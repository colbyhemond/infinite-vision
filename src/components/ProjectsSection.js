"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * ProjectsSection
 * A responsive list of past projects. Each item renders as a horizontal card:
 * image on the left (on desktop) and text on the right. On mobile it stacks.
 *
 * Props:
 *  - projects: Array<{
 *      id: string | number
 *      title: string
 *      description: string
 *      location: string
 *      coverImage: string // public path or remote URL allowed by next.config
 *      imageAlt?: string
 *    }>
 */
export default function ProjectsSection({ projects }) {
  const sampleProjects = [
    {
      id: 1,
      title: "Exterior Repaint — Ranch Home",
      description:
        "Full exterior repaint with durable, weather-resistant coating. Power washed, caulked, and finished with two coats for long-lasting color.",
      location: "Pinconning, MI",
      coverImage: "/images/projects/exterior-ranch.jpg",
      imageAlt: "Freshly painted ranch-style home with new trim",
    },
    {
      id: 2,
      title: "Deck Clean, Stain & Seal",
      description:
        "Deep clean, brightener, and semi-transparent stain application to protect against Michigan weather while highlighting the wood grain.",
      location: "Tawas, MI",
      coverImage: "/images/projects/deck-stain.jpg",
      imageAlt: "Stained wood deck with railing at sunset",
    },
    {
      id: 3,
      title: "Garage Floor Epoxy",
      description:
        "Surface prep, crack repair, and two-part epoxy with anti-slip flakes for a clean, durable garage floor finish.",
      location: "West Branch, MI",
      coverImage: "/images/projects/garage-epoxy.jpg",
      imageAlt: "Glossy gray epoxy garage floor with light flakes",
    },
  ];

  const data = Array.isArray(projects) && projects.length ? projects : sampleProjects;

  return (
    <section aria-labelledby="projects-heading" className="mx-auto max-w-6xl px-4 py-12 md:py-16">


      <ul className="space-y-6 md:space-y-8">
        {data.map((item, idx) => (
          <li key={item._id}>
            <ProjectCard item={item} index={idx} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ item, index }) {
    console.log(item.slug);
  return (
    <Link href={`/projects/${item.slug.current}`} className="no-underline hover:underline">
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border bg-background shadow-sm ring-1 ring-black/5"
    >
      <div className="grid gap-0 md:grid-cols-[minmax(280px,35%)_1fr]">
        {/* Image */}
        <div className="relative h-56 w-full md:h-full">
          <Image
            src={item.coverImage}
            alt={item.imageAlt || item.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={index < 2}
          />
          {/* subtle gradient overlay for legibility on narrow screens */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <h3 className="text-lg font-semibold leading-tight md:text-xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {item.description}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-none" aria-hidden="true" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>
    </motion.article>
    </Link>
  );
}
