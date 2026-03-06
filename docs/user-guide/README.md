# GEO-TREES User Guide

## What is GEO-TREES?

GEO-TREES is a geospatial data visualization and management platform hosted at data.geo-trees.org. It provides an interactive map for exploring tree plot data, Airborne Laser Scanning (ALS) survey sites, and BRM (Biomass Reference Measurement) field sites. Researchers and data managers can also download plot data, manage site content, and administer users through the same application.

## Who is it for?

- **Researchers and scientists** — explore the interactive map, view site locations and status, download tree plot data for analysis.
- **Data managers** — manage map layers, publish CMS pages and navigation menus, moderate comments.
- **Administrators** — manage user accounts, roles, and permissions across the platform.

## Main Sections

| Section | URL | Description |
|---------|-----|-------------|
| Map | `/` | Interactive geospatial map (the home page) |
| Dashboard | `/dashboard` | Admin overview: user counts, role counts, tenant counts, charts, recent activity |
| Users | `/admin/users` | Create, edit, and delete user accounts |
| Roles | `/admin/roles` | Create and manage roles; assign permissions per role |
| Map Layers | `/admin/map-layers` | Configure which data layers appear on the map |
| CMS Pages | `/admin/cms/pages` | Create and edit content pages using the visual editor |
| CMS Navigation | `/admin/cms/navigation` | Manage the site navigation menu structure |
| CMS Comments | `/admin/cms/comments` | Moderate user comments on CMS pages |
| Profile | `/profile` | View and update your own profile and security settings |

## How to Log In

1. Open the application in your browser. The map page loads immediately — no login is required to view the map.
2. Click the **Login** button in the top-right corner of the header.
3. You are redirected to the identity provider login page. Enter your username and password and submit.
4. After successful authentication you are redirected back to the map. Your name or avatar appears in the header.
5. To log out, click your avatar in the top-right corner and select **Logout** from the dropdown.

Downloading data and accessing the admin area both require you to be logged in. If you visit a protected page without being authenticated, you are redirected to the login page automatically.

## Navigation

The top header bar is visible on every page. It contains:

- The **Geo Trees** logo and name (links back to the map)
- A navigation bar with **Map** and **Dashboard** links
- A user avatar/login button on the right

Admin pages (`/admin/*`) and CMS pages (`/admin/cms/*`) are accessible from the dashboard or by typing the URL directly. They require an authenticated session with appropriate permissions.

## Further Reading

- [Map Guide](./map.md) — how to navigate the map, use layers, switch basemaps, and download data
- [User Management](./user-management.md) — managing users, roles, and permissions
- [CMS Guide](./cms.md) — creating and managing pages, navigation, and comments
