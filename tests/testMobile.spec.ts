import {test,expect} from '../test-options';
import path from 'path';

const contactFormUploadFile = path.join(__dirname, 'fixtures', 'contains_structured_data_detailed_report.csv');

test('Contact Us Test', async ({ contactPage}) => {


    await contactPage.toContactPage.fillContactForm('Test User', 'test@example.com', contactFormUploadFile);



});

