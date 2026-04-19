# Project Brief: Headless E-Commerce Store
**Version:** 1.0.0 | **Status:** Active | **Last Updated:** 2026-04-17

> **SOURCE OF TRUTH** — This document governs all architectural decisions, coding standards, and implementation priorities for the AI Coding Agent. Do not deviate from this spec without explicit approval.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Modular Folder Structure](#4-modular-folder-structure)
5. [Implementation Roadmap](#5-implementation-roadmap)
6. [Shopify Storefront API Integration](#6-shopify-storefront-api-integration)
7. [Component Architecture](#7-component-architecture)
8. [Internationalization (i18n)](#8-internationalization-i18n)
9. [Coding Standards](#9-coding-standards)
10. [SEO Strategy](#10-seo-strategy)
11. [Error Handling](#11-error-handling)
12. [Environment Variables](#12-environment-variables)

---

## 1. Project Overview

### 1.1 Summary

A high-end, headless e-commerce storefront for a fashion/lifestyle brand, powered by **Shopify** as the commerce backend and **Next.js 15** as the frontend framework. The store delivers a luxury retail experience defined by restraint, precision, and bold typography — inspired by Nike's product page layout logic while establishing an original design identity.

### 1.2 Goals

- Deliver a performance-first shopping experience (Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms).
- Provide a seamless product discovery → cart → checkout flow with zero friction.
- Support multiple currencies (VND, USD) and locales (Vietnamese, English).
- Be fully operable by an AI Coding Agent from Day 1, using this brief as the sole reference.

### 1.3 Stakeholders

| Role | Responsibility |
|---|---|
| Product Owner (Sister) | Final approval on design & product decisions |
| Lead Developer | Architecture, API integration |
| AI Coding Agent | Feature implementation, following this brief |

---

## 2. Tech Stack

### 2.1 Core Dependencies

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 15.x (App Router) | SSR, SSG, routing, server actions |
| Language | TypeScript | 5.x | Type safety across all layers |
| Styling | Tailwind CSS | 3.x | Utility-first styling system |
| UI Components | shadcn/ui | Latest | Accessible, unstyled base components |
| Icons | Lucide React | Latest | Consistent iconography |
| Commerce | Shopify Storefront API | 2024-10 | Products, cart, checkout |
| GraphQL Client | graphql-request | 6.x | Lightweight GraphQL fetching |
| State Management | Zustand | 4.x | Client-side cart state |
| Animations | Framer Motion | 11.x | Page transitions, slide-over cart |
| Forms | React Hook Form + Zod | Latest | Type-safe form validation |

### 2.2 Dev Dependencies

```json
{
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.x",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.5"
  }
}
```

---

## 3. Design System

### 3.1 Visual Philosophy

Derived from analysis of the Nike reference screenshots, the design language is:

- **High contrast:** Pure black on white, white on black. Zero mid-tones in the primary palette.
- **Radical whitespace:** Generous padding forces the eye to rest on the product.
- **Typography-led hierarchy:** Text size and weight alone communicate importance — no color or decorative elements used for hierarchy.
- **Photography-first grid:** Products are displayed in clean, editorial-style grids. Images are the hero; UI chrome is invisible.
- **Functional minimalism:** Every UI element earns its place. No decorative borders, no gradients, no shadows on primary UI.

### 3.2 Color Palette

```css
/* /app/globals.css */
:root {
  /* Neutrals */
  --color-black:       #111111;
  --color-white:       #FFFFFF;
  --color-gray-50:     #F9F9F9;
  --color-gray-100:    #F1F1F1;
  --color-gray-300:    #CCCCCC;
  --color-gray-500:    #757575;
  --color-gray-700:    #404040;

  /* Accents (used sparingly — e.g., "Recycled Materials" label) */
  --color-accent-red:  #D43F00;
  --color-accent-blue: #0050A0;

  /* Semantic */
  --color-bg:          var(--color-white);
  --color-fg:          var(--color-black);
  --color-muted:       var(--color-gray-500);
  --color-border:      var(--color-gray-300);
  --color-disabled:    var(--color-gray-300);
}
```

### 3.3 Typography

```css
/* Font Strategy: Two faces, maximum contrast */
/* Display: Bebas Neue (bold, condensed, athletic) */
/* Body: DM Sans (clean, geometric, readable) */

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  /* Scale */
  --text-xs:   0.75rem;   /* 12px — labels, badges */
  --text-sm:   0.875rem;  /* 14px — meta, captions */
  --text-base: 1rem;      /* 16px — body */
  --text-lg:   1.125rem;  /* 18px — subheadings */
  --text-xl:   1.25rem;   /* 20px — card titles */
  --text-2xl:  1.5rem;    /* 24px — section headings */
  --text-4xl:  2.25rem;   /* 36px — page headings */
  --text-6xl:  3.75rem;   /* 60px — hero text (desktop) */
}
```

### 3.4 Spacing & Layout

Following the Nike reference, spacing uses an **8px base grid**:

```
4px  → micro gaps (icon to label)
8px  → tight groupings
16px → component internal padding
24px → component external spacing
32px → section gaps (mobile)
48px → section gaps (desktop)
64px → major section separators
96px → hero/feature sections
```

**Grid System:**
- Mobile: 4-column, 16px gutters, 16px margins
- Tablet: 8-column, 24px gutters, 32px margins
- Desktop: 12-column, 24px gutters, 40px margins
- Max content width: `1440px`

### 3.5 Key UI Components (from Nike Reference Analysis)

| Component | Behavior | Notes |
|---|---|---|
| **Global Nav** | Sticky, collapses on scroll down, reappears on scroll up | Hamburger on mobile; horizontal links on desktop |
| **Product Card** | Image → Label Badge → Product Name (bold) → Subtitle → Price | Label badge (e.g., "Recycled Materials") in accent-red |
| **Category Filter Sidebar** | Left-rail on desktop, sheet on mobile | Scrollable list; active item bold |
| **Size Selector** | Bordered pill buttons; greyed-out = out of stock | XL/2XL shown greyed with strikethrough per Nike pattern |
| **Color Swatch** | Circular image thumbnails with selected border ring | 2px ring in `--color-black` when active |
| **Add to Bag Button** | Full-width, black fill, white text, pill shape | Disabled state when no size selected |
| **Slide-over Cart** | Right-panel overlay; backdrop blur | Framer Motion `x` animation |
| **Breadcrumb** | Small, muted text above product title | Hidden on mobile |
| **Image Gallery** | Vertical thumbnail strip on left; main image right | Swipeable carousel on mobile |

### 3.6 Tailwind Config Extension

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#111111',
          white:  '#FFFFFF',
          muted:  '#757575',
          border: '#CCCCCC',
          accent: '#D43F00',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 4. Modular Folder Structure

```
/
├── app/                              # Next.js App Router
│   ├── [locale]/                     # i18n root (en | vi)
│   │   ├── layout.tsx                # Root layout (fonts, providers, nav, footer)
│   │   ├── page.tsx                  # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx              # Product Listing Page (PLP)
│   │   │   └── [handle]/
│   │   │       └── page.tsx          # Product Detail Page (PDP) ← PRIORITY 1
│   │   ├── collections/
│   │   │   └── [handle]/
│   │   │       └── page.tsx          # Collection page
│   │   ├── search/
│   │   │   └── page.tsx              # Search results
│   │   └── not-found.tsx             # 404 page
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts              # Shopify webhook revalidation
│   └── globals.css                   # Global styles, CSS variables
│
├── components/
│   ├── ui/                           # shadcn/ui generated components
│   │   ├── button.tsx
│   │   ├── sheet.tsx                 # Slide-over cart drawer
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx                # Global navigation (Server Component)
│   │   ├── NavClient.tsx             # Mobile menu, cart icon w/ count (Client)
│   │   ├── Footer.tsx
│   │   └── AnnouncementBar.tsx       # "Free Delivery" top bar
│   ├── product/
│   │   ├── ProductCard.tsx           # PLP card (Server Component)
│   │   ├── ProductGallery.tsx        # PDP image gallery (Client Component)
│   │   ├── ProductInfo.tsx           # PDP right panel (Server Component)
│   │   ├── VariantSelector.tsx       # Size + Color pickers (Client Component)
│   │   ├── AddToCartButton.tsx       # CTA button (Client Component)
│   │   ├── ProductGrid.tsx           # Responsive grid wrapper
│   │   └── ProductBadge.tsx          # "Recycled Materials" label
│   ├── cart/
│   │   ├── CartDrawer.tsx            # Slide-over cart (Client Component)
│   │   ├── CartItem.tsx              # Individual cart line
│   │   ├── CartSummary.tsx           # Subtotal + checkout button
│   │   └── CartProvider.tsx          # Zustand store + context bridge
│   ├── home/
│   │   ├── HeroBanner.tsx            # Full-bleed hero
│   │   ├── FeaturedCollection.tsx    # Curated grid
│   │   └── BrandStory.tsx            # Editorial storytelling section
│   └── common/
│       ├── CurrencySwitcher.tsx      # VND / USD toggle (Client Component)
│       ├── LanguageSwitcher.tsx      # EN / VI toggle
│       ├── Breadcrumb.tsx
│       ├── LoadingSkeleton.tsx       # Shimmer skeletons
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── shopify/
│   │   ├── client.ts                 # graphql-request client setup
│   │   ├── queries/
│   │   │   ├── product.ts            # getProduct, getProducts GraphQL queries
│   │   │   ├── collection.ts         # getCollection, getCollections
│   │   │   ├── cart.ts               # createCart, addToCart, updateCart, removeFromCart
│   │   │   └── search.ts             # predictiveSearch
│   │   ├── mutations/
│   │   │   └── cart.ts               # Cart mutation strings
│   │   └── types.ts                  # Shopify API TypeScript types
│   ├── i18n/
│   │   ├── config.ts                 # Locale config
│   │   └── request.ts                # next-intl request config
│   ├── currency.ts                   # Currency formatting utilities
│   └── utils.ts                      # cn(), formatPrice(), etc.
│
├── hooks/
│   ├── useCart.ts                    # Cart operations hook
│   ├── useProductVariant.ts          # Variant selection logic
│   └── useMediaQuery.ts              # Responsive breakpoint hook
│
├── store/
│   └── cart.ts                       # Zustand cart store
│
├── messages/
│   ├── en.json                       # English translations
│   └── vi.json                       # Vietnamese translations
│
├── types/
│   └── index.ts                      # Shared global types
│
├── middleware.ts                     # next-intl i18n routing middleware
├── next.config.ts                    # Next.js config (images, i18n, headers)
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. Implementation Roadmap

### Phase 1 — Product Detail Page (PDP) ✅ PRIORITY 1

**Goal:** A fully functional, visually stunning product page that mirrors the Nike reference layout.

**Acceptance Criteria:**
- [ ] Left thumbnail strip + main image viewer (desktop); swipeable carousel (mobile)
- [ ] Color variant selector using product image thumbnails
- [ ] Size selector with out-of-stock indication (greyed pills)
- [ ] Dynamic price display from Shopify (respects selected variant)
- [ ] "Add to Bag" button disabled until size is selected
- [ ] Product badge (e.g., "Recycled Materials") from Shopify metafield
- [ ] Product details accordion (description, size & fit, delivery & returns)
- [ ] Breadcrumb navigation
- [ ] Structured data (JSON-LD) for SEO

**Key Files:**
- `app/[locale]/products/[handle]/page.tsx`
- `components/product/ProductGallery.tsx` (Client)
- `components/product/VariantSelector.tsx` (Client)
- `components/product/AddToCartButton.tsx` (Client)

---

### Phase 2 — Cart System ✅ PRIORITY 2

**Goal:** A slide-over cart drawer that persists across navigation via Shopify Cart API.

**Acceptance Criteria:**
- [ ] Cart state managed in Zustand, cartId stored in localStorage
- [ ] Slide-over opens from the right on "Add to Bag"
- [ ] Each cart item shows: image, name, variant, quantity stepper, remove button
- [ ] Subtotal displayed in the user's selected currency
- [ ] Cart icon in navbar shows item count badge
- [ ] Guest session handling — cart is associated with a Shopify cartId only

**Key Files:**
- `store/cart.ts`
- `components/cart/CartDrawer.tsx` (Client)
- `hooks/useCart.ts`

---

### Phase 3 — Checkout ✅ PRIORITY 3

**Goal:** Redirect user to Shopify's hosted, secure checkout.

**Acceptance Criteria:**
- [ ] "Checkout" button in cart calls Shopify's `checkoutUrl` from the Cart object
- [ ] URL includes locale parameter for correct language/currency on Shopify checkout
- [ ] Loading state on the checkout button during redirect

**Implementation Note:** Do NOT build a custom checkout page. Use `cart.checkoutUrl` from the Shopify Cart API and redirect with `window.location.href`.

---

### Phase 4 — Homepage ✅ PRIORITY 4

**Goal:** A brand-forward homepage with editorial storytelling and product discovery.

**Sections (in order):**
1. `HeroBanner` — Full-bleed image/video, headline, CTA button
2. `FeaturedCollection` — 3-up product grid from a curated Shopify collection
3. `BrandStory` — Split layout (large image left, text right)
4. `FeaturedCollection` (second) — New arrivals grid
5. `AnnouncementBar` — Already in layout, persistent

---

## 6. Shopify Storefront API Integration

### 6.1 Client Setup

```typescript
// lib/shopify/client.ts
import { GraphQLClient } from 'graphql-request'

const domain    = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const token     = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
const apiVersion = '2024-10'

export const shopifyClient = new GraphQLClient(
  `https://${domain}/api/${apiVersion}/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': token,
      'Content-Type': 'application/json',
    },
  }
)
```

### 6.2 GraphQL Queries

#### Get Single Product (PDP)

```graphql
# lib/shopify/queries/product.ts
export const GET_PRODUCT_BY_HANDLE = `
  query GetProduct($handle: String!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      metafields(identifiers: [
        { namespace: "custom", key: "badge_label" },
        { namespace: "custom", key: "size_guide_url" }
      ]) {
        namespace
        key
        value
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
      seo { title description }
    }
  }
`
```

#### Get Product List (PLP)

```graphql
export const GET_PRODUCTS = `
  query GetProducts(
    $first: Int!,
    $after: String,
    $query: String,
    $sortKey: ProductSortKeys,
    $reverse: Boolean,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      after: $after,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 2) {
          nodes { url altText width height }
        }
        variants(first: 1) {
          nodes { availableForSale }
        }
        metafields(identifiers: [{ namespace: "custom", key: "badge_label" }]) {
          value
        }
      }
    }
  }
`
```

#### Get Collection

```graphql
export const GET_COLLECTION = `
  query GetCollection(
    $handle: String!,
    $first: Int!,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      image { url altText }
      products(first: $first) {
        nodes {
          id title handle vendor
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { nodes { url altText width height } }
        }
      }
    }
  }
`
```

### 6.3 Cart Mutations

```graphql
# lib/shopify/mutations/cart.ts

export const CREATE_CART = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const UPDATE_CART_LINE = `
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 50) { nodes { ...CartLineFragment } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
  ${CART_LINE_FRAGMENT}
`

const CART_LINE_FRAGMENT = `
  fragment CartLineFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
        product { title handle images(first: 1) { nodes { url altText } } }
      }
    }
  }
`
```

### 6.4 Shopify Type Definitions

```typescript
// lib/shopify/types.ts

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  metafields: ShopifyMetafield[]
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money }
  images: { nodes: ShopifyImage[] }
  options: ShopifyProductOption[]
  variants: { nodes: ShopifyProductVariant[] }
  seo: { title: string; description: string }
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions: { name: string; value: string }[]
  price: Money
  compareAtPrice: Money | null
  image: ShopifyImage | null
}

export interface ShopifyProductOption {
  id: string
  name: string
  values: string[]
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  lines: { nodes: ShopifyCartLine[] }
  cost: { subtotalAmount: Money }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: ShopifyProductVariant & { product: Pick<ShopifyProduct, 'title' | 'handle' | 'images'> }
}

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMetafield {
  namespace: string
  key: string
  value: string
}
```

---

## 7. Component Architecture

### 7.1 Server vs. Client Component Rules

| Component Type | Rendered As | Rule |
|---|---|---|
| Page layouts, nav, footer | **Server** | Default — no interactivity needed |
| Product card, product info panel | **Server** | Static data from Shopify |
| Product gallery (image switcher) | **Client** | Needs `useState` for active image |
| Variant selector (size/color) | **Client** | Needs `useState` for selected variant |
| Add to Cart button | **Client** | Calls cart mutation, shows loading state |
| Cart drawer | **Client** | Animation, Zustand store access |
| Currency/language switcher | **Client** | User preference, triggers re-render |
| Navbar cart icon (count) | **Client** | Reads from Zustand cart store |

**Rule:** Start every component as a Server Component. Only add `'use client'` when you need:
- `useState`, `useEffect`, `useRef`
- Event listeners (onClick, onChange)
- Browser APIs
- Third-party client libraries

### 7.2 Cart Store (Zustand)

```typescript
// store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ShopifyCart } from '@/lib/shopify/types'

interface CartStore {
  cartId: string | null
  cart: ShopifyCart | null
  isOpen: boolean
  setCart: (cart: ShopifyCart) => void
  setCartId: (id: string) => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartId: null,
      cart: null,
      isOpen: false,
      setCart: (cart) => set({ cart }),
      setCartId: (cartId) => set({ cartId }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId
    }
  )
)
```

---

## 8. Internationalization (i18n)

### 8.1 Strategy

Using **`next-intl`** for routing-based locale management. Locale is embedded in the URL path: `/en/products/...` and `/vi/products/...`.

### 8.2 Supported Locales & Currencies

| Locale | Language | Default Currency | Shopify Country Code |
|---|---|---|---|
| `en` | English | USD | `US` |
| `vi` | Vietnamese | VND | `VN` |

### 8.3 Configuration

```typescript
// lib/i18n/config.ts
export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'vi'

export const currencyMap: Record<Locale, string> = {
  en: 'USD',
  vi: 'VND',
}

export const countryMap: Record<Locale, string> = {
  en: 'US',
  vi: 'VN',
}
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/lib/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

### 8.4 Translation Files (Sample)

```json
// messages/en.json
{
  "nav": {
    "new": "New & Featured",
    "men": "Men",
    "women": "Women",
    "kids": "Kids",
    "sale": "Sale",
    "search": "Search",
    "cart": "Cart"
  },
  "product": {
    "addToBag": "Add to Bag",
    "selectSize": "Select Size",
    "sizeGuide": "Size Guide",
    "outOfStock": "Out of Stock",
    "favourite": "Favourite",
    "sizeAndFit": "Size & Fit",
    "deliveryAndReturns": "Free Delivery and Returns",
    "reviews": "Reviews"
  },
  "cart": {
    "title": "Your Bag",
    "empty": "Your bag is empty.",
    "checkout": "Checkout",
    "subtotal": "Subtotal",
    "continueShopping": "Continue Shopping"
  }
}
```

```json
// messages/vi.json
{
  "nav": {
    "new": "Mới & Nổi Bật",
    "men": "Nam",
    "women": "Nữ",
    "kids": "Trẻ Em",
    "sale": "Khuyến Mãi",
    "search": "Tìm kiếm",
    "cart": "Giỏ hàng"
  },
  "product": {
    "addToBag": "Thêm vào Túi",
    "selectSize": "Chọn Kích Cỡ",
    "sizeGuide": "Hướng Dẫn Chọn Cỡ",
    "outOfStock": "Hết Hàng",
    "favourite": "Yêu thích",
    "sizeAndFit": "Kích Cỡ & Phù Hợp",
    "deliveryAndReturns": "Giao Hàng & Đổi Trả Miễn Phí",
    "reviews": "Đánh Giá"
  },
  "cart": {
    "title": "Túi Của Bạn",
    "empty": "Túi của bạn đang trống.",
    "checkout": "Thanh Toán",
    "subtotal": "Tạm Tính",
    "continueShopping": "Tiếp Tục Mua Sắm"
  }
}
```

### 8.5 Currency Formatting

```typescript
// lib/currency.ts
export function formatPrice(amount: string, currencyCode: string, locale: string): string {
  const numericAmount = parseFloat(amount)
  const displayLocale = locale === 'vi' ? 'vi-VN' : 'en-US'

  return new Intl.NumberFormat(displayLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
  }).format(numericAmount)
}
```

---

## 9. Coding Standards

### 9.1 File & Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase with `use` prefix | `useCart.ts` |
| Utility functions | camelCase | `formatPrice.ts` |
| GraphQL queries | SCREAMING_SNAKE_CASE | `GET_PRODUCT_BY_HANDLE` |
| CSS variables | kebab-case | `--color-brand-black` |
| Zustand stores | camelCase with `use` prefix | `useCartStore` |

### 9.2 TypeScript Rules

- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- No `any` types — use `unknown` and type-narrow where necessary
- All Shopify API responses must be typed via `lib/shopify/types.ts`
- Use `satisfies` operator for object literals where inference is needed

### 9.3 Data Fetching Patterns

```typescript
// ✅ CORRECT: Data fetching in Server Components
// app/[locale]/products/[handle]/page.tsx
export default async function ProductPage({ params }: { params: { handle: string; locale: string } }) {
  const { locale } = params
  const country = countryMap[locale as Locale]
  const language = locale.toUpperCase()

  const product = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, {
    handle: params.handle,
    country,
    language,
  })

  if (!product) notFound()
  return <ProductView product={product} locale={locale} />
}

// ✅ CORRECT: Cache strategy
export const revalidate = 3600 // Revalidate every 1 hour
```

### 9.4 Image Handling

All images must use Next.js `<Image>` with explicit dimensions:

```typescript
import Image from 'next/image'

<Image
  src={product.images.nodes[0].url}
  alt={product.images.nodes[0].altText ?? product.title}
  width={product.images.nodes[0].width}
  height={product.images.nodes[0].height}
  priority={isAboveFold}  // true for hero/first product image only
  className="object-cover w-full h-full"
/>
```

Add Shopify CDN to `next.config.ts`:

```typescript
// next.config.ts
const config = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.myshopify.com' },
    ],
  },
}
```

---

## 10. SEO Strategy

### 10.1 Metadata (generateMetadata)

```typescript
// app/[locale]/products/[handle]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.handle)

  return {
    title: product.seo.title || `${product.title} | Brand Name`,
    description: product.seo.description || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.images.nodes[0]?.url, width: 1200, height: 630 }],
      type: 'website',
    },
    alternates: {
      canonical: `/en/products/${params.handle}`,
      languages: {
        'vi': `/vi/products/${params.handle}`,
        'en': `/en/products/${params.handle}`,
      },
    },
  }
}
```

### 10.2 Structured Data (JSON-LD)

```typescript
// components/product/ProductStructuredData.tsx (Server Component)
export function ProductStructuredData({ product, locale }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.nodes.map(img => img.url),
    brand: { '@type': 'Brand', name: product.vendor },
    offers: product.variants.nodes.map(variant => ({
      '@type': 'Offer',
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

---

## 11. Error Handling

### 11.1 Hierarchy

```
Network Error → Retry (3x exponential backoff)
  ↓
Shopify API Error → Log + show user-friendly message
  ↓
notFound() → Custom 404 page
  ↓
Unexpected Error → Error Boundary → Custom error.tsx
```

### 11.2 Page-Level Error Files

```
app/[locale]/
├── error.tsx          # Client error boundary (unexpected runtime errors)
├── not-found.tsx      # 404 handler
└── loading.tsx        # Streaming suspense fallback
```

### 11.3 Shopify API Error Wrapper

```typescript
// lib/shopify/client.ts
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  try {
    const data = await shopifyClient.request<T>(query, variables)
    return data
  } catch (error) {
    if (error instanceof ClientError) {
      console.error('[Shopify API Error]', {
        query: query.slice(0, 100),
        errors: error.response?.errors,
        status: error.response?.status,
      })
      throw new Error('Failed to fetch from Shopify. Please try again.')
    }
    throw error
  }
}
```

---

## 12. Environment Variables

```bash
# .env.local (never commit to version control)

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxx

# Revalidation
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_SITE_URL=https://yourstore.com
NEXT_PUBLIC_DEFAULT_LOCALE=vi
```

**Security Rules:**
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — Storefront API tokens are public-safe but should still use server-side fetch in Server Components wherever possible.
- Never expose Admin API tokens client-side under any circumstances.
- Add `.env.local` to `.gitignore` immediately.

---

## Appendix A: Key Reference URLs

| Resource | URL |
|---|---|
| Shopify Storefront API Docs | https://shopify.dev/docs/api/storefront |
| Shopify GraphQL Explorer | https://shopify.dev/docs/api/storefront/graphiql |
| next-intl Docs | https://next-intl-docs.vercel.app |
| shadcn/ui Docs | https://ui.shadcn.com |
| Framer Motion Docs | https://www.framer.com/motion |

---

## Appendix B: AI Agent Instructions

> **To the AI Coding Agent:** Read this file in its entirety before writing any code. When implementing a feature:
> 1. Check the **Implementation Roadmap** (Section 5) for priority and acceptance criteria.
> 2. Check **Component Architecture** (Section 7) to determine Server vs. Client component.
> 3. Use only the GraphQL queries defined in **Section 6** — do not invent new ones.
> 4. Follow the exact **Folder Structure** (Section 4) — do not create new top-level directories.
> 5. All new text strings must be added to both `messages/en.json` and `messages/vi.json`.
> 6. When in doubt: fewer Client Components, more Server Components.

---

*End of Project Brief v1.0.0*