"use client"

// import { PortableText } from "next-sanity"
import { useEffect, useState } from "react";
import { client } from "../../sanity/client";
// import { redirect } from 'next/navigation'

const SETTINGS_QUERY = `*[_type == "settings"][0]`;
const options = { next: { revalidate: 30 } };

const ContactPage =  () => {

    const [sending, setSending] = useState(false)
    const [settings, setSettings] = useState(null)

    const handleSend = (event) => {
        setSending(true)
        event.preventDefault()

        const formElement = event.target;
        const formData = new FormData(formElement);
        console.log(new URLSearchParams(formData).toString());

        if (formData.get('honeypot')) {
            console.log('bot detected');
            setTimeout(()=>{
                event.target.reset()
                setSending(false)
            // handleClose()
            }, 2000)
            return
        }

        fetch("/api/form/contact", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then((res) => {console.log(res);res.json()})
            .then((data) => {

                console.log(data);
                setTimeout(()=>{
                    event.target.reset()
                    setSending(false)
                // handleClose()
                }, 2000)
            })
            .catch((error) => alert(error));
    }

    const submitText = sending ? "Sending..." : "Send Message";
    const isDisabeld = sending || !settings?.contactEmail;

    // let settings = await client.fetch(SETTINGS_QUERY, {}, options);
    // const settings = {
    //     contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null
    // };


    useEffect(() => {
        const fetchSettings = async () => {
             const _settings = await client.fetch(SETTINGS_QUERY, {}, options);
            setSettings(_settings);
            if (!_settings?.contactEmail) {
                console.warn("Contact email is not set in settings.");
            }
        };
        fetchSettings();
    }
    , []);

    return (<>
    <main className="mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <div className="prose mx-auto h-screen w-full">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact</h1>
          <div>
            <form  onSubmit={handleSend} className="flex flex-col gap-4 bg-base-200 p-4 rounded-xl drop-shadow w-full">
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="honeypot" value="" />
                <input className="input" placeholder="Name" type="text" name="name"></input>
                <input className="input" placeholder="Email" type="email" name="email"></input>
                <textarea className="textarea" placeholder="Message" name="message"></textarea>
                {/* {settings?.contactEmail ? */}
                    <input type="submit" value={submitText} disabled={isDisabeld} className="btn btn-primary"></input>
                    {/* :
                    (<span className="text-error text-center">Form is currently inactive.</span>)
                } */}
            </form>
          </div>
        </div>
    </main>
    </>)
}

export default ContactPage