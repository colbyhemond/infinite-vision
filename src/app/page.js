import Hero from "../components/Hero";
import BlogHero from "../components/blog/BlogHero";
import LatestPosts from "../components/blog/LatestPosts";
import CallToActionSection from "../components/calltoaction/CallToActionSection";
import { client } from "../sanity/client";
import imageUrlBuilder from "@sanity/image-url";


const HOME_QUERY = `*[_type == "homePage"][0]{..., showcasePost->{..., author->}, calltoaction}`;
const options = { next: { revalidate: 30 } };
const { projectId, dataset } = client.config();
  const urlFor = (source) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;
    
const Home = async () => {
  let homeContent = await client.fetch(HOME_QUERY, {}, options);

  // if (!homeContent) {
  //   homeContent = {
  //     showcasePost: {
  //       title: "Welcome to your blog!",
  //       excerpt: "Don't worry, this is just some placeholder content. It will all be replaced with your own content once you start adding posts. I hope you enjoy your new blog!",
  //       image: {
  //         url: "/placeholder.png",
  //         alt: "Placeholder image",
  //       },
  //       publishedAt: new Date().toISOString(),
  //       author: {
  //         name: "Colby Hemond",
  //         image: "/colby.jpeg",
  //       },
  //       slug: {
  //         current: "/",
  //       },
  //     }
  //   }
  
  // } else {
  //   homeContent.showcasePost.image.url = urlFor(homeContent.showcasePost.image).url();
  //   homeContent.showcasePost.author.image = urlFor(homeContent.showcasePost.author.image).url();
  // }

  if (!homeContent) {

  }

  const calltoaction = {
    text: homeContent?.calltoaction?.ctatext || "Check out our services!",
    button: {
      href: homeContent?.calltoaction?.buttonlink || "/services",
      text: homeContent?.calltoaction?.buttontext || "See Services",
    },
  };

  return (
    <div>
      {/* <BlogHero post={homeContent.showcasePost} />
      <LatestPosts /> */}
      <Hero/>
      <CallToActionSection text={calltoaction.text} button={calltoaction.button}/>
    </div>
  );
}

export default Home;