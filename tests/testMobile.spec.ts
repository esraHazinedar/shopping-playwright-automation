import {test,expect} from '../test-options';

test('Contact Us Test', async ({ contactPage}) => {
  
    await contactPage.toContactPage.fillContactForm('Test User', 'test@example.com', '/Users/esrahazinedar/contains_structured_data_detailed_report.csv');
   


});

