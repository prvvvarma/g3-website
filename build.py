"""Builds the G3 Technologies preview site (static HTML) from the final content.
Run: python3 build.py  (writes the .html files next to this script)"""
import html, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
YEAR = 2026
import time
VERSION = time.strftime('%Y%m%d%H%M')

def ph(s):
    """Render [bracketed] placeholders as visible pending items."""
    return re.sub(r'\[([^\]]+)\]', lambda m: f'<span class="ph">[{m.group(1)}]</span>', s)

SERVICES = [
    ('ai.html', 'AI', 'AI that works inside your business.'),
    ('blockchain.html', 'Blockchain', 'Records no one can argue with.'),
    ('iot.html', 'IoT', "Know what's happening at every site."),
    ('cloud-security.html', 'Cloud &amp; Security', 'Systems that stay up and stay safe.'),
]

def head(title, desc, page):
    t = 'G3 Technologies' if page == 'index.html' else f'{title} · G3 Technologies'
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/img/og.jpg">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/schibsted-grotesk-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/site.css?v={VERSION}">
<script src="assets/site.js?v={VERSION}" defer></script>
<script src="assets/rings.js?v={VERSION}" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''

def header(page):
    svc_current = page in [s[0] for s in SERVICES]
    sub = ''.join(f'<a href="{h}"{" aria-current=\"page\"" if h == page else ""}>{n}</a>' for h, n, _ in SERVICES)
    def cur(h):
        return ' aria-current="page"' if h == page else ''
    return f'''<header class="header">
  <div class="wrap">
    <a class="brand" href="./" aria-label="G3 Technologies, home"><img src="assets/img/g3-mark.svg" alt="" width="34" height="34">G3 Technologies</a>
    <nav class="nav" aria-label="Main">
      <div class="nav-services{' is-current' if svc_current else ''}">
        <button type="button" aria-expanded="false" aria-haspopup="true">Services</button>
        <div class="submenu">{sub}</div>
      </div>
      <a href="products.html"{cur('products.html')}>Products</a>
      <a href="about.html"{cur('about.html')}>About</a>
      <a href="careers.html"{cur('careers.html')}>Careers</a>
      <a class="btn btn--primary btn--sm" href="contact.html">Book a call</a>
    </nav>
    <a class="btn btn--primary btn--sm" href="contact.html">Book a call</a>
    <button class="menu-btn" type="button" aria-expanded="false">Menu</button>
  </div>
</header>
<main id="main">
'''

BAND = '''<section class="band" aria-labelledby="band-h">
  <img class="band__rings" src="assets/img/rings.jpg" alt="" aria-hidden="true" loading="lazy">
  <div class="wrap">
    <div><span class="label">The end result</span><h2 id="band-h" class="display-l">Your tech team, without the hiring.</h2></div>
    <a class="btn btn--inverse" href="contact.html">Book a call<span class="dot" aria-hidden="true"></span></a>
  </div>
</section>
'''

def footer():
    svc = ''.join(f'<a href="{h}">{n}</a>' for h, n, _ in SERVICES)
    return f'''</main>
<footer class="footer">
  <div class="wrap grid">
    <div class="footer__brand"><img src="assets/img/g3-mark.svg" alt="" width="48" height="48"><span class="title">G3 Technologies</span><span class="muted">AI, blockchain and IoT, built and run for your business.</span></div>
    <nav class="footer__col" aria-label="Services"><span class="label">Services</span>{svc}</nav>
    <nav class="footer__col" aria-label="Company"><span class="label">Company</span><a href="products.html">Products</a><a href="about.html">About</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></nav>
    <div class="footer__addr"><span class="label">Dubai</span><span>PO Box 40056, Al Quoz Industrial Area 4, Dubai, UAE</span><span><a href="mailto:hello@gggtech.io">hello@gggtech.io</a><br><a href="tel:+97140000000">+971 4 000 0000</a></span></div>
    <div class="footer__base"><span class="label">© {YEAR} G3 Technologies</span><span class="label">Preview · not yet public</span></div>
  </div>
</footer>
</body>
</html>
'''

