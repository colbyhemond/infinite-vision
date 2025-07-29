import { PortableText } from "next-sanity"
import { client } from "../../sanity/client";

const ABOUT_QUERY = `*[_type == "aboutPage"][0]`;
const SETTINGS_QUERY = `*[_type == "settings"][0]`;
const options = { next: { revalidate: 30 } };

const placeholderContent = {
    title: "About",
    body: [
        {
            _type: "block",
            children: [
                {
                    _type: "span",
                    text: "This is the about page. You can change this text in your settings.",
                },
            ],
        },
    ],
};

export const metadata = async () => {
    let content = await client.fetch(ABOUT_QUERY, {}, options);
    let settings = await client.fetch(SETTINGS_QUERY, {}, options);

    if (!content) {
        content = placeholderContent
    }

    if (!settings) {
        settings = {
            title: "Blog",
        }
    }

    return ({
    title: content.title,
    description: `Learn all about the writers behind the blog at ${settings.title}.`,
  });
}

const AboutPage = async () => {
    let content = await client.fetch(ABOUT_QUERY, {}, options);

    if (!content) {
        content = placeholderContent
    }

    return (<>
    <main className="mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <div className="prose mx-auto min-h-screen">
          <h1 className="text-4xl font-bold mb-8 text-center">{content.title}</h1>
          <div className="mx-5">
            {Array.isArray(content.body) && <PortableText value={content.body} />}
          </div>
        </div>
    </main>
    </>)
}

export default AboutPage