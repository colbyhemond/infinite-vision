// import { PortableText } from "next-sanity"
// import { client } from "../../sanity/client";
import { redirect } from 'next/navigation'

// const SETTINGS_QUERY = `*[_type == "settings"][0]`;
// const options = { next: { revalidate: 30 } };

const ContactPage = async () => {
    // let settings = await client.fetch(SETTINGS_QUERY, {}, options);
    const settings = {
        contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null
    };

    return (<>
    <main className="mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <div className="prose mx-auto h-screen w-full">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact</h1>
          <div>
            <form  method="POST" className="flex flex-col gap-4 bg-base-200 p-4 rounded-xl drop-shadow w-full">
                <input className="input" placeholder="Name" type="text" name="name"></input>
                <input className="input" placeholder="Email" type="email" name="email"></input>
                <textarea className="textarea" placeholder="Message" name="message"></textarea>
                {settings?.contactEmail ?
                    <input type="submit" value="Submit" className="btn btn-primary"></input>
                    :
                    (<span className="text-error text-center">Form is currently inactive.</span>)
                }
            </form>
          </div>
        </div>
    </main>
    </>)
}

export default ContactPage