def intro(num, heading, lead='', hid=None, level='h2'):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    idattr = f' id="{hid}"' if hid else ''
    return f'''<div class="intro grid rv">
      <span class="intro__num label">{num}</span>
      <div class="intro__body"><{level} class="heading"{idattr}>{heading}</{level}>{lead_html}</div>
    </div>'''

def actions(link_text=None, link_href=None):
    second = f'<a class="link" href="{link_href}">{link_text}</a>' if link_text else ''
    return f'<div class="actions"><a class="btn btn--primary" href="contact.html">Book a call<span class="dot" aria-hidden="true"></span></a>{second}</div>'

def plate(img, alt, left, right=''):
    return f'''<figure class="plate"><img src="assets/img/{img}" alt="{alt}" width="1200" height="1200"></figure>'''

def rings(alt, kind='rings', img='rings.jpg'):
    return f'''<div class="rings" data-rings="{kind}" title="Drag to turn"><img src="assets/img/{img}" alt="{alt}" width="1200" height="1200"></div>'''

KINDS = {'plate-ai.jpg': 'knot', 'plate-blockchain.jpg': 'chain', 'plate-iot.jpg': 'sensors', 'plate-cloud.jpg': 'layers'}


PRODUCTS = [
    ('rmn', 'Retail Media Network', 'In-store screens that earn.', 'Turn in-store screens into a measurable advertising channel, with proof of every play.'),
    ('companion', 'Companion', 'An AI assistant for every counter.', 'An AI assistant for any industry: a sales assistant in a supermarket, room service in a hotel, a waiter in a restaurant.'),
    ('marketing', 'Marketing Intelligence', 'Know which campaigns work.', 'See which campaigns work and where to spend next.'),
    ('voice', 'Voice Agents', 'AI that answers your calls.', 'AI that answers calls and resolves common requests.'),
]
PRODUCTS_SHORT = [(k, n, s) for k, n, s, l in PRODUCTS]
PRODUCTS_LONG = [(k, n, l) for k, n, s, l in PRODUCTS]
ALTS = {'rmn': 'A screen on a stand, engraved', 'companion': 'An orb with a ring around it, engraved', 'marketing': 'Rising bars, engraved', 'voice': 'Rings of sound, engraved'}

def cards(items, big=False):
    out = []
    for i, (key, name, line) in enumerate(items, 1):
        href = 'contact.html' if big else f'products.html#{key}'
        go = 'Ask about it →' if big else 'Learn more →'
        tag = 'h2' if big else 'h3'
        out.append(f'''<a class="card" id="{key if big else ''}" href="{href}"><div class="card__img"><img src="assets/img/product-{key}.jpg" alt="{ALTS[key]}" width="800" height="800" loading="lazy"></div><span class="label">0{i}</span><{tag} class="{'heading' if big else 'title'}">{name}</{tag}><p>{line}</p><span class="go">{go}</span></a>''')
    return f'<div class="cards{" cards--big" if big else ""}">' + ''.join(out) + '</div>'

LOGOS = ['<span class="logo"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg><b style="font-weight:600;letter-spacing:-0.03em;text-transform:lowercase">halcyon</b></span>','<span class="logo"><svg viewBox="0 0 28 24" aria-hidden="true"><path d="M2 21 9 5l7 16zM12 21l7-16 7 16z" fill="currentColor"/></svg><b style="font-family:var(--mono);font-weight:400;letter-spacing:0.18em;font-size:13px">MERIDIAN</b></span>','<span class="logo"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/></svg><b style="font-weight:500;letter-spacing:-0.02em;font-size:21px">Orbis</b></span>','<span class="logo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="3" fill="currentColor"/><rect x="2" y="11" width="14" height="3" fill="currentColor"/><rect x="2" y="17" width="8" height="3" fill="currentColor"/></svg><b style="font-weight:600;letter-spacing:0.08em;font-size:15px">SANDLINE</b></span>','<span class="logo"><b style="font-size:21px;letter-spacing:-0.02em"><i style="font-weight:400">Kestrel</i>&amp;Co.</b></span>','<span class="logo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="9" height="9" fill="currentColor"/><rect x="13" y="2" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="13" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="13" width="9" height="9" fill="currentColor"/></svg><b style="font-weight:500;font-size:19px">Quadra</b></span>']

