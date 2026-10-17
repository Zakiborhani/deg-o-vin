// What the customer can edit in the Dara IT portal (CMS format v2).
// Published at /.well-known/dara-cms.json (app/.well-known); the portal reads
// it from degovin.se and builds the edit form from it. Defaults are today's
// content (cms/defaults.ts), so the site looks the same until something is saved.
//
// Keys are stable — never rename a key, or saved content stops showing.
import type { CmsManifest, CmsRow } from "@/lib/dara-cms";
import {
  ANTIPASTI, BIANCHE, DESSERT, EXTRAS, GALLERY_ITEMS, MARQUEE_ITEMS, RED_WINES, ROSE_WINES, ROSSE,
  SPARKLING_ROSE_WINES, SPARKLING_WINES, WHITE_WINES, type Wine,
} from "./defaults";

/** Portal customer id (public). */
export const CMS_CUSTOMER_ID = "b21fde15-aeed-465d-9839-501ce7155bf0";

/** Live origin. Default images are sent as absolute URLs because the portal
 *  only accepts https or its own image address; cmsImage() strips it again. */
export const SITE_ORIGIN = "https://degovin.se";

type Dish = { name: string; price: string; desc: string; tags?: string[] };
const dishRow = (d: Dish): CmsRow => ({
  name: d.name, price: d.price, desc: d.desc, new: !!d.tags?.includes("new"), veg: !!d.tags?.includes("veg"),
});
const wineRow = (w: Wine): CmsRow => ({ ...w });

const DISH_FIELDS = [
  { key: "name", type: "text", label: "Namn", required: true },
  { key: "price", type: "text", label: "Pris (t.ex. 159 kr)" },
  { key: "desc", type: "richtext", label: "Beskrivning" },
  { key: "new", type: "boolean", label: "Märk som nyhet" },
  { key: "veg", type: "boolean", label: "Vegetarisk" },
] as const;

const WINE_FIELDS = [
  { key: "name", type: "text", label: "Namn", required: true },
  { key: "producer", type: "text", label: "Producent" },
  { key: "origin", type: "text", label: "Ursprung (t.ex. Italien, Piemonte)" },
  { key: "grapes", type: "text", label: "Druvor" },
  { key: "vintage", type: "text", label: "Årgång" },
  { key: "abv", type: "text", label: "Alkoholhalt (t.ex. 13%)" },
  { key: "notes", type: "richtext", label: "Smak och doft" },
  { key: "special", type: "richtext", label: "Särskilt" },
] as const;

// Pages in the portal form, in the order the customer sees them.
const MENU = "Meny";
const WINE = "Vinmeny";
const HOURS = "Öppettider & lunch";
const CONTACT = "Kontakt & länkar";
const TEXTS = "Texter";
const GALLERY = "Galleri";

