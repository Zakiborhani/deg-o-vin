// Publishes the CMS manifest for the Dara IT portal, which reads it from the
// customer's website address — no keys or environment variables needed.
// The customer id lets the portal check that it is reading the right site.
import { cmsManifest, CMS_CUSTOMER_ID } from "@/cms/manifest";
import { manifestResponseBody } from "@/lib/dara-cms";

export function GET() {
  return Response.json(manifestResponseBody(cmsManifest, CMS_CUSTOMER_ID), {
    headers: { "cache-control": "public, max-age=300" },
  });
}