CAPTIONS = ['thinks', 'proves', 'senses', 'holds it together']

def scrub_words(text):
    return ' '.join(f'<span class="w">{w}</span>' for w in text.replace('in-house', 'in\u2011house').split())

def scrub_intro(num, text, hid):
    return f'''<div class="intro grid">
      <span class="intro__num label">{num}</span>
      <div class="intro__body"><h2 class="display-l scrub" id="{hid}">{scrub_words(text)}</h2></div>
    </div>'''

def marquee(items, cls=''):
    track = ''.join(items)
    return f'<div class="marquee {cls}"><div class="marquee__track">{track}<span class="marquee__dup" aria-hidden="true">{track}</span></div></div>'

def index_list(items, uid):
    rows, first = [], items[0]
    for i, (t, d) in enumerate(items):
        rows.append(f'''<li><button class="ix__item{' is-on' if i == 0 else ''}" type="button" aria-expanded="false" aria-controls="{uid}-{i}" data-desc="{html.escape(d, quote=True)}" data-n="0{i + 1}"><span class="label">0{i + 1}</span><span class="title">{t}</span><span class="ix__arrow" aria-hidden="true">→</span></button><p class="ix__desc" id="{uid}-{i}">{ph(d)}</p></li>''')
    return f'''<div class="ix"><ol class="ix__list">{''.join(rows)}</ol><div class="ix__panel" aria-hidden="true"><span class="ix__num">01</span><p class="ix__text lead">{ph(first[1])}</p></div></div>'''


def services_strip(exclude=None, margin=True):
    cells = ''.join(
        f'<a class="service" href="{h}" data-ring="{i}" data-caption="{CAPTIONS[i]}"><span class="label">{n}</span><span class="title">{line}</span><span class="go">Explore {n} →</span></a>'
        for i, (h, n, line) in enumerate(SERVICES) if h != exclude)
    style = '' if margin else ' style="margin-top:0"'
    cls = 'services' + (' services--3' if exclude else '')
    cols = ' style="grid-template-columns:repeat(3,minmax(0,1fr))"' if exclude else style
    return f'<nav class="{cls}" aria-label="Services"{cols}>{cells}</nav>'

PLAN = '''<ol class="steps timeline">
        <li class="step"><span class="label" data-n="1">Step 1</span><span class="title">Book a call.</span><p>Tell us what you want to achieve.</p></li>
        <li class="step"><span class="label" data-n="2">Step 2</span><span class="title">Get a clear plan.</span><p>What to build, in what order, and what it takes.</p></li>
        <li class="step"><span class="label" data-n="3">Step 3</span><span class="title">We build and run it.</span><p>Or hand it to your team when you're ready.</p></li>
      </ol>'''

def write(name, body):
    with open(os.path.join(ROOT, name), 'w') as f:
        f.write(body)
    print('wrote', name)

