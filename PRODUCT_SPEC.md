# GastroConnect product spec

GastroConnect is a Russian HoReCa marketplace inspired by Coople, VentraGo and Instawork, scoped to three roles only: establishments, workers and suppliers.

## Roles

- Establishment: keeps a venue profile, publishes shifts, views worker profiles, accepts or declines applications, requests supplier offers.
- Worker: keeps a worker profile, views open shifts, applies to shifts, accepts or declines shift invites.
- Supplier: keeps a supplier profile, publishes offers, views establishment requests, accepts or declines incoming inquiries.
- Admin: manages site logo, hero images, navigation labels and main page copy through the admin settings UI.

## Required working flows

1. Worker registration opens with `auth.html?role=worker`, creates a worker account and shows the worker cabinet.
2. Establishment registration opens with `auth.html?role=restaurant`, creates an establishment account and shows the establishment cabinet.
3. Supplier registration opens with `auth.html?role=supplier`, creates a supplier account and shows the supplier cabinet.
4. Establishment creates a shift in `shift_posts`; workers can see it and apply through `shift_applications`.
5. Establishment loads workers from `worker_profiles` and sends an invite into `shift_invites`.
6. Worker sees shift invites and can set status to `accepted` or `declined`.
7. Supplier creates offers in `supplier_offers`; establishments can send direct inquiries into `supplier_inquiries`.
8. Supplier sees incoming inquiries and can set status to `accepted` or `declined`.
9. Establishment can publish general supply requests into `supply_requests`.
10. Supplier can respond to a general supply request through `supplier_responses`; establishment can accept or decline that supplier response.

## Release checks

- Public pages use local hero images from `assets/hero-home.webp`, `assets/hero-workers.webp`, `assets/hero-restaurants.webp` and `assets/hero-suppliers.webp`.
- Every first-screen hero image is eager loaded and high priority; the optimized logo does not compete with hero priority.
- `style.css` contains one shared style system, without stacked temporary hero override blocks.
- `index.html`, `workers.html`, `restaurants.html`, `suppliers.html`, `auth.html`, `cabinet.html`, `admin.html` and `manage.html` load without missing local assets.
- `manage.html` and `admin.html` expose editable fields for logo, hero images, navigation text, hero text and dashboard text.
- `supabase.js` contains `sb_publishable_` and does not contain `.join('.')`.
- `cabinet.html` contains role panels for worker, restaurant, supplier and admin.
- `cabinet.html` contains `workerName`, `restaurantBusinessName`, `supplierCompanyName`, `loadWorkersBtn`, `loadInvitesBtn`, `loadSupplyResponsesBtn`, `loadSupplyRequestsBtn` and `loadSupplierInquiriesBtn`.
- `cabinet.js` passes syntax check and all referenced element IDs exist in `cabinet.html`.
- Live pages and assets must return HTTP 200 with a cache-busting query.
