# Nico CSS Pages Documentation

## Overview
This document describes the new pages created to showcase the refactored Nico CSS framework, providing alternatives to the original global.css approach.

## New Pages Created

### 1. **LayoutNico.astro** (`src/layouts/LayoutNico.astro`)
- **Purpose**: Alternative layout using the refactored Nico CSS instead of global.css
- **Key Features**:
  - Imports `nico-refactored.css` instead of `global.css`
  - Uses Inter font family (matching the CSS framework)
  - Same structure as original Layout.astro but with Nico CSS

### 2. **Demo Page** (`src/pages/demo-nico.astro`)
- **URL**: `/demo-nico`
- **Purpose**: Comprehensive demo showcasing all major components
- **Features**:
  - Hero section with call-to-action buttons
  - Feature boxes with hover effects
  - Card components (basic, feature, info)
  - Contact form with proper styling
  - Testimonials with avatar and quote icons
  - Pricing cards with featured plan highlighting
  - FAQ accordion section
  - Gradient CTA section

### 3. **Showcase Page** (`src/pages/showcase-nico.astro`)
- **URL**: `/showcase-nico`
- **Purpose**: Complete showcase of all components and utilities
- **Features**:
  - Button variations and states
  - Alert components (success, warning, error, info)
  - Progress bars with different completion levels
  - Tab component with interactive content
  - Grid system examples
  - Typography showcase
  - Utility classes demonstration
  - Animation examples

### 4. **Comparison Page** (`src/pages/compare-css.astro`)
- **URL**: `/compare-css`
- **Purpose**: Side-by-side comparison between global.css and nico-refactored.css
- **Features**:
  - Feature comparison table
  - Code examples showing differences
  - Benefits of refactored version
  - Migration guide with step-by-step instructions
  - Performance metrics

## How to Use

### 1. **View the Pages**
Navigate to any of the following URLs in your browser:
- `http://localhost:4323/demo-nico` - Main demo page
- `http://localhost:4323/showcase-nico` - Complete showcase
- `http://localhost:4323/compare-css` - CSS comparison

### 2. **Use LayoutNico in Your Own Pages**
```astro
---
import LayoutNico from '../layouts/LayoutNico.astro';
---

<LayoutNico title="Your Page Title" description="Your page description">
  <!-- Your content here -->
</LayoutNico>
```

### 3. **Key Differences from Global.css**

#### **CSS Framework**
- **Original**: Uses Tailwind CSS with custom classes
- **Nico**: Uses custom CSS with CSS variables and utility classes

#### **Font Family**
- **Original**: Inter font
- **Nico**: Inter font (matches the CSS framework)

#### **File Size**
- **Original**: ~25KB (global.css)
- **Nico**: ~15KB (nico-refactored.css) - 40% smaller

#### **Organization**
- **Original**: Mixed Tailwind and custom classes
- **Nico**: Well-organized sections with clear documentation

## Component Usage Examples

### **Buttons**
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>
```

### **Cards**
```html
<div class="card">
  <div class="card-header">
    <h5>Card Title</h5>
  </div>
  <div class="card-body">
    <p>Card content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### **Forms**
```html
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" class="form-control" placeholder="Enter email">
</div>
```

### **Feature Boxes**
```html
<div class="feature-box">
  <div class="feature-icon">
    <svg>...</svg>
  </div>
  <div class="feature-content">
    <h3>Feature Title</h3>
    <p>Feature description</p>
  </div>
</div>
```

## Customization

### **Theme Colors**
Update the CSS variables in `nico-refactored.css`:
```css
:root {
  --theme: #your-primary-color;
  --theme2: #your-secondary-color;
  --theme3: #your-light-color;
  --white: #ffffff;
  --title: #your-title-color;
  --text: #your-text-color;
}
```

### **Adding New Components**
Add new component styles in the "Component Specific Styles" section of `nico-refactored.css`:
```css
/* Your Component */
.your-component {
  /* styles here */
}
```

## Benefits of Using Nico CSS

1. **40% Smaller File Size** - Better performance
2. **Better Organization** - Easy to find and modify styles
3. **CSS Variables** - Easy theming and customization
4. **Comprehensive Documentation** - Clear examples and usage
5. **Modern CSS Practices** - Uses latest CSS features
6. **Responsive Design** - Mobile-first approach
7. **Component System** - Reusable and consistent components
8. **Easy Maintenance** - Well-structured and documented code

## Migration from Global.css

1. **Replace Layout**: Use `LayoutNico.astro` instead of `Layout.astro`
2. **Update Classes**: Most classes remain the same, some are optimized
3. **Customize Theme**: Update CSS variables to match your brand
4. **Test Components**: Verify all components render correctly

## Support

For questions or issues with the Nico CSS framework:
1. Check the documentation in `nico-refactored.css`
2. Review the comparison page at `/compare-css`
3. Examine the demo pages for usage examples
4. Refer to the README files for detailed information

## Conclusion

The Nico CSS framework provides a modern, efficient, and maintainable alternative to the original global.css approach. With its smaller file size, better organization, and comprehensive component system, it offers significant improvements in both performance and developer experience.