# ---------------------------------------------------------------- Home
home = head('Home', "You don't need an AI team. You need AI that works. G3's consultants, architects and developers build and run AI, blockchain and IoT for your business.", 'index.html') + header('index.html') + f'''
<section class="hero" aria-labelledby="hero-h">
  <div class="wrap">
    <div class="grid">
      <div class="hero__text">
        <h1 id="hero-h" class="display-xl">You don't need an AI team. You need AI that <span class="u">works.</span></h1>
        <p class="lead">G3's consultants, architects and developers build and run AI, blockchain and IoT for your business.</p>
        {actions('See what we build', '#services')}
      </div>
      <div class="hero__plate">{rings('Three interlocked rings, engraved: AI, blockchain and IoT')}<p class="rings-caption" aria-live="polite"><span class="rc-k label">G3</span><span class="rc-v">Three disciplines, locked together.</span></p></div>
    </div>
    <div id="services">{services_strip()}</div>
  </div>
</section>

<section class="section problem" aria-labelledby="problem-h">
  <div class="wrap">
    <div class="intro grid">
      <span class="intro__num label">01 — The problem</span>
      <div class="intro__body"><h2 class="display-l scrub" id="problem-h"><span class="w">Building</span> <span class="w">an</span> <span class="w">AI</span> <span class="w">team</span> <span class="w">in‑house</span> <span class="w">is</span> <span class="w">slow,</span> <span class="w">expensive</span> <span class="w">and</span> <span class="w">hard</span> <span class="w">to</span> <span class="w">get</span> <span class="w">right.</span></h2></div>
    </div>
    <div class="grid"><div class="block"><p class="label pains-hint">Tap to flip · problem or fix</p><div class="pains">
      <button class="pain rv" type="button" aria-pressed="false"><span class="title"><span class="strike">Slow</span></span><span class="pain__lines"><span class="prob">Hiring the right people takes months.</span><span class="fix"><span class="label">G3</span> Our team is ready when you are.</span></span></button>
      <button class="pain rv" type="button" aria-pressed="false"><span class="title"><span class="strike">Expensive</span></span><span class="pain__lines"><span class="prob">Senior AI talent is scarce and costly.</span><span class="fix"><span class="label">G3</span> Pay for the skills you need, only when you need them.</span></span></button>
      <button class="pain rv" type="button" aria-pressed="false"><span class="title"><span class="strike">Hard to get right</span></span><span class="pain__lines"><span class="prob">Many projects stall between the demo and daily use.</span><span class="fix"><span class="label">G3</span> We build it, then run it with you.</span></span></button>
    </div>
    <p class="empathy heading rv">Good ideas stall without the right people. We've seen it, and we built G3 to fix it.<span class="dot" aria-hidden="true"></span></p>
    </div></div>
  </div>
</section>

<section class="section" aria-labelledby="proof-h">
  <div class="wrap">
    {intro('02 — Proof', 'Who we work with.', '', 'proof-h')}
    {marquee(LOGOS, "marquee--logos")}
    <div class="grid"><div class="block"><p class="label" style="margin-top:12px">Sample logos · to be replaced with G3's clients</p></div></div>
  </div>
</section>

<section class="section" aria-labelledby="products-h">
  <div class="wrap">
    {intro('03 — Products', 'Ready-made solutions, so you can start faster.', '', 'products-h')}
    <div class="grid"><div class="block rv">{cards(PRODUCTS_SHORT)}</div></div>
  </div>
</section>

<section class="section" aria-labelledby="plan-h">
  <div class="wrap">
    {intro('04 — How it works', 'Three steps. No hiring.', '', 'plan-h')}
    <div class="grid"><div class="block rv">{PLAN}</div></div>
  </div>
</section>

<section class="statement" aria-label="What changes">
  <div class="wrap"><span class="label">05 — What changes</span><p class="display-l scrub ba"><span class="w">From</span> <span class="w before">talking</span> <span class="w before">about</span> <span class="w before">AI</span> <span class="w">to</span> <span class="w after">using</span> <span class="w after">it</span> <span class="w after">every</span> <span class="w after">day.</span></p></div>
</section>
''' + BAND + footer()
write('index.html', home)

