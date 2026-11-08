# sitau5d.nl

One-page website van Sitau5D (Michel Arents). Statische HTML/CSS/JS, gehost op Netlify. Geen build-stap.

## Structuur

```
public/                 ← Netlify publish-map (wordt 1-op-1 online gezet)
  index.html            one-page site
  bedankt/index.html    na verzenden van het formulier (noindex)
  privacy/index.html    privacyverklaring
  404.html              Netlify gebruikt deze automatisch
  css/site.css          alle stijlen (tokens bovenaan; tablet ≤1100 px, mobiel ≤760 px)
  js/site.js            mobiel menu, inlaadanimatie, parallax
  fonts/                Archivo (variabel) + IBM Plex Mono, zelf gehost
  img/                  afbeeldingen, favicons, og.jpg (social preview)
  img/prive/            portretten van Michel: niet geïndexeerd (robots.txt + X-Robots-Tag)
  _headers              Netlify headers (noindex portretten, CSP, beveiliging, cache fonts)
  robots.txt, sitemap.xml, site.webmanifest
netlify.toml            publish = "public"
docs/                   originele handoff en ontwerpbestanden (niet gepubliceerd)
tools/og/og.html        bron van public/img/og.jpg
```

## Lokaal bekijken

```sh
python3 -m http.server 8000 -d public
# open http://localhost:8000
```

(`_headers`, redirects en het formulier werken alleen op Netlify, of lokaal met `netlify dev`.)

## Deploy (Netlify)

1. Nieuwe site koppelen aan deze repo. Build command leeg laten, publish directory `public` (staat ook in `netlify.toml`).
2. **Forms**: zet onder *Site configuration → Forms* formulierdetectie aan. Het formulier `contact` wordt bij de eerste deploy gevonden.
3. Onder *Forms → Form notifications*: e-mailmelding naar **info@sitau5d.nl**.
4. Domein `sitau5d.nl` koppelen (canonical, sitemap en og-tags gaan uit van `https://sitau5d.nl/` zonder www).

## Let op bij wijzigingen

- **Inline script en CSP**: in elke `<head>` staat één inline regel (`document.documentElement.className='js'`). De `Content-Security-Policy` in `public/_headers` staat die toe via de sha256-hash. Pas je die regel aan, bereken dan de hash opnieuw:
  ```sh
  printf "%s" "document.documentElement.className='js'" | openssl dgst -sha256 -binary | base64
  ```
  De CSP staat geen inline `style="…"` toe: gebruik klassen in `site.css`.
- **Header en footer** staan in alle vier de HTML-bestanden; wijzig ze overal.
- **Portretten** horen in `public/img/prive/`, met neutrale bestandsnamen. Gebruik ze nooit als `og:image` of in JSON-LD.
- **Social preview** opnieuw maken: serveer de repo-root (`python3 -m http.server 8766`), en
  ```sh
  google-chrome --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=3000 \
    --screenshot=og.png http://localhost:8766/tools/og/og.html
  ```
  en sla op als `public/img/og.jpg` (1200×630, JPEG ±85 %).

## Animaties

- Parallax: elementen met `data-t="groep.naam"` krijgen een transform uit `calc()` in `site.js` (zelfde formules als het ontwerp). Op mobiel gedempt; werkwijze-foto's staan daar stil.
- Inlaadanimatie: blokken in elke sectie behalve de hero (IntersectionObserver); `[data-rv-group]` = rijen één voor één.
- `prefers-reduced-motion`: geen parallax, geen reveal, geen smooth scroll; de collage toont de rustpositie.
- Zonder JavaScript is alles zichtbaar en staat het mobiele menu open.
