# Handoff: nieuwe website sitau5d.nl

Brief voor Claude Code. Bouw de nieuwe one-page website van Sitau5D (consultancy van Michel Arents) na uit het goedgekeurde ontwerp, als statische site op Netlify. Taal van de site: Nederlands.

## Wat er in deze map zit

| Pad | Wat |
|---|---|
| `ontwerp/desktop.dc.html` | Het ontwerp op 1440 px. **Bron van waarheid** voor alle teksten, volgorde, kleuren, maten en animaties. |
| `ontwerp/mobiel.dc.html` | Hetzelfde bestand als desktop (alleen titel en previewmaat verschillen). De mobiele regels staan in het blok `@container site (max-width: 760px)`. |
| `assets/img/` | Alle afbeeldingen uit het ontwerp, bijgesneden en geoptimaliseerd (webp, ±2× de weergavemaat, samen ±650 KB). Niet opnieuw comprimeren; wel mag je met `srcset` een kleinere variant voor mobiel toevoegen. `portret-hoofd` en `portret-deksel` zijn bewust even groot (1000×1000, transparant) zodat ze precies op elkaar vallen: niet los bijsnijden. |
| `assets/img/prive/` | Portretten van Michel. Mogen **niet geïndexeerd** worden, zie hieronder. |
| `assets/favicon/` | Favicon (swirl zonder tekst): `.ico` (16/32/48) en PNG 16/32/180/512. |

Live ontwerp (canvas, alleen voor de eigenaar): https://claude.ai/artifact/BLxAm2PVLkhwUz5oJAsWhB

### Over het ontwerpformaat (`.dc.html`)
Het ontwerp is gemaakt in een design-canvas met een eigen templatetaal. Neem de HTML/CSS over, maar vertaal deze constructies:
- `<x-dc>`, `<helmet>`: wrapper; de inhoud van `<helmet>` hoort in `<head>`.
- `{{naam}}`: waarde uit `renderVals()` / `calc()` in de `class Component extends DCLogic` onderaan. Vooral `transform: {{g.zon}}` e.d. voor parallax.
- `<sc-for list="..." as="r">`: lus over data (bijv. de rijen van Recent werk). Schrijf de rijen uit als gewone HTML.
- `<sc-if value="...">`: voorwaardelijk tonen (hamburger/kruis-icoon van het mobiele menu).
- `support.js` en `DCLogic` zijn van de canvas-omgeving; niet meenemen. Herschrijf de logica als klein vanilla-JS-bestand.

## Stack

- Statische HTML + CSS + een klein vanilla-JS-bestand. Geen framework nodig. (Een eenvoudige generator zoals Eleventy of Astro mag, als het de output statisch houdt.)
- Hosting: **Netlify**. Formulier via **Netlify Forms**.
- Pagina's: `/` (one-page), `/bedankt/` (na formulier), `/privacy/` (privacyverklaring).

## Huisstijl

- Fonts: **Archivo** (variabel, wdth 75–100, wght 400–900) voor alles; **IBM Plex Mono** 400/500 voor labels, nummers en menu (`.mono`). In het ontwerp via Google Fonts; **zelf hosten** in productie (woff2, `font-display: swap`).
- Kleuren:
  - Inkt `#17121F` (tekst, lijnen), crème `#EFEAE1` (achtergrond), wit `#FFFFFF`
  - Paars: `#2A1B45` (aubergine), `#5B2D91`, `#844599` (accent, hover, focus), `#C9A6DB`, `#C9B3EA`, `#E4DAF2` (lila vlak), `#ECE7F3`
  - Ruitpapier `.ruit` op `#F6F3EE`; korrel-overlay `.korrel` (`korrel.png`, multiply).
- Basis: 17px / 1,55. Koppen Archivo extra vet, uppercase.
- Grid desktop: 12 kolommen, container 1200 px, gutter 24 px, zijmarge 24 px.
- Grid mobiel: 4 kolommen, gutter 16 px, marge 24 px.
- Geen harde schaduwen op vaste blokken (formulier e.d.). Alleen het losse citaatblok heeft een schaduw.

## Secties (in volgorde, ids zijn ankers voor het menu)

