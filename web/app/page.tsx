"use client";

import { useEffect, useRef, useState } from "react";

const MARQUEE_ITEMS = [
  "Öppet tisdag – söndag",
  "Italienska premiumvaror",
  "Surdeg 48h",
  "Tutto fatto con passione",
  "DOP & IGP certifierade",
  "Stockholm",
  "Pizza Contemporanea Italiana",
];

const ANTIPASTI = [
  { name: "Attenzione Combo", price: "229 kr", desc: "För 2–3 pers. Nybakat surdeg vitlöksbröd med Eko Burrata, körsbärstomater, saffransolja, Parmesan DOP Sicilia, evo olja, aceto balsamico IGP, basilika.", tags: ["new"] },
  { name: "Mandorla", price: "49 kr", desc: "Rostad mandelsmör, crackersbröd, siciliansk salt, evo olja, aceto balsamico IGP, basilika.", tags: ["veg"] },
  { name: "Burratina", price: "129 kr", desc: "Körsbärstomater, saffransolja, crackersbröd, siciliansk salt, evo olja, aceto balsamico IGP + Prosciutto di Parma 40 gr.", tags: [] },
  { name: "Peco & Zola", price: "89 kr", desc: "Gorgonzola eko rullad i Pecorino Romano. Rekommenderas med crackersbröd.", tags: ["veg"] },
  { name: "Cerignola", price: "55 kr", desc: "Gröna oliver från Toscana.", tags: ["veg"] },
  { name: "EKO Taggiasche", price: "40 kr", desc: "Eko-odlade taggiasche oliver, evo olja.", tags: ["veg"] },
  { name: "Charcbricka Originale", price: "229 kr", desc: "För 2 pers. Salami, Prosciutto di Parma DOP, mozzarella di Bufala, tomater, Parmigiano-Reggiano, Pecorino, EKO oliver, hembakat bröd.", tags: [] },
  { name: "Rè Su Charcbricka", price: "319 kr", desc: "För 2 pers. Premium urval — kökets bästa val från charkuteriet.", tags: [] },
  { name: "Pane Aglio", price: "79 kr", desc: "Surdeg, tomatsalsa, sicilianskt saffransalt, evo olja.", tags: ["veg"] },
];

const BIANCHE = [
  { name: "Salmone", price: "249 kr", desc: "Varmrökt lax, fior di latte, körsbärstomater, stracciatella, allo santa (stark evo olja), basilika.", tags: ["bianca"] },
  { name: "Carbonara", price: "189 kr", desc: "Fior di latte, knaprig guanciale, Pecorino-Romano, ägg, evo olja, svart pepper.", tags: ["bianca"] },
  { name: "Genovese", price: "249 kr", desc: "Fior di latte, krämig pesto Genovese med mandlar, Parmigiano-Reggiano 40 mån, evo olja.", tags: ["bianca", "veg"] },
  { name: "Prosciuttina", price: "219 kr", desc: "Parmigiano-Reggiano, mozzarella di Bufala, Prosciutto di Parma 24 mån lagrat, basilika.", tags: ["bianca"] },
  { name: "Tartufata", price: "239 kr", desc: "Pancetta (rökt salt), salsiccia (italiensk korv), champignon, fior di latte, tartufo tryffelkräm, Parmigiano-Reggiano 40 mån, evo olja.", tags: ["bianca"] },
  { name: "4 Formaggi", price: "189 kr", desc: "Fyra ostar, Parmigiano-Reggiano 30 mån, basilico, evo olja.", tags: ["bianca", "veg"] },
];

