# Images Directory

This directory contains images for the website's service descriptions and blog posts.

## Directory Structure

```
images/
├── services/     # Images for service descriptions
└── blog/         # Images for blog posts
```

## Adding Images to Markdown

### Basic Image Syntax

```markdown
![Image Description](images/services/your-image.jpg)
```

### Image with Caption

```markdown
![3D Printed Part](images/services/fdm-example.jpg)
*FDM printed functional prototype*
```

### Multiple Images

```markdown
![Image 1](images/services/image1.jpg)
*Caption for image 1*

![Image 2](images/services/image2.jpg)
*Caption for image 2*
```

## Recommended Image Specifications

- **Format:** JPG, PNG, SVG, or WebP
- **Width:** 800-1200px (will be responsive)
- **File size:** Under 500KB for fast loading
- **Aspect ratio:** 16:9 or 4:3 recommended

## Image Optimization Tips

1. Compress images before uploading (use TinyPNG, ImageOptim, etc.)
2. Use descriptive filenames: `fdm-printing-example.jpg` instead of `IMG_1234.jpg`
3. Consider using WebP format for better compression
4. Keep image dimensions reasonable (max 1920px width)

## Example Service Page with Images

```markdown
# 3D Printing

![3D Printer in Action](images/services/printer-working.jpg)
*Our industrial FDM printer creating a prototype*

## Technologies We Use

### FDM Printing

![FDM Example](images/services/fdm-parts.jpg)

We use professional FDM printers for:
- Functional prototypes
- Large parts
- Engineering plastics
```

## Current Placeholder Images

The following SVG placeholders are provided as examples:
- `3d-printing-example.svg` - Generic 3D printing placeholder
- `fdm-technology.svg` - FDM technology placeholder

**Replace these with your actual photos!**

## Uploading to S3

When deploying to S3, make sure to:
1. Upload the entire `images/` folder
2. Set correct MIME types for images
3. Enable public read access for image files
4. Consider using CloudFront CDN for faster delivery

## Image Attribution

If using stock photos or images from others, add attribution in the caption:
```markdown
![3D Model](images/services/example.jpg)
*Photo by [Photographer Name](link) on [Source]*
```
