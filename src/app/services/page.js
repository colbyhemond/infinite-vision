import { client } from "../../sanity/client";


const SERVICES_QUERY = `*[
    _type == "service"
    && defined(slug.current)
  ]|order(publishedAt desc){_id, title, slug, publishedAt, icon, description}`;
  
  const options = { next: { revalidate: 30 } };

const ServicesPage = async () => {
    let services = [];
        services = await client.fetch(SERVICES_QUERY, {}, options);
    
        const serviceImageUrl = (service) => {
            return service.icon ? urlFor(service.icon)?.url() : null
        };
    
        services = services.map((service) => {
            return {
                ...service,
                icon: serviceImageUrl(service)
            }
        });


  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8 flex flex-col gap-4">
        <div className="mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center prose">Services</h1>
            <div className="flex flex-wrap gap-4 justify-center">
                {services.length === 0 && <div className="flex justify-center items-center"><div>No Services Available...</div></div>}

                {services.map((service, index) => {
                    return (
                        <div key={index} className="flex flex-col items-start bg-base-200 p-4 rounded-lg shadow-md max-w-sm">
                            {/* <img src={serviceImageUrl(service)} alt={service.title} className="w-16 h-16 mb-4" /> */}
                            <h2 className="text-xl font-semibold">{service.title}</h2>
                            <p className="text-gray-600">{service.description || "No description available."}</p>
                        </div>
                    );
                })}

            </div>
        </div>
    </main>
  );
}

export default ServicesPage;