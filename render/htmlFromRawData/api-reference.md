<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://arch.nexellab.com/icon.svg">
        <img width="140" alt="Logo for A1" src="https://arch.nexellab.com/icon.svg">
    </picture>
</p>

<h1 align="center">
  HtmlFromRawData by <a href="https://theiceji.com">TheIceJi</a>
</h1>

# Content Schema and API Reference

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Content Structure",
  "definitions": {
    "TextContent": {
      "type": "object",
      "required": ["text"],
      "properties": {
        "text": {
          "type": "string",
          "description": "The text content to be displayed"
        },
        "bold": {
          "type": "boolean",
          "description": "Whether the text should be displayed in bold",
          "default": false
        }
      }
    },
    "ImageContent": {
      "type": "object",
      "required": ["src", "altText", "height", "width"],
      "properties": {
        "src": {
          "type": "string",
          "description": "URL of the image"
        },
        "altText": {
          "type": "string",
          "description": "Alternative text for accessibility"
        },
        "height": {
          "type": "number",
          "description": "Height of the image in pixels"
        },
        "width": {
          "type": "number",
          "description": "Width of the image in pixels"
        }
      }
    },
    "ContentBlockType": {
      "type": "string",
      "enum": [
        "paragraph",
        "heading-one",
        "heading-two",
        "heading-three",
        "heading-four",
        "heading-five",
        "heading-six",
        "image",
        "class",
        "block-quote"
      ]
    },
    "Content": {
      "type": "object",
      "required": ["type", "children"],
      "properties": {
        "type": {
          "$ref": "#/definitions/ContentBlockType"
        },
        "className": {
          "type": "string",
          "description": "Optional CSS class name for styling"
        },
        "children": {
          "type": "array",
          "items": {
            "oneOf": [
              { "$ref": "#/definitions/TextContent" },
              { "$ref": "#/definitions/ImageContent" },
              { "$ref": "#/definitions/Content" }
            ]
          }
        }
      }
    },
    "RawContent": {
      "type": "object",
      "required": ["content"],
      "properties": {
        "content": {
          "$ref": "#/definitions/Content"
        }
      }
    }
  }
}
```

## Component API Reference

### HTMLFromRaw

The main component for rendering content structure.

```typescript
interface HTMLFromRawProps {
  data: RawContent;
}
```

#### Example Usage

```tsx
const content = {
  content: {
    type: 'paragraph',
    children: [
      { text: 'Hello ', bold: false },
      { text: 'World', bold: true }
    ]
  }
};

<HTMLFromRaw data={content} />
```

### Text

Renders text content with optional bold formatting.

```typescript
interface TextProps {
  block: TextContent[];
}
```

#### Example Usage

```tsx
const textBlock = [
  { text: 'Regular text ', bold: false },
  { text: 'Bold text', bold: true }
];

<Text block={textBlock} />
```

### ImageBlock

Renders an image with proper formatting and loading states.

```typescript
interface ImageBlockProps {
  src: string;
  altText: string;
  height: number;
  width: number;
}
```

#### Example Usage

```tsx
<ImageBlock
  src="/path/to/image.jpg"
  altText="Description"
  height={400}
  width={600}
/>
```

### BlockQuote

Renders a styled blockquote with text content.

```typescript
interface BlockQuoteProps {
  children: TextContent[];
}
```

#### Example Usage

```tsx
const quoteContent = [
  { text: 'This is a quote', bold: false }
];

<BlockQuote children={quoteContent} />
```

### Heading

Renders heading elements (h1-h6) with consistent styling.

```typescript
interface HeadingProps {
  type: ContentBlockType;
  children: TextContent[];
}
```

#### Example Usage

```tsx
const headingContent = [
  { text: 'Main Title', bold: false }
];

