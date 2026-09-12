ï»¿# GastroConnect

Static GitHub Pages site for the GastroConnect HoReCa marketplace.

## Main Pages

- `index.html` â home page
- `workers.html` â worker landing page
- `restaurants.html` â restaurant landing page
- `suppliers.html` â supplier landing page
- `auth.html` â role-based login and registration
- `cabinet.html` â worker, restaurant, supplier and admin cabinet
- `manage.html` â public admin settings page
- `admin.html` â protected admin entry, if server auth is enabled

## Assets

Hero images are local and preloaded from:

- `assets/hero-home.webp`
- `assets/hero-workers.webp`
- `assets/hero-restaurants.webp`
- `assets/hero-suppliers.webp`

Default logos:

- `assets/logo-full.png`
- `assets/logo-mark.png`

## Checks Before Publish

Run:

```powershell
npm run check
```

`npm run check` validates JS syntax, verifies that the inline copies of `public.js` and
`supabase.js` embedded in the HTML pages match their source files, checks that every
referenced asset exists, and reports duplicate element ids.

Before advertising, run `supabase-launch-fix.sql` in Supabase SQL Editor and configure Supabase Auth:

- connect SMTP or disable mandatory email confirmation for the MVP;
- verify that `public_submissions` accepts anonymous inserts;
- verify that new Auth users get a row in `profiles`.

Then verify the live pages with a cache-busting query, for example:

```text
https://gastroconnect.ru/index.html?v=check
https://gastroconnect.ru/cabinet.html?v=check
```
