
"use server";

const postmark = require("postmark");
const { createClient } = require('@sanity/client');

const { projectId, dataset, apiVersion } = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01' // Use the latest API version or specify as needed
};

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

const getHtml = (email, name, message) => {
  const html = `
    <p>** This is a Contact form submission from https://infinitevision.services/contact **</p>
    <table>
        <tr>
            <td><strong>Email:</strong></td>
            <td>${email}</td>
        </tr>
        <tr>
            <td><strong>Name:</strong></td>
            <td>${name}</td>
        </tr>
        <tr>
            <td><strong>Message:</strong></td>
        </tr>
        
    </table>
    <p>${message}</p>
  `
  return(html)
}


export async function GET(request) {
    // Your GET method code here
}

export async function HEAD(request) {
    // Your HEAD method code here
}

export async function POST(request) {
    // Your POST method code here
try {
    const SETTINGS_QUERY = `*[_type == "settings"][0]`;
    const options = { next: { revalidate: 30 } };

    const data = await request.formData()

    const formName = data.get('form-name')
    const honeypot = data.get('honeypot')

    console.log('RECEIVED REQUEST');

    if (formName !== 'contact') { return Response.json({}).status(401)}
    if (honeypot !== '') { return Response.json({}).status(401)}

    const emailAddress = data.get('email')
    const name = data.get('name')
    const message = data.get('message')

    const client = new postmark.ServerClient(process.env.POSTMARK_EMAIL_API_KEY);

    console.log('SENDING MAIL');

    // fetch email from settings stored in sanity client
    const settings = await sanityClient.fetch(SETTINGS_QUERY, {}, options);
    if (!settings.contactEmail) {
      console.error('Contact email is not set in settings.');
      return Response.json({error: 'Contact email is not set in settings.'}).status(500);
    }
    console.log('Settings fetched successfully:', settings);
    
    const toEmailAddress = settings.contactEmail ? settings.contactEmail : 'contact@colbyhemond.com'

    let htmlBody;

    if (toEmailAddress !== 'contact@colbyhemond.com') {
        htmlBody = getHtml(emailAddress, name, message);
    } else {
        htmlBody = getHtml(emailAddress, name, message);
        //append notice to htmlBody to mention there was no toEmailAddress set in settings
        htmlBody += `<p><strong>Note:</strong> The contact email address is not set in the settings. The email was sent to the default address.</p>`;
    }

    const res = await client.sendEmail({
      "From": "notify@chwd.email",
      "To": "hemond.colby@gmail.com",
      "ReplyTo": emailAddress,
      "Bcc": "notify@chwd.email",
      "Subject": "Infinite Vision Contact Submission",
      "HtmlBody": getHtml(emailAddress, name, message),
      "TextBody": "Infinite Vision Contact Submission",
      "MessageStream": "outbound"
    })
    .catch((error) => {
      console.log('ERROR SENDING EMAIL')
      console.log(error)
      return Response.json({}.status(500))
    });
    console.log('after email send');
    console.log(res);

      return Response.json({})

} catch (error) {
    console.log('General Error');
    console.log(error);
    return Response.json({error})
}

}

export async function PUT(request) {
    // Your PUT method code here
}

export async function DELETE(request) {
    // Your DELETE method code here
}

export async function PATCH(request) {
    // Your PATCH method code here
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) {
    // Your OPTIONS method code here
}