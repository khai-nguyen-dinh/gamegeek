import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    // Using local storage - files will be saved to src/content/
    // A git hook will automatically commit and push to GitLab
    kind: 'local',
  },
  collections: {
    // News Posts Collection
    posts: collection({
      label: 'News Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        slug: fields.text({ 
          label: 'Slug',
          description: 'URL-friendly identifier (auto-generated from title)',
        }),
        date: fields.date({ 
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: "Vietnam's Game Scene", value: 'vietnam-game-scene' },
            { label: 'IT Services', value: 'it-services' },
            { label: 'Database Security', value: 'database-security' },
            { label: 'IT Consultancy', value: 'it-consultancy' },
            { label: 'App Development', value: 'app-development' },
            { label: 'UI/UX Design', value: 'ui-ux-design' },
            { label: 'Cyber Security', value: 'cyber-security' },
          ],
          defaultValue: 'it-services',
        }),
        author: fields.text({ 
          label: 'Author',
          defaultValue: 'Admin',
        }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        thumb: fields.image({
          label: 'Thumbnail',
          directory: 'public/images',
          publicPath: '/images',
        }),
        thumb2: fields.image({
          label: 'Thumbnail 2',
          directory: 'public/images',
          publicPath: '/images',
        }),
        thumb3: fields.image({
          label: 'Thumbnail 3',
          directory: 'public/images',
          publicPath: '/images',
        }),
        breadcrumbBg: fields.image({
          label: 'Breadcrumb Background',
          directory: 'public/images',
          publicPath: '/images',
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images',
            publicPath: '/images',
          },
        }),
      },
    }),

    // Categories Collection
    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.text({ label: 'Category Name' }),
        slug: fields.text({ 
          label: 'Slug',
          description: 'URL-friendly identifier',
        }),
      },
    }),

    // Pages Collection (for static pages like About, Services, etc.)
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Page Title' }),
        slug: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ 
          label: 'Description',
          multiline: true,
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images',
            publicPath: '/images',
          },
        }),
      },
    }),

    // Services Collection
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ label: 'Service Title' }),
        slug: fields.slug({ name: { label: 'Title' } }),
        description: fields.document({
          label: 'Description',
          formatting: true,
          dividers: true,
          links: true,
        }),
        icon: fields.image({
          label: 'Service Icon',
          directory: 'public/images',
          publicPath: '/images',
        }),
        image: fields.image({
          label: 'Service Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        featured: fields.checkbox({
          label: 'Featured Service',
          defaultValue: false,
        }),
      },
    }),

    // Team Members Collection
    team: collection({
      label: 'Team Members',
      slugField: 'name',
      path: 'src/content/team/*',
      schema: {
        name: fields.text({ label: 'Name' }),
        slug: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Role/Position' }),
        bio: fields.document({
          label: 'Biography',
          formatting: true,
          links: true,
        }),
        image: fields.image({
          label: 'Profile Photo',
          directory: 'public/images',
          publicPath: '/images',
        }),
        email: fields.text({ 
          label: 'Email',
          validation: { isRequired: false },
        }),
        linkedin: fields.text({ 
          label: 'LinkedIn URL',
          validation: { isRequired: false },
        }),
        twitter: fields.text({ 
          label: 'Twitter URL',
          validation: { isRequired: false },
        }),
      },
    }),

    // Hero Slides Collection
    slides: collection({
      label: 'Hero Slides',
      slugField: 'title',
      path: 'src/content/slides/*',
      schema: {
        title: fields.text({ label: 'Slide Title' }),
        slug: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ 
          label: 'Subtitle',
          multiline: true,
        }),
        description: fields.text({ 
          label: 'Description',
          multiline: true,
        }),
        image: fields.image({
          label: 'Slide Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        link: fields.text({ 
          label: 'Link URL',
          validation: { isRequired: false },
        }),
        linkText: fields.text({ 
          label: 'Link Text',
          validation: { isRequired: false },
        }),
        order: fields.integer({ 
          label: 'Display Order',
          defaultValue: 0,
        }),
        active: fields.checkbox({
          label: 'Active',
          defaultValue: true,
        }),
      },
    }),

    // Events Collection
    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ label: 'Event Title' }),
        slug: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Event Date' }),
        location: fields.text({ label: 'Location' }),
        image: fields.image({
          label: 'Event Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        description: fields.document({
          label: 'Description',
          formatting: true,
          dividers: true,
          links: true,
        }),
        registrationLink: fields.text({ 
          label: 'Registration Link',
          validation: { isRequired: false },
        }),
        featured: fields.checkbox({
          label: 'Featured Event',
          defaultValue: false,
        }),
      },
    }),
  },
});
