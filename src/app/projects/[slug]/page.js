import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { MapPin } from "lucide-react";

// --- Sanity Client ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: true,
});

// --- GROQ ---
const PROJECT_BY_SLUG = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  location,
  description,
  body[],
  date,
  services[],
  projectType,
  "coverImage": coverImage.asset->url,
  "coverAlt": coalesce(coverImage.alt, title),
  gallery[]{
    "url": asset->url,
    alt,
    caption
  },
  beforeAfter[]{
    "before": before.asset->url,
    "after": after.asset->url,
    label
  },
  // SEO
  "metaTitle": coalesce(metaTitle, title),
  metaDescription,
  "ogImage": openGraphImage.asset->url,
  "slug": slug.current
}`;

const ALL_PROJECT_SLUGS = `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`;

export const revalidate = 120; // ISR: revalidate every 2 minutes

// --- Static params for SSG ---
export async function generateStaticParams() {
  const slugs = await client.fetch(ALL_PROJECT_SLUGS);
  return slugs.map((s) => ({ slug: s.slug }));
}

// --- SEO metadata ---
export async function generateMetadata({ params }) {
  const data = await client.fetch(PROJECT_BY_SLUG, { slug: params.slug });
  if (!data) return { title: "Project Not Found" };

  const title = data.metaTitle || data.title;
  const description = data.metaDescription || data.description || "Project details";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/projects/${data.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: data.ogImage ? [{ url: data.ogImage }] : data.coverImage ? [{ url: data.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.ogImage || data.coverImage || undefined,
    },
  };
}

// --- Page ---
export default async function ProjectPage({ params }) {
  const project = await client.fetch(PROJECT_BY_SLUG, { slug: params.slug });
  if (!project) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {project.location && (
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{project.location}</span>
          )}
          {project.date && (
            <time dateTime={project.date} className="opacity-80">
              {new Date(project.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
        </div>
        {project.description && (
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">{project.description}</p>
        )}
      </header>

      {/* Cover Image */}
      {project.coverImage && (
        <div className="mb-10 overflow-hidden rounded-2xl border bg-muted/10">
          <Image
            src={project.coverImage}
            alt={project.coverAlt || project.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            // If you don't want to configure next/image remote patterns, uncomment:
            // unoptimized
            priority
          />
        </div>
      )}

      {/* Body */}
      {project.body?.length ? (
        <article className="prose prose-neutral max-w-none dark:prose-invert">
          <PortableText value={project.body} />
        </article>
      ) : null}

      {/* Gallery */}
      {project.gallery?.length ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {project.gallery.map((img, i) => (
              <figure key={i} className="overflow-hidden rounded-xl border">
                <Image
                  src={img.url}
                  alt={img.alt || project.title}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                  // unoptimized
                />
                {img.caption ? (
                  <figcaption className="px-3 py-2 text-xs text-muted-foreground">{img.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Before / After */}
      {project.beforeAfter?.length ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Before & After</h2>
          <div className="space-y-6">
            {project.beforeAfter.map((pair, i) => (
              <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border">
                  <Image src={pair.before} alt={`Before - ${pair.label || project.title}`} width={1000} height={750} className="h-full w-full object-cover" />
                </div>
                <div className="overflow-hidden rounded-xl border">
                  <Image src={pair.after} alt={`After - ${pair.label || project.title}`} width={1000} height={750} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
