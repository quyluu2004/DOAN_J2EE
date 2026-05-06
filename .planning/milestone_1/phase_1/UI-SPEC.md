# UI Specification: Luxury 3D Studio Banner

## 1. Visual Identity
- **Concept:** "The Artisan's Atelier" - A blend of modern technology and classic Italian craftsmanship.
- **Primary Palette:**
    - Background: `#111827` (Deep Midnight Blue)
    - Wood: `#a18262` (Warm Oak Texture)
    - Furniture: `#334155` (Slate Grey Fabric)
    - Accents: `#d4af37` (Gold/Brass)
- **Typography:** `Plus Jakarta Sans` for body, `Inter` for headers.

## 2. 3D Scene Components (MiniRoom3D v2)

### A. Environment
- **Isometric Perspective:** Fixed at 45 degrees for that "diorama" look.
- **Walls:** L-shape. Back wall with a large horizontal window. Texture: Procedural wood grain.
- **Floor:** Light marble tiles with subtle gloss and reflections.
- **Lighting:**
    - Warm point light inside the room.
    - Soft blue/white light from the window.
    - `ContactShadows` for grounded furniture.

### B. Furniture
- **L-Sofa:** Modern, multi-cushioned, rounded edges.
- **Dining Area:** White marble top table, 4 minimalist chairs.
- **Rug:** Beige textured area rug under the sofa.

### C. The Pointer (Realistic Hand)
- **Source:** Realistic 3D Hand model (GLB from CDN).
- **Animation:** Floating + Pointing gesture. Metallic gold material to match the brand.

## 3. Interaction & Animations
- **Auto-Rotation:** Slow continuous rotation (0.5 rpm) when idle.
- **Hover Effect:** Room tilts slightly towards mouse position.
- **Text Animation:** `SplitText` with staggered spring entrance for the title.
