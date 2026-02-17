# Puck Block Components Documentation

This directory contains all custom Puck block components used in the CMS page editor. Puck is a visual page builder that allows users to drag and drop components to create pages.

## Table of Contents

- [Overview](#overview)
- [Existing Blocks](#existing-blocks)
- [Creating a New Block](#creating-a-new-block)
- [Block Structure](#block-structure)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

Puck blocks are React components that can be added to pages through the visual editor. Each block:
- Has configurable props via the Puck editor sidebar
- Renders content in the page canvas
- Can be customized with styles, layout options, and content

Currently, there are **19 custom blocks** totaling ~2,077 lines of code.

## Existing Blocks

| Block | File | Purpose |
|-------|------|---------|
| Heading | `heading-block.tsx` | H1-H6 headings with configurable level |
| Text | `text-block.tsx` | Simple text content |
| Button | `button-block.tsx` | Interactive buttons with variants |
| Image | `image-block.tsx` | Image display with alt text |
| Card | `card-block.tsx` | Card components with title/description |
| List | `list-block.tsx` | Ordered and unordered lists |
| Quote | `quote-block.tsx` | Blockquotes with author attribution |
| Video | `video-block.tsx` | Video embeds with autoplay controls |
| Divider | `divider-block.tsx` | Horizontal dividers with styling |
| Container | `container-block.tsx` | Layout containers with padding |
| Grid | `grid-block.tsx` | Grid layouts for organizing content |
| Form | `form-block.tsx` | Interactive forms |
| Hero | `hero-block.tsx` | Hero sections with gradients/animations |
| Testimonial | `testimonial-block.tsx` | Testimonial cards |
| Carousel | `carousel-block.tsx` | Image carousels |
| Table | `table-block.tsx` | Data tables |
| Gallery | `gallery-block.tsx` | Image galleries |
| Spacer | `spacer-block.tsx` | Spacing elements |
| Welcome | `welcome-block.tsx` | Welcome sections |

## Creating a New Block

### Step 1: Create the Block File

Create a new file in this directory following the naming convention: `{block-name}-block.tsx`

```tsx
// src/features/cms/pages/config/components/my-custom-block.tsx
import type { ComponentConfig } from "@measured/puck";

export interface MyCustomBlockProps {
  title: string;
  description?: string;
  variant?: "default" | "primary" | "secondary";
}

export const MyCustomBlock: ComponentConfig<MyCustomBlockProps> = {
  fields: {
    title: {
      type: "text",
      label: "Title",
    },
    description: {
      type: "textarea",
      label: "Description",
    },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
      ],
    },
  },
  defaultProps: {
    title: "My Custom Block",
    variant: "default",
  },
  render: ({ title, description, variant }) => (
    <div className={`my-custom-block variant-${variant}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  ),
};
```

### Step 2: Register the Block in Puck Config

Add your block to the main Puck configuration:

```tsx
// src/features/cms/pages/config/puck-config.tsx
import { MyCustomBlock } from "./components/my-custom-block";

export const puckConfig: Config = {
  components: {
    // ... existing blocks
    MyCustomBlock,
  },
};
```

### Step 3: Test Your Block

1. Start the development server
2. Navigate to the CMS page editor
3. Look for your new block in the component sidebar
4. Drag it onto the canvas
5. Configure its properties in the right sidebar
6. Verify it renders correctly

## Block Structure

Every Puck block follows this structure:

```tsx
import type { ComponentConfig } from "@measured/puck";

// 1. Define TypeScript interface for props
export interface YourBlockProps {
  // Define all configurable properties
  propertyName: string;
  optionalProperty?: number;
}

// 2. Export the ComponentConfig
export const YourBlock: ComponentConfig<YourBlockProps> = {
  // 3. Define editable fields (shown in Puck sidebar)
  fields: {
    propertyName: {
      type: "text", // Field type
      label: "Property Label", // Label shown in editor
    },
  },

  // 4. Set default values
  defaultProps: {
    propertyName: "Default value",
  },

  // 5. Render function (how the block appears on the page)
  render: (props) => (
    <div>
      {/* Your component JSX */}
    </div>
  ),
};
```

## Field Types

Puck supports various field types for configuring blocks:

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text input | Title, name, URL |
| `textarea` | Multi-line text input | Description, bio, content |
| `number` | Numeric input | Width, height, count |
| `select` | Dropdown selection | Variant, alignment, size |
| `radio` | Radio button selection | Theme, layout option |
| `array` | List of items | Image gallery, list items |
| `object` | Nested object | Advanced settings |
| `custom` | Custom field component | Rich text editor, color picker |

### Advanced Field Example

```tsx
fields: {
  items: {
    type: "array",
    label: "List Items",
    arrayFields: {
      text: { type: "text", label: "Text" },
      icon: { type: "text", label: "Icon" },
    },
  },
  settings: {
    type: "object",
    label: "Advanced Settings",
    objectFields: {
      autoplay: { type: "radio", options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]},
      speed: { type: "number", label: "Speed (ms)" },
    },
  },
},
```

## Best Practices

### 1. TypeScript Types
Always define TypeScript interfaces for your block props:

```tsx
export interface MyBlockProps {
  title: string;
  subtitle?: string; // Use optional for non-required fields
}
```

### 2. Default Props
Provide sensible defaults for all fields:

```tsx
defaultProps: {
  title: "Default Title",
  variant: "default",
  showIcon: true,
},
```

### 3. Styling
Use Tailwind CSS classes for consistent styling:

```tsx
render: ({ title, variant }) => (
  <div className={cn(
    "rounded-lg p-4",
    variant === "primary" && "bg-primary text-primary-foreground",
    variant === "secondary" && "bg-secondary text-secondary-foreground"
  )}>
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
),
```

### 4. Accessibility
Include proper ARIA labels and semantic HTML:

```tsx
render: ({ title, description }) => (
  <section aria-labelledby="block-title">
    <h2 id="block-title" className="sr-only">{title}</h2>
    <p>{description}</p>
  </section>
),
```

### 5. Responsive Design
Use responsive Tailwind classes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### 6. Performance
For heavy components, consider memoization:

```tsx
import { memo } from "react";

const HeavyComponent = memo(({ data }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});
```

### 7. Error Handling
Wrap components in error boundaries for safety:

```tsx
render: (props) => (
  <InlineErrorBoundary message="Failed to render block">
    <YourComponent {...props} />
  </InlineErrorBoundary>
),
```

## Examples

### Example 1: Simple Text Block

```tsx
export interface SimpleTextProps {
  text: string;
  alignment?: "left" | "center" | "right";
}

export const SimpleText: ComponentConfig<SimpleTextProps> = {
  fields: {
    text: { type: "text", label: "Text Content" },
    alignment: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    text: "Enter your text here",
    alignment: "left",
  },
  render: ({ text, alignment }) => (
    <p className={`text-${alignment}`}>{text}</p>
  ),
};
```

### Example 2: Feature Grid Block

```tsx
export interface FeatureGridProps {
  title: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  columns?: number;
}

export const FeatureGrid: ComponentConfig<FeatureGridProps> = {
  fields: {
    title: { type: "text", label: "Section Title" },
    features: {
      type: "array",
      label: "Features",
      arrayFields: {
        icon: { type: "text", label: "Icon Name" },
        title: { type: "text", label: "Feature Title" },
        description: { type: "textarea", label: "Description" },
      },
    },
    columns: {
      type: "select",
      label: "Columns",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
    },
  },
  defaultProps: {
    title: "Features",
    features: [],
    columns: 3,
  },
  render: ({ title, features, columns = 3 }) => (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {features.map((feature, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  ),
};
```

### Example 3: Advanced Hero Block with Gradients

```tsx
export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundGradient?: "blue" | "purple" | "green" | "none";
  animated?: boolean;
}

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
  fields: {
    title: { type: "text", label: "Hero Title" },
    subtitle: { type: "textarea", label: "Subtitle" },
    ctaText: { type: "text", label: "CTA Button Text" },
    ctaLink: { type: "text", label: "CTA Button Link" },
    backgroundGradient: {
      type: "select",
      label: "Background Gradient",
      options: [
        { label: "None", value: "none" },
        { label: "Blue", value: "blue" },
        { label: "Purple", value: "purple" },
        { label: "Green", value: "green" },
      ],
    },
    animated: { type: "radio", label: "Animated", options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ]},
  },
  defaultProps: {
    title: "Welcome to Our Site",
    backgroundGradient: "blue",
    animated: true,
  },
  render: ({ title, subtitle, ctaText, ctaLink, backgroundGradient, animated }) => (
    <div className={cn(
      "relative py-20 px-4 text-center",
      backgroundGradient === "blue" && "bg-gradient-to-r from-blue-500 to-cyan-500",
      backgroundGradient === "purple" && "bg-gradient-to-r from-purple-500 to-pink-500",
      backgroundGradient === "green" && "bg-gradient-to-r from-green-500 to-emerald-500",
      animated && "animate-gradient"
    )}>
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      {subtitle && <p className="text-xl text-white/90 mb-8">{subtitle}</p>}
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {ctaText}
        </a>
      )}
    </div>
  ),
};
```

## Resources

- [Puck Documentation](https://puck.measured.co)
- [Puck GitHub](https://github.com/measuredco/puck)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)

## Need Help?

If you encounter issues or have questions:
1. Check the Puck documentation
2. Review existing block implementations in this directory
3. Reach out to the team for guidance
