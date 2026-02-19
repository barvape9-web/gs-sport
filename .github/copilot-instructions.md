# GS • Sport — Copilot Instructions

## Project Overview
Full-stack eCommerce app for **GS • Sport** — premium sportswear brand.
- **Location**: `c:\Users\user\Desktop\New folder\gs-sport`
- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma + PostgreSQL

## Brand Guidelines
- Brand name: **GS • Sport** (always with the bullet • character)
- Primary color: `#f97316` (orange)
- Men's collection theme: Blue (`#0ea5e9`)
- Women's collection theme: Pink (`#ec4899`)
- Dark background: `#0a0a0a`
- Font: Inter (variable)

## Code Style Rules

### Tailwind CSS
- Uses **Tailwind v4** — import is `@import "tailwindcss"` in globals.css
- Do NOT use `@tailwind base/components/utilities` directives
- Custom utility classes in globals.css: `.glass`, `.glass-card`, `.glass-dark`, `.gradient-text`, `.btn-primary`, `.input-glass`, `.glow-orange`

### Components
- All client components must have `'use client'` at the top
- Use `framer-motion` for all animations (motion.div, AnimatePresence, etc.)
- Use `lucide-react` for icons
- Use `toast` from `react-hot-toast` for notifications

### Authentication
- JWT token stored in HTTP-only cookie named `gs-sport-token`
- Server-side auth: `getAuthUser()` from `@/lib/auth` (uses `cookies()`)
- API route auth: `getAuthUserFromRequest(request)` from `@/lib/auth`
- Auth store: `useAuthStore()` from `@/store/authStore`

### Database
- Prisma client singleton: `import { prisma } from '@/lib/db'`
- Always use `prisma.model.upsert`, `create`, `update`, `delete`, `findMany`, `findUnique`
- Schema file: `prisma/schema.prisma`

### State Management
- Cart: `useCartStore()` from `@/store/cartStore`
- Auth: `useAuthStore()` from `@/store/authStore`
- Theme: `useThemeStore()` from `@/store/themeStore`

### API Routes
- All API routes are in `src/app/api/`
- Validate input with `zod` schemas
- Return `NextResponse.json()` with appropriate HTTP status codes
- Admin routes check `authUser.role !== 'ADMIN'` and return 403

### TypeScript Types
- All interfaces are in `src/types/index.ts`
- Prisma enums: `Role ('USER' | 'ADMIN')`, `Gender ('MEN' | 'WOMEN' | 'UNISEX')`, `Category ('UPPER_WEAR' | 'LOWER_WEAR' | 'WINTER_WEAR' | 'SUMMER_WEAR' | 'ACCESSORIES')`, `OrderStatus ('PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED')`

## File Structure
```
src/
  app/
    api/auth/{login,register,logout}/route.ts
    api/products/route.ts + [id]/route.ts
    api/orders/route.ts + user/route.ts + [id]/route.ts
    api/admin/{analytics,users}/route.ts + users/[id]/route.ts
    admin/{page,layout,orders,theme,users}/
    products/{page,[id]}/
    {checkout,dashboard,login,register,contact}/
  components/{layout,cart,home,products,three}/
  lib/{auth,db,utils}.ts
  store/{authStore,cartStore,themeStore}.ts
  types/index.ts
  middleware.ts
```

## Demo Credentials
- Admin: `admin@gs-sport.com` / `admin123`
- User: `user@gs-sport.com` / `user123`