<Heading type="heading-one" children={headingContent} />
```

## Example Content Structure

Here's a complete example of a content structure:

```json
{
  "content": {
    "type": "class",
    "className": "article-content",
    "children": [
      {
        "type": "heading-one",
        "children": [{ "text": "Article Title", "bold": true }]
      },
      {
        "type": "paragraph",
        "children": [
          { "text": "This is a paragraph with " },
          { "text": "bold text", "bold": true },
          { "text": " and normal text." }
        ]
      },
      {
        "type": "image",
        "src": "/example.jpg",
        "altText": "Example Image",
        "height": 400,
        "width": 600
      },
      {
        "type": "block-quote",
        "children": [{ "text": "This is a quoted text", "bold": false }]
      }
    ]
  }
}
```

## Styling

The components use Tailwind CSS classes for styling. Custom styles can be applied through:

1. The `className` property for class-type blocks
2. Predefined styles for specific block types (headings, blockquotes, etc.)
3. Dark mode support with `dark:` variants

## Error Handling

Components include the following error handling:

1. Type checking for all props
2. Null checks for optional properties
3. Fallback rendering for unknown content types
4. Image loading error handling with blur placeholders

## Performance Considerations

1. All components are memoized using `React.memo`
2. `renderContent` function is memoized using `useCallback`
3. Proper key generation for mapped elements
4. Efficient rendering of dynamic heading elements
5. Lazy loading of images with blur placeholders

# Using HTMLFromRaw Schema

## Schema Location
The schema is available at:
```
https://theiceji.com/schema/htmlFromRawData/schema.json
```

## How to Reference the Schema

### 1. In Your JSON Data
```json
{
  "$schema": "https://theiceji.com/schema/htmlFromRawData/schema.json",
  "content": {
    "type": "class",
    "children": [...]
  }
}
```

### 2. In TypeScript with VS Code
Add a reference to the schema in your `jsconfig.json` or `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... other options
  },
  "json.schemas": [
    {
      "fileMatch": ["**/content.json"],
      "url": "https://theiceji.com/schema/htmlFromRawData/schema.json"
    }
  ]
}
```

### 3. In package.json (for npm projects)
```json
{
  "name": "your-project",
  "version": "1.0.0",
  "$schema": "https://theiceji.com/schema/htmlFromRawData/schema.json"
}
```

## Validation Examples

### Using Node.js with Ajv
```typescript
import Ajv from 'ajv';
import schema from './schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const data = {
  "content": {
    "type": "paragraph",
    "children": [
      { "text": "Hello World" }
    ]
  }
};

const valid = validate(data);
if (!valid) {
  console.log(validate.errors);
}
```

### Using Python with jsonschema
```python
from jsonschema import validate
import json
import requests

# Fetch schema
schema_url = "https://theiceji.com/schema/htmlFromRawData/schema.json"
schema = requests.get(schema_url).json()

# Your data
data = {
    "content": {
        "type": "paragraph",
        "children": [
            {"text": "Hello World"}
        ]
    }
}

# Validate
validate(instance=data, schema=schema)
```

## Content Examples

### Basic Text Content
```json
{
  "$schema": "https://theiceji.com/schema/htmlFromRawData/schema.json",
  "content": {
    "type": "paragraph",
    "children": [
      {
        "text": "Regular text ",
        "bold": false
      },
      {
        "text": "bold text",
        "bold": true
      }
    ]
  }
}
```

### Mixed Content with Image
```json
{
  "$schema": "https://theiceji.com/schema/htmlFromRawData/schema.json",
  "content": {
    "type": "class",
    "className": "article",
    "children": [
      {
        "type": "heading-one",
        "children": [
          {
            "text": "Article Title",
            "bold": true
          }
        ]
      },
      {
        "type": "image",
        "src": "/path/to/image.jpg",
        "altText": "Description",
        "height": 400,
        "width": 600
      }
    ]
  }
}
```

### Block Quote Example
```json
{
  "$schema": "https://theiceji.com/schema/htmlFromRawData/schema.json",
  "content": {
    "type": "block-quote",
    "children": [
      {
        "text": "This is a quote with ",
        "bold": false
      },
      {
        "text": "emphasized",
        "bold": true
      },
      {
        "text": " text.",
        "bold": false
      }
    ]
  }
}
```

## IDE Support

### VS Code Settings
Add to `.vscode/settings.json`:
```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "content.json",
        "*.content.json"
      ],
      "url": "https://theiceji.com/schema/htmlFromRawData/schema.json"
    }
  ]
}
```

### WebStorm Settings
1. Go to Preferences → JSON Schema Mappings
2. Add new schema mapping:
   - Schema URL: `https://theiceji.com/schema/htmlFromRawData/schema.json`
   - File pattern: `*.content.json`

## Common Issues and Solutions

### Schema Not Loading
- Ensure the schema URL is accessible
- Check your network connection
- Verify CORS settings if loading from browser

### Validation Errors
Common validation errors and solutions:
1. Missing required fields
   ```json
   // ❌ Wrong
   { "type": "paragraph" }
   
   // ✅ Correct
   { "type": "paragraph", "children": [] }
   ```

2. Invalid content type
   ```json
   // ❌ Wrong
   { "type": "unknown-type", "children": [] }
   
   // ✅ Correct
   { "type": "paragraph", "children": [] }
   ```

3. Wrong data type
   ```json
   // ❌ Wrong
   { "type": "image", "height": "400" }
   
   // ✅ Correct
   { "type": "image", "height": 400 }
   ```

## Best Practices

1. Always include the `$schema` property for better IDE support
2. Validate your content before saving/rendering
3. Use TypeScript with the schema for better development experience
4. Keep content structure flat when possible
5. Use meaningful alt text for images
6. Maintain consistent class naming conventions