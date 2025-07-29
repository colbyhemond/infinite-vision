import { client } from "../../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import BlogCard from "../../components/blog/BlogCard";
import { redirect } from "next/navigation";

const POSTS_QUERY = `*[
    _type == "post"
    && defined(slug.current)
  ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image}`;
  
  const options = { next: { revalidate: 30 } };
  const { projectId, dataset } = client.config();
  const urlFor = (source) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;
  

const Blog = async () => {
    let posts = [];
    posts = await client.fetch(POSTS_QUERY, {}, options);

    const postImageUrl = (post) => {
        return post.image ? urlFor(post.image)?.url() : null
    };

    posts = posts.map((post) => {
        return {
            ...post,
            imageUrl: postImageUrl(post)
        }
    });

    redirect('/not-found');


    return (
        <main className="p-8 max-w-6xl ">
            <div className="prose w-fit mx-auto">
                <h1 className="font-bold mb-4 ">Blog</h1>
            </div>

            {posts.length === 0 && <div className="flex justify-center items-center"><div>No Posts Yet...</div></div>}

            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => {
                    return ( 
                    <BlogCard post={post} key={index} />
                    )
                
                })}
            </div>
        </main>
        );
}

export default Blog