# ---------------------------------------------------------------- Service pages
def service_page(page, name, headline, subline, problem, groups, used, img, alt, fig, small='', what_h='What we do', used_h='Where it’s used'):
    caps_html = ''
    for gi, (gtitle, items) in enumerate(groups):
        gh = f'<h3 class="label" style="margin:{"0" if gi == 0 else "64px"} 0 16px">{gtitle}</h3>' if gtitle else ''
        caps_html += gh + index_list(items, f'ix{gi}')
    if small:
        caps_html += f'<p class="small"><em>{small}</em></p>'
    chips = ''.join(f'<span class="chip">{u}</span>' for u in used)
    used_html = ''
    n0 = 3
    if used:
        n0 = 4
        used_html = f'''<section class="section" aria-labelledby="used-h">
  <div class="wrap">
    {intro('03 — Used in', used_h, '', 'used-h')}
  </div>
  <div class="rv">{marquee([f'<span class="mq-word">{u}</span>' for u in used], 'marquee--words')}</div>
</section>
'''
    body = head(name.replace('&amp;', '&'), f'{headline} {subline}', page) + header(page) + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap">
    <div class="grid">
      <div class="hero__text">
        <span class="label">Services — {name}</span>
        <h1 id="hero-h" class="display-l">{headline}</h1>
        <p class="lead">{subline}</p>
        {actions()}
      </div>
      <div class="hero__plate">{rings(alt, KINDS[img], img)}</div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="problem-h">
  <div class="wrap">{scrub_intro('01 — The problem', problem, 'problem-h')}</div>
</section>

<section class="section" aria-labelledby="what-h">
  <div class="wrap">
    {intro('02 — What we do', what_h, '', 'what-h')}
    <div class="grid"><div class="block rv">{caps_html}</div></div>
  </div>
</section>

