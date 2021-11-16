import ejs from 'ejs'; 

// Assume internal library of `emailSender` 
// `emailSender` returns a Promise holding a potential boolean 
import emailSender from '@packages/emailSender';  
 

function getTemplate(customerId, name): string { 
  // Assume template is fetched from a storage (e.g. DynamoDB, PSQL, MySQL) 
} 


/** 
 * (Inside EmailGenerator.ts) 
 *  
 * Generate e-mails based on input JSON event and customer's own templates, 
 * then send the e-mail to the user. 
 */  
class EmailCustomer { 
// email should pass id, email and cu
  async email(event: any, customerId: number): void { 

    const template = await getTemplate(customerId, event.name); // Antara: there is no event.name into email event object, so in 46 line, the parameter of the event should be name
    const html = ejs.render(template, event); // Antara : why we are passing overlapping arguments like template has event.name and event also has event.name

    this.sendemailtocustomer(html, event); // Antara: no  need to pass event again
  } 

  async sendemailtocustomer(html, event): void { 
    return emailSender(event.email, html); // Antara: I think we don't need this function when we can use sendemailtocustomer function in 26
  } 
} 

module.exports = EmailGenerator; 



/** 
 * (Inside EmailGenerator.test.ts) 
 */ 
import EmailGenerator from './EmailGenerator.ts' 

it('email', async () { 
// Antara: no need to create object as it's already been exported
  new EmailGenerator().email({ 
    id: 'password_reset', 
    email: 'fake@test.com' 
  }, 23); 
}); 
