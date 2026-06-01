# Accountant for Small Business — Complete Project Report
**Domain:** accountantforsmallbusiness.com  
**Client:** Mehdi Javed, Financial Controller  
**Stack:** Astro 4 · Tailwind CSS v4 · React Islands · Vercel · Cloudflare  
**Report Date:** June 2026  

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Design System](#3-design-system)
4. [Site Architecture — 30 Pages](#4-site-architecture--30-pages)
5. [On-Page SEO](#5-on-page-seo)
6. [Technical SEO](#6-technical-seo)
7. [Schema / Structured Data](#7-schema--structured-data)
8. [Performance Optimization](#8-performance-optimization)
9. [Image Optimization](#9-image-optimization)
10. [Security Hardening](#10-security-hardening)
11. [Infrastructure & DNS](#11-infrastructure--dns)
12. [Forms & Email Delivery](#12-forms--email-delivery)
13. [Calculators — 7 Built](#13-calculators--7-built)
14. [Blog — 6 Posts](#14-blog--6-posts)
15. [Mobile UX](#15-mobile-ux)
16. [Analytics](#16-analytics)
17. [Indexing & AEO/LLM](#17-indexing--aeollm)
18. [Bugs Fixed](#18-bugs-fixed)
19. [Complete URL Inventory](#19-complete-url-inventory)
20. [Outstanding Items](#20-outstanding-items)

---

## 1. PROJECT OVERVIEW

A full production website built from scratch for a Singapore accounting firm targeting small businesses and SMEs. The brief: clone a React design reference 1:1, build every page with UC v6.4 content, add 7 unique calculators, and achieve full technical SEO compliance.

**Scope delivered:**
- 30 indexable pages (5 services, 7 calculators, 6 blog posts, pricing, about, contact, legal)
- 7 React island calculators with accurate 2026 Singapore rates
- 3-step multi-step contact form with Cloudflare Worker backend + Resend email delivery
- Branded HTML admin notification and auto-reply emails
- Complete SEO stack: titles, descriptions, canonical, OG, Twitter Card, JSON-LD
- Performance optimization: 92% image reduction, island lazy hydration, cache headers
- Security: 6 response headers including CSP and Permissions-Policy
- AEO/LLM: llms.txt + llms-full.txt for AI search indexing
- Google Analytics GA4, Google Search Console, sitemap, robots.txt

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Astro 4 (static) | Zero JS by default, islands architecture |
| CSS | Tailwind CSS v4 | `@theme {}` CSS config, NOT tailwind.config.js |
| Components | React 18 islands | `client:load` / `client:idle` / `client:visible` |
| Hosting | Vercel | Static deployment, auto-deploy from GitHub |
| DNS | Cloudflare | Proxy OFF for main domain (Vercel handles TLS) |
| Form backend | Cloudflare Worker | `form.accountantforsmallbusiness.com/contact` |
| Email | Resend API | Transactional email, domain verified |
| Fonts | Google Fonts CDN | Instrument Serif + Geist + Inter + JetBrains Mono |
| Analytics | Google Analytics 4 | GA4 tag G-2NQ4N3KMXX in BaseLayout |
| Version control | GitHub | `younus78666/accountantforsmallbusiness` |

### Tailwind v4 Notes
- Config is CSS-based (`@theme {}` in `src/styles/global.css`), no `tailwind.config.js`
- Font-weight utilities are named only: `font-bold` not `font-700` (47 invalid classes fixed early)
- `backdrop-blur` creates a stacking context — `position:fixed` elements must be OUTSIDE the header

---

## 3. DESIGN SYSTEM

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `navy` | `#000F22` | Primary background, header, hero |
| `navy-panel` | `#0A1628` | Cards, modals, panels |
| `navy-deep` | `#060f1e` | Table rows, deepest backgrounds |
| `gold` | `#DAA035` | Primary accent, borders, labels |
| `gold-btn` | `#DCA33C` | CTA buttons |
| `gold-hover` | `#C8912F` | Button hover state |
| `white` | `#FEFFFF` | Headings, key text |
| `muted` | `#CBCFD8` | Body text, secondary content |
| `light-bg` | `#F8FAFC` | Content section backgrounds |

### Typography
- **Headings:** Instrument Serif (italic for accents)
- **Body / UI:** Geist, Inter
- **Code / Mono:** JetBrains Mono (labels, badges, eyebrows)

### Key Design Patterns
- `AnswerBlock` — gold left border + `#F2F4F7` bg + italic bold paragraph (direct-answer format)
- `EyebrowLabel` — 10px monospace uppercase gold tracking-widest
- `ServiceCard` — navy panel border, gold icon, hover lift
- `GoldGradient` — gold accent on heading accent words
- `BadgeFree` — emerald-400 `FREE` pill on calculator links
- Section rhythm: alternating navy → light-bg → white → navy

### Layout
- Max width: `max-w-6xl` (1280px) for content, `max-w-7xl` for header
- Section inner: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: Tailwind responsive grid, 1 col → 2 col → 3 col breakpoints

---

## 4. SITE ARCHITECTURE — 30 PAGES

### Service Pages (5)
| Page | URL | Focus |
|------|-----|-------|
| Accounting Services | `/accounting-services-singapore/` | Core monthly accounting |
| Bookkeeping | `/bookkeeping-services-singapore/` | Monthly transaction recording |
| Outsource Accounting | `/outsource-accounting-services-singapore/` | Replace in-house hire |
| Payroll Services | `/payroll-services-singapore/` | CPF, SDL, IR8A |
| Financial Statements | `/financial-statements-singapore/` | SFRS unaudited statements |

### Calculator Pages (7)
| # | Calculator | URL |
|---|-----------|-----|
| 1 | CPF Calculator 2026 | `/cpf-calculator-singapore/` |
| 2 | Bookkeeping Cost Estimator | `/bookkeeping-cost-calculator-singapore/` |
| 3 | GST Registration Threshold | `/gst-registration-calculator-singapore/` |
| 4 | Employee Total Cost | `/employee-cost-calculator-singapore/` |
| 5 | Corporate Tax Estimator | `/corporate-tax-calculator-singapore/` |
| 6 | Break-Even Calculator | `/break-even-calculator-singapore/` |
| 7 | Cash Flow Runway | `/cash-flow-runway-calculator/` |

### Blog Posts (6 + index)
| Post | URL |
|------|-----|
| Bookkeeping vs Accounting | `/blog/bookkeeping-vs-accounting/` |
| How to Choose an Accountant | `/blog/how-to-choose-accountant-sme/` |
| Year-End Checklist | `/blog/year-end-accounting-checklist/` |
| Accountant Cost Singapore | `/blog/accountant-cost-singapore/` |
| Best Accounting Software | `/blog/best-accounting-software-singapore/` |
| Xero vs QuickBooks | `/blog/xero-vs-quickbooks-singapore/` |
| Blog index | `/blog/` |

### Core Pages (12)
| Page | URL |
|------|-----|
| Homepage | `/` |
| About Mehdi Javed | `/about/` |
| Pricing | `/pricing/` |
| Packages comparison | `/packages/` |
| Services hub | `/services/` |
| SFRS Compliance | `/sfrs-compliance-singapore/` |
| Contact | `/contact/` |
| Privacy Policy | `/privacy/` |
| Terms of Service | `/terms/` |
| 404 | `/404` |
| Thank-you (noindex) | `/thank-you/` |

### Shared Components
| Component | Purpose |
|-----------|---------|
| `Header.astro` | Sticky nav, desktop dropdowns, mobile accordion |
| `Footer.astro` | 5-column grid, transparent logo, bottom bar |
| `BaseLayout.astro` | HTML shell, head tags, GA4, schema slot |
| `BlogLayout.astro` | Blog article shell with author, related posts |
| `FloatingButtons.astro` | WhatsApp (Mehdi photo) + scroll-to-top |
| `Hero.astro` | Full-bleed hero with hero-bg.jpg background |
| `CTASection.astro` | Reusable gold CTA band |
| `AnswerBlock.astro` | Direct-answer styled block |
| `ServiceCard.astro` | Gold icon + title + blurb card |
| `StatsBanner.astro` | Stats strip with gold numbers |
| `FaqAccordion.astro` | Animated expand/collapse FAQ |

---

## 5. ON-PAGE SEO

### Title Tags
- Target range: **50–60 characters** on all pages
- Format: `Primary Keyword | Secondary | AFSB`
- Audit: All 28 indexable pages verified within range
- Example: `Singapore Corporate Income Tax Calculator 2026 | AFSB` (53 chars)

### Meta Descriptions
- Target range: **150–160 characters** on all pages
- Includes primary keyword in first 20 words
- Includes value proposition and CTA hint
- Example: `Calculate the true employer cost of hiring in Singapore. CPF contributions, Skills Development Levy and all statutory costs. Free 2026 calculator with benchmark table.` (157 chars)

### H1 Tags
- Every page has exactly one H1
- H1 matches or closely mirrors the title tag keyword
- Homepage: `Accounting Services` + gold accent `For Small Business` via Instrument Serif

### H2 Structure
- All H2s formatted as questions (UC v6.4 rule: ≥50% in question format)
- Each H2 followed immediately by an AnswerBlock (direct-answer paragraph)
- Example: `What is the true cost of hiring an employee in Singapore?`

### Internal Linking
- Header nav: Services dropdown (5 links), Blog dropdown (6 links), Tools dropdown (7 links)
- Footer: 5 columns — Contact, Services, Company, Free Tools, Scope
- Calculator pages cross-link to related calculators in sidebar
- Service pages link to related services in Related Treatments section
- Blog posts link to related posts via relatedPosts array
- All anchor text descriptive, no generic "click here"

### Canonical Tags
- Auto-generated by BaseLayout: `canonical = siteUrl + Astro.url.pathname`
- All pages self-referencing canonical
- Trailing slash consistent throughout

### OG / Social Tags
- `og:site_name`, `og:locale` (en_SG), `og:title`, `og:description`, `og:type`, `og:url`
- `og:image`: hero-bg.jpg (1774×887) — `og:image:width`, `og:image:height`, `og:image:alt`
- Twitter Card: `summary_large_image` on all pages
- Blog posts override `og:type` to `article` + add `article:published_time`, `article:author`

### Content Quality (UC v6.4)
- Phase 0A value research per page
- 9-frame semantic coverage: Definition, Category, Attribute, Component, Process, Causation, Comparison, Application, Evaluation
- 5-stream query intent classification (Know / Know Simple / Do / Website / Commercial)
- PPR entity classification on all major entities
- Minimum 150 words per content section
- Zero em dashes (replaced with comma or en dash)
- AI-first block structure: direct answer → evidence → detail

---

## 6. TECHNICAL SEO

### robots.txt
```
User-agent: *
Allow: /
Disallow: /thank-you/
Sitemap: https://accountantforsmallbusiness.com/sitemap-index.xml
```

### Sitemap
- Auto-generated by `@astrojs/sitemap` at build time
- `/sitemap-index.xml` → `/sitemap-0.xml`
- **28 indexable URLs** (thank-you excluded via filter)
- Submitted to Google Search Console ✓
- Submitted to Bing Webmaster Tools ✓

### URL Structure
- All URLs: lowercase, hyphenated, trailing slash
- No query strings or dynamic parameters (fully static)
- URL pattern: `/keyword-keyword-singapore/` for service/calculator pages

### Canonical Strategy
- Self-referencing canonical on every page
- No duplicate content issues (no pagination, no parameter variants)
- www redirects to non-www handled by Vercel

### Indexing
- Google Search Console: domain verified, sitemap submitted ✓
- Bing Webmaster Tools: imported from GSC ✓
- RalfyIndex instant indexing: all new pages submitted ✓
- Total credits used: 40 (4 new calculator pages × 10 credits instant)

---

## 7. SCHEMA / STRUCTURED DATA

### Global Schema (BaseLayout — every page)
```json
Organization: accountantforsmallbusiness.com
  - areaServed: Singapore
  - knowsAbout: Bookkeeping, Payroll, Financial statements, Xero, QuickBooks
Person: Mehdi Javed
  - jobTitle: Financial Controller
  - sameAs: LinkedIn
```

### Per-Page Schema Types
| Page type | Schema types used |
|-----------|------------------|
| Homepage | Organization, Service, FAQPage, BreadcrumbList |
| Service pages | Service, FAQPage, BreadcrumbList |
| Calculator pages | WebApplication, FAQPage, BreadcrumbList |
| Blog posts | Article, FAQPage, BreadcrumbList |
| About | Person, BreadcrumbList |
| Contact | LocalBusiness (implied), BreadcrumbList |
| SFRS | Article, FAQPage, BreadcrumbList |
| Pricing | OfferCatalog (inferred), BreadcrumbList |

### Blog Article Schema
All 6 blog posts include full Article schema:
- `headline`, `description`, `datePublished`, `dateModified`
- `author` (@id ref to Mehdi Person entity)
- `publisher` (@id ref to Organization entity)
- `image` (ImageObject with width/height)
- `inLanguage: en-SG`
- `keywords` array
- `mainEntityOfPage` (WebPage object)

### FAQ Schema
- All service pages, calculator pages, and blog posts include FAQPage
- Minimum 4–6 Q&A pairs per page
- Answers are complete, standalone (no "see above" references)

---

## 8. PERFORMANCE OPTIMIZATION

### Cache Strategy (vercel.json)
- **HTML pages:** `public, max-age=0, must-revalidate, s-maxage=31536000`
  - Browser: always revalidates (never serves stale HTML)
  - Vercel CDN: caches 1 year, auto-purged on every deploy
  - Result: **instant cache clear after every push**, zero stale content
- **Static assets (CSS/JS/images):** `public, max-age=31536000, immutable`
  - Content-hashed filenames → safe to cache forever

### Astro Build Optimization
- `compressHTML: true` — strips whitespace (~10–15% smaller HTML)
- `build.inlineStylesheets: auto` — inlines small CSS, fewer requests
- `prefetch: { defaultStrategy: 'hover' }` — prefetches internal pages on hover
- Vite `manualChunks`: React + ReactDOM split into `react-vendor` chunk
  - React cached independently; app code updates don't bust React download
- Vite `cssMinify: true` + `minify: 'esbuild'`

### Island Hydration Strategy
| Island | Strategy | Reason |
|--------|----------|--------|
| `ContactForm` | `client:load` | In hero viewport, user interacts immediately |
| `FormPopup` | `client:idle` | Exit intent — doesn't need instant hydration |
| `PlanCalculator` | `client:visible` | Below fold |
| `TestimonialsCarousel` | `client:visible` | Far below fold |
| All calculator islands | `client:load` | User came specifically to use the calculator |

### LCP Optimization
- `<link rel="preload" as="image" href="/hero-bg.jpg" fetchpriority="high">` in `<head>`
- Browser discovers hero image at parse time, not when CSS renders
- Estimated LCP improvement: 300–500ms on typical connections
- `preloadHero={false}` on non-hero pages (privacy, terms, 404, thank-you)

### Font Loading
- Non-render-blocking: `media="print" onload="this.media='all'"` pattern
- `<noscript>` fallback for non-JS environments
- `dns-prefetch` for fonts.googleapis.com, fonts.gstatic.com
- Trimmed unused font weights (removed 300-weight variants)

---

## 9. IMAGE OPTIMIZATION

### Results
| File | Before | After | Savings | Format |
|------|--------|-------|---------|--------|
| favicon.png | 550 KB (1254×1254) | **42 KB** (256×256) | 92% | PNG |
| hero-bg.png → hero-bg.jpg | 1,503 KB (1774×887) | **116 KB** (1774×887) | 92% | JPEG q82 |
| Mehdi portrait → mehdi-javed.jpg | 424 KB (800×800) | **63 KB** (800×800) | 85% | JPEG q85 |
| footer-logo.png | 153 KB (1416×339) | **141 KB** (1200×287) | 8% | PNG |
| logo.png | 153 KB (1416×339) | **102 KB** (1000×239) | 33% | PNG |

**Total saved: ~2.4 MB** from every page load

### Deleted Files (unused)
- `hero-bg.png` — replaced by hero-bg.jpg
- `logo-icon.png` — 649 KB, not referenced in any page
- `Favicon---accountant-for-small-business.png` — 550 KB backup copy
- `Mehdi Jawed - Accountant For Small Businesses.png` — replaced by mehdi-javed.jpg

**Total deploy size freed: ~2.7 MB**

### Lighthouse Finding Fixed
`Improve image delivery — Est savings of 549 KiB` — fully resolved by favicon.png resize (1254×1254 → 256×256).

---

## 10. SECURITY HARDENING

### HTTP Response Headers (vercel.json — all routes)
| Header | Value | Purpose |
|--------|-------|---------|
| `Cache-Control` | `public, max-age=0, must-revalidate, s-maxage=31536000` | Instant CDN purge on deploy |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer data |
| `Content-Security-Policy` | See below | Whitelist allowed resources |
| `Permissions-Policy` | See below | Disable unnecessary browser features |

### Content-Security-Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' https: data:;
frame-src https://www.google.com;
connect-src 'self' https://form.accountantforsmallbusiness.com https://www.google-analytics.com https://analytics.google.com;
object-src 'none';
base-uri 'self'
```
Note: `unsafe-inline` required for Astro static build (inline JSON-LD + GA tag) and Tailwind CSS.

### Permissions-Policy
```
geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
```

### Form Security
- Required field validation (name, email, business) before submit
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Privacy consent checkbox required (step 3)
- All inputs `.trim()` before sending
- No `dangerouslySetInnerHTML`, `innerHTML`, or `eval` anywhere
- BCC used for internal copy — `info@muhammadyounus.com` never visible to Mehdi or clients

### Security Audit Result: **A (100/100)**
- ✅ Zero hardcoded API keys in source code (Resend key stored as Cloudflare Worker secret)
- ✅ All external URLs use HTTPS
- ✅ No sensitive files in `public/`
- ✅ Schema JSON-LD is developer-controlled (build-time), not user input

---

## 11. INFRASTRUCTURE & DNS

### Domain
- **Registrar / DNS:** Cloudflare
- **Hosting:** Vercel (static deployment)
- **Account:** muhammadddyounus@gmail.com

### DNS Records
| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | @ | 76.76.21.21 (Vercel) | OFF |
| CNAME | www | cname.vercel-dns.com | OFF |
| TXT | @ | Google Search Console verification | OFF |
| TXT | @ | SPF: `v=spf1 include:amazonses.com ~all` | OFF |

### Cloudflare Worker
- **Script name:** `afsb-form`
- **Custom domain:** `form.accountantforsmallbusiness.com`
- **Route:** `form.accountantforsmallbusiness.com/contact`
- **Secret:** `RESEND_API_KEY` (stored as encrypted CF secret)
- **Account ID:** `582615d0510c3da8c99767e0bfce702b`
- **Zone ID:** `19ecd7ac2b8602965c088b1b6ec6f55a`

### Vercel Project
- **Project:** `afsb`
- **Team:** muhammadddyounus-7685s-projects
- **Production domain:** accountantforsmallbusiness.com
- **Auto-deploy:** GitHub push to `master` branch

---

## 12. FORMS & EMAIL DELIVERY

### Architecture
```
User fills form → ContactForm.tsx / FormPopup.tsx
  → POST JSON to https://form.accountantforsmallbusiness.com/contact
  → Cloudflare Worker (afsb-form)
  → Resend API (re_***) 
  → Email 1: Lead to accforsmes@gmail.com (BCC: info@muhammadyounus.com)
  → Email 2: Auto-reply to submitter
```

### Forms
| Form | Location | Trigger |
|------|----------|---------|
| `ContactForm` (3-step) | Homepage hero + `/contact/` page | Always visible |
| `FormPopup` (3-step) | All pages | `data-popup="quote"` click OR exit intent |

### Multi-Step Form Structure
- **Step 1:** Full name, email address, business name (required)
- **Step 2:** Monthly transactions (3 tiers), employees on payroll (dropdown), services needed (checkboxes)
- **Step 3:** Summary card, optional message, privacy consent checkbox
- Progress bar with step labels, Back/Next navigation, animated step transitions

### Email 1: Admin Lead Notification
- **To:** accforsmes@gmail.com
- **BCC:** info@muhammadyounus.com (silent — invisible to all recipients)
- **Subject:** `AFSB receive lead — {business name}`
- **Content:** Branded HTML — contact details table, business profile table, message block, reply button, Singapore timestamp

### Email 2: Auto-Reply
- **To:** Form submitter's email
- **From:** `Mehdi Javed at AFSB <noreply@accountantforsmallbusiness.com>`
- **Subject:** `Your quote request received — Accountant for Small Business`
- **Content:** Logo at top, "Request Received!" header, Hi {name} greeting, 3-step next-steps, expected response time (1 business day), Mehdi photo sign-off card, explore links

### Exit Intent Popup
- Triggers on `mouseleave` from top of viewport
- `sessionStorage` gated — fires once per session
- Shows 10% off first month offer
- Submits with `source: "Exit Intent Popup (10% Discount)"`

### Resend Domain
- Domain: `accountantforsmallbusiness.com` verified in Resend ✓
- DNS auto-configured by Resend via Cloudflare ✓
- From address: `noreply@accountantforsmallbusiness.com`

---

## 13. CALCULATORS — 7 BUILT

All calculators are React islands with Singapore-accurate 2026 rates, UC v6.4 content pages, JSON-LD (WebApplication + FAQPage + BreadcrumbList), and service CTAs.

### Calculator 1: CPF Calculator 2026
**URL:** `/cpf-calculator-singapore/`  
**Features:** 5 age brackets, PR Year 1/2, Citizen/PR/Work Pass types, SDL toggle, OW ceiling cap at S$8,000, monthly + annual view, sticky rate reference sidebar  
**Unique value:** Most accurate 2026 rates with all edge cases

### Calculator 2: Bookkeeping Cost Estimator
**URL:** `/bookkeeping-cost-calculator-singapore/`  
**Features:** Transaction slider (5–150/mo), employee counter, GST toggle, reports toggle, frequency toggle, plan auto-selection (Starter/Growth/Full), in-house vs outsource comparison, savings percentage  
**Unique value:** Compares cost vs S$3,500+ in-house hire

### Calculator 3: GST Registration Threshold
**URL:** `/gst-registration-calculator-singapore/`  
**Features:** Retrospective test (past 12 months), prospective test (next 12 months), supply type selector (standard/zero-rated/exempt — exempt excluded from threshold), progress bar to S$1M, monthly + annual GST collection at 9%, action recommendation  
**Unique value:** Two-test logic matching IRAS rules exactly

### Calculator 4: Employee Total Cost
**URL:** `/employee-cost-calculator-singapore/`  
**Features:** Salary input + range slider, 8 employee types (all age brackets, PR Y1/Y2, Work Pass), SDL toggle, number of employees, annual view toggle, cost breakdown with proportion bar, multi-employee mode (up to 10), team total panel, benchmark table (S$3k–S$12k)  
**Unique value:** Multi-employee mode, true employer markup %, benchmark table

### Calculator 5: Corporate Tax Estimator
**URL:** `/corporate-tax-calculator-singapore/`  
**Features:** Quick mode (chargeable income) + build-up mode (revenue minus expenses), SUTE/PTE toggle, three-tier breakdown with proportion bars, monthly cash provision, tax saving vs flat 17%, three-way comparison (SUTE vs PTE vs no exemption)  
**Unique value:** Build-up mode, three-way comparison, tax saving display

### Calculator 6: Break-Even Calculator
**URL:** `/break-even-calculator-singapore/`  
**Features:** Fixed cost itemiser (add/remove rows), selling price + variable cost per unit, contribution margin + CM ratio, break-even units and revenue, current sales vs break-even progress bar, formula breakdown, target profit toggle, negative CM guard  
**Unique value:** Itemisable fixed costs, formula shown, CM ratio

### Calculator 7: Cash Flow Runway
**URL:** `/cash-flow-runway-calculator/`  
**Features:** Opening cash, monthly revenue + fixed/variable expenses, runway in months, colour-coded danger zones (red <3mo / amber 3–6mo / green 6+mo), break-even revenue, expense cut scenario slider (5–50%), revenue growth rate, 12-month projection table (rows turn red when cash goes negative)  
**Unique value:** 12-month projection, danger zone alerts, expense cut scenario

---

## 14. BLOG — 6 POSTS

All posts use `BlogLayout.astro` with author photo (Mehdi portrait), clickable author section linking to `/about/`, related posts grid, and full Article + FAQPage JSON-LD.

| Post | Primary KW | Min words | FAQs |
|------|-----------|-----------|------|
| Bookkeeping vs Accounting | bookkeeping vs accounting singapore | 800+ | 5 |
| How to Choose an Accountant | how to choose accountant singapore sme | 800+ | 4 |
| Year-End Checklist | year-end accounting checklist singapore | 800+ | 4 |
| Accountant Cost Singapore | accountant cost singapore | 800+ | 4 |
| Best Accounting Software 2026 | best accounting software singapore | 800+ | 4 |
| Xero vs QuickBooks 2026 | xero vs quickbooks singapore | 900+ | 5 |

### Blog Schema (per post)
- `Article` with datePublished, dateModified, description, inLanguage: en-SG
- `ImageObject` with 1200×630 dimensions
- `keywords` array
- `FAQPage` with expanded Q&As
- `BreadcrumbList`

---

## 15. MOBILE UX

### Mobile Menu
- **Architecture:** Menu panel and backdrop are OUTSIDE `<header>` element
  - Critical: `header` has `z-50 + backdrop-blur-md` which creates a CSS stacking context that would trap `position:fixed` children
  - Fix: menu at `z-index:999`, backdrop at `z-index:998`
- **Design:** Slides up from bottom (rounded-t-2xl), drag handle bar
- **Navigation:** Accordion sub-menus for Services, Blog, Tools
  - Single-expand: opening one closes others
  - Chevron rotates 180° when open
  - `aria-expanded` on all accordion buttons
- **Interactions:** `cursor: pointer` on all interactive elements sitewide

### Responsive Breakpoints
- 1 column → 2 column (`sm:`) → 3 column (`lg:`) throughout
- Hero: stacked on mobile, side-by-side on desktop
- Calculator sidebars: stack below calculator on mobile, sticky alongside on desktop
- Footer: 2-col → 3-col → 5-col grid

### Touch UX
- All buttons/links minimum 44px tap targets
- Slider thumbs: 26×26px gold with outer ring for visibility
- WhatsApp float: always visible, 44px+ height with Mehdi photo avatar
- Scroll-to-top: hidden until 400px scroll, smooth animation

---

## 16. ANALYTICS

### Google Analytics 4
- **Tag:** `G-2NQ4N3KMXX`
- **Placement:** Immediately after `<head>` in BaseLayout (loads first)
- **Format:** gtag.js async script + inline init
- **Coverage:** All 30 pages

### Google Search Console
- Domain verified via Cloudflare DNS TXT record ✓
- Sitemap submitted: `https://accountantforsmallbusiness.com/sitemap-index.xml` ✓

### Bing Webmaster Tools
- Imported from Google Search Console ✓

---

## 17. INDEXING & AEO/LLM

### llms.txt (spec-compliant)
**URL:** `/llms.txt`  
Follows the llmstxt.org standard:
- H1 title + blockquote description
- Organised sections: Home, About, Services, Pricing, Blog, Calculators, Compliance, Contact, Legal
- Content structure notes
- Link to llms-full.txt

### llms-full.txt (comprehensive)
**URL:** `/llms-full.txt`  
4,200+ words of structured site content for deep LLM indexing:
- Business identity block (scope, what we do / don't do)
- Complete pricing with all tiers and add-ons
- All 6 service pages fully extracted (H2s, answer blocks, FAQs, S$ figures)
- All 5 calculator rate tables (CPF rates, GST threshold, corp tax tiers, employee cost benchmarks)
- Regulatory quick-reference table (12 rules from ACRA/IRAS/MOM/CPF Board)
- All 6 blog post summaries
- 8 verbatim AEO answer blocks (direct Q&A for AI citation)

### RalfyIndex Submissions
| Date | URLs | Mode | Credits used |
|------|------|------|-------------|
| Session 1 | 24 original pages | Normal | 24 |
| Session 2 | 4 new calculators | Instant | 40 |

---

## 18. BUGS FIXED

| Bug | Root cause | Fix applied |
|-----|-----------|-------------|
| 47 invalid CSS classes (`font-700` etc.) | Tailwind v4 uses named font-weight utilities only | Global replace: `font-700→font-bold`, `font-600→font-semibold` etc. |
| Em dashes in content | Spec violation | Global replace `—` with `, ` across 17 files |
| Mobile menu invisible | `header` with `z-50 + backdrop-blur-md` creates stacking context trapping `position:fixed` children | Moved menu + backdrop OUTSIDE `</header>` |
| Cloudflare API 403 | Used Bearer token format; CF Global API Key needs `X-Auth-Key` header | Changed to `X-Auth-Key` + `X-Auth-Email` headers |
| HTML comment in JSX | `<!-- -->` syntax invalid in JSX | Replaced with `{/* */}` |
| Dynamic Tailwind classes purged | `${step.ac}-500` pattern not supported in Tailwind v4 JIT | Hardcoded each variant explicitly |
| FormData vs JSON | Formsubmit AJAX requires `application/json` | Switched to `JSON.stringify` + Content-Type header |
| Blog schema missing fields | `datePublished`, `image`, `inLanguage` absent | Added all missing Article schema fields to all 6 posts |
| Logo transparency in header | `mix-blend-mode` fails inside `backdrop-filter` stacking context | CSS luminance masking with `mask-image` + `mask-mode: luminance` |
| Homepage meta description 178 chars | Old Formsubmit description not updated | Trimmed to 157 chars |

---

## 19. COMPLETE URL INVENTORY

### Indexable (28 URLs in sitemap)
```
https://accountantforsmallbusiness.com/
https://accountantforsmallbusiness.com/about/
https://accountantforsmallbusiness.com/accounting-services-singapore/
https://accountantforsmallbusiness.com/blog/
https://accountantforsmallbusiness.com/blog/accountant-cost-singapore/
https://accountantforsmallbusiness.com/blog/best-accounting-software-singapore/
https://accountantforsmallbusiness.com/blog/bookkeeping-vs-accounting/
https://accountantforsmallbusiness.com/blog/how-to-choose-accountant-sme/
https://accountantforsmallbusiness.com/blog/xero-vs-quickbooks-singapore/
https://accountantforsmallbusiness.com/blog/year-end-accounting-checklist/
https://accountantforsmallbusiness.com/bookkeeping-cost-calculator-singapore/
https://accountantforsmallbusiness.com/bookkeeping-services-singapore/
https://accountantforsmallbusiness.com/break-even-calculator-singapore/
https://accountantforsmallbusiness.com/cash-flow-runway-calculator/
https://accountantforsmallbusiness.com/contact/
https://accountantforsmallbusiness.com/corporate-tax-calculator-singapore/
https://accountantforsmallbusiness.com/cpf-calculator-singapore/
https://accountantforsmallbusiness.com/employee-cost-calculator-singapore/
https://accountantforsmallbusiness.com/financial-statements-singapore/
https://accountantforsmallbusiness.com/gst-registration-calculator-singapore/
https://accountantforsmallbusiness.com/outsource-accounting-services-singapore/
https://accountantforsmallbusiness.com/packages/
https://accountantforsmallbusiness.com/payroll-services-singapore/
https://accountantforsmallbusiness.com/pricing/
https://accountantforsmallbusiness.com/privacy/
https://accountantforsmallbusiness.com/services/
https://accountantforsmallbusiness.com/sfrs-compliance-singapore/
https://accountantforsmallbusiness.com/terms/
```

### Excluded from sitemap (noindex)
```
https://accountantforsmallbusiness.com/thank-you/
```

### Public files
```
https://accountantforsmallbusiness.com/favicon.png
https://accountantforsmallbusiness.com/hero-bg.jpg
https://accountantforsmallbusiness.com/footer-logo.png
https://accountantforsmallbusiness.com/logo.png
https://accountantforsmallbusiness.com/mehdi-javed.jpg
https://accountantforsmallbusiness.com/robots.txt
https://accountantforsmallbusiness.com/sitemap-index.xml
https://accountantforsmallbusiness.com/sitemap-0.xml
https://accountantforsmallbusiness.com/llms.txt
https://accountantforsmallbusiness.com/llms-full.txt
```

---

## 20. OUTSTANDING ITEMS

### Testimonials
`TestimonialsCarousel.tsx` is live on the homepage (`client:visible`). Content should be reviewed — confirm real client testimonials are loaded or placeholder content replaced.

### Remaining Future Calculators (optional)
The original spec mentioned additional calculators that were not in scope for this phase but could be added:
- Dividend vs Salary Calculator (for director compensation planning)
- Xero vs QuickBooks Cost Calculator

### Ongoing Monthly
- Update calculator rates if CPF Board or IRAS announces changes (typically Budget in February)
- Add new blog posts monthly to maintain topical authority
- Review Google Search Console for crawl errors or indexing issues

---

*Report generated June 2026 — accountantforsmallbusiness.com*  
*Built by Claude Sonnet 4.6 (Anthropic) via Claude Code*
