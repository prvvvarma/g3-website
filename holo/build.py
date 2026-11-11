#!/usr/bin/env python3
"""Builds the GI5SI hologram site. Change BRAND below to rename the company everywhere."""
import math, pathlib

BRAND = 'Gi5.si'
WM = 'Gi<b>5</b>.si'                     # wordmark with the glowing 5
EMAIL, JOBS, PHONE = 'hello@gggtech.io', 'careers@gggtech.io', '+971 4 000 0000'
V = '7'
OUT = pathlib.Path(__file__).parent

def mark(size=30):
    pts = [(50 + 34 * math.sin(i * 2 * math.pi / 5), 50 - 34 * math.cos(i * 2 * math.pi / 5)) for i in range(5)]
    poly = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    spokes = ''.join(f'<line x1="50" y1="50" x2="{x:.1f}" y2="{y:.1f}" stroke="#4FE3FF" stroke-width="2.5" opacity=".55"/>' for x, y in pts)
    nodes = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="#04070B" stroke="#4FE3FF" stroke-width="4"/>' for x, y in pts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}" aria-hidden="true">'
            f'<polygon points="{poly}" fill="none" stroke="#4FE3FF" stroke-width="4"/>{spokes}{nodes}<circle cx="50" cy="50" r="11" fill="#DFFAFF"/></svg>')

NAV = [('ai.html', 'AI'), ('blockchain.html', 'Blockchain'), ('iot.html', 'IoT'), ('cloud-security.html', 'Cloud &amp; Security'),
       ('products.html', 'Products'), ('about.html', 'About'), ('careers.html', 'Careers')]

def head(title, desc):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#04070B">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/img/favicon.svg">
<link rel="preload" href="assets/fonts/schibsted-grotesk-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/holo.css?v={V}">
</head>
<body>
'''

def header(cur):
    links = ''.join(f'<a href="{h}"{" aria-current=page" if h == cur else ""}>{t}</a>' for h, t in NAV)
    return f'''<header class="header">
  <a class="brand" href="./" aria-label="{BRAND} home">{mark()}<span class="wm">{WM}</span></a>
  <nav class="nav" aria-label="Main">{links}<a href="contact.html">Book a call</a></nav>
  <a class="btn" href="contact.html">Book a call</a>
  <button class="menu-btn mono" aria-expanded="false">Menu</button>
</header>
'''

def footer():
    return f'''<footer class="foot">
  <div class="foot__in">
    <div><a class="brand" href="./">{mark(26)}<span class="wm">{WM}</span></a><p>AI, blockchain and IoT, built and run for your business.</p></div>
    <div><h4>Services</h4><a href="ai.html">AI</a><a href="blockchain.html">Blockchain</a><a href="iot.html">IoT</a><a href="cloud-security.html">Cloud &amp; Security</a></div>
    <div><h4>Company</h4><a href="products.html">Products</a><a href="about.html">About</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
    <div><h4>Talk to us</h4><a href="mailto:{EMAIL}">{EMAIL}</a><a href="tel:{PHONE.replace(" ", "")}">{PHONE}</a><span>Dubai, UAE</span></div>
  </div>
  <div class="foot__base mono"><span>© 2026 {BRAND}</span><span>Preview · sample content</span></div>
</footer>
<script src="assets/holo.js?v={V}"></script>
</body>
</html>
'''

def close(line='Your tech team, without the hiring.'):
    return f'''<section class="close">
  <div class="orb" aria-hidden="true"></div>
  <p class="eyebrow mono rv">The end result</p>
  <h2 class="rv">{line}</h2>
  <a class="btn btn--solid rv" href="contact.html">Book a call</a>
