describe("Add Task", () => {
  before(() => {
    // login the page, login credential will be fetched from cypress/fixtures/userCredentials.json
    cy.fixture("userCredentials.json").then((user) => {
      var email = user.email;
      var pass = user.password;

      cy.login(email, pass); // custom command has been defined into cypress/support/commands.js
    });
  });

  it("Add a task and Validate it has been stored into cloud ", function () {
    // Click on Add task buttom
    cy.get('[data-test-id="add-task"]').click(); // Assuming data-test-id is add-task for the Add task button
    cy.get('[data-test-id="add-task"]').should("not.be.enabled"); // The Add task button is disabled
    cy.get('[data-test-id="new-task"]').type("this is a new task by antara"); // type new task into new task type field, Assuming data-test-id is new-task

    cy.type("{enter}"); // this will HIT Enter

    // wait until post request is successful
    cy.intercept("POST", "v1/tasks/*").as("addTaskRequest");
    cy.wait("@addTaskRequest").its("response.statusCode").should("eq", 200);

    cy.get('[data-test-id="add-task"]').should("be.enabled"); // Add task button will be enabled after the new task is added

    //============ Validate task has been saved into cloud==========
    // Load the AWS SDK for Node.js.
    var AWS = require("aws-sdk");
    // Set the AWS Region.
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      // Set the projection expression, which are the attributes that we want.
      ProjectionExpression: "Title, Status",
      TableName: "Tasks",

      // Specify which items in the results are returned
      FilterExpression: "Title = :title AND Status = .status",

      // Define the expression attribute value, which are substitutes for the values we want to compare.
      ExpressionAttributeValues: {
        ":title": { S: "this is a new task by antara" },
        ".status": { N: 1 },
      },
    };

    docClient.scan(params, function (err, data) {
      if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        console.log("Query succeeded:", data);
        data.Items.forEach(function (element) {
          console.log(
            "Task Title:",
            element.Title.S + ", Task Status: " + element.Status.N
          );
        });
      }
    });
  });
});
