import { config, fields, collection, singleton } from '@keystatic/core';

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
        id: fields.text({ 
          label: 'ID',
          description: 'Unique identifier for the post',
        }),
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
        id: fields.text({ 
          label: 'ID',
          description: 'Unique identifier (should match slug)',
        }),
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
        id: fields.text({ 
          label: 'ID',
          description: 'Unique identifier (e.g., slide-1, slide-2)',
        }),
        type: fields.select({
          label: 'Slide Type',
          options: [
            { label: 'Content Slide (with text)', value: 'content' },
            { label: 'Image Slide (image only)', value: 'image' },
          ],
          defaultValue: 'content',
        }),
        title: fields.text({ 
          label: 'Slide Title',
          validation: { isRequired: false },
        }),
        slug: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ 
          label: 'Subtitle',
          multiline: true,
          validation: { isRequired: false },
        }),
        description: fields.text({ 
          label: 'Description',
          multiline: true,
          validation: { isRequired: false },
        }),
        buttonText: fields.text({ 
          label: 'Button Text',
          validation: { isRequired: false },
        }),
        buttonLink: fields.text({ 
          label: 'Button Link URL',
          validation: { isRequired: false },
        }),
        backgroundImage: fields.text({ 
          label: 'Background Image URL',
          description: 'URL for background image (if not using image field)',
          validation: { isRequired: false },
        }),
        image: fields.image({
          label: 'Slide Image',
          directory: 'public/images',
          publicPath: '/images',
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
  singletons: {
    // Site Content - Singleton for managing all page content
    siteContent: singleton({
      label: 'Site Content',
      path: 'src/content/site-content',
      schema: {
        // Home Page Content
        homeHero: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            titleHighlight: fields.text({ label: 'Title Highlight' }),
            subtitle: fields.text({ label: 'Subtitle', multiline: true }),
          },
          { label: 'Home - Hero Section' }
        ),
        homeAbout: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            titlePart1: fields.text({ label: 'Title Part 1' }),
            titleHighlight: fields.text({ label: 'Title Highlight' }),
            titlePart2: fields.text({ label: 'Title Part 2' }),
            description: fields.text({ label: 'Description', multiline: true }),
            buttonText: fields.text({ label: 'Button Text' }),
          },
          { label: 'Home - About Section' }
        ),
        homeServices: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            titlePart1: fields.text({ label: 'Title Part 1' }),
            titleHighlight: fields.text({ label: 'Title Highlight' }),
            titlePart2: fields.text({ label: 'Title Part 2' }),
          },
          { label: 'Home - Services Section' }
        ),
        homeNetwork: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            titlePart1: fields.text({ label: 'Title Part 1' }),
            titleHighlight: fields.text({ label: 'Title Highlight' }),
            titlePart2: fields.text({ label: 'Title Part 2' }),
            buttonText: fields.text({ label: 'Button Text' }),
          },
          { label: 'Home - Network Section' }
        ),
        // Navbar
        navbar: fields.object(
          {
            buttonText: fields.text({ label: 'Button Text' }),
          },
          { label: 'Navigation Bar' }
        ),
        // Footer
        footer: fields.object(
          {
            address: fields.text({ label: 'Address', multiline: true }),
            email: fields.text({ label: 'Email' }),
            phone: fields.text({ label: 'Phone' }),
            brandText: fields.text({ label: 'Brand Text' }),
          },
          { label: 'Footer' }
        ),
        // Contact Form
        contactForm: fields.object(
          {
            step1Question: fields.text({ label: 'Step 1 Question' }),
            step2Question: fields.text({ label: 'Step 2 Question' }),
            step3Title: fields.text({ label: 'Step 3 Title' }),
            step3Description: fields.text({ label: 'Step 3 Description', multiline: true }),
          },
          { label: 'Contact Form' }
        ),
        // Full JSON Content (for complex nested structures)
        fullContent: fields.document({
          label: 'Full Site Content (JSON)',
          description: 'Advanced: Edit full content.json structure. Use with caution!',
          formatting: false,
          dividers: false,
          links: false,
        }),
      },
    }),
  },
});