</section>
'''

def hero(kind, eyebrow, h1, lede, actions=None, home=False):
    actions = actions or '<a class="btn btn--solid" href="contact.html">Book a call</a>'
    extra = ''
    if home:
        extra = '''<p class="hint mono">Drag to spin · tap a sense to open it</p>
    <div class="chips" role="group" aria-label="Open a sense">
      <button class="chip mono">See</button><button class="chip mono">Hear</button><button class="chip mono">Touch</button><button class="chip mono">Smell</button><button class="chip mono">Taste</button><button class="chip mono">Remember</button>
    </div>
    <aside class="panel" aria-live="polite">
      <div class="panel__tag mono"><span class="pTag"></span><button class="panel__x mono" aria-label="Close">Close ✕</button></div>
      <h2 class="pName"></h2><p class="pLine"></p><ul class="pList"></ul><a class="pLink" href="#"></a>
    </aside>'''
    else:
        extra = '<p class="hint mono">Drag to spin</p>'
    return f'''<div class="hero{"" if home else " hero--sub"}">
  <div class="floor" aria-hidden="true"></div>
  <canvas id="holo" data-holo="{kind}" aria-hidden="true"></canvas>
  <div class="hud hud--tl mono" aria-hidden="true">{BRAND} // Systems <b>online</b></div>
  <div class="hud hud--tr mono" aria-hidden="true">DXB <b id="clock">00:00:00</b><br>25.2048°N 55.2708°E</div>
  <div class="hud hud--bl mono" aria-hidden="true">Yaw <b id="yaw">000°</b> · Pitch <b id="pit">000°</b></div>
  <div class="hud hud--br mono" aria-hidden="true">Senses <b>5 / 5</b> live</div>
  <div class="hero__copy">
    <p class="boot mono" id="boot" data-msg="{eyebrow}" aria-hidden="true"></p>
    <h1>{h1}</h1>
    <p class="lede">{lede}</p>
    <div class="actions">{actions}</div>
  </div>
  <div class="stage">
    {extra}
  </div>
</div>
'''

def sec(n, label, title, body, sub='', cls='', id_=''):
    s = f'<p class="sub rv">{sub}</p>' if sub else ''
    i = f' id="{id_}"' if id_ else ''
    return f'''<section class="{cls}"{i}>
  <p class="eyebrow mono rv">{n} · {label}</p>
  <h2 class="big rv">{title}</h2>{s}
  {body}
