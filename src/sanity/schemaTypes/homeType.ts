import {defineField, defineType} from 'sanity'

export const homeType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // defineField({
    //   name: 'showcasePost',
    //   title: 'Showcase Post',
    //   type: 'reference',
    //   to: [{type: 'post'}],
    // }),
    defineField({
        name: 'hero',
        title: 'Hero Section',
        type: 'object',
        fields: [
            defineField({
                name: 'title',
                title: 'Title',
                type: 'string',
            }),
            defineField({
                name: 'subtitle',
                title: 'Subtitle',
                type: 'string',
            }),
            defineField({
                name: 'image',
                title: 'Background Image',
                type: 'image',
                options: {
                    hotspot: true,
                },
            }),
        ],
    }),
    defineField({
        name: 'calltoaction',
        title: 'Call To Action',
        type: 'calltoaction',
    }),
  ],
})