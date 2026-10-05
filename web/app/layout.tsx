import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  // Only used for small italic accents; keep its files off the critical path
  // so the CSS and the hero poster arrive sooner on slow connections.
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const title = "Deg ø Vin – Napolitansk pizzeria i Bromma, Stockholm";
const description =
  "Napolitansk surdegspizza (48h) på Spångavägen 309 i Bromma. DOP-råvaror, italienska viner och lunch för 159 kr. Boka bord eller beställ online.";
const ogImage = "/images/og-cover.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://degovin.se"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "https://degovin.se",
    siteName: "Deg ø Vin",
    images: [{ url: ogImage, width: 1600, height: 1104, alt: "Deg ø Vin — Pizza Contemporanea Italiana" }],
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://degovin.se/#restaurant",
  name: "Deg ø Vin",
  description,
  image: "https://degovin.se" + ogImage,
  url: "https://degovin.se",
  telephone: "+46737221125",
  email: "info@degovin.se",
  servesCuisine: ["Italian", "Pizza"],
  priceRange: "$$",
  hasMap: "https://maps.google.com/maps?q=Sp%C3%A5ngav%C3%A4gen+309%2C+163+46+Bromma%2C+Sverige",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Spångavägen 309",
    postalCode: "163 46",
    addressLocality: "Bromma",
    addressRegion: "Stockholms län",
    addressCountry: "SE",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "11:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
  menu: "https://degovin.se/#dv-menu",
  acceptsReservations: "https://book.easytable.com/book/?id=85c56&lang=auto",
  potentialAction: {
    "@type": "OrderAction",
    target: "https://qopla.com/restaurant/deg-och-vin/qMbRR7pDXd/order",
    deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModePickUp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
