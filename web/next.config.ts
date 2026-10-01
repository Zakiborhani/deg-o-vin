import type { NextConfig } from "next";

// Old WordPress URLs on degovin.se, mapped to their counterparts on the new site.
// Each source matches the bare path, a trailing slash, and anything underneath it.
const legacyRedirects: Record<string, string> = {
  "/book-a-table": "/#dv-book",
  "/food-menu": "/#dv-menu",
  "/drinks-menu": "/#dv-menu",
  "/about-us": "/#dv-about",
  "/privacy-policy": "/integritetspolicy",
  "/shop": "/",
  "/cart": "/",
  "/checkout": "/",
  "/my-account": "/",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(legacyRedirects).map(([source, destination]) => ({
      source: `${source}/:rest*`,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
