<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Layout Spacing and Alignment Guidelines

To maintain visual consistency and avoid layout bugs (such as squeezed mobile grids, inconsistent spacing, or cropped media elements):

1. **Responsive Grid Spanning (Mobile-First)**
   - Always define grid layouts mobile-first. If a grid is declared, ensure column spans are defined for all breakpoints (e.g., `col-span-1 md:col-span-3`) to prevent elements from defaulting to a single-column layout on mobile.

2. **Consistent Layout Padding**
   - When organizing multiple columns/blocks side-by-side or stacked, apply matching padding (e.g., `p-6 md:p-8`) across sibling blocks to keep the text and image boundaries aligned consistently with outer card borders.

3. **Absolute Elements & Padding Bounds (Next.js `<Image fill />`)**
   - Next.js's `<Image fill />` uses absolute positioning and ignores the parent's padding, which can lead to layout clipping or uneven gaps.
   - To make the image respect padding bounds while keeping its size dynamically maximized:
     - Add padding (e.g., `p-6 md:p-8`) to the grid/column cell wrapper.
     - Insert a relative inner wrapper (`w-full h-48 md:h-full min-h-[150px]`) inside the padded cell to house the `<Image fill className="object-contain" />`.

4. **Sibling Spacing Utilities (`space-y-*`)**
   - Never apply flex sibling spacing (e.g. `space-y-*`) directly to elements with single children (e.g., `<h3>{title}</h3>`). Use margin utilities (`mb-*`) on the element itself, or place the `space-y-*` utility on the parent container.
