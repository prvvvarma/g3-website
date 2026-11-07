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
    <div class="footer__addr"><span class="label">Dubai</span><span>{ph('PO Box 40056, Al Quoz Industrial Area 4, Dubai, UAE [confirm]')}</span><span>{ph('[Email and phone from G3]')}</span></div>
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

def rings(alt):
    return f'''<div class="rings" data-rings title="Drag to turn"><img src="assets/img/rings.jpg" alt="{alt}" width="1200" height="1200"></div>'''

def services_strip(exclude=None, margin=True):
    cells = ''.join(
        f'<a class="service" href="{h}" data-ring="{i}"><span class="label">{n}</span><span class="title">{line}</span><span class="go">Explore {n} →</span></a>'
        for i, (h, n, line) in enumerate(SERVICES) if h != exclude)
    style = '' if margin else ' style="margin-top:0"'
    cls = 'services' + (' services--3' if exclude else '')
    cols = ' style="grid-template-columns:repeat(3,minmax(0,1fr))"' if exclude else style
    return f'<nav class="{cls}" aria-label="Services"{cols}>{cells}</nav>'

PLAN = '''<ol class="steps">
        <li class="step"><span class="label">Step 1</span><span class="title">Book a call.</span><p>Tell us what you want to achieve.</p></li>
        <li class="step"><span class="label">Step 2</span><span class="title">Get a clear plan.</span><p>What to build, in what order, and what it takes.</p></li>
        <li class="step"><span class="label">Step 3</span><span class="title">We build and run it.</span><p>Or hand it to your team when you're ready.</p></li>
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
        <span class="label">AI · Blockchain · IoT · Cloud &amp; Security</span>
        <h1 id="hero-h" class="display-xl">You don't need an AI team. You need AI that works.</h1>
        <p class="lead">G3's consultants, architects and developers build and run AI, blockchain and IoT for your business.</p>
        {actions('See what we build', '#services')}
      </div>
      <div class="hero__plate">{rings('Three interlocked rings, engraved: AI, blockchain and IoT')}</div>
    </div>
    <div id="services">{services_strip()}</div>
  </div>
</section>

<section class="section" aria-labelledby="problem-h">
  <div class="wrap">
    {intro('01 — The problem', 'Building an AI team in-house is slow, expensive and hard to get right.', "Good ideas stall without the right people. We've seen it, and we built G3 to fix it.", 'problem-h')}
  </div>
</section>

<section class="section" aria-labelledby="proof-h">
  <div class="wrap">
    {intro('02 — Proof', 'Who we work with.', ph('[Client logos, or one short case study, from G3]'), 'proof-h')}
    <div class="grid"><div class="block rv"><div class="logos" aria-label="Client logos to come"><span>Client logo</span><span>Client logo</span><span>Client logo</span><span>Client logo</span><span>Client logo</span><span>Client logo</span></div></div></div>
  </div>
</section>

<section class="section" aria-labelledby="products-h">
  <div class="wrap">
    {intro('03 — Products', 'Ready-made solutions, so you can start faster.', '', 'products-h')}
    <div class="grid"><div class="block rv"><div class="rows">
      <div class="row"><span class="label">01</span><h3 class="title">Retail Media Network</h3><p>Turn in-store screens into a measurable advertising channel.</p></div>
      <div class="row"><span class="label">02</span><h3 class="title">Companion</h3><p>{ph("[One line from G3: what Companion does and who it's for]")}</p></div>
      <div class="row"><span class="label">03</span><h3 class="title">Marketing Intelligence</h3><p>See which campaigns work and where to spend next.</p></div>
      <div class="row"><span class="label">04</span><h3 class="title">Voice Agents</h3><p>AI that answers calls and resolves common requests.</p></div>
    </div><p style="margin-top:28px"><a class="link" href="products.html">All products</a></p></div></div>
  </div>
</section>

<section class="section" aria-labelledby="plan-h">
  <div class="wrap">
    {intro('04 — How it works', 'Three steps. No hiring.', '', 'plan-h')}
    <div class="grid"><div class="block rv">{PLAN}</div></div>
  </div>
</section>

<section class="statement" aria-label="What changes">
  <div class="wrap rv"><span class="label">05 — What changes</span><p class="display-l">From talking about AI to using it every day.</p></div>
</section>
''' + BAND + footer()
write('index.html', home)

# ---------------------------------------------------------------- Service pages
def service_page(page, name, headline, subline, problem, groups, used, img, alt, fig, small='', what_h='What we do', used_h='Where it’s used'):
    caps_html = ''
    for gi, (gtitle, items) in enumerate(groups):
        cells = ''.join(f'<div class="cap"><h3 class="title">{t}</h3><p>{ph(d)}</p></div>' for t, d in items)
        gh = f'<h3 class="label" style="margin:{"0" if gi == 0 else "48px"} 0 16px">{gtitle}</h3>' if gtitle else ''
        caps_html += f'{gh}<div class="caps">{cells}</div>'
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
    <div class="grid"><div class="block rv"><div class="chips">{chips}</div></div></div>
  </div>
