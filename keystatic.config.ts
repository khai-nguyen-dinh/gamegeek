import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'khai-nguyen-dinh',
      name: 'gamegeek',
    },
  },
  // IMPORTANT: For Cloudflare deployments, ui.kind must be 'github'
  // This redirects the admin UI to use GitHub's OAuth flow
  // instead of trying to use the local API (which doesn't work on Cloudflare)
  ui: {
    kind: 'github',
  },
  collections: {
    // News Posts Collection
    posts: collection({
      label: 'News Posts',
      slugField: 'title',
      path: 'src/keystatic/posts/*',
      format: { contentField: 'content' },
      schema: {
        id: fields.text({ 
          label: 'ID',
          description: 'Unique identifier (auto-generated from title if left empty)',
          validation: { isRequired: false },
        }),
        title: fields.text({ 
          label: 'Title',
          validation: { isRequired: true },
        }),
        date: fields.date({ 
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),
        category: fields.relationship({
          label: 'Category',
          collection: 'categories',
          validation: { isRequired: true },
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
      path: 'src/keystatic/categories/*',
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
      path: 'src/keystatic/pages/*',
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

    // Services Collection (for service items)
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/keystatic/services/*',
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

    // Services Page Content Collection
    servicePages: collection({
      label: 'Services Pages',
      slugField: 'title',
      path: 'src/keystatic/page-content/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ 
          label: 'Page Title',
          defaultValue: 'Services',
        }),
        hero: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            title: fields.text({ label: 'Title', validation: { isRequired: false } }),
            titlePart1: fields.text({ label: 'Title Part 1', validation: { isRequired: false } }),
            titleHighlight: fields.text({ label: 'Title Highlight', validation: { isRequired: false } }),
            titleHighlight2: fields.text({ label: 'Title Highlight 2', validation: { isRequired: false } }),
            titlePart4: fields.text({ label: 'Title Part 4', validation: { isRequired: false } }),
            titleHighlight3: fields.text({ label: 'Title Highlight 3', validation: { isRequired: false } }),
            tagline: fields.text({ 
              label: 'Tagline',
              description: 'Hero tagline text (e.g., "leading local gaming market expert & marketing partner")',
              validation: { isRequired: false },
            }),
          },
          { label: 'Hero' }
        ),
        moveText: fields.array(fields.text({ label: 'Text' }), { label: 'Move Text' }),
        globalPartners: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            title: fields.text({ label: 'Title' }),
          },
          { label: 'Global Partners' }
        ),
        globalPartnersTabs: fields.array(
          fields.object(
            {
              name: fields.text({ label: 'Name' }),
              description: fields.text({ label: 'Description', multiline: true }),
              image: fields.image({
                label: 'Image',
                directory: 'public/images',
                publicPath: '/images',
                validation: { isRequired: false },
              }),
              items: fields.array(
                fields.object(
                  {
                    number: fields.text({ label: 'Number' }),
                    title: fields.text({ label: 'Title' }),
                    description: fields.text({ label: 'Description', multiline: true }),
                  },
                  { label: 'Item' }
                ),
                { label: 'Items' }
              ),
            },
            { label: 'Tab' }
          ),
          { label: 'Global Partners Tabs' }
        ),
        localPartners: fields.object(
          {
            subtitle: fields.text({ label: 'Subtitle' }),
            title: fields.text({ label: 'Title' }),
          },
          { label: 'Local Partners' }
        ),
        tabs: fields.array(
          fields.object(
            {
              name: fields.text({ label: 'Name' }),
              description: fields.text({ label: 'Description', multiline: true }),
              image: fields.image({
                label: 'Image',
                directory: 'public/images',
                publicPath: '/images',
                validation: { isRequired: false },
              }),
              items: fields.array(
                fields.object(
                  {
                    number: fields.text({ label: 'Number' }),
                    title: fields.text({ label: 'Title' }),
                    description: fields.text({ label: 'Description', multiline: true }),
                  },
                  { label: 'Item' }
                ),
                { label: 'Items' }
              ),
            },
            { label: 'Tab' }
          ),
          { label: 'Tabs' }
        ),
        cta: fields.object(
          {
            title: fields.text({ label: 'Title' }),
          },
          { label: 'CTA' }
        ),
        description: fields.document({
          label: 'Description',
          formatting: true,
          dividers: true,
          links: true,
          validation: { isRequired: false },
        }),
      },
    }),

    // Team Members Collection
    team: collection({
      label: 'Team Members',
      slugField: 'name',
      path: 'src/keystatic/team/*',
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
      path: 'src/keystatic/slides/*',
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
      path: 'src/keystatic/events/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ label: 'Event Title' }),
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
        isHero: fields.checkbox({
          label: 'Event Đại Diện (Hero)',
          description: 'Chọn event này làm event đại diện hiển thị ở phần hero slider',
          defaultValue: false,
        }),
      },
    }),

    // Careers Collection
    careers: collection({
      label: 'Careers',
      slugField: 'title',
      path: 'src/keystatic/careers/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.text({ 
          label: 'Job Title',
          validation: { isRequired: true },
        }),
        location: fields.text({ 
          label: 'Location',
          validation: { isRequired: true },
        }),
        type: fields.select({
          label: 'Job Type',
          options: [
            { label: 'Full-Time', value: 'Full-Time' },
            { label: 'Part-Time', value: 'Part-Time' },
            { label: 'Contract', value: 'Contract' },
            { label: 'Internship', value: 'Internship' },
            { label: 'Freelance', value: 'Freelance' },
          ],
          defaultValue: 'Full-Time',
        }),
        experience: fields.text({ 
          label: 'Experience Required',
          description: 'e.g., "2+ Years", "5+ Years", "Entry Level"',
          validation: { isRequired: true },
        }),
        deadline: fields.date({ 
          label: 'Application Deadline',
          validation: { isRequired: false },
        }),
        salary: fields.text({ 
          label: 'Salary Range',
          description: 'e.g., "UP TO 20,000,000", "Competitive", "Negotiable"',
          validation: { isRequired: false },
        }),
        description: fields.document({
          label: 'Job Description',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images',
            publicPath: '/images',
          },
        }),
        responsibilities: fields.array(
          fields.text({ label: 'Responsibility' }),
          { 
            label: 'Responsibilities',
            itemLabel: (props) => props.value || 'New Responsibility',
          }
        ),
        qualifications: fields.array(
          fields.text({ label: 'Qualification' }),
          { 
            label: 'Qualifications',
            itemLabel: (props) => props.value || 'New Qualification',
          }
        ),
        offers: fields.array(
          fields.text({ label: 'Benefit/Offer' }),
          { 
            label: 'What We Offer',
            itemLabel: (props) => props.value || 'New Offer',
          }
        ),
        featured: fields.checkbox({
          label: 'Featured Job',
          description: 'Show this job prominently on the careers page',
          defaultValue: false,
        }),
        active: fields.checkbox({
          label: 'Active',
          description: 'Only active jobs will be displayed',
          defaultValue: true,
        }),
      },
    }),

    // Globals Collection - Shared content across the site
    globals: collection({
      label: 'Globals',
      slugField: 'title',
      path: 'src/keystatic/globals/*',
      schema: {
        title: fields.text({ 
          label: 'Title',
          description: 'Identifier for this global content (e.g., "navbar", "footer", "contactForm", "meta")',
        }),
        navbar: fields.object(
          {
            menu: fields.array(
              fields.object(
                {
                  text: fields.text({ label: 'Text' }),
                  href: fields.text({ label: 'Href' }),
                },
                { label: 'Menu Item' }
              ),
              { label: 'Menu' }
            ),
            buttonText: fields.text({ label: 'Button Text' }),
          },
          { label: 'Navbar', validation: { isRequired: false } }
        ),
        footer: fields.object(
          {
            quickLinks: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                links: fields.array(
                  fields.object(
                    {
                      text: fields.text({ label: 'Text' }),
                      href: fields.text({ label: 'Href' }),
                    },
                    { label: 'Link' }
                  ),
                  { label: 'Links' }
                ),
              },
              { label: 'Quick Links' }
            ),
            explore: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                links: fields.array(
                  fields.object(
                    {
                      text: fields.text({ label: 'Text' }),
                      href: fields.text({ label: 'Href' }),
                    },
                    { label: 'Link' }
                  ),
                  { label: 'Links' }
                ),
              },
              { label: 'Explore' }
            ),
            company: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                links: fields.array(
                  fields.object(
                    {
                      text: fields.text({ label: 'Text' }),
                      href: fields.text({ label: 'Href' }),
                    },
                    { label: 'Link' }
                  ),
                  { label: 'Links' }
                ),
              },
              { label: 'Company' }
            ),
            address: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                address: fields.text({ label: 'Address', multiline: true }),
                email: fields.text({ label: 'Email' }),
                phone: fields.text({ label: 'Phone' }),
              },
              { label: 'Address' }
            ),
            social: fields.object(
              {
                followText: fields.text({ label: 'Follow Text' }),
                links: fields.array(
                  fields.object(
                    {
                      platform: fields.text({ label: 'Platform' }),
                      href: fields.text({ label: 'Href' }),
                      icon: fields.text({ label: 'Icon' }),
                    },
                    { label: 'Social Link' }
                  ),
                  { label: 'Links' }
                ),
              },
              { label: 'Social' }
            ),
            brandText: fields.text({ label: 'Brand Text' }),
          },
          { label: 'Footer', validation: { isRequired: false } }
        ),
        contactForm: fields.object(
          {
            step1: fields.object(
              {
                question: fields.text({ label: 'Question' }),
                options: fields.array(fields.text({ label: 'Option' }), { label: 'Options' }),
              },
              { label: 'Step 1' }
            ),
            step2: fields.object(
              {
                question: fields.text({ label: 'Question' }),
                options: fields.array(fields.text({ label: 'Option' }), { label: 'Options' }),
              },
              { label: 'Step 2' }
            ),
            step3: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
                fields: fields.object(
                  {
                    fullName: fields.text({ label: 'Full Name' }),
                    email: fields.text({ label: 'Email' }),
                    title: fields.text({ label: 'Title' }),
                    companyName: fields.text({ label: 'Company Name' }),
                    socialContact: fields.text({ label: 'Social Contact' }),
                  },
                  { label: 'Fields' }
                ),
                submitButton: fields.text({ label: 'Submit Button' }),
              },
              { label: 'Step 3' }
            ),
          },
          { label: 'Contact Form', validation: { isRequired: false } }
        ),
        meta: fields.object(
          {
            siteTitle: fields.text({ label: 'Site Title' }),
            defaultDescription: fields.text({ label: 'Default Description', multiline: true }),
            defaultKeywords: fields.text({ label: 'Default Keywords', multiline: true }),
          },
          { label: 'Meta', validation: { isRequired: false } }
        ),
      },
    }),

    // Page Content Collection - Content for individual pages
    pageContent: collection({
      label: 'Page Content',
      slugField: 'title',
      path: 'src/keystatic/page-content/*',
      schema: {
        title: fields.text({ 
          label: 'Page Title',
          description: 'Identifier for this page (e.g., "home", "about", "contact", "news", "blog", "career", "program")',
        }),
        home: fields.object(
          {
            hero: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                titleHighlight: fields.text({ label: 'Title Highlight' }),
                subtitle: fields.text({ label: 'Subtitle', multiline: true }),
              },
              { label: 'Hero', validation: { isRequired: false } }
            ),
            about: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
                buttonText: fields.text({ label: 'Button Text' }),
              },
              { label: 'About', validation: { isRequired: false } }
            ),
            moveText: fields.array(fields.text({ label: 'Text' }), { label: 'Move Text', validation: { isRequired: false } }),
            services: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                items: fields.array(
                  fields.object(
                    {
                      title: fields.text({ label: 'Title' }),
                      items: fields.array(fields.text({ label: 'Item' }), { label: 'Items' }),
                      linkText: fields.text({ label: 'Link Text' }),
                    },
                    { label: 'Service Item' }
                  ),
                  { label: 'Items' }
                ),
              },
              { label: 'Services', validation: { isRequired: false } }
            ),
            network: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                buttonText: fields.text({ label: 'Button Text' }),
                stats: fields.array(
                  fields.object(
                    {
                      value: fields.text({ label: 'Value' }),
                      label: fields.text({ label: 'Label' }),
                    },
                    { label: 'Stat' }
                  ),
                  { label: 'Stats' }
                ),
              },
              { label: 'Network', validation: { isRequired: false } }
            ),
            cta: fields.object(
              {
                title: fields.text({ label: 'Title' }),
              },
              { label: 'CTA', validation: { isRequired: false } }
            ),
            events: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
              },
              { label: 'Events', validation: { isRequired: false } }
            ),
            news: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                stats: fields.array(
                  fields.object(
                    {
                      label: fields.text({ label: 'Label' }),
                      prefix: fields.text({ label: 'Prefix' }),
                      value: fields.text({ label: 'Value' }),
                      suffix: fields.text({ label: 'Suffix' }),
                      description: fields.text({ label: 'Description', multiline: true }),
                    },
                    { label: 'Stat' }
                  ),
                  { label: 'Stats' }
                ),
              },
              { label: 'News', validation: { isRequired: false } }
            ),
          },
          { label: 'Home', validation: { isRequired: false } }
        ),
        about: fields.object(
          {
            hero: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                titlePart1: fields.text({ label: 'Title Part 1', validation: { isRequired: false } }),
                buttonText: fields.text({ label: 'Button Text' }),
              },
              { label: 'Hero', validation: { isRequired: false } }
            ),
            aboutSection: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
                stats: fields.array(
                  fields.object(
                    {
                      label: fields.text({ label: 'Label' }),
                      value: fields.text({ label: 'Value' }),
                      suffix: fields.text({ label: 'Suffix' }),
                      description: fields.text({ label: 'Description' }),
                    },
                    { label: 'Stat' }
                  ),
                  { label: 'Stats' }
                ),
              },
              { label: 'About Section', validation: { isRequired: false } }
            ),
            features: fields.array(
              fields.object(
                {
                  value: fields.text({ label: 'Value' }),
                  description: fields.text({ label: 'Description', multiline: true }),
                },
                { label: 'Feature' }
              ),
              { label: 'Features', validation: { isRequired: false } }
            ),
            vision: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
              },
              { label: 'Vision', validation: { isRequired: false } }
            ),
            mission: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
              },
              { label: 'Mission', validation: { isRequired: false } }
            ),
            team: fields.object(
              {
                subtitle: fields.text({ label: 'Subtitle' }),
                title: fields.text({ label: 'Title' }),
              },
              { label: 'Team', validation: { isRequired: false } }
            ),
            cta: fields.object(
              {
                title: fields.text({ label: 'Title' }),
              },
              { label: 'CTA', validation: { isRequired: false } }
            ),
          },
          { label: 'About', validation: { isRequired: false } }
        ),
        contact: fields.object(
          {
            hero: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
              },
              { label: 'Hero', validation: { isRequired: false } }
            ),
            form: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                fields: fields.object(
                  {
                    firstName: fields.text({ label: 'First Name' }),
                    lastName: fields.text({ label: 'Last Name' }),
                    email: fields.text({ label: 'Email' }),
                    company: fields.text({ label: 'Company' }),
                    service: fields.text({ label: 'Service' }),
                    budget: fields.text({ label: 'Budget' }),
                    message: fields.text({ label: 'Message' }),
                    messagePlaceholder: fields.text({ label: 'Message Placeholder' }),
                  },
                  { label: 'Fields' }
                ),
                submitButton: fields.text({ label: 'Submit Button' }),
                serviceOptions: fields.array(fields.text({ label: 'Option' }), { label: 'Service Options' }),
                budgetOptions: fields.array(fields.text({ label: 'Option' }), { label: 'Budget Options' }),
              },
              { label: 'Form', validation: { isRequired: false } }
            ),
            info: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
                email: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    value: fields.text({ label: 'Value' }),
                  },
                  { label: 'Email' }
                ),
                phone: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    value: fields.text({ label: 'Value' }),
                  },
                  { label: 'Phone' }
                ),
                address: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    value: fields.text({ label: 'Value', multiline: true }),
                  },
                  { label: 'Address' }
                ),
                hours: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    values: fields.array(fields.text({ label: 'Value' }), { label: 'Values' }),
                  },
                  { label: 'Hours' }
                ),
                followText: fields.text({ label: 'Follow Text' }),
              },
              { label: 'Info', validation: { isRequired: false } }
            ),
          },
          { label: 'Contact', validation: { isRequired: false } }
        ),
        news: fields.object(
          {
            breadcrumb: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                home: fields.text({ label: 'Home' }),
                current: fields.text({ label: 'Current' }),
              },
              { label: 'Breadcrumb', validation: { isRequired: false } }
            ),
            sidebar: fields.object(
              {
                search: fields.object(
                  {
                    placeholder: fields.text({ label: 'Placeholder' }),
                  },
                  { label: 'Search' }
                ),
                categories: fields.object(
                  {
                    title: fields.text({ label: 'Title' }),
                  },
                  { label: 'Categories' }
                ),
                recentPosts: fields.object(
                  {
                    title: fields.text({ label: 'Title' }),
                  },
                  { label: 'Recent Posts' }
                ),
                tags: fields.object(
                  {
                    title: fields.text({ label: 'Title' }),
                    items: fields.array(fields.text({ label: 'Tag' }), { label: 'Items' }),
                  },
                  { label: 'Tags' }
                ),
              },
              { label: 'Sidebar', validation: { isRequired: false } }
            ),
            readMore: fields.text({ label: 'Read More', validation: { isRequired: false } }),
          },
          { label: 'News', validation: { isRequired: false } }
        ),
        blog: fields.object(
          {
            hero: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
              },
              { label: 'Hero', validation: { isRequired: false } }
            ),
            featured: fields.object(
              {
                badge: fields.text({ label: 'Badge' }),
                loadMore: fields.text({ label: 'Load More' }),
              },
              { label: 'Featured', validation: { isRequired: false } }
            ),
            newsletter: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description', multiline: true }),
                placeholder: fields.text({ label: 'Placeholder' }),
                button: fields.text({ label: 'Button' }),
              },
              { label: 'Newsletter', validation: { isRequired: false } }
            ),
          },
          { label: 'Blog', validation: { isRequired: false } }
        ),
        career: fields.object(
          {
            breadcrumb: fields.object(
              {
                title: fields.text({ label: 'Title' }),
                home: fields.text({ label: 'Home' }),
                current: fields.text({ label: 'Current' }),
              },
              { label: 'Breadcrumb', validation: { isRequired: false } }
            ),
            applyButton: fields.text({ label: 'Apply Button', validation: { isRequired: false } }),
            jobMeta: fields.object(
              {
                location: fields.text({ label: 'Location' }),
                type: fields.text({ label: 'Type' }),
                experience: fields.text({ label: 'Experience' }),
              },
              { label: 'Job Meta', validation: { isRequired: false } }
            ),
          },
          { label: 'Career', validation: { isRequired: false } }
        ),
        program: fields.object(
          {
            hero: fields.object(
              {
                title: fields.text({ label: 'Title' }),
              },
              { label: 'Hero', validation: { isRequired: false } }
            ),
            upcomingEvents: fields.object(
              {
                title: fields.text({ label: 'Title' }),
              },
              { label: 'Upcoming Events', validation: { isRequired: false } }
            ),
            filters: fields.object(
              {
                eventStatus: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    options: fields.array(fields.text({ label: 'Option' }), { label: 'Options' }),
                  },
                  { label: 'Event Status' }
                ),
                location: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    options: fields.array(fields.text({ label: 'Option' }), { label: 'Options' }),
                  },
                  { label: 'Location' }
                ),
                year: fields.object(
                  {
                    label: fields.text({ label: 'Label' }),
                    options: fields.array(fields.text({ label: 'Option' }), { label: 'Options' }),
                  },
                  { label: 'Year' }
                ),
                searchButton: fields.text({ label: 'Search Button' }),
              },
              { label: 'Filters', validation: { isRequired: false } }
            ),
            eventStatus: fields.object(
              {
                upcoming: fields.text({ label: 'Upcoming' }),
                completed: fields.text({ label: 'Completed' }),
              },
              { label: 'Event Status', validation: { isRequired: false } }
            ),
            followText: fields.text({ label: 'Follow Text', validation: { isRequired: false } }),
          },
          { label: 'Program', validation: { isRequired: false } }
        ),
      },
    }),
  },
  singletons: {
    // Site Content - Singleton for managing all page content
    siteContent: singleton({
      label: 'Site Content',
      path: 'src/keystatic/site-content',
      schema: {
        // All page content has been moved to pageContent collection
        // All global content (navbar, footer, contactForm, meta) has been moved to globals collection
      },
    }),
  },
});