const ROSSE = [
  { name: "Margherita", price: "159 kr", desc: "San Marzano-tomater, fior di latte mozzarella, evo olja, flingsalt, basilika.", tags: ["rossa", "veg"] },
  { name: "Peperoni", price: "179 kr", desc: "Fior di latte mozzarella, pepperoni salami, basilik.", tags: ["rossa"] },
  { name: "Bambino", price: "169 kr", desc: "San Marzano-tomater, fior di latte mozzarella, kokt skinka, basilik.", tags: ["rossa"] },
  { name: "Marinara 2.0", price: "169 kr", desc: "San Marzano-tomater, fior di latte mozzarella, premium anchovies (Slowfood), oregano, evo olja, basilik.", tags: ["rossa"] },
  { name: "Vegetariana", price: "199 kr", desc: "San Marzano-tomater, mozzarella, rostade champinjoner, körsbärstomater semidry, vitlök, taggiasche oliver, oregano, kronärtskocka, evo olja, basilik.", tags: ["rossa", "veg"] },
  { name: "Bufalina", price: "179 kr", desc: "San Marzano-tomater, mozzarella di Bufala, Prosciutto di Parma 22 mån, basilik.", tags: ["rossa"] },
  { name: "Diavola", price: "169 kr", desc: "San Marzano-tomater, 'nduja (mjuk kryddig salami från Spilinga), San Marzano piccante, fior di latte mozzarella, evo olja, basilika.", tags: ["rossa"] },
  { name: "Capricciosa", price: "189 kr", desc: "San Marzano-tomater, fior di latte mozzarella, kokt skinka, champinjoner, rostade kronärtskockor, basilik.", tags: ["rossa"] },
];

const DESSERT = [
  { name: "Choklad Tartufo", price: "50 kr", desc: "" },
  { name: "Tiramisù Classico", price: "79 kr", desc: "Mascarpone med savoiardier, eko kakao." },
  { name: "Pizza Nutellina", price: "139 kr", desc: "Nocciolata, omsorgsfull, oemotståndlig." },
  { name: "G.E.T.", price: "169 kr", desc: "Grappa, Espresso, Tryffel — kaffekräm, 3 cl grappa." },
];

const EXTRAS = [
  { name: "Tartufo", price: "50 kr", desc: "" },
  { name: "Mozzarella di Bufala", price: "30 kr", desc: "" },
  { name: "Grönt / Ost", price: "30 kr", desc: "" },
  { name: "Glutenfri botten", price: "40 kr", desc: "" },
];

const TAG_LABELS: Record<string, string> = { new: "Nyhet", veg: "Veg", bianca: "Bianca", rossa: "Röd" };
const TAG_CLASSES: Record<string, string> = {
  new: "dv-tag dv-tag-new",
  veg: "dv-tag dv-tag-veg",
  bianca: "dv-tag dv-tag-bianca",
  rossa: "dv-tag dv-tag-rossa",
};