export const cmsManifest = {
  version: 2,
  fields: [
    { key: "lunch.title", type: "text", label: "Lunch – rubrik", page: HOURS, default: "Luncherbjudande, 159 kr" },
    { key: "lunch.time", type: "text", label: "Lunch – tid", page: HOURS, default: "kl. 11–13" },
    { key: "lunch.text", type: "richtext", label: "Lunch – text (tom döljer rutan)", page: HOURS, default: "Samtliga pizzor under 200 kr inkluderar läsk (ej San Pellegrino) och espresso!" },
    { key: "links.order", type: "url", label: "Beställ online (Qopla-länk)", page: CONTACT, default: "https://qopla.com/restaurant/deg-och-vin/qMbRR7pDXd/order" },
    { key: "links.booking", type: "url", label: "Boka bord (easyTable-länk)", page: CONTACT, default: "https://book.easytable.com/book/?id=85c56&lang=auto" },
    { key: "contact.address", type: "text", label: "Adress", page: CONTACT, default: "Spångavägen 309, 163 46 Bromma" },
    { key: "contact.phone", type: "text", label: "Telefon", page: CONTACT, default: "+46 73-722 11 25" },
    { key: "contact.email", type: "text", label: "E-post", page: CONTACT, default: "info@degovin.se" },
    { key: "contact.groups", type: "text", label: "Grupper & event", page: CONTACT, default: "Kontakta oss via e-post för gruppreservationer och event." },
    { key: "hero.eyebrow", type: "text", label: "Startsida – rad ovanför namnet", page: TEXTS, default: "Surdeg 48h · Bromma, Stockholm" },
    { key: "hero.sub", type: "text", label: "Startsida – rad under namnet", page: TEXTS, default: "Pizza Contemporanea Italiana" },
    { key: "about.text", type: "richtext", label: "Om oss – text", page: TEXTS, default: "Vi är en italiensk pizzeria i Stockholm med ett enkelt löfte: äkta napolitansk teknik möter de bästa italienska råvarorna. Vår deg jäser i 48 timmar, toppingarna kommer direkt från producenter med IGP- och DOP-certifieringar." },
    { key: "about.quote", type: "richtext", label: "Om oss – citat", page: TEXTS, default: "Från Prosciutto di Parma 24 månader till Parmigiano-Reggiano 40 månader. Varje ingrediens är utvald med omsorg." },
    { key: "book.text", type: "richtext", label: "Boka & beställ – text", page: TEXTS, default: "Boka ett bord för en afton av äkta napolitansk pizza, eller beställ hem och upplev smakerna hemma." },
    { key: "wine.note", type: "text", label: "Rad under vinmenyn", page: WINE, default: "Fråga din servitör om priser och dagens urval." },
  ],
  lists: [
    { key: "antipasti", label: "Antipasti", page: MENU, itemFields: DISH_FIELDS, default: ANTIPASTI.map(dishRow) },
    { key: "bianche", label: "Pizze Bianche", page: MENU, itemFields: DISH_FIELDS, default: BIANCHE.map(dishRow) },
    { key: "rosse", label: "Pizze Rosse", page: MENU, itemFields: DISH_FIELDS, default: ROSSE.map(dishRow) },
    { key: "dessert", label: "Dessert", page: MENU, itemFields: DISH_FIELDS, default: DESSERT.map(dishRow) },
    { key: "extras", label: "Extra", page: MENU, itemFields: DISH_FIELDS, default: EXTRAS.map(dishRow) },
    { key: "wines-white", label: "Vitt vin", page: WINE, itemFields: WINE_FIELDS, default: WHITE_WINES.map(wineRow) },
    { key: "wines-red", label: "Rött vin", page: WINE, itemFields: WINE_FIELDS, default: RED_WINES.map(wineRow) },
    { key: "wines-rose", label: "Rosé", page: WINE, itemFields: WINE_FIELDS, default: ROSE_WINES.map(wineRow) },
    { key: "wines-sparkling", label: "Prosecco", page: WINE, itemFields: WINE_FIELDS, default: SPARKLING_WINES.map(wineRow) },
    { key: "wines-sparkling-rose", label: "Prosecco Rosé", page: WINE, itemFields: WINE_FIELDS, default: SPARKLING_ROSE_WINES.map(wineRow) },
    {
      key: "hours", label: "Öppettider", page: HOURS,
      itemFields: [
        { key: "days", type: "text", label: "Dagar (t.ex. Måndag – Torsdag)", required: true },
        { key: "time", type: "text", label: "Tid (t.ex. kl. 11–21)" },
      ],
      default: [
        { days: "Måndag – Torsdag", time: "kl. 11–21" },
        { days: "Fredag", time: "kl. 11–22" },
        { days: "Lördag", time: "kl. 12–22" },
        { days: "Söndag", time: "kl. 12–21" },
      ],
    },
    {
      key: "marquee", label: "Rullande text", page: TEXTS,
      itemFields: [{ key: "text", type: "text", label: "Text", required: true }],
      default: MARQUEE_ITEMS.map((text) => ({ text })),
    },
    {
      key: "gallery", label: "Bilder", page: GALLERY,
      itemFields: [
        { key: "image", type: "image", label: "Bild", required: true },
        { key: "alt", type: "text", label: "Beskrivning för skärmläsare" },
        { key: "caption", type: "text", label: "Bildtext" },
        { key: "portrait", type: "boolean", label: "Stående bild" },
      ],
      default: GALLERY_ITEMS.map((g) => ({ image: SITE_ORIGIN + g.src, alt: g.alt, caption: g.caption, portrait: g.ratio < 1 })),
    },
  ],
} as const satisfies CmsManifest;