{used_html}
''' + BAND + footer()
    write(page, body)

service_page('ai.html', 'AI', 'AI that works inside your business, not just in a demo.',
    'Our consultants, data engineers and developers take AI from first idea to daily use.',
    'Many AI projects stall between the demo and daily use.',
    [(None, [
        ('AI strategy', 'Find where AI pays off and plan the roadmap.'),
        ('Assistants and agents', 'Answer questions and complete tasks across your tools.'),
        ('Search your own data', 'Answers from your documents, with access controls.'),
        ('Document automation', 'Read, sort and process documents automatically.'),
        ('Voice and chat AI', 'In Arabic and English.'),
        ('Data and machine learning', 'Pipelines, predictions and analytics.'),
        ('AI operations', 'Monitoring, cost control and governance.'),
    ])],
    ['Customer service', 'Operations', 'Finance', 'Sales and marketing', 'Government services'],
    'plate-ai.jpg', 'A knotted loop, engraved', 'Fig. 02 — AI',
    what_h='Seven ways we put AI to work.', used_h='Teams that use it most.')

service_page('blockchain.html', 'Blockchain', 'Records no one can argue with.',
    'Our architects and smart-contract developers build blockchain solutions that make records verifiable and payments automatic.',
    'When partners keep separate records, disputes and delays follow.',
    [(None, [
        ('Blockchain consulting', 'Where it genuinely helps, and which network to use.'),
        ('Smart contracts', 'Built, tested and independently audited before launch.'),
        ('Apps and wallets', 'Web and mobile apps on blockchain (dApps).'),
        ('Enterprise blockchain', 'Shared records, digital identity and verifiable credentials.'),
        ('Tokenisation', 'Digital ownership of real assets, with licensed custody and compliance partners.'),
    ])],
    ['Supply chain', 'Real estate', 'Finance', 'Advertising networks', 'Government'],
    'plate-blockchain.jpg', 'Three chain links, engraved', 'Fig. 03 — Blockchain',
    what_h='Only where it genuinely helps.', used_h='Industries where shared records matter.')

service_page('iot.html', 'IoT', "Know what's happening at every site, as it happens.",
    'We design and build connected solutions, from sensors to dashboards.',
    'Too many sites still run on guesswork and manual checks.',
    [(None, [
        ('IoT consulting', 'The right use cases, the business case and a pilot.'),
        ('Solution architecture', 'Device-to-cloud design and the right connectivity for each site.'),
        ('Device and edge engineering', 'Firmware, sensors, gateways and camera analytics.'),
        ('Platforms and apps', 'Real-time dashboards, alerts and mobile apps.'),
        ('Integration', 'Connect device data to ERP, building management and other systems.'),
        ('Security and support', 'Secure devices, updates and monitoring after go-live.'),
    ])],
    ['Buildings and facilities', 'Farms', 'Factories', 'Retail', 'Logistics', 'Energy and utilities'],
    'plate-iot.jpg', 'Sensors standing across a site, engraved', 'Fig. 04 — IoT',
    what_h='Sensors, software and support.', used_h='Sites we connect.')

service_page('cloud-security.html', 'Cloud &amp; Security', 'Systems that stay up and stay safe.',
    'Our infrastructure and security engineers build, protect and run the systems you depend on.',
    'One weak link can take everything offline.',
    [('Cloud and infrastructure', [
        ('Cloud and migration', 'Public, private and sovereign cloud, with your data kept where it must stay.'),
        ('Networks and data centres', 'Design, set-up and upgrades.'),
        ('AI infrastructure', 'GPU compute and private model hosting.'),
        ('DevOps', 'Fast, reliable software releases, fully automated.'),
        ('Managed services', 'Monitoring, support and cost control after go-live.'),
    ]), ('Security', [
        ('Security assessments', 'Risk reviews, vulnerability scanning and penetration testing.'),
        ('Security architecture', 'Secure design, and the right security tools deployed.'),
        ('Identity and data protection', 'Access control, encryption and leak prevention.'),
        ('AI security', "Testing that your AI can't be tricked or misused, plus guardrails."),
        ('Monitoring', 'Logging, audit trails and incident readiness.'),
    ])],
    [],
    'plate-cloud.jpg', 'Three stacked layers, engraved', 'Fig. 05 — Cloud &amp; Security',
    what_h='Build it, protect it, run it.',
    small='Penetration testing, certifications and formal compliance assessments depend on the accreditation and scope each engagement requires.')

# ---------------------------------------------------------------- Products
products = head('Products', 'Ready-made solutions, so you can start faster.', 'products.html') + header('products.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid"><div class="hero__text">
    <span class="label">Products</span>
    <h1 id="hero-h" class="display-l">Ready-made solutions, so you can start faster.</h1>
    {actions()}
  </div>
  <div class="hero__plate">{rings('A solid cube, engraved', 'cube')}</div></div></div>
</section>
<section class="section" aria-label="Products">
  <div class="wrap rv">{cards(PRODUCTS_LONG, big=True)}</div>
</section>
<section class="section" aria-labelledby="fit-h">
  <div class="wrap grid"><div class="block rv" style="grid-column: 1 / -1; margin-top: 0; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:32px">
    <h2 id="fit-h" class="heading">Not sure which fits?</h2>{actions()}
  </div></div>
</section>
''' + BAND + footer()
write('products.html', products)

