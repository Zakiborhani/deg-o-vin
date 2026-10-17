// Builds the props for the home page from the Dara IT portal content, with
// the manifest defaults as fallback. Runs on the server (app/page.tsx).
import { cmsImage, cmsParagraphs, cmsText, createCms, type CmsContent, type CmsRow } from "@/lib/dara-cms";
import { cmsManifest, SITE_ORIGIN } from "@/cms/manifest";
import { GALLERY_ITEMS } from "@/cms/defaults";

export type Dish = { id: string; name: string; price: string; desc: string; tags: string[] };
export type Wine = { id: string; name: string; producer: string; origin: string; grapes: string; vintage: string; notes: string; abv: string; special: string };

export type HomeContent = ReturnType<typeof buildHomeContent>;

const rowId = (row: CmsRow, i: number) => row._id ?? String(i);

export function buildHomeContent(content: CmsContent) {
  const { list, text } = createCms(cmsManifest, content);

  /** `kind` is implied by the list: every bianca/rossa pizza gets its tag. */
  const dishes = (key: "antipasti" | "bianche" | "rosse" | "dessert" | "extras", kind?: "bianca" | "rossa"): Dish[] =>
    list(key).map((row, i) => ({
      id: rowId(row, i),
      name: cmsText(row.name),
      price: cmsText(row.price),
      desc: cmsText(row.desc),
      tags: [...(row.new === true ? ["new"] : []), ...(kind ? [kind] : []), ...(row.veg === true ? ["veg"] : [])],
    })).filter((d) => d.name);

  const wines = (key: "wines-white" | "wines-red" | "wines-rose" | "wines-sparkling" | "wines-sparkling-rose"): Wine[] =>
    list(key).map((row, i) => ({
      id: rowId(row, i),
      name: cmsText(row.name), producer: cmsText(row.producer), origin: cmsText(row.origin), grapes: cmsText(row.grapes),
      vintage: cmsText(row.vintage), notes: cmsText(row.notes), abv: cmsText(row.abv), special: cmsText(row.special),
    })).filter((w) => w.name);

  // Our own photos keep their hand-tuned frame; new uploads get one from "Stående bild".
  const layoutOf = new Map(GALLERY_ITEMS.map((g) => [g.src, { ratio: g.ratio, position: g.position }]));
  const gallery = list("gallery").map((row, i) => {
    const src = cmsImage(row.image, SITE_ORIGIN);
    const layout = layoutOf.get(src) ?? { ratio: row.portrait === true ? 0.8 : 1.3, position: "center" };
    return { key: rowId(row, i), src, alt: cmsText(row.alt), caption: cmsText(row.caption), ...layout };
  }).filter((g) => g.src);

  const address = text("contact.address");
  const mapsQuery = encodeURIComponent(`${address}, Sverige`);
  const phone = text("contact.phone");

  return {
    marquee: list("marquee").map((r) => cmsText(r.text)).filter(Boolean),
    tabs: [
      { key: "antipasti", label: "Antipasti", items: dishes("antipasti"), extras: null },
      { key: "bianche", label: "Pizze Bianche", items: dishes("bianche", "bianca"), extras: null },
      { key: "rosse", label: "Pizze Rosse", items: dishes("rosse", "rossa"), extras: null },
      { key: "dessert", label: "Dessert & Extra", items: dishes("dessert"), extras: dishes("extras") },
      { key: "vin", label: "Vinmeny", items: [] as Dish[], extras: null },
    ],
    wineGroups: [
      { key: "white", label: "Vitt vin", items: wines("wines-white") },
      { key: "red", label: "Rött vin", items: wines("wines-red") },
      { key: "rose", label: "Rosé", items: wines("wines-rose") },
      { key: "sparkling", label: "Prosecco", items: wines("wines-sparkling") },
      { key: "sparkling-rose", label: "Prosecco Rosé", items: wines("wines-sparkling-rose") },
    ].filter((g) => g.items.length),
    wineNote: text("wine.note"),
    hours: list("hours").map((r, i) => ({ key: rowId(r, i), days: cmsText(r.days), time: cmsText(r.time) })).filter((h) => h.days),
    lunch: { title: text("lunch.title"), time: text("lunch.time"), text: text("lunch.text") },
    links: { order: text("links.order"), booking: text("links.booking") },
    contact: {
      address,
      phone,
      tel: "tel:" + phone.replace(/^0/, "+46").replace(/[^\d+]/g, ""),
      email: text("contact.email"),
      groups: text("contact.groups"),
      mapsUrl: `https://maps.google.com/maps?q=${mapsQuery}`,
      mapsEmbedUrl: `https://maps.google.com/maps?q=${mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    },
    // The middle dot gets non-breaking spaces, as in the original design.
    heroEyebrow: text("hero.eyebrow").replace(/\s*·\s*/g, "  ·  "),
    heroSub: text("hero.sub"),
    aboutText: cmsParagraphs(text("about.text")),
    aboutQuote: text("about.quote"),
    bookText: text("book.text"),
    gallery,
  };
}