</section>
'''

def diags(items):
    cards = ''.join(f'<button class="diag frame rv" aria-pressed="false"><span class="diag__st mono"><i></i><b>Fault detected</b></span><span class="diag__k">{k}</span>'
                    f'<span class="diag__t"><span class="prob">{p}</span><span class="fix">{f}</span></span></button>' for k, p, f in items)
    return f'<div class="diags">{cards}</div><p class="tap mono">Tap a card · problem or fix</p>'

def rows(items):
    return '<div class="rows">' + ''.join(f'<div class="row rv" data-kick><span class="mono">{i + 1:02d}</span><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(items)) + '</div>'

def tags(items):
    return '<div class="tags rv">' + ''.join(f'<span class="tag mono">{t}</span>' for t in items) + '</div>'

def steps(items):
    return '<div class="steps">' + ''.join(f'<div class="step rv"><i></i><span class="mono">Step {i + 1}</span><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(items)) + '</div>'

PLAN = [('Book a call.', 'Tell us what you want to achieve.'), ('Get a clear plan.', 'What to build, in what order, and what it takes.'),
        ('We build and run it.', 'Or hand it to your team when you\'re ready.')]

PRODUCTS = [
    ('rmn', 'Retail Media Network', 'In-store screens that earn.', 'Turn the screens in your stores into an advertising channel, with proof of every play.',
     ['Sell screen time to brands', 'Proof of every ad played', 'One dashboard for every store']),
    ('companion', 'Companion', 'An AI assistant for every counter.', 'One assistant, many jobs: a sales guide in a supermarket, room service in a hotel, a waiter in a restaurant.',
     ['Talks, listens and shows products', 'Speaks your customers\' languages', 'Learns your menu, stock and prices']),
    ('marketing', 'Marketing Intelligence', 'Know which campaigns work.', 'See what every campaign earned, and where to spend next.',
     ['All channels on one screen', 'Clear return on every campaign', 'Suggestions for the next move']),
    ('voice', 'Voice Agents', 'AI that answers your calls.', 'Natural-sounding agents that pick up every call and resolve common requests.',
     ['Answers day and night', 'Books, confirms and reminds', 'Hands over to a person when needed']),
]

def product_cards():
    return '<div class="prods">' + ''.join(
        f'<a class="prod frame rv" href="products.html#{k}"><div class="prod__img"><img src="assets/img/product-{k}.jpg" alt="" loading="lazy"></div>'
        f'<p class="prod__n mono">{i + 1:02d}</p><h3>{n}</h3><p>{t}</p></a>' for i, (k, n, t, _, _) in enumerate(PRODUCTS)) + '</div>'

SENSES = [
    ('See', 'Sense 01 · Sight', 'It sees.', 'Cameras that count people, read plates and check quality.'),
    ('Hear', 'Sense 02 · Hearing', 'It hears.', 'Voice agents that answer calls and understand what people need.'),
    ('Touch', 'Sense 03 · Touch', 'It feels.', 'Sensors that feel heat, movement and pressure at every site.'),
    ('Smell', 'Sense 04 · Smell', 'It smells trouble.', 'Alerts that catch faults and threats before they spread.'),
    ('Taste', 'Sense 05 · Taste', 'It knows what\'s good.', 'Recommendations that learn what your customers like.'),
]

def senses():
    btns, lines = '', ''
    for i, (name, tag, title, text) in enumerate(SENSES):
        a = i * 2 * math.pi / 5
        x, y = 50 + 39 * math.sin(a), 50 - 39 * math.cos(a)
        lines += f'<line x1="50" y1="50" x2="{x:.1f}" y2="{y:.1f}"/>'
        btns += (f'<button class="sense mono{" on" if i == 0 else ""}" style="left:{x:.1f}%;top:{y:.1f}%" data-i="{i}" data-tag="{tag}" '
                 f'data-title="{title}" data-text="{text}" aria-pressed="{"true" if i == 0 else "false"}">{name}</button>')
    t = SENSES[0]
    return f'''<div class="pick" data-pick>
    <div class="penta rv">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="39"/><g class="spin"><circle cx="50" cy="50" r="47" stroke-dasharray="1 3"/></g>{lines}</svg>
      <div class="penta__core" aria-hidden="true">5</div>{btns}
    </div>
    <div class="readout frame rv" aria-live="polite"><p class="ro-tag mono">{t[1]}</p><h3 class="ro-title">{t[2]}</h3><p class="ro-text">{t[3]}</p></div>
  </div>'''

DECODE = [
    ('Gi', 'Gi · Where it starts', 'Generative intelligence.', 'The AI that writes, answers and creates today. General intelligence comes next.'),
    ('5', '5 · How it works', 'Five senses.', 'Our systems see, hear, touch, smell and taste. They notice what is happening and act on it.'),
    ('si', 'si · Where it goes', 'Super intelligence.', 'AI keeps getting smarter. We build today\'s systems so they are ready for tomorrow\'s.'),
]

def decode():
    b = ''.join(f'<button class="dc{" on" if i == 0 else ""}" data-i="{i}" data-tag="{t}" data-title="{h}" data-text="{x}" aria-pressed="{"true" if i == 0 else "false"}">{k}</button>'
                for i, (k, t, h, x) in enumerate(DECODE))
    d = DECODE[0]
    return f'''<div class="pick pick--stack" data-pick>
    <div class="decode rv">{b}</div>
    <div class="readout frame rv" aria-live="polite"><p class="ro-tag mono">{d[1]}</p><h3 class="ro-title">{d[2]}</h3><p class="ro-text">{d[3]}</p></div>
  </div>'''

STAGES = '''<div class="stages">
    <div class="stg frame rv" style="--w:100%"><p class="mono"><span>GI</span><span>Working today</span></p><h3>Generative intelligence</h3><p>Writes, answers and creates. We put it to work now.</p><div class="bar"></div></div>
    <div class="stg frame rv" style="--w:55%"><p class="mono"><span>GI</span><span>Arriving</span></p><h3>General intelligence</h3><p>Reasons across your whole business. We design for it.</p><div class="bar"></div></div>
    <div class="stg frame rv" style="--w:18%"><p class="mono"><span>SI</span><span>On the horizon</span></p><h3>Super intelligence</h3><p>Beyond human scale. What we build today is ready to grow into it.</p><div class="bar"></div></div>
  </div>'''

DUO = '''<div class="duo">
    <div class="cty frame rv"><b>G</b><h3>Germany</h3><p>Architecture, quality and security.</p></div>
    <div class="duo__x rv" aria-hidden="true">+</div>
    <div class="cty frame rv"><b>I</b><h3>India</h3><p>Engineering teams that deliver at speed.</p></div>
  </div>'''

LOGOS = '''<div class="marq rv" aria-label="Sample client logos"><div class="marq__t">''' + ''.join(
    f'<span>{n}</span>' for n in ['halcyon', 'MERIDIAN', 'Orbis', 'SANDLINE', 'Kestrel', '&amp;Co.', 'Quadra'] * 2) + '''</div></div>
  <p class="demo mono">Sample logos · to be replaced with real clients</p>'''

def page(name, title, desc, body):
    (OUT / name).write_text(head(title, desc) + header(name) + '<main>\n' + body + '</main>\n' + footer())

# ---------------------------------------------------------------- Home
SAY = [
    ('See.', 'Sense 01 · Sight', 'It sees.', 'Cameras that count people, read plates and check quality.', 'ai.html', 'Explore AI →'),
    ('Hear.', 'Sense 02 · Hearing', 'It hears.', 'Voice agents that answer calls and understand what people need.', 'products.html#voice', 'See Voice Agents →'),
    ('Touch.', 'Sense 03 · Touch', 'It feels.', 'Sensors that feel heat, movement and pressure at every site.', 'iot.html', 'Explore IoT →'),
    ('Smell.', 'Sense 04 · Smell', 'It smells trouble.', 'Alerts that catch faults and threats before they spread.', 'cloud-security.html', 'Explore Cloud &amp; Security →'),
    ('Taste.', 'Sense 05 · Taste', 'It knows what\'s good.', 'Recommendations that learn what your customers like.', 'ai.html', 'Explore AI →'),
    ('Remember.', 'Plus · Memory', 'And it never forgets.', 'Blockchain records that no one can change.', 'blockchain.html', 'Explore Blockchain →'),
]

def say():
    w = ''.join(f'<button class="sw{" on" if i == 0 else ""}" data-i="{i}" data-tag="{t}" data-title="{h}" data-text="{x}" data-href="{u}" data-cta="{c}" aria-pressed="{"true" if i == 0 else "false"}">{k}</button>'
                for i, (k, t, h, x, u, c) in enumerate(SAY))
    d = SAY[0]
    return f'''<div class="say" data-pick>
    <div class="say__words rv">{w}</div>
    <div class="readout frame rv" aria-live="polite"><p class="ro-tag mono">{d[1]}</p><h3 class="ro-title">{d[2]}</h3><p class="ro-text">{d[3]}</p><a class="ro-link" href="{d[4]}">{d[5]}</a></div>
  </div>'''

def showroom():
    slides = ''.join(f'''<a class="slide{" on" if i == 0 else ""}" href="products.html#{k}"><div class="prod__img"><img src="assets/img/product-{k}.jpg" alt="" loading="lazy"></div>
      <div class="slide__txt"><p class="mono">{i + 1:02d} / 04</p><h3>{n}</h3><p class="t">{t}</p><span class="go">See how it works →</span></div></a>''' for i, (k, n, t, _, _) in enumerate(PRODUCTS))
    tabs = ''.join(f'<button class="stab{" on" if i == 0 else ""}" role="tab" aria-selected="{"true" if i == 0 else "false"}"><b>{i + 1:02d}</b>{n}</button>' for i, (k, n, *_ ) in enumerate(PRODUCTS))
    return f'<div class="show" data-show><div class="show__stage frame rv">{slides}</div><div class="show__tabs" role="tablist">{tabs}</div></div>'

BA = [('Sales', 'Known at month end', 'Known right now'), ('Fridge 3', 'Failed overnight', 'Fixed before it failed'),
      ('Phone calls', 'Missed after hours', 'All answered'), ('Stock', 'Ran out on Friday', 'Reordered in time')]

def before_after():
    bef = ''.join(f'<div class="ba__r"><span>{k}</span><b>{x}</b></div>' for k, x, _ in BA)
    aft = ''.join(f'<div class="ba__r"><span>{k}</span><b>{y}</b></div>' for k, _, y in BA)
    return f'''<div class="ba frame rv" data-ba>
    <div class="ba__l ba__before"><h3>Guessing</h3>{bef}</div>
    <div class="ba__l ba__after" aria-hidden="true"><h3>Knowing</h3>{aft}</div>
    <div class="ba__h" aria-hidden="true"></div>
    <input type="range" min="0" max="100" value="6" aria-label="Drag from guessing to knowing">
  </div><p class="tap mono">Drag the line · guessing to knowing</p>'''

def close_plan():
    mini = '<i>→</i>'.join(f'<div class="rv"><b>{i + 1}</b>{t}</div>' for i, t in enumerate(['Book a call', 'Get a clear plan', 'We build and run it']))
    return f'''<section class="close">
  <div class="orb" aria-hidden="true"></div>
  <p class="eyebrow mono rv">Three steps · no hiring</p>
  <div class="mini">{mini}</div>
  <h2 class="rv">Your tech team, without the hiring.</h2>
  <a class="btn btn--solid rv" href="contact.html">Book a call</a>