# ---------------------------------------------------------------- About
about = head('About', 'One team, from first idea to everyday use.', 'about.html') + header('about.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid">
    <div class="hero__text">
      <span class="label">About G3</span>
      <h1 id="hero-h" class="display-l">One team, from first idea to everyday use.</h1>
      <p class="lead">{ph('G3 Technologies is a Dubai-based technology services company. Our consultants, architects and developers build and run AI, blockchain and IoT solutions for organisations across the UAE and the wider region.')}</p>
    </div>
    <div class="hero__plate">{rings('Three interlocked rings, engraved')}</div>
  </div></div>
</section>
<section class="photo-band" aria-label="Our team at work">
  <div class="wrap"><figure class="photo rv"><img src="assets/img/photo-team.jpg" alt="A G3 architect sketching a cloud system diagram at his desk, laptop open beside him" width="1536" height="624" loading="lazy"></figure></div>
</section>
<section class="section" aria-labelledby="how-h">
  <div class="wrap">
    {intro('01 — How we work', 'Discover, design, build, secure, run.', '', 'how-h')}
    <div class="grid"><div class="block rv"><ol class="steps steps--5 timeline">
      <li class="step"><span class="label" data-n="1">01</span><span class="title">Discover</span><p>Your goals, your systems and what success looks like.</p></li>
      <li class="step"><span class="label" data-n="2">02</span><span class="title">Design</span><p>The right technology, fitted to what you already have.</p></li>
      <li class="step"><span class="label" data-n="3">03</span><span class="title">Build</span><p>Short cycles, so you see progress every few weeks.</p></li>
      <li class="step"><span class="label" data-n="4">04</span><span class="title">Secure</span><p>Risks tested and protections in place before go-live.</p></li>
      <li class="step"><span class="label" data-n="5">05</span><span class="title">Run</span><p>We support and improve it, or hand it to your team.</p></li>
    </ol></div></div>
  </div>
</section>
<section class="section" aria-labelledby="ways-h">
  <div class="wrap">
    {intro('02 — Ways to work with us', 'Start small or go all in.', '', 'ways-h')}
    <div class="grid"><div class="block rv"><div class="tiles">
      <div class="tile"><span class="label">01</span><span class="title">Consulting</span><p>Advice and a clear plan.</p></div>
      <div class="tile"><span class="label">02</span><span class="title">Projects</span><p>We build it, end to end.</p></div>
      <div class="tile"><span class="label">03</span><span class="title">Dedicated teams</span><p>Our people, your roadmap.</p></div>
      <div class="tile"><span class="label">04</span><span class="title">Managed services</span><p>We run it for you.</p></div>
    </div></div></div>
  </div>
</section>
<section class="section" aria-labelledby="why-h">
  <div class="wrap">
    {intro('03 — Why G3', 'What you can count on.', '', 'why-h')}
    <div class="grid"><div class="block rv"><ol class="numbered">
      <li><span class="numbered__n">01</span><span class="heading">No hand-offs from strategy to support</span></li>
      <li><span class="numbered__n">02</span><span class="heading">AI in Arabic and English</span></li>
      <li><span class="numbered__n">03</span><span class="heading">Your data kept where it must stay</span></li>
      <li><span class="numbered__n">04</span><span class="heading">Security built in, not added later</span></li>
    </ol></div></div>
  </div>
</section>
<section class="section" aria-labelledby="facts-h">
  <div class="wrap">
    {intro('04 — Facts', 'G3 at a glance.', '', 'facts-h')}
    <div class="grid"><div class="block rv"><div class="facts">
      <div class="fact"><span class="display-l">2019</span><span class="label">Founded in Dubai</span></div>
      <div class="fact"><span class="display-l">40+</span><span class="label">Consultants, architects and developers</span></div>
      <div class="fact"><span class="display-l">4</span><span class="label">Disciplines under one roof</span></div>
    </div></div></div>
  </div>
</section>
''' + BAND + footer()
write('about.html', about)

# ---------------------------------------------------------------- Careers
careers = head('Careers', 'Work on real AI, blockchain and IoT projects.', 'careers.html') + header('careers.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid"><div class="hero__text">
    <span class="label">Careers</span>
    <h1 id="hero-h" class="display-l">Work on real AI, blockchain and IoT projects.</h1>
    <p class="lead">We're looking for consultants, architects and developers in AI, blockchain, IoT and cloud.</p>
  </div>
  <div class="hero__plate">{rings('A rising spiral, engraved', 'helix')}</div></div></div>
</section>
<section class="photo-band" aria-label="Engineers at work">
  <div class="wrap"><figure class="photo rv"><img src="assets/img/photo-careers.jpg" alt="Two engineers working through code together at a screen" width="1800" height="654" loading="lazy"></figure></div>
</section>
<section class="section" aria-labelledby="roles-h">
  <div class="wrap">
    {intro('01 — Open roles', 'Current openings.', '', 'roles-h')}
    <div class="grid"><div class="block rv"><ul class="roles">
      <li><a href="mailto:careers@gggtech.io?subject=AI%20Engineer"><span class="title">AI Engineer</span><span class="label">Dubai · Full-time</span><span class="ix__arrow" aria-hidden="true">→</span></a></li>
      <li><a href="mailto:careers@gggtech.io?subject=Blockchain%20Developer"><span class="title">Blockchain Developer</span><span class="label">Dubai · Full-time</span><span class="ix__arrow" aria-hidden="true">→</span></a></li>
      <li><a href="mailto:careers@gggtech.io?subject=IoT%20Solutions%20Architect"><span class="title">IoT Solutions Architect</span><span class="label">Dubai · Full-time</span><span class="ix__arrow" aria-hidden="true">→</span></a></li>
      <li><a href="mailto:careers@gggtech.io?subject=Cloud%20Security%20Engineer"><span class="title">Cloud Security Engineer</span><span class="label">Dubai · Full-time</span><span class="ix__arrow" aria-hidden="true">→</span></a></li>
    </ul></div></div>
  </div>
</section>
<section class="section" aria-labelledby="apply-h">
  <div class="wrap">
    {intro('02 — How to apply', 'Send us your CV.', 'Email <a class="link" href="mailto:careers@gggtech.io">careers@gggtech.io</a> with the role in the subject line.', 'apply-h')}
  </div>
</section>
''' + footer()
write('careers.html', careers)

# ---------------------------------------------------------------- Contact
opts = ''.join(f'<label><input type="radio" name="need" value="{v}"><span>{v}</span></label>' for v in ['AI', 'Blockchain', 'IoT', 'Cloud & Security', 'Not sure yet'])
contact = head('Contact', 'Book a call with our team.', 'contact.html') + header('contact.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid"><div class="hero__text">
    <span class="label">Contact</span>
    <h1 id="hero-h" class="display-l">Book a call with our team.</h1>
    <p class="lead">Tell us what you want to achieve. We'll reply within one working day with a clear next step.</p>
  </div>
  <div class="hero__plate">{rings('Two linked rings, engraved', 'pair')}</div></div></div>
</section>
<section class="photo-band" aria-label="Our office">
  <div class="wrap"><figure class="photo rv"><img src="assets/img/photo-office.jpg" alt="A calm office reception with a stone desk, lounge chairs and a meeting in progress behind glass" width="1800" height="792" loading="lazy"></figure></div>
</section>
<section class="section" aria-label="Contact form">
  <div class="wrap grid">
    <div class="contact rv" style="margin-top:0">
      <form class="form" novalidate>
        <div class="pair">
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
        </div>
        <div class="pair">
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="f-phone">Phone (optional)</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        </div>
        <fieldset class="field"><legend>What do you need help with?</legend><div class="options">{opts}</div></fieldset>
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message"></textarea></div>
        <div><button class="btn btn--primary" type="submit">Book a call<span class="dot" aria-hidden="true"></span></button></div>
        <p class="form-note" tabindex="-1" role="status" hidden>Thanks. This is a preview, so messages aren't sent yet. The form goes live with the launch site.</p>
      </form>
      <div class="aside">
        <div><span class="label">Office</span><span>PO Box 40056, Al Quoz Industrial Area 4, Dubai, UAE</span></div>
        <div><span class="label">Email</span><a href="mailto:hello@gggtech.io">hello@gggtech.io</a></div>
        <div><span class="label">Phone</span><a href="tel:+97140000000">+971 4 000 0000</a></div>
        <div><span class="label">Hours</span><span>Sunday to Thursday, 9:00–18:00</span></div>
      </div>
    </div>
  </div>
</section>
''' + footer()
write('contact.html', contact)
