// Menu, wines, hours, texts and contact details are edited in the Dara IT
// portal. The content is fetched on the server and cached for a minute, so
// the HTML already contains it; if the portal is unreachable the defaults in
// cms/manifest.ts are shown.
import Home from "./home";
import { buildHomeContent } from "./home-content";
import { CMS_CUSTOMER_ID } from "@/cms/manifest";
import { fetchCmsContent } from "@/lib/dara-cms";

export default async function Page() {
  const content = await fetchCmsContent({ customerId: CMS_CUSTOMER_ID }, { next: { revalidate: 60 } });
  return <Home content={buildHomeContent(content)} />;
}
