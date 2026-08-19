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
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const title = "Deg & Vin — Pizza Contemporanea Italiana · Stockholm";
const description =
  "Äkta napolitansk pizza med surdeg 48h, DOP-certifierade råvaror och passion för kvalitet. Beställ online eller boka bord i Stockholm.";
const ogImage = "/images/f96e6614-0744-493d-9b21-acad6459e30f.jfif";

export const metadata: Metadata = {
  metadataBase: new URL("https://degovin.se"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://degovin.se",
    siteName: "Deg & Vin",
    images: [{ url: ogImage, width: 1200, height: 800, alt: "Deg & Vin — Pizza Contemporanea Italiana" }],
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
  name: "Deg & Vin",
  image: "https://degovin.se" + ogImage,
  url: "https://degovin.se",
  telephone: "+46737221125",
  email: "info@degovin.se",
  servesCuisine: ["Italian", "Pizza"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Spångavägen 309",
    postalCode: "163 46",
    addressLocality: "Bromma",
    addressCountry: "SE",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "11:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
  menu: "https://degovin.se/#dv-menu",
  acceptsReservations: "true",
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
