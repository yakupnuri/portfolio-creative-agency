# Style Guide - Portfolio & Creative Agency Website

## Color Palette

### Primary Brand Colors
```css
--brand-primary: #2AB7CA       /* Turquoise - Primary action color */
--brand-cta: #FE4A49            /* Red - Call-to-action / Important actions */
--brand-highlight: #FED766       /* Yellow - Highlights / Accents */
--brand-bg: #F4F4F8             /* Light Gray - Backgrounds */
--brand-divider: #E6E6EA         /* Divider Gray - Borders */
```

### Typography Colors
```css
--text-primary: #1a1a1a         /* Dark text - Main content */
--text-secondary: #64748b         /* Medium text - Descriptions */
--text-muted: #94a3b8            /* Light text - Placeholders */
```

## Typography

### Font Families

#### Public Website
```css
font-family-sans: 'Lato', sans-serif;
font-family-serif: 'Playfair Display', serif;
font-family-display: 'Playfair Display', serif;
```

#### Admin Panel
```css
font-family-sans: 'Inter', sans-serif;
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Black: 900 (for Playfair Display headings)

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;        /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;        /* 48px */
```

## Spacing System

```css
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
```

## Border Radius

```css
--radius-sm: 0.5rem;     /* 8px - Small elements */
--radius-md: 1rem;       /* 16px - Cards, buttons */
--radius-lg: 1.5rem;      /* 24px - Larger cards */
--radius-xl: 2rem;        /* 32px - Hero sections */
--radius-full: 9999px;    /* Pills, circles */
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
```

## Component Styles

### Buttons

#### Primary Button
```tsx
<button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-6 py-4 rounded-2xl transition-all">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-4 rounded-2xl transition-all">
  Secondary Action
</button>
```

#### CTA Button
```tsx
<button className="bg-brand-cta hover:bg-brand-cta/90 text-white font-bold px-6 py-4 rounded-2xl transition-all">
  Call to Action
</button>
```

### Input Fields

```tsx
<input
  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 transition-all"
  placeholder="Enter text..."
/>
```

### Cards

```tsx
<div className="bg-white rounded-2xl p-6 shadow-md">
  {/* Card content */}
</div>
```

### Modals

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-[2rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    {/* Modal content */}
  </div>
</div>
```

## Layout Patterns

### Section Spacing
```tsx
<section className="py-16 px-6">
  {/* Section content */}
</section>
```

### Container
```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>
```

### Grid Layouts
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

## Animation & Transitions

### Hover Effects
```css
transition-all duration-300 ease-in-out
```

### Focus States
```css
focus:ring-2 focus:ring-brand-primary/20
```

### Loading States
```tsx
<div className="animate-pulse bg-brand-bg rounded-2xl">
  {/* Skeleton content */}
</div>
```

## Icons

Use Material Symbols Outlined:
```tsx
<span className="material-symbols-outlined">icon_name</span>
```

Common icons:
- Add: `add`
- Edit: `edit`
- Delete: `delete`
- Close: `close`
- Search: `search`
- Filter: `filter_list`
- More: `more_vert`

## Responsive Breakpoints

```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## Accessibility

- Minimum touch target: 44px
- Minimum text size: 14px
- Color contrast ratio: WCAG AA (4.5:1)
- Focus visible states on all interactive elements

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Mobile