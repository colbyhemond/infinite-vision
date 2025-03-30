// import { client } from "@/sanity/client";

import { PortableText } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../../../sanity/client";
import Link from "next/link";
import Image from "next/image";
import ArticleReader from "../../../components/blog/ArticleReader";
import CallToActionSection from "../../../components/calltoaction/CallToActionSection";
import Author from "../../../components/blog/Author";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{..., author->}`;

const SETTINGS_QUERY = `*[_type == "settings"][0]`;
const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const sanityOptions = { next: { revalidate: 30 } };

export const generateMetadata = async ({params, searchParams}, parent) => {

  const post = await client.fetch(POST_QUERY, await params, sanityOptions);
  const settings = await client.fetch(SETTINGS_QUERY, {}, options);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: '',
      siteName: settings.title,
      type: 'article',
      images: [{
        url: `/api/og?title=${post.title}&website=${settings.title}`,
        width: 800,
        height: 600,
      }]
    },
  };
}

const dateOptions = { 
  year: "numeric",
  month: "long",
  day: "numeric",
};

const defaults = {nonTextBehavior: 'remove'}
const blocksToText = (blocks, opts = {}) => {
  const options = Object.assign({}, defaults, opts)
  if (!blocks) {
    return ''
  }
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}

const portableTextComponents = {
  types: {
    code: (node) => {
      const {language, code} = node.value
      return (
        <pre data-language={language}>
          <code>{code}</code>
        </pre>
      )
    },
    image: (node) => {
      if (projectId && dataset ) {
        return(
          <Image src={imageUrlBuilder({ projectId, dataset }).image(node.value).url()} width="900" height="500" alt="image"/>
        )
      }
    }
  }
}

export default async function Post({params}) {
    const post = await client.fetch(POST_QUERY, await params, sanityOptions);
    const postImageUrl = post.image
      ? urlFor(post.image)?.url()
      : null;      

    post.author.image = urlFor(post.author.image).url();
    
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <Link href="/blog" className="hover:underline pb-5">
          ← Back to posts
        </Link>
        
        <article className="prose mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">{post.title}</h1>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <Author author={post.author}/>
            <div className="text-center">{new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(post.publishedAt))}</div>
            <ArticleReader text={blocksToText(post.body)} />
          </div>
          
          {postImageUrl && (
            <div className="relative rounded-xl w-[425px] h-[250px] md:w-[650px] md:h-[400px] mt-5 mx-auto">
              <Image
                src={postImageUrl}
                alt={post.title}
                fill={true}
                className="rounded-xl object-cover"
              />
            </div>
          )}
          <div className="m-5 mt-14">
            {Array.isArray(post.body) && <PortableText value={post.body} components={portableTextComponents} />}
          </div>
        </article>
        {post.calltoaction && 
          <CallToActionSection text={post.calltoaction.text} button={{href: post.calltoaction.buttonlink, text: post.calltoaction.buttontext}} />
        }
        
        {post.tags && 
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {post.tags.map((tag, index) => {
              return (
                <div key={index} className="badge badge-primary">{tag}</div>
              )
            })}
          </div>
        }

      </main>
    );
  }
  
  