</section>
'''
    body = head(name.replace('&amp;', '&'), f'{headline} {subline}', page) + header(page) + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap">
    <div class="grid">
      <div class="hero__text hero__text--wide">
        <span class="label">Services — {name}</span>
        <h1 id="hero-h" class="display-l">{headline}</h1>
        <p class="lead">{subline}</p>
        {actions()}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="problem-h">
  <div class="wrap">{intro('01 — The problem', problem, '', 'problem-h')}</div>
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
        ('Smart contracts', 'Built, tested and independently audited before launch [G3 to confirm audit partner].'),
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
  <div class="wrap"><div class="grid"><div class="hero__text hero__text--wide">
    <span class="label">Products</span>
    <h1 id="hero-h" class="display-xl">Ready-made solutions, so you can start faster.</h1>
  </div></div></div>
</section>
<section class="section" aria-label="Products">
  <div class="wrap rv"><div class="rows">
    <div class="row"><span class="label">01</span><h2 class="heading">Retail Media Network</h2><p>Turn in-store screens into a measurable advertising channel, with proof of every play.</p></div>
    <div class="row"><span class="label">02</span><h2 class="heading">Companion</h2><p>{ph("[One line from G3: what Companion does and who it's for]")}</p></div>
    <div class="row"><span class="label">03</span><h2 class="heading">Marketing Intelligence</h2><p>See which campaigns work and where to spend next.</p></div>
    <div class="row"><span class="label">04</span><h2 class="heading">Voice Agents</h2><p>AI that answers calls and resolves common requests.</p></div>
  </div></div>
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
    <div class="hero__text hero__text--wide">
      <span class="label">About G3</span>
      <h1 id="hero-h" class="display-l">One team, from first idea to everyday use.</h1>
      <p class="lead">{ph('G3 Technologies is a Dubai-based technology services company. Our consultants, architects and developers build and run AI, blockchain and IoT solutions for organisations across [the UAE or the region: G3 to confirm].')}</p>
    </div>
  </div></div>
</section>
<section class="section" aria-labelledby="how-h">
  <div class="wrap">
    {intro('01 — How we work', 'Discover, design, build, secure, run.', '', 'how-h')}
    <div class="grid"><div class="block rv"><ol class="steps steps--5">
      <li class="step"><span class="label">01</span><span class="title">Discover</span><p>Your goals, your systems and what success looks like.</p></li>
      <li class="step"><span class="label">02</span><span class="title">Design</span><p>The right technology, fitted to what you already have.</p></li>
      <li class="step"><span class="label">03</span><span class="title">Build</span><p>Short cycles, so you see progress every few weeks.</p></li>
      <li class="step"><span class="label">04</span><span class="title">Secure</span><p>Risks tested and protections in place before go-live.</p></li>
      <li class="step"><span class="label">05</span><span class="title">Run</span><p>We support and improve it, or hand it to your team.</p></li>
    </ol></div></div>
  </div>
</section>
<section class="section" aria-labelledby="ways-h">
  <div class="wrap">
    {intro('02 — Ways to work with us', 'Start small or go all in.', '', 'ways-h')}
    <div class="grid"><div class="block rv"><div class="chips"><span class="chip">Consulting</span><span class="chip">Projects</span><span class="chip">Dedicated teams</span><span class="chip">Managed services</span></div></div></div>
  </div>
</section>
<section class="section" aria-labelledby="why-h">
  <div class="wrap">
    {intro('03 — Why G3', 'What you can count on.', '', 'why-h')}
    <div class="grid"><div class="block rv"><div class="caps">
      <div class="cap"><h3 class="title">No hand-offs from strategy to support</h3></div>
      <div class="cap"><h3 class="title">AI in Arabic and English</h3></div>
      <div class="cap"><h3 class="title">Your data kept where it must stay</h3></div>
      <div class="cap"><h3 class="title">Security built in, not added later</h3></div>
    </div></div></div>
  </div>
</section>
<section class="section" aria-labelledby="facts-h">
  <div class="wrap">
    {intro('04 — Facts', 'G3 at a glance.', ph('[founding year] · [team size] · [leadership]'), 'facts-h')}
  </div>
</section>
''' + BAND + footer()
write('about.html', about)

# ---------------------------------------------------------------- Careers
careers = head('Careers', 'Work on real AI, blockchain and IoT projects.', 'careers.html') + header('careers.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid"><div class="hero__text hero__text--wide">
    <span class="label">Careers</span>
    <h1 id="hero-h" class="display-xl">Work on real AI, blockchain and IoT projects.</h1>
    <p class="lead">We're looking for consultants, architects and developers in AI, blockchain, IoT and cloud.</p>
  </div></div></div>
</section>
<section class="section" aria-labelledby="roles-h">
  <div class="wrap">
    {intro('01 — Open roles', 'Current openings.', ph('[List of open roles from G3]'), 'roles-h')}
  </div>
</section>
<section class="section" aria-labelledby="apply-h">
  <div class="wrap">
    {intro('02 — How to apply', 'Send us your CV.', ph('Send your CV to [careers email].'), 'apply-h')}
  </div>
</section>
''' + footer()
write('careers.html', careers)

# ---------------------------------------------------------------- Contact
opts = ''.join(f'<label><input type="radio" name="need" value="{v}"><span>{v}</span></label>' for v in ['AI', 'Blockchain', 'IoT', 'Cloud & Security', 'Not sure yet'])
contact = head('Contact', 'Book a call with our team.', 'contact.html') + header('contact.html') + f'''
<section class="hero hero--page" aria-labelledby="hero-h">
  <div class="wrap"><div class="grid"><div class="hero__text hero__text--wide">
    <span class="label">Contact</span>
    <h1 id="hero-h" class="display-xl">Book a call with our team.</h1>
    <p class="lead">{ph("Tell us what you want to achieve. We'll reply within [one working day: G3 to confirm] with a clear next step.")}</p>
  </div></div></div>
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
        <div><span class="label">Office</span><span>{ph('PO Box 40056, Al Quoz Industrial Area 4, Dubai, UAE [confirm]')}</span></div>
        <div><span class="label">Email and phone</span><span>{ph('[from G3]')}</span></div>
      </div>
    </div>
  </div>
</section>
''' + footer()
write('contact.html', contact)