</section>
'''

page('index.html', f'{BRAND} · AI, blockchain and IoT for your business', 'AI, blockchain and IoT, built and run for your business.',
     hero('senses', f'{BRAND} // Intelligence with five senses', 'AI that sees, hears and senses your <span class="c">whole business.</span>',
          f'{BRAND} builds and runs AI, blockchain and IoT for you. No hiring needed.',
          '<a class="btn btn--solid" href="contact.html">Book a call</a><a class="btn" href="#senses">See what it can do</a>', home=True)
     + '<section class="strip">' + LOGOS + '</section>\n'
     + sec('01', 'The problem', 'Building an AI team in‑house is slow, expensive and hard to get right.',
           diags([('Slow', 'Hiring the right people takes months.', 'Our team is ready when you are.'),
                  ('Expensive', 'Senior AI talent is scarce and costly.', 'Pay for the skills you need, only when you need them.'),
                  ('Hard to get right', 'Many projects stall between the demo and daily use.', 'We build it, then run it with you.')])
           + '<p class="note rv">Good ideas stall without the right people. We\'ve seen it, and we built ' + BRAND + ' to fix it.</p>')
     + sec('02', 'The answer', 'Now your business can', say(), id_='senses')
     + sec('03', 'Products', 'Ready-made, so you can start faster.', showroom() + '<p class="demo mono">Demo products · details to be confirmed</p>', id_='products')
     + sec('04', 'What changes', 'From guessing to knowing.', before_after())
     + close_plan())

# ---------------------------------------------------------------- Service pages
def service(name, kind, label, h1, lede, problem, fix, heading, items, used):
    page(name, f'{label} · {BRAND}', lede,
         hero(kind, f'{BRAND} // {label}', h1, lede)
         + sec('01', 'The problem', problem, f'<p class="note rv">{fix}</p>', cls='tight')
         + sec('02', 'What we do', heading, rows(items))
         + sec('03', 'Used in', 'Where it works.', tags(used), cls='tight')
         + sec('04', 'How it works', 'Three steps. No hiring.', steps(PLAN))
         + close())

service('ai.html', 'brain', 'AI', 'AI that does real work, <span class="c">every day.</span>',
        'Assistants, agents and predictions, built into the tools your team already uses.',
        'Most AI projects never leave the demo.', 'We build AI for daily use, then keep it running.',
        'Seven ways we put AI to work.',
        [('Assistants', 'Answer staff and customer questions, day and night.'), ('Agents', 'Finish whole tasks, not just one reply.'),
         ('Knowledge search', 'Find any answer in your own documents.'), ('Vision', 'Cameras that count, read and check.'),
         ('Voice', 'Calls answered in natural speech.'), ('Forecasting', 'Know demand before it arrives.'), ('Automation', 'Paperwork done without people.')],
        ['Retail', 'Hospitality', 'Logistics', 'Healthcare', 'Real estate', 'Finance'])

service('blockchain.html', 'chain', 'Blockchain', 'Records no one can <span class="c">argue with.</span>',
        'Shared, tamper-proof records for payments, assets and supply chains. Only where it helps.',
        'When partners keep separate records, every dispute costs time.', 'One shared record that nobody can quietly change.',
        'Only where it helps.',
        [('Smart contracts', 'Agreements that run themselves.'), ('Tokenisation', 'Turn real assets into digital units.'),
         ('Traceability', 'Follow every item from source to shelf.'), ('Digital identity', 'Prove who is who, without paperwork.'),
         ('Payments', 'Settle in minutes, not days.'), ('Audits', 'Contracts tested before they go live.')],
        ['Supply chain', 'Real estate', 'Finance', 'Loyalty', 'Advertising', 'Government'])

service('iot.html', 'globe', 'IoT', 'Know what\'s happening at <span class="c">every site.</span>',
        'Sensors, devices and dashboards that show your whole operation, live.',
        'You can\'t fix what you can\'t see.', 'We connect your sites, so you see problems as they start.',
        'Sensors, software and support.',
        [('Sensors and devices', 'Chosen, installed and tested for your site.'), ('Connectivity', 'Wi‑Fi, cellular or LoRa, whichever fits.'),
         ('Live dashboards', 'Every site on one screen.'), ('Alerts', 'Know before it breaks.'),
         ('Edge AI', 'Decisions made on the device, in milliseconds.'), ('Device management', 'Update thousands of devices from one place.')],
        ['Cold chain', 'Buildings', 'Factories', 'Farms', 'Fleets', 'Retail'])

service('cloud-security.html', 'shield', 'Cloud & Security', 'Systems that stay up and <span class="c">stay safe.</span>',
        'We build your cloud, protect it and run it around the clock.',
        'One outage or one breach can undo years of trust.', 'We design for failure and attack from day one.',
        'Build it, protect it, run it.',
        [('Cloud build', 'A clean, cost-aware setup on the cloud you choose.'), ('Migration', 'Move old systems without downtime.'),
         ('Security testing', 'We attack your systems before others do.'), ('Monitoring', 'Eyes on your systems 24/7.'),
         ('Data platforms', 'All your data in one trusted place.'), ('Managed operations', 'We run it, you get the reports.')],
        ['Finance', 'Healthcare', 'Retail', 'Government', 'Logistics', 'Start-ups'])

# ---------------------------------------------------------------- Products
blocks = ''.join(
    f'''<div class="pblock" id="{k}">
    <div class="pblock__img frame rv"><div class="prod__img"><img src="assets/img/product-{k}.jpg" alt="" loading="lazy"></div></div>
    <div class="rv"><p class="mono c">{i + 1:02d} · {t}</p><h2>{n}</h2><p>{d}</p><ul>{"".join(f"<li>{b}</li>" for b in bl)}</ul><a class="btn" href="contact.html">Ask about it</a></div>
  </div>''' for i, (k, n, t, d, bl) in enumerate(PRODUCTS))
page('products.html', f'Products · {BRAND}', 'Ready-made products you can start with.',
     hero('products', f'{BRAND} // Products', 'Start with something that <span class="c">already works.</span>',
          'Four ready-made products. We fit them to your business in weeks, not months.',
          '<a class="btn btn--solid" href="contact.html">Book a call</a><a class="btn" href="#rmn">See the products</a>')
     + f'<section>{blocks}<p class="demo mono">Demo products · details to be confirmed</p></section>\n' + close('Pick one. We\'ll have it running fast.'))

# ---------------------------------------------------------------- About
page('about.html', f'About · {BRAND}', 'Five senses, one team.',
     hero('helix', f'{BRAND} // About', 'Five senses. <span class="c">One team.</span>',
          f'{BRAND} builds intelligent systems for business, from Dubai.')
     + sec('01', 'The name', f'What {BRAND} means.', decode())
     + sec('02', 'From GI to SI', 'Built for today\'s AI. Ready for what comes next.', STAGES)
     + '<section class="tight"><div class="photo frame rv"><img src="assets/img/photo-team.jpg" alt="" loading="lazy"><span class="mono">The team at work</span></div></section>\n'
     + sec('02', 'How we work', 'Five steps, start to finish.',
           '<div class="steps" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">' + ''.join(
               f'<div class="step rv"><i></i><span class="mono">Step {i + 1}</span><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(
                   [('Listen.', 'We learn your business first.'), ('Plan.', 'A clear, costed roadmap.'), ('Build.', 'Working software every two weeks.'),
                    ('Run.', 'We operate it day to day.'), ('Improve.', 'It gets better every month.')])) + '</div>')
     + sec('03', f'Why {BRAND}', 'One team for the whole job.',
           '<div class="tiles">' + ''.join(f'<div class="tile frame rv"><p class="mono">{i + 1:02d}</p><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(
               [('Everything under one roof', 'AI, blockchain, IoT, cloud and security work together from day one.'),
                ('Senior people on your project', 'Consultants, architects and developers who have done it before.'),
                ('We stay after launch', 'The team that builds it also runs it.')])) + '</div>')
     + sec('04', 'In numbers', f'{BRAND} at a glance.',
           '<div class="facts">' + ''.join(f'<div class="fact frame rv"><b>{n}</b><span>{t}</span></div>' for n, t in
                                           [('1', 'Team for the whole job'), ('5', 'Senses in every system'), ('4', 'Disciplines under one roof'), ('24/7', 'Systems watched')]) + '</div>')
     + close())

# ---------------------------------------------------------------- Careers
ROLES = [('AI Engineer', 'Dubai · Full-time'), ('Blockchain Developer', 'Dubai · Full-time'), ('IoT Engineer', 'Dubai · Full-time'), ('Solution Architect', 'Dubai · Full-time')]
page('careers.html', f'Careers · {BRAND}', f'Work at {BRAND}.',
     hero('orbits', f'{BRAND} // Careers', 'Build the systems everyone else <span class="c">talks about.</span>',
          'Real AI, blockchain and IoT projects, shipped to real customers.',
          '<a class="btn btn--solid" href="#roles">See open roles</a>')
     + sec('01', 'Why join', 'Good work, good people.',
           '<div class="tiles">' + ''.join(f'<div class="tile frame rv"><p class="mono">{i + 1:02d}</p><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(
               [('Real projects', 'Your work goes live and gets used.'), ('Senior teammates', 'Learn from people who have built it before.'),
                ('Room to grow', 'Take on more as you prove yourself.')])) + '</div>')
     + '<section class="tight"><div class="photo frame rv"><img src="assets/img/photo-careers.jpg" alt="" loading="lazy"><span class="mono">Where the work happens</span></div></section>\n'
     + sec('02', 'Open roles', 'Find your seat.',
           '<div class="rows">' + ''.join(f'<a class="role rv" href="mailto:{JOBS}?subject={r.replace(" ", "%20")}"><h3>{r}</h3><span>{w}</span><i>Apply →</i></a>' for r, w in ROLES)
           + f'</div><p class="demo mono">Sample roles · to be confirmed</p><p class="note rv">Don\'t see your role? Write to <a class="c" href="mailto:{JOBS}">{JOBS}</a>.</p>', id_='roles')
     + close('Come and build with us.').replace('Book a call', 'Get in touch'))

# ---------------------------------------------------------------- Contact
page('contact.html', f'Book a call · {BRAND}', 'Tell us what you want to achieve.',
     hero('radar', f'{BRAND} // Contact', 'Book a <span class="c">call.</span>',
          'Tell us what you want to achieve. We reply within one working day.',
          '<a class="btn btn--solid" href="#form">Write to us</a>')
     + f'''<section id="form"><div class="contact">
    <form class="form frame rv" novalidate>
      <label class="mono">Your name<input name="name" autocomplete="name" required></label>
      <label class="mono">Work email<input name="email" type="email" autocomplete="email" required></label>
      <label class="mono">Company<input name="company" autocomplete="organization"></label>
      <label class="mono">What do you want to achieve?<textarea name="message" rows="4"></textarea></label>
      <button class="btn btn--solid" type="submit">Book a call</button>
      <p class="form-note mono" hidden tabindex="-1">Preview only · this form is not connected yet</p>
    </form>
    <dl class="dl rv">
      <div><dt class="mono">Email</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
      <div><dt class="mono">Phone</dt><dd>{PHONE}</dd></div>
      <div><dt class="mono">Where</dt><dd>Dubai, UAE</dd></div>
      <div><dt class="mono">Hours</dt><dd>Monday to Friday, 9:00–18:00</dd></div>
      <div><dt class="mono">Note</dt><dd style="color:var(--mute);font-size:16px">Sample contact details, to be replaced.</dd></div>
    </dl>
  </div></section>
<section class="tight"><div class="photo frame rv"><img src="assets/img/photo-office.jpg" alt="" loading="lazy"><span class="mono">Come and see us</span></div></section>
''' + sec('02', 'What happens next', 'Three steps. No hiring.', steps(PLAN)))

(OUT / 'assets/img/favicon.svg').write_text(mark(64).replace(' aria-hidden="true"', ''))
print('built', len(list(OUT.glob('*.html'))), 'pages')
