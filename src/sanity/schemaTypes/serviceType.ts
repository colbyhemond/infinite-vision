
import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        defineField({
        name: 'title',
        title: 'Title',
        type: 'string'
        }),
        defineField({
        name: 'description',
        title: 'Description',
        type: 'text'
        }),
        defineField({
        name: 'icon',
        title: 'Icon',
        type: 'image',
        options: {
            hotspot: true,
        },
        }),
        defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
            source: 'title',
            maxLength: 96,
        },
        }),
    ],
    })