1. **Header/nav**: logo links; menu 01 Diensten, 02 Werk, 03 Werkwijze, 04 Over, knop Contact →. Mobiel: knop "Menu ☰" / "Sluiten ✕" die het menu animerend openklapt (zie `.m-menu`, `.m-knop`).
2. `#top` **Hero**: poster met kop "Van finance naar data." over een lila vlak, paarse zon, ring, halve cirkel, stippenraster, diagonale lijn, sterretjes, en Michel (`prive/portret-hero.webp`) voor de zon. Alles met scroll-parallax. Geen inlaadanimatie op de hero.
3. `#statement`: intro + twee kaders (Inzet / Werkplek).
4. `#diensten`: vier diensten met nummers 01–04.
5. `#werk`: tabel Recent werk (Periode / Opdrachtgever / Rol / Wat), rijen schuiven één voor één in. Daarna "Gewerkt voor": klantnamen als typografie (volgorde zoals in het ontwerp aanhouden).
6. `#werkwijze`: People / Process / Systems met foto's (boomverzorger, uurwerk, …) die los parallax bewegen.
7. `#over`: "De brug tussen business en data" + collage `#collage` waarin het hoofd openklapt en een mini-Michel eruit komt, met de Fuji (`prive/portret-hoofd.webp`, `prive/portret-deksel.webp`, `prive/portret-mini.webp`, `fuji.webp`, `berg-voorgrond.webp`).
8. `#citaat`: Sun Tzu-citaat op de zentuinfoto (`zentuin-band.webp`, `.spinband`).
9. `#contact`: "Zullen we kennismaken?" + formulier.
10. **Footer**: 4 gelijke kolommen: © 2026 Sitau5D · KVK 63547473 · Btw NL001604146B45 · Website door Codulo ↗ (link https://codulo.nl).

Alle teksten letterlijk uit `ontwerp/desktop.dc.html` overnemen.

## Responsief

- Het ontwerp gebruikt `@container site (max-width: 760px)` met `cqw`-eenheden zodat het in de canvas werkte. In productie mag dit `@media (max-width: 760px)` met `vw` worden; het resultaat moet gelijk zijn aan `mobiel.dc.html`.
- De `m-*`-klassen zijn de mobiele overrides. Neem ze over, liefst opgeschoond (minder `!important`).
- Op mobiel verborgen: Gewerkt voor-driehoek (`.m-weg`), stippenvlak bij Diensten, enkele losse vormen (`v.st2`, `v.co2`, `w.ster`).
- **Niet getest: tablet 760–1100 px.** Controleer en los dit netjes op.

## Animaties

- **Parallax**: elementen met `data-t="groep.naam"` krijgen een `transform` uit `calc()`. De voortgang per sectie komt uit `prog(id)` (0 = sectie komt onder in beeld, 1 = sectie verlaat de bovenkant). Schrijf transforms direct naar de DOM in `requestAnimationFrame`, niet via re-render. Op mobiel gedempt (`smal()`: werkwijze ×0,35, hero ×0,5; werkwijze-foto's helemaal zonder transform).
- **Hero-collage in #over**: deksel opent eerst, daarna komt mini-Michel omhoog (`lid`/`up` in `calc()`).
- **Inlaadanimatie**: blokken in elke sectie behalve de hero faden + schuiven 48 px omhoog als ze in beeld komen (IntersectionObserver, `setupReveal()`); kinderen krijgen een oplopende vertraging; `[data-rv-group]` = rijen één voor één.
- **Menu-links**: vloeiend scrollen naar de sectie; mobiel menu sluit bij klik.
- Respecteer `prefers-reduced-motion`: geen parallax, geen reveal, geen smooth scroll.

## Contactformulier (Netlify Forms)

- Staat al in het ontwerp: `<form name="contact" method="POST" action="/bedankt/" data-netlify="true" netlify-honeypot="bot-field">`. Houd de veldnamen zo.
- Maak `/bedankt/` in dezelfde stijl (korte bevestiging + link terug naar home).
- Ontvanger: info@sitau5d.nl (in te stellen in Netlify).

## Portretfoto's van Michel niet indexeren (vereist)

Alle foto's waarop Michel staat, staan in `assets/img/prive/`. Die mogen niet in zoekmachines (Google Afbeeldingen e.d.) terechtkomen.

1. Publiceer ze onder `/img/prive/` en houd de bestandsnamen neutraal (geen naam van Michel in bestandsnaam).
2. `robots.txt`:
   ```
   User-agent: *
   Disallow: /img/prive/
   ```
   (Dit is de manier die Google aanraadt om afbeeldingen uit Google Afbeeldingen te houden.)
3. Netlify `_headers`, als extra laag:
   ```
   /img/prive/*
     X-Robots-Tag: noindex, noimageindex
   ```
4. Gebruik een portret **niet** als `og:image`/`twitter:image` en niet in JSON-LD (`Person.image`). Neem voor de social-preview een merkafbeelding (logo/paars vlak).
5. Laat beschrijvende `alt`-teksten staan (toegankelijkheid).

Goed om te weten: dit houdt nette zoekmachines tegen, maar niemand die de pagina bezoekt en een screenshot maakt.

## Verder nog te doen

- **Privacyverklaring** `/privacy/` (AVG: welke gegevens het formulier verzamelt, waarvoor, bewaartermijn, Netlify als verwerker). Link in footer en bij het formulier.
- **Meta**: `<title>`, description, `lang="nl"`, canonical, Open Graph/Twitter (zonder portret), favicon-links + `apple-touch-icon` (favicon-180.png).
- **Fonts zelf hosten**, afbeeldingen met `width`/`height`, `loading="lazy"` onder de vouw, hero-afbeelding met `fetchpriority="high"`.
- Toegankelijkheid: focusstijl staat in het ontwerp (3px `#844599`), menu-knop met `aria-expanded`/`aria-controls`, contrast checken op paarse vlakken.
- Lighthouse ≥ 90 op alle vier de scores, mobiel en desktop.

## Inhoudsregels

- Teksten beginnen altijd met een hoofdletter.
- **Geen** adres en **geen** telefoonnummer van Michel op de site. Contact alleen via formulier, info@sitau5d.nl en LinkedIn (https://www.linkedin.com/in/michelarents/).
- Liever algemene, tijdloze info dan details die steeds bijgewerkt moeten worden (geen beschikbaarheidsdatum of uren per week).
- De oude stappentabel (Shrine/Tsjoen/Tiger/Dog/Horse/Chi) komt niet terug.

## Open punten (niet zelf invullen, wel melden)

- Teksten en klantnamen nog laten controleren door Michel.
- Mocht er een SVG of hogere resolutie van het logo komen: favicon en logo daarmee vervangen.
