# Gamegeek - Astro Website with Keystatic CMS

A modern, responsive website built with Astro and Keystatic CMS, featuring a clean design and comprehensive content management capabilities.

## 🚀 Features

- **Modern Tech Stack**: Built with Astro, TypeScript, and Tailwind CSS
- **Content Management**: Integrated Keystatic CMS for easy content management
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Performance Optimized**: Fast loading times and SEO-friendly
- **Type Safe**: Full TypeScript support throughout the project

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages
│   ├── content/            # Keystatic content collections
│   └── assets/             # Static assets
├── public/                 # Public static files
├── keystatic.config.ts     # Keystatic CMS configuration
└── astro.config.mjs        # Astro configuration
```

## 🛠️ Tech Stack

- **Framework**: Astro 4.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Keystatic
- **Icons**: Heroicons
- **Fonts**: Inter (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gamegeek
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Content Management

The website uses Keystatic CMS for content management. Access the admin panel at `/admin` or directly at `/keystatic`.

### Content Collections

- **Posts**: Blog articles and news
- **Pages**: Static pages (About, Services, etc.)
- **Services**: Service offerings
- **Team**: Team member profiles

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.mjs`:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... more shades
  }
}
```

### Components

All components are located in `src/components/` and can be easily customized or extended.

### Content

Content is managed through Keystatic CMS. The schema is defined in `keystatic.config.ts`.

## 📱 Pages

- **Home** (`/`): Landing page with hero, features, services, and testimonials
- **About** (`/about`): Company information and team
- **Services** (`/services`): Detailed service offerings
- **Portfolio** (`/portfolio`): Project showcase
- **Blog** (`/blog`): Blog articles and insights
- **Contact** (`/contact`): Contact form and information
- **Admin** (`/admin`): CMS admin panel

## 🔧 Configuration

### Astro Configuration

The Astro configuration is in `astro.config.mjs` and includes:
- Tailwind CSS integration
- React support
- Node.js adapter for server-side rendering

### Keystatic Configuration

Keystatic is configured in `keystatic.config.ts` with:
- Local storage for development
- Content collections for different content types
- Image handling and optimization

## 📦 Deployment

The project is configured for deployment on various platforms:

### Vercel
```bash
npm run build
# Deploy the dist folder
```

### Netlify
```bash
npm run build
# Deploy the dist folder
```

### Node.js Server
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: hello@gamegeek.com
- Phone: +1 (555) 123-4567

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - The web framework
- [Keystatic](https://keystatic.com/) - The CMS
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Heroicons](https://heroicons.com/) - The icon library
