import ImageUrlBuilder from "@sanity/image-url";
import { client } from "../sanity/client";

const HERO_QUERY = `*[_type == "homePage"][0]`;
const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source) =>
    projectId && dataset
    ? ImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const imageUrl = (obj) => {
    return obj.image ? urlFor(obj.image)?.url() : null
};

const Hero = async () => {
    let hero = await client.fetch(HERO_QUERY, {}, options);

    
    
    if (hero) {
        hero = {
            image: imageUrl(hero.hero),
            title: hero.hero?.title || "",
            subtitle: hero.hero?.subtitle || "",
            buttonText: hero.hero?.buttonText || "Contact Us",
            buttonLink: hero.hero?.buttonLink || "/contact"
        }
    } else {
        hero = {}
    }

    if (!hero.image) {
        hero.image = "https://scontent-ord5-3.xx.fbcdn.net/v/t39.30808-6/505397253_649944634747306_5163763291663898976_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=jFdQPOdqE5sQ7kNvwEbzaf0&_nc_oc=Adl9O3XxumF9RyL31ZMlKvru1aPyZCkIfGWXCWe_VHM3SYl_VJ0GqoFRPCmMUXEkZpk&_nc_zt=23&_nc_ht=scontent-ord5-3.xx&_nc_gid=N41JCw7NviaJ6Kx1su6C7g&oh=00_AfTECnD7MEdxq67iYPFr9Q4G5ue2S6G8rNAGILp24S9Wgg&oe=688EAC1A";
    }

    if (!hero.buttonText) {
        hero.buttonText = "Contact Us";
    }

    if (!hero.buttonLink) {
        hero.buttonLink = "/contact";
    }

    if (!hero.title) {
        hero.title = "Painting and Outdoor Services";
    }

    if (!hero.subtitle) {
        hero.subtitle = "We provide high-quality painting and outdoor services for your home or business.";
    }
    

    return (<>
        <div className="hero min-h-screen"
            style={{
                backgroundImage: `url(${hero.image})`,
            }}>
            <div className="hero-overlay bg-opacity-60 "></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">{hero.title}</h1>
                    <p className="mb-5">
                        {hero.subtitle}
                    </p>
                    <a href={hero.buttonLink} className="btn btn-primary">{hero.buttonText}</a>
                </div>
            </div>
        </div>
    </>)
}

export default Hero