function MenuItem({ name, price, desc, tags = [] }: { name: string; price: string; desc: string; tags?: string[] }) {
  return (
    <div className="dv-menu-item">
      <div className="dv-menu-item-top">
        <span className="dv-menu-item-name">{name}</span>
        <span className="dv-menu-item-price">{price}</span>
      </div>
      {desc && <p className="dv-menu-item-desc">{desc}</p>}
      {tags.length > 0 && (
        <div className="dv-menu-tags">
          {tags.map((t) => (
            <span key={t} className={TAG_CLASSES[t]}>{TAG_LABELS[t]}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = [
  { key: "antipasti", label: "Antipasti",       items: ANTIPASTI, extras: null },
  { key: "bianche",   label: "Pizze Bianche",   items: BIANCHE,   extras: null },
  { key: "rosse",     label: "Pizze Rosse",      items: ROSSE,     extras: null },
  { key: "dessert",   label: "Dessert & Extra",  items: DESSERT,   extras: EXTRAS },
];

export default function Home() {
  const [scrolled,    setScrolled]   = useState(false);
  const [loaded,      setLoaded]     = useState(false);
  const [activeTab,   setActiveTab]  = useState("antipasti");
  const [mobileOpen,  setMobileOpen] = useState(false);

  const heroBgRef    = useRef<HTMLDivElement>(null);
  const aboutImgRef  = useRef<HTMLImageElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const ringRef      = useRef<HTMLDivElement>(null);
  const tabBarRef    = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const loaderRef    = useRef<HTMLDivElement>(null);

  /* loader */
  useEffect(() => {
    const t = setTimeout(() => {
      loaderRef.current?.classList.add("hidden");
      setLoaded(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  /* hero bg zoom */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => heroBgRef.current?.classList.add("loaded"), 150);
    return () => clearTimeout(t);
  }, [loaded]);

  /* about img ken-burns */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => aboutImgRef.current?.classList.add("loaded"), 400);
    return () => clearTimeout(t);
  }, [loaded]);

  /* scroll effects */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 70);
      if (heroBgRef.current && window.scrollY < window.innerHeight * 1.2) {
        heroBgRef.current.style.transform = `scale(1.03) translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* custom cursor */
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);
    let rafId: number;
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current)  { dotRef.current.style.left = mx + "px"; dotRef.current.style.top = my + "px"; }
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, []);

  /* scroll reveal — runs immediately, no loader dependency */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    const els = document.querySelectorAll(".dv-reveal, .dv-clip-reveal");
    els.forEach((el) => obs.observe(el));

    /* hard fallback: if observer misses anything, reveal all after 2s */
    const fallback = setTimeout(() => {
      document.querySelectorAll(".dv-reveal:not(.visible), .dv-clip-reveal:not(.visible)")
        .forEach((el) => el.classList.add("visible"));
    }, 2000);

    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  /* tab indicator */
  useEffect(() => {
    const bar = tabBarRef.current;
    const ind = indicatorRef.current;
    if (!bar || !ind) return;
    const activeEl = bar.querySelector<HTMLButtonElement>(".dv-menu-tab.active");
    if (!activeEl) return;
    const barR = bar.getBoundingClientRect();
    const tabR = activeEl.getBoundingClientRect();
    ind.style.left  = (tabR.left - barR.left) + "px";
    ind.style.width = tabR.width + "px";
  }, [activeTab]);

  return (
    <div
      className="dv-root"
      style={{
        background: "var(--dv-bg)",
        color: "var(--dv-text)",
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        overflowX: "hidden",
        cursor: "none",
      }}
    >
      {/* cursor */}
      <div id="dv-cur-dot"  ref={dotRef}  />
      <div id="dv-cur-ring" ref={ringRef} />

      {/* loader */}
      <div id="dv-loader" ref={loaderRef}>
        <div className="dv-loader-logo">Deg <span>&amp;</span> Vin</div>
        <div className="dv-loader-bar" />
        <div className="dv-loader-sub">Pizza Contemporanea Italiana</div>
      </div>

      {/* nav */}
      <nav className={`dv-nav${scrolled ? " scrolled" : ""}`}>
        <a className="dv-nav-logo" href="#dv-hero">
          <img src="/images/logo.webp" alt="Deg & Vin" className="dv-logo-img" />
        </a>
        <ul className={`dv-nav-links${mobileOpen ? " mobile-open" : ""}`}>
          <li><a href="#dv-menu"    onClick={() => setMobileOpen(false)}>Meny</a></li>
          <li><a href="#dv-hours"   onClick={() => setMobileOpen(false)}>Öppettider</a></li>
          <li><a href="#dv-footer"  onClick={() => setMobileOpen(false)}>Hitta oss</a></li>
          <li><a href="#dv-about"   onClick={() => setMobileOpen(false)}>Om oss</a></li>
          <li><a href="#dv-gallery" onClick={() => setMobileOpen(false)}>Galleri</a></li>
          <li><a href="#dv-book"    onClick={() => setMobileOpen(false)}>Boka bord</a></li>
        </ul>
        <div className="dv-nav-btns">
          <a className="dv-btn dv-btn-outline" href="https://degovin.se/book-a-table/" target="_blank" rel="noopener noreferrer">Boka bord</a>
          <a className="dv-btn dv-btn-gold"    href="https://degovin.orderyoyo.com/"   target="_blank" rel="noopener noreferrer">Beställ online</a>
        </div>
        <button
          className="dv-hamburger"
          aria-label="Meny"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span style={{ transform: mobileOpen ? "rotate(45deg) translate(4px,5px)" : undefined }} />
          <span style={{ opacity: mobileOpen ? 0 : undefined }} />
          <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(4px,-5px)" : undefined }} />
        </button>
      </nav>

      {/* hero */}
      <section id="dv-hero">
        <div className="dv-hero-bg" ref={heroBgRef} />
        <div className="dv-hero-vignette" />
        <div className="dv-hero-line-l" />
        <div className="dv-hero-line-r" />
        <div className="dv-hero-content">
          <div className="dv-hero-eyebrow">Surdeg 48h &nbsp;&middot;&nbsp; Stockholm</div>
          <h1 className="dv-hero-title">
            <span className="line"><span className="line-inner">Deg</span></span>
            <span className="line"><span className="line-inner">&amp; Vin</span></span>
          </h1>
          <div className="dv-hero-rule" />
          <p className="dv-hero-sub">Pizza Contemporanea Italiana</p>
          <div className="dv-hero-actions">
            <a className="dv-btn dv-btn-gold dv-btn-lg"    href="https://degovin.orderyoyo.com/"   target="_blank" rel="noopener noreferrer">Beställ online</a>
            <a className="dv-btn dv-btn-outline dv-btn-lg" href="#dv-menu">Se menyn</a>
          </div>
        </div>
        <div className="dv-hero-scroll">
          <span>Scrolla</span>
          <div className="dv-scroll-arrow" />
        </div>
      </section>

      {/* marquee */}
      <div className="dv-marquee-wrap">
        <div className="dv-marquee-track" aria-hidden="true">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="dv-marquee-item">
              {item}<span className="dv-marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* menu */}
      <section id="dv-menu" className="dv-section">
        <div className="dv-menu-wrap">
          <div className="dv-menu-head dv-reveal">
            <div className="dv-section-label center">Vår meny</div>
            <h2 className="dv-section-title">Pizza Contemporanea</h2>
            <p className="dv-section-body" style={{ margin: "0 auto", textAlign: "center" }}>
              Surdeg 48h &middot; Italienska premiumvaror &middot; Stockholm
            </p>
          </div>

          <div className="dv-tab-bar" ref={tabBarRef}>
            <div className="dv-tab-border" />
            <div className="dv-tab-indicator" ref={indicatorRef} />
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`dv-menu-tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {TABS.map((tab) => (
            <div key={tab.key} className={`dv-menu-panel${activeTab === tab.key ? " active" : ""}`}>
              <div className="dv-menu-grid">
                {tab.items.map((item) => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
              {tab.extras && (
                <>
                  <p className="dv-extras-label">Extra</p>
                  <div className="dv-menu-grid">
                    {tab.extras.map((item) => (
                      <MenuItem key={item.name} {...item} tags={[]} />
                    ))}
                  </div>
                  <p className="dv-menu-note" style={{ marginTop: "2rem" }}>
                    Evo = Extra Vergine Olja &middot; IGP = Indicazione Geografica Protetta &middot; DOP = Denominazione di Origine Protetta<br/>
                    Bianca = Utan tomatsås &middot; Rossa = Med San Marzano-tomater
                  </p>
                </>
              )}
            </div>
          ))}

          <p className="dv-menu-note" style={{ marginTop: "3.5rem" }}>Grazia di cuore e buon appetito ♥</p>
        </div>
      </section>

      {/* hours */}
      <section id="dv-hours" className="dv-section">
        <div className="dv-hours-inner">
          <div className="dv-hours-head dv-reveal">
            <div className="dv-section-label center">Välkommen</div>
            <h2 className="dv-section-title">Öppettider</h2>
          </div>
          <div className="dv-hours-grid dv-reveal dv-reveal-d1">
            <div className="dv-hours-day">
              <div className="dv-hours-day-name">Måndag – Torsdag</div>
              <div className="dv-hours-time">kl. 11–21</div>
            </div>
            <div className="dv-hours-day">
              <div className="dv-hours-day-name">Fredag</div>
              <div className="dv-hours-time">kl. 11–22</div>
            </div>
            <div className="dv-hours-day">
              <div className="dv-hours-day-name">Lördag</div>
              <div className="dv-hours-time">kl. 12–22</div>
            </div>
            <div className="dv-hours-day">
              <div className="dv-hours-day-name">Söndag</div>
              <div className="dv-hours-time">kl. 12–21</div>
            </div>
          </div>
          <div className="dv-hours-lunch dv-reveal dv-reveal-d2">
            <div className="dv-hours-lunch-label">Dagligt erbjudande</div>
            <div className="dv-hours-lunch-title">Luncherbjudande — 159 kr</div>
            <div className="dv-hours-lunch-time">kl. 11–13</div>
            <p className="dv-hours-lunch-desc">
              Samtliga pizzor under 200 kr inkluderar läsk (ej San Pellegrino) och espresso!
            </p>
          </div>
        </div>
      </section>

      {/* about */}
      <section id="dv-about">
        <div className="dv-about-grid">
          <div className="dv-about-img-col dv-reveal">
            <img
              ref={aboutImgRef}
              src="/images/82cc8b71-861d-40fa-99e9-fbe42f36017f.jfif"
              alt="Deg & Vin ambiance"
              loading="lazy"
            />
            <div className="dv-about-img-overlay" />
            <div className="dv-about-badge dv-reveal dv-reveal-d2">
              <strong>48h</strong>
              <span>Surdeg<br/>Jäsning</span>
            </div>
          </div>
          <div className="dv-about-text-col">
            <div className="dv-section-label dv-reveal">Vår historia</div>
            <h2 className="dv-section-title dv-reveal dv-reveal-d1">Passione per la<br/>Qualità Italiana</h2>
            <div className="dv-gold-rule dv-reveal dv-reveal-d2" />
            <p className="dv-section-body dv-reveal dv-reveal-d2">
              Vi är ett pizzarestaurang i Stockholm med ett enkelt löfte: äkta napolitansk teknik
              möter de bästa italienska råvarorna. Vår deg jäser i 48 timmar, toppingarna kommer
              direkt från producenter med IGP- och DOP-certifieringar.
            </p>
            <blockquote className="dv-about-quote dv-reveal dv-reveal-d3">
              Från Prosciutto di Parma 24 månader till Parmigiano-Reggiano 40 månader — varje
              ingrediens är utvald med omsorg.
            </blockquote>
            <div className="dv-about-stats dv-reveal dv-reveal-d3">
              <div className="dv-stat"><div className="dv-stat-num">48h</div><div className="dv-stat-label">Surdegsjäsning</div></div>
              <div className="dv-stat"><div className="dv-stat-num">100%</div><div className="dv-stat-label">Italienska råvaror</div></div>
              <div className="dv-stat"><div className="dv-stat-num">DOP</div><div className="dv-stat-label">Certifierade produkter</div></div>
              <div className="dv-stat"><div className="dv-stat-num">IGP</div><div className="dv-stat-label">Skyddad ursprungsbeteckning</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section id="dv-gallery" className="dv-section">
        <div className="dv-gallery-inner">
          <div className="dv-gallery-head dv-reveal">
            <div className="dv-section-label">Galleri</div>
            <h2 className="dv-section-title">Upplev Deg &amp; Vin</h2>
          </div>
          <div className="dv-gallery-grid">
            <div className="dv-g-item large dv-clip-reveal">
              <img src="/images/f96e6614-0744-493d-9b21-acad6459e30f.jfif" alt="Deg & Vin ambiance" loading="lazy" />
              <div className="dv-g-overlay"><p className="dv-g-caption">Pizza Contemporanea Italiana</p></div>
            </div>
            <div className="dv-g-item dv-clip-reveal" style={{ transitionDelay: ".15s" }}>
              <img src="/images/82cc8b71-861d-40fa-99e9-fbe42f36017f.jfif" alt="Deg & Vin pizza" loading="lazy" />
              <div className="dv-g-overlay"><p className="dv-g-caption">Äkta råvaror, äkta smak</p></div>
            </div>
            <div className="dv-g-item dv-clip-reveal" style={{ transitionDelay: ".3s" }}>
              <img src="/images/8b888fef-c08e-4068-9f2e-25297a130055.jfif" alt="Deg & Vin interiör" loading="lazy" />
              <div className="dv-g-overlay"><p className="dv-g-caption">Surdeg 48 timmar</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* pillars */}
      <section id="dv-pillars" className="dv-section">
        <div className="dv-pillars-inner">
          <div className="dv-pillar dv-reveal">
            <div className="dv-pillar-num">48h</div>
            <div className="dv-pillar-line" />
            <div className="dv-pillar-title">Surdeg med tålamod</div>
            <p className="dv-pillar-desc">Vår deg jäser i 48 timmar för maximal smak, luftighet och lättsmälthet. Ingen genväg — bara passion.</p>
          </div>
          <div className="dv-pillar dv-reveal dv-reveal-d2">
            <div className="dv-pillar-num">DOP</div>
            <div className="dv-pillar-line" />
            <div className="dv-pillar-title">Äkta italienska råvaror</div>
            <p className="dv-pillar-desc">Prosciutto di Parma, Parmigiano-Reggiano, mozzarella di Bufala och San Marzano-tomater — direkt från producenten.</p>
          </div>
          <div className="dv-pillar dv-reveal dv-reveal-d4">
            <div className="dv-pillar-num">∞</div>
            <div className="dv-pillar-line" />
            <div className="dv-pillar-title">Contemporanea stil</div>
            <p className="dv-pillar-desc">Vi respekterar den napolitanska traditionen men är inte rädda för att innovera med moderna kombinationer.</p>
          </div>
        </div>
      </section>

      {/* book */}
      <section id="dv-book">
        <div className="dv-book-bg-text">Deg &amp; Vin</div>
        <div className="dv-book-inner dv-reveal">
          <div className="dv-section-label center">Boka &amp; Beställ</div>
          <h2 className="dv-section-title">
            Redo för<br/>
            <em style={{ fontStyle: "italic", color: "var(--dv-gold-lt)" }}>ett riktigt mål mat?</em>
          </h2>
          <div className="dv-gold-rule-center" />
          <p className="dv-section-body" style={{ margin: "0 auto", textAlign: "center", maxWidth: "500px" }}>
            Boka ett bord för en afton av äkta napolitansk pizza, eller beställ hem och upplev smakerna hemma.
          </p>
          <div className="dv-book-actions">
            <a className="dv-btn dv-btn-gold dv-btn-lg"    href="https://degovin.orderyoyo.com/"   target="_blank" rel="noopener noreferrer">Beställ online &rarr;</a>
            <a className="dv-btn dv-btn-outline dv-btn-lg" href="https://degovin.se/book-a-table/" target="_blank" rel="noopener noreferrer">Boka bord</a>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer id="dv-footer" className="dv-footer">
        <div className="dv-footer-inner">

          {/* hitta oss strip */}
          <div className="dv-footer-find">
            <div className="dv-footer-find-map">
              <iframe
                src="https://maps.google.com/maps?q=Sp%C3%A5ngav%C3%A4gen+309%2C+163+46+Bromma%2C+Sverige&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Deg & Vin på kartan"
              />
            </div>
            <div className="dv-footer-find-info">
              <div className="dv-footer-h">Hitta oss</div>
              <img src="/images/logo.webp" alt="Deg & Vin" className="dv-logo-img dv-logo-img--lg" />
              <div className="dv-footer-find-items">
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">Adress</span>
                  <a href="https://maps.google.com/maps?q=Sp%C3%A5ngav%C3%A4gen+309%2C+163+46+Bromma%2C+Sverige" target="_blank" rel="noopener noreferrer">
                    Spångavägen 309, 163 46 Bromma
                  </a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">Telefon</span>
                  <a href="tel:+46737221125">+46 73-722 11 25</a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">E-post</span>
                  <a href="mailto:info@degovin.se">info@degovin.se</a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">För grupper &amp; event</span>
                  <span className="dv-footer-find-note">Kontakta oss via e-post för gruppreservationer och event.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dv-footer-divider" />

          <div className="dv-footer-top">
            <div>
              <img src="/images/logo.webp" alt="Deg & Vin" className="dv-logo-img dv-logo-img--lg" />
              <p className="dv-footer-tagline">Pizza Contemporanea Italiana</p>
            </div>
            <div>
              <div className="dv-footer-h">Navigera</div>
              <ul className="dv-footer-links">
                <li><a href="#dv-menu">Meny</a></li>
                <li><a href="#dv-hours">Öppettider</a></li>
                <li><a href="#dv-about">Om oss</a></li>
                <li><a href="#dv-gallery">Galleri</a></li>
                <li><a href="#dv-book">Boka bord</a></li>
              </ul>
            </div>
            <div>
              <div className="dv-footer-h">Besök oss</div>
              <ul className="dv-footer-links">
                <li><a href="https://degovin.orderyoyo.com/"   target="_blank" rel="noopener noreferrer">Beställ online</a></li>
                <li><a href="https://degovin.se/book-a-table/" target="_blank" rel="noopener noreferrer">Boka bord</a></li>
                <li><a href="https://maps.google.com/maps?q=Sp%C3%A5ngav%C3%A4gen+309%2C+163+46+Bromma" target="_blank" rel="noopener noreferrer">Vägbeskrivning</a></li>
              </ul>
            </div>
          </div>
          <div className="dv-footer-bottom">
            <span>&copy; 2026 Deg &amp; Vin. Alla rättigheter förbehållna.</span>
            <span className="dv-footer-passion">Grazia di cuore e buon appetito ♥</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
