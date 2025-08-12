import { client } from "../../sanity/client";
import ProjectsSection from "../../components/ProjectsSection";


const PROJECTS_QUERY = `*[_type == "project"] 
| order(defined(sortOrder) desc, sortOrder asc, date desc) {
  _id,
  slug,
  title,
  description,
  location,
  "coverImage": coverImage.asset->url,
  "imageAlt": coalesce(coverImage.alt, title)
}`;
  
  const options = { next: { revalidate: 30 } };

const ProjectsPage = async () => {
    let projects = [];
        projects = await client.fetch(PROJECTS_QUERY, {}, options);
    
        const projectImageUrl = (project) => {
            return project.icon ? urlFor(project.icon)?.url() : null
        };
    
        projects = projects.map((project) => {
            return {
                ...project,
                icon: projectImageUrl(project)
            }
        });


  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8 flex flex-col gap-4">
        <div className="mx-auto min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center prose">Projects</h1>
            <div className="flex flex-wrap gap-4 justify-center">
                <ProjectsSection projects={projects}/>
 
            </div>
        </div>
    </main>
  );
}

export default ProjectsPage;

