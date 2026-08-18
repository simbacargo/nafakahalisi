# Nafaka Halisi Tanzania

Bilingual React + Vite website for Nafaka Halisi Tanzania Limited. It is a client-rendered single-page application with ten clean URLs and fast in-app navigation.

## Local development

```bash
bun install
bun run dev
```

## Validate and build

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

The production files are written to `dist/`.

## Deploy to EC2 with Nginx

1. Upload the contents of `dist/` to the web root on the server.
2. Adapt `deploy/nginx.conf.example` to the server's domain and release path.
3. Validate the Nginx configuration with `sudo nginx -t`, then reload Nginx.

The `try_files` fallback is required so direct requests to routes such as `/en/products/` load the SPA. Hashed files under `/assets/app/` may be cached permanently; `index.html` should not be cached.

## Before launch

- The production domain is `nafakahalisi.com`.
- Review the business claims, opening hours, address, products, and lodging-routing text.
- Replace social placeholders when official Instagram or Facebook URLs are available.
