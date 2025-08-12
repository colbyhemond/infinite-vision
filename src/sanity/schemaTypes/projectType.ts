import {defineField, defineType} from "sanity";

export const projectType =  defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    {name: "content", title: "Content", default: true},
    {name: "media", title: "Media"},
    {name: "meta", title: "SEO & Meta"},
    {name: "settings", title: "Settings"},
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {source: "title", maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      group: "content",
      options: {
        list: [
          {title: "Residential", value: "residential"},
          {title: "Commercial", value: "commercial"},
        ],
        layout: "radio",
      },
      initialValue: "residential",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "content",
      of: [{type: "string"}],
      options: {
        list: [
          {title: "Painting (Interior/Exterior)", value: "painting"},
          {title: "Deck Painting & Staining", value: "deck"},
          {title: "Power Washing", value: "powerwashing"},
          {title: "Yard Cleanup & Maintenance", value: "yard"},
          {title: "Landscaping Support", value: "landscaping"},
          {title: "Garage & Basement Floors", value: "floors"},
          {title: "General Handyman", value: "handyman"},
        ],
      },
      validation: (Rule) => Rule.min(1).unique(),
    }),
    defineField({
      name: "location",
      title: "Location (City, State)",
      type: "string",
      group: "content",
      description: "e.g., Standish, MI",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: "body",
      title: "Project Details",
      type: "array",
      group: "content",
      of: [{type: "block"}],
    }),

    // Media
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "media",
      options: {hotspot: true},
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        defineField({
          name: "galleryImage",
          title: "Gallery Image",
          type: "image",
          options: {hotspot: true},
          fields: [
            defineField({name: "alt", title: "Alt Text", type: "string"}),
            defineField({name: "caption", title: "Caption", type: "string"}),
          ],
        }),
      ],
    }),
    defineField({
      name: "beforeAfter",
      title: "Before & After (optional)",
      type: "array",
      group: "media",
      of: [
        defineField({
          name: "pair",
          title: "Pair",
          type: "object",
          fields: [
            defineField({name: "before", title: "Before", type: "image", options: {hotspot: true}}),
            defineField({name: "after", title: "After", type: "image", options: {hotspot: true}}),
            defineField({name: "label", title: "Label", type: "string"}),
          ],
        }),
      ],
    }),

    // Meta & Settings
    defineField({
      name: "date",
      title: "Project Date",
      type: "date",
      group: "settings",
      options: {dateFormat: "YYYY-MM-DD"},
    }),
    defineField({
      name: "clientName",
      title: "Client (optional)",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "settings",
      description: "Lower shows first.",
    }),

    // SEO
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      group: "meta",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      group: "meta",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph Image",
      type: "image",
      group: "meta",
      options: {hotspot: true},
      fields: [{name: "alt", title: "Alt Text", type: "string"}],
    }),
  ],
  orderings: [
    {title: "Date, New → Old", name: "dateDesc", by: [{field: "date", direction: "desc"}]},
    {title: "Sort Order", name: "sortAsc", by: [{field: "sortOrder", direction: "asc"}]},
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "coverImage",
    },
  },
});

/**
 * GROQ example to feed ProjectsSection component:
 *
 * *[_type == "project"] | order(defined(sortOrder) => sortOrder asc, date desc) {
 *   _id,
 *   title,
 *   description,
 *   location,
 *   "coverImageUrl": coverImage.asset->url,
 *   "imageAlt": coalesce(coverImage.alt, title),
 * }
 *
 * Client mapping (TS):
 * type ProjectCard = {
 *   id: string;
 *   title: string;
 *   description: string;
 *   location: string;
 *   coverImage: string;
 *   imageAlt?: string;
 * };
 * const projects: ProjectCard[] = data.map((d: any) => ({
 *   id: d._id,
 *   title: d.title,
 *   description: d.description,
 *   location: d.location,
 *   coverImage: d.coverImageUrl,
 *   imageAlt: d.imageAlt,
 * }));
 */
