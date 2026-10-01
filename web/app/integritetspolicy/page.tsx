/*
 * ATT GRANSKA AV KUNDEN (Italian Food Tre AB) INNAN PUBLICERING
 * --------------------------------------------------------------
 * Texten nedan är ett utkast och är inte juridiskt granskad. Den beskriver
 * sajten som den är byggd: inga egna cookies, ingen analys, typsnitt
 * levereras från vår egen domän och Google Maps-kartan i sidfoten är det
 * enda inbäddade tredjepartsinnehållet. Kontrollera särskilt:
 *  - lagringstiden för e-post (12 månader är ett antagande)
 *  - vilken e-postleverantör som används för info@degovin.se
 *  - om organisationsnummer ska anges
 *  - datumet "Senast uppdaterad"
 * Om analysverktyg, nyhetsbrev eller fler inbäddningar läggs till på sajten
 * måste den här sidan uppdateras.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "Integritetspolicy · Deg & Vin";
const description = "Så behandlar Deg & Vin (Italian Food Tre AB) dina personuppgifter.";

// openGraph and twitter replace the layout's objects wholesale, so the shared fields are repeated here.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/integritetspolicy" },
  openGraph: {
    title,
    description,
    url: "/integritetspolicy",
    siteName: "Deg & Vin",
    images: [{ url: "/images/og-cover.jpg", width: 1600, height: 1104, alt: "Deg & Vin — Pizza Contemporanea Italiana" }],
    locale: "sv_SE",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og-cover.jpg"] },
};

const UPDATED = "1 oktober 2026";

export default function Integritetspolicy() {
  return (
    <div className="dv-legal">
      <header className="dv-legal-head">
        <Link className="dv-nav-logo" href="/" aria-label="Till startsidan">
          <Image src="/images/logo.webp" alt="Deg & Vin" className="dv-logo-img" width={300} height={295} preload />
        </Link>
        <Link className="dv-legal-back" href="/">&larr; Tillbaka</Link>
      </header>

      <main className="dv-legal-main">
        <div className="dv-section-label">Deg &amp; Vin</div>
        <h1 className="dv-section-title">Integritetspolicy</h1>
        <p className="dv-legal-updated">Senast uppdaterad {UPDATED}</p>
        <div className="dv-gold-rule" />

        <p className="dv-section-body">
          Vi vill att du ska känna dig trygg när du besöker degovin.se och när du kontaktar oss. Här
          beskriver vi vilka personuppgifter vi behandlar, varför, och vilka rättigheter du har enligt
          dataskyddsförordningen (GDPR).
        </p>

        <section>
          <h2>Personuppgiftsansvarig</h2>
          <p>
            Italian Food Tre AB, som driver Deg &amp; Vin, är personuppgiftsansvarig för behandlingen
            som beskrivs här.
          </p>
          <address>
            Italian Food Tre AB<br />
            Spångavägen 309, 163 46 Bromma<br />
            <a href="mailto:info@degovin.se">info@degovin.se</a>
          </address>
        </section>

        <section>
          <h2>Bordsbokning och onlinebeställning</h2>
          <p>
            Bordsbokning sker via <strong>easyTable</strong> och onlinebeställning via{" "}
            <strong>Qopla</strong>. När du klickar på &rdquo;Boka bord&rdquo; eller &rdquo;Beställ
            online&rdquo; lämnar du vår webbplats. De uppgifter du lämnar där, till exempel namn,
            telefonnummer, e-post och betalningsuppgifter, samlas in i deras tjänster och omfattas av
            deras egna villkor och integritetspolicyer. Vi får de uppgifter som behövs för att ta emot
            din bokning eller beställning.
          </p>
        </section>

        <section>
          <h2>När du mejlar oss</h2>
          <p>
            Om du skickar e-post till oss, till exempel för gruppbokningar, event eller frågor,
            behandlar vi de uppgifter du själv skickar: namn, e-postadress, eventuellt telefonnummer
            och innehållet i meddelandet.
          </p>
          <ul>
            <li><strong>Syfte:</strong> att besvara din fråga och planera en eventuell bokning eller ett event.</li>
            <li>
              <strong>Rättslig grund:</strong> vårt berättigade intresse av att kunna svara på
              förfrågningar, eller åtgärder inför ett avtal när du vill boka något hos oss.
            </li>
            <li>
              <strong>Lagring:</strong> vi sparar korrespondensen så länge den behövs för ärendet och
              raderar den senast 12 månader efter att kontakten avslutats, om vi inte måste spara den
              längre enligt lag (till exempel bokföringsregler).
            </li>
            <li>
              <strong>Mottagare:</strong> vi säljer aldrig dina uppgifter. Vår e-postleverantör hanterar
              meddelandena för vår räkning.
            </li>
          </ul>
        </section>

        <section>
          <h2>Cookies och tredjepartsinnehåll</h2>
          <p>
            Vår webbplats sätter inga egna cookies och använder inga analys- eller
            marknadsföringsverktyg. Typsnitten levereras från vår egen domän, så din webbläsare
            kontaktar inte Google Fonts.
          </p>
          <p>
            <strong>Google Maps.</strong> Längst ner på sidan visas en inbäddad karta från Google Maps.
            Kartan laddas när du scrollar fram till den. Då skickar din webbläsare bland annat din
            IP-adress till Google, och Google kan sätta egna cookies. Google LLC är ansvarigt för den
            behandlingen, se{" "}
            <a href="https://policies.google.com/privacy?hl=sv" target="_blank" rel="noopener noreferrer">
              Googles integritetspolicy
            </a>
            . Du kan blockera cookies från tredje part i din webbläsares inställningar.
          </p>
          <p>
            <strong>Webbhotell.</strong> Webbplatsen drivs hos Vercel. Som alla webbservrar behandlar
            Vercel tekniska uppgifter, till exempel IP-adress och tidpunkt för besöket, för att kunna
            leverera sidan och skydda den mot missbruk.
          </p>
        </section>

        <section>
          <h2>Dina rättigheter</h2>
          <p>Enligt GDPR har du rätt att:</p>
          <ul>
            <li>få veta vilka personuppgifter vi behandlar om dig och få en kopia av dem,</li>
            <li>få felaktiga uppgifter rättade,</li>
            <li>få dina uppgifter raderade, om de inte längre behövs eller om vi saknar rättslig grund,</li>
            <li>begära att behandlingen begränsas,</li>
            <li>invända mot behandling som grundar sig på berättigat intresse,</li>
            <li>få ut uppgifter du själv lämnat i ett maskinläsbart format (dataportabilitet).</li>
          </ul>
          <p>
            Kontakta oss på <a href="mailto:info@degovin.se">info@degovin.se</a> om du vill använda
            någon av dina rättigheter. Vi svarar inom en månad.
          </p>
        </section>

        <section>
          <h2>Klagomål</h2>
          <p>
            Om du anser att vi behandlar dina personuppgifter felaktigt får du gärna höra av dig till oss
            först. Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY),{" "}
            <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer">imy.se</a>.
          </p>
        </section>

        <section>
          <h2>Ändringar</h2>
          <p>
            Vi kan uppdatera den här policyn, till exempel om vi börjar använda nya tjänster på
            webbplatsen. Den senaste versionen finns alltid på den här sidan.
          </p>
        </section>
      </main>

      <footer className="dv-footer">
        <div className="dv-footer-inner">
          <div className="dv-footer-bottom">
            <span>&copy; 2026 Deg &amp; Vin. Alla rättigheter förbehållna.</span>
            <span className="dv-footer-passion">Grazia di cuore e buon appetito ♥</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
