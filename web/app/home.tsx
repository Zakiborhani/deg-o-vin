"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomeContent, Wine } from "./home-content";

const TAG_LABELS: Record<string, string> = { new: "Nyhet", veg: "Veg", bianca: "Bianca", rossa: "Röd" };
const TAG_CLASSES: Record<string, string> = {
  new: "dv-tag dv-tag-new",
  veg: "dv-tag dv-tag-veg",
  bianca: "dv-tag dv-tag-bianca",
  rossa: "dv-tag dv-tag-rossa",
};

function WineItem({ name, producer, origin, grapes, vintage, notes, abv, special }: Wine) {
  return (
    <div className="dv-menu-item dv-wine-item">
      <div className="dv-menu-item-top">
        <span className="dv-menu-item-name">{name}</span>
        <span className="dv-menu-item-price">{abv}</span>
      </div>
      <div className="dv-wine-meta">{producer} &middot; {origin}{vintage ? ` · ${vintage}` : ""}</div>
      <div className="dv-wine-grapes">{grapes}</div>
      {notes && <p className="dv-menu-item-desc">{notes}</p>}
      {special && <p className="dv-wine-special">{special}</p>}
    </div>
  );
}

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

export default function Home({ content }: { content: HomeContent }) {
  const { tabs, wineGroups, links, contact } = content;

  const [scrolled,    setScrolled]   = useState(false);
  const [loaded,      setLoaded]     = useState(false);
  const [activeTab,     setActiveTab]     = useState("antipasti");
  const [wineFilter,    setWineFilter]    = useState("all");
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [tabsScrolled,  setTabsScrolled]  = useState(false);

  const heroBgRef    = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const aboutImgRef  = useRef<HTMLImageElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const ringRef      = useRef<HTMLDivElement>(null);
  const tabBarRef    = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const filmFillRef  = useRef<HTMLDivElement>(null);

  /* hero video — fetched only after the page has loaded, so it never competes
     with the still, fonts and scripts for bandwidth; skipped under Save-Data */
  useEffect(() => {
    const start = () => {
      setLoaded(true);
      const video = heroVideoRef.current;
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (!video || conn?.saveData) return;
      video.src = "/videos/dov-hero.mp4";
      video.play().catch(() => {});
    };
    if (document.readyState === "complete") { start(); return; }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
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
        heroBgRef.current.style.setProperty("--dv-hero-ty", `${window.scrollY * 0.28}px`);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* custom cursor */
  useEffect(() => {
    // Touch devices hide the cursor in CSS; don't run a per-frame loop for nothing.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);
    let rafId: number;
    // transform instead of left/top: compositor-only, no layout per frame
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
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

  /* dismiss the "scroll for more" hint once the user has actually scrolled the tab bar */
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const onScroll = () => {
      if (bar.scrollLeft > 4) setTabsScrolled(true);
    };
    bar.addEventListener("scroll", onScroll, { passive: true });
    return () => bar.removeEventListener("scroll", onScroll);
  }, []);

  /* filmstrip: gold reel-progress line + let the vertical wheel drive horizontal scroll */
  useEffect(() => {
    const strip = filmstripRef.current;
    const fill  = filmFillRef.current;
    if (!strip || !fill) return;
    const onScroll = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      const pct = max > 0 ? (strip.scrollLeft / max) * 100 : 0;
      fill.style.width = pct + "%";
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      const next = strip.scrollLeft + e.deltaY;
      if (next < 0 || next > max) return; // let the page take over once the strip hits an edge
      strip.scrollLeft = next;
      e.preventDefault();
    };
    onScroll();
    strip.addEventListener("scroll", onScroll, { passive: true });
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      strip.removeEventListener("scroll", onScroll);
      strip.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      className="dv-root"
      style={{
        background: "var(--dv-bg)",
        color: "var(--dv-text)",
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* cursor */}
      <div id="dv-cur-dot"  ref={dotRef}  />
      <div id="dv-cur-ring" ref={ringRef} />

      {/* nav */}
      <nav className={`dv-nav${scrolled ? " scrolled" : ""}`}>
        <a className="dv-nav-logo" href="#dv-hero">
          <Image src="/images/logo.webp" alt="Deg ø Vin" className="dv-logo-img" width={36} height={40} priority />
        </a>
        <ul id="dv-nav-links" className={`dv-nav-links${mobileOpen ? " mobile-open" : ""}`}>
          <li><a href="#dv-menu"    onClick={() => setMobileOpen(false)}>Meny</a></li>
          <li><a href="#dv-hours"   onClick={() => setMobileOpen(false)}>Öppettider</a></li>
          <li><a href="#dv-footer"  onClick={() => setMobileOpen(false)}>Hitta oss</a></li>
          <li><a href="#dv-about"   onClick={() => setMobileOpen(false)}>Om oss</a></li>
          <li><a href="#dv-gallery" onClick={() => setMobileOpen(false)}>Galleri</a></li>
          {/* Same-tab and no menu close: on iOS a new-tab link whose menu re-renders mid-tap often never opens */}
          <li><a href={links.booking} rel="noopener noreferrer">Boka bord</a></li>
        </ul>
        <div className="dv-nav-btns">
          <a className="dv-btn dv-btn-outline" href={links.booking} target="_blank" rel="noopener noreferrer">Boka bord</a>
          <a className="dv-btn dv-btn-gold"    href={links.order}   target="_blank" rel="noopener noreferrer">Beställ online</a>
        </div>
        <button
          className="dv-hamburger"
          aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={mobileOpen}
          aria-controls="dv-nav-links"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span style={{ transform: mobileOpen ? "rotate(45deg) translate(4px,5px)" : undefined }} />
          <span style={{ opacity: mobileOpen ? 0 : undefined }} />
          <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(4px,-5px)" : undefined }} />
        </button>
      </nav>

      {/* hero */}
      <section id="dv-hero">
        {/* The still is a real <img> so it counts as the LCP element and gets a
            responsive, high-priority fetch; the video covers it once it plays. */}
        <div className="dv-hero-bg" ref={heroBgRef}>
          <div className="dv-hero-zoom">
            <Image src="/images/dov-hero-poster.webp" alt="" fill priority sizes="120vw" style={{ objectFit: "cover" }} />
            <video
              className="dv-hero-video"
              ref={heroVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
          </div>
        </div>
        <div className="dv-hero-vignette" />
        <div className="dv-hero-line-l" />
        <div className="dv-hero-line-r" />
        <div className="dv-hero-content">
          <div className="dv-hero-eyebrow">{content.heroEyebrow}</div>
          <h1 className="dv-hero-title">
            <span className="line"><span className="line-inner">Deg</span></span>
            <span className="line"><span className="line-inner"><span aria-hidden="true">ø</span><span className="sr-only">&amp;</span> Vin</span></span>
          </h1>
          <div className="dv-hero-rule" />
          <p className="dv-hero-sub">{content.heroSub}</p>
          <div className="dv-hero-actions">
            <a className="dv-btn dv-btn-gold dv-btn-lg"    href={links.order}   target="_blank" rel="noopener noreferrer">Beställ online</a>
            <a className="dv-btn dv-btn-outline dv-btn-lg" href={links.booking} target="_blank" rel="noopener noreferrer">Boka bord</a>
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
          {[...content.marquee, ...content.marquee].map((item, i) => (
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

          <div className="dv-tab-bar-outer">
            <div className="dv-tab-bar" ref={tabBarRef}>
              <div className="dv-tab-border" />
              <div className="dv-tab-indicator" ref={indicatorRef} />
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`dv-menu-tab${activeTab === tab.key ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {!tabsScrolled && (
              <div className="dv-tab-scroll-hint" aria-hidden="true">
                <span className="dv-tab-scroll-chevron">›</span>
              </div>
            )}
          </div>

          {tabs.map((tab) => (
            <div key={tab.key} className={`dv-menu-panel${activeTab === tab.key ? " active" : ""}`}>
              {tab.key === "vin" ? (
                <>
                  <div className="dv-wine-filters">
                    <button
                      className={`dv-wine-filter-chip${wineFilter === "all" ? " active" : ""}`}
                      onClick={() => setWineFilter("all")}
                    >
                      Alla
                    </button>
                    {wineGroups.map((group) => (
                      <button
                        key={group.key}
                        className={`dv-wine-filter-chip${wineFilter === group.key ? " active" : ""}`}
                        onClick={() => setWineFilter(group.key)}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>
                  {wineGroups.filter((group) => wineFilter === "all" || wineFilter === group.key).map((group) => (
                    <div key={group.key}>
                      <p className="dv-extras-label">{group.label}</p>
                      <div className="dv-menu-grid">
                        {group.items.map((wine) => (
                          <WineItem key={wine.id} {...wine} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {content.wineNote && (
                    <p className="dv-menu-note" style={{ marginTop: "2rem" }}>
                      {content.wineNote}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="dv-menu-grid">
                    {tab.items.map((item) => (
                      <MenuItem key={item.id} {...item} />
                    ))}
                  </div>
                  {tab.extras && (
                    <>
                      <p className="dv-extras-label">Extra</p>
                      <div className="dv-menu-grid">
                        {tab.extras.map((item) => (
                          <MenuItem key={item.id} {...item} tags={[]} />
                        ))}
                      </div>
                      <p className="dv-menu-note" style={{ marginTop: "2rem" }}>
                        Evo = Extra Vergine Olja &middot; IGP = Indicazione Geografica Protetta &middot; DOP = Denominazione di Origine Protetta<br/>
                        Bianca = Utan tomatsås &middot; Rossa = Med San Marzano-tomater
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          ))}

          <p className="dv-menu-note" style={{ marginTop: "3.5rem" }}>Grazie di cuore e buon appetito ♥</p>
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
            {content.hours.map((h) => (
              <div key={h.key} className="dv-hours-day">
                <div className="dv-hours-day-name">{h.days}</div>
                <div className="dv-hours-time">{h.time}</div>
              </div>
            ))}
          </div>
          {content.lunch.text && (
            <div className="dv-hours-lunch dv-reveal dv-reveal-d2">
              <div className="dv-hours-lunch-label">Dagligt erbjudande</div>
              <div className="dv-hours-lunch-title">{content.lunch.title}</div>
              <div className="dv-hours-lunch-time">{content.lunch.time}</div>
              <p className="dv-hours-lunch-desc">
                {content.lunch.text}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* about */}
      <section id="dv-about">
        <div className="dv-about-grid">
          <div className="dv-about-img-col dv-reveal">
            <Image
              ref={aboutImgRef}
              src="/images/about-ambiance.jpg"
              alt="Matsalen på Deg ø Vin i Bromma"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
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
            {content.aboutText.map((p, i) => (
              <p key={i} className="dv-section-body dv-reveal dv-reveal-d2">{p}</p>
            ))}
            {content.aboutQuote && (
              <blockquote className="dv-about-quote dv-reveal dv-reveal-d3">
                {content.aboutQuote}
              </blockquote>
            )}
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
            <h2 className="dv-section-title">Upplev Deg ø Vin</h2>
          </div>
          <div className="dv-filmstrip-wrap">
            <div className="dv-filmstrip" ref={filmstripRef} role="region" aria-label="Bildgalleri" tabIndex={0}>
              {content.gallery.map((item, i) => (
                <div key={item.key} className="dv-g-item dv-clip-reveal" style={{ aspectRatio: item.ratio, transitionDelay: `${i * .08}s` }}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 860px) 70vw, 34vw"
                    style={{ objectPosition: item.position }}
                  />
                  <div className="dv-g-overlay"><p className="dv-g-caption">{item.caption}</p></div>
                </div>
              ))}
            </div>
            <div className="dv-filmstrip-fade" aria-hidden="true" />
            <div className="dv-filmstrip-track">
              <div className="dv-filmstrip-fill" ref={filmFillRef} />
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
            <p className="dv-pillar-desc">Vår deg jäser i 48 timmar för maximal smak, luftighet och lättsmälthet. Ingen genväg, bara passion.</p>
          </div>
          <div className="dv-pillar dv-reveal dv-reveal-d2">
            <div className="dv-pillar-num">DOP</div>
            <div className="dv-pillar-line" />
            <div className="dv-pillar-title">Äkta italienska råvaror</div>
            <p className="dv-pillar-desc">Prosciutto di Parma, Parmigiano-Reggiano, mozzarella di Bufala och San Marzano-tomater, direkt från producenten.</p>
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
        <div className="dv-book-bg-text">Deg ø Vin</div>
        <div className="dv-book-inner dv-reveal">
          <div className="dv-section-label center">Boka &amp; Beställ</div>
          <h2 className="dv-section-title">
            Redo för<br/>
            <em style={{ fontStyle: "italic", color: "var(--dv-gold-lt)" }}>ett riktigt mål mat?</em>
          </h2>
          <div className="dv-gold-rule-center" />
          <p className="dv-section-body" style={{ margin: "0 auto", textAlign: "center", maxWidth: "500px" }}>
            {content.bookText}
          </p>
          <div className="dv-book-actions">
            <a className="dv-btn dv-btn-gold dv-btn-lg"    href={links.order}   target="_blank" rel="noopener noreferrer">Beställ online &rarr;</a>
            <a className="dv-btn dv-btn-outline dv-btn-lg" href={links.booking} target="_blank" rel="noopener noreferrer">Boka bord</a>
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
                src={contact.mapsEmbedUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Deg ø Vin på kartan"
              />
            </div>
            <div className="dv-footer-find-info">
              <div className="dv-footer-h">Hitta oss</div>
              <Image src="/images/logo.webp" alt="Deg ø Vin" className="dv-logo-img dv-logo-img--lg" width={57} height={64} />
              <div className="dv-footer-find-items">
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">Adress</span>
                  <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {contact.address}
                  </a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">Telefon</span>
                  <a href={contact.tel}>{contact.phone}</a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">E-post</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="dv-footer-find-item">
                  <span className="dv-footer-find-label">För grupper &amp; event</span>
                  <span className="dv-footer-find-note">{contact.groups}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dv-footer-divider" />

          <div className="dv-footer-top">
            <div>
              <Image src="/images/logo-full.webp" alt="Deg ø Vin" className="dv-logo-img dv-logo-img--full" width={102} height={128} />
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
                <li><a href={links.order}   target="_blank" rel="noopener noreferrer">Beställ online</a></li>
                <li><a href={links.booking} target="_blank" rel="noopener noreferrer">Boka bord</a></li>
                <li><a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">Vägbeskrivning</a></li>
              </ul>
            </div>
          </div>
          <div className="dv-footer-bottom">
            <span>&copy; 2026 Deg ø Vin. Alla rättigheter förbehållna.</span>
            <span className="dv-footer-legal"><Link href="/integritetspolicy">Integritetspolicy</Link></span>
            <span className="dv-footer-passion">Grazie di cuore e buon appetito ♥</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
