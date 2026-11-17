#!/usr/bin/env python3
"""
construir.py — genera las páginas estáticas de ARANDU a partir de _fuente/datos.js

Uso (desde la carpeta raíz del sitio):   python3 _fuente/construir.py
Requiere Python 3 y Node.js (solo para leer datos.js).

Genera / actualiza:
  index.html, profesional/*.html, localidad/*.html, bienestar/*.html,
  profesionales.html, nosotros.html, privacidad.html, terminos.html, 404.html,
  assets/datos.js, sitemap.xml, robots.txt
"""
import json, os, re, shutil, subprocess, unicodedata, html
from datetime import date

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUENTE = os.path.join(RAIZ, "_fuente")

# ---------- Datos ----------
def leer_datos():
    js = os.path.join(FUENTE, "datos.js")
    out = subprocess.check_output(["node", "-e", f"process.stdout.write(JSON.stringify(require({json.dumps(js)})))"])
    return json.loads(out)

D = leer_datos()
C = D["CONFIG"]
PROFS = D["PROFESIONALES"]
CATS = D["CATEGORIAS"]
SITIO = C["sitioUrl"].rstrip("/")
HOY = date.today().isoformat()

def e(s): return html.escape(str(s or ""), quote=True)
def norm(s): return unicodedata.normalize("NFD", str(s)).encode("ascii", "ignore").decode().lower()
def slug(s): return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")
def aplanar(lst):
    for x in lst:
        if isinstance(x, list): yield from x
        else: yield x

def cats_de(p):
    texto = norm(" | ".join(p["areas"]))  # solo áreas declaradas
    res = []
    for c in CATS:
        if c["id"] in (p.get("categorias") or []) or any(x in p["poblacion"] for x in c.get("poblaciones", [])) \
           or any(re.search(k, texto) for k in c["claves"]):
            if c["id"] not in (p.get("categoriasExcluir") or []): res.append(c["id"])
    return res
for p in PROFS: p["cats"] = cats_de(p)
CAT = {c["id"]: c for c in CATS}

def enlace_wa(w):
    if not w: return ""
    if re.match(r"^https?://", w): return w
    from urllib.parse import quote
    return "https://wa.me/" + re.sub(r"\D", "", w) + "?text=" + quote(C["mensajeWhatsApp"])
def mailto(m):
    from urllib.parse import quote
    return f"mailto:{m}?subject={quote(C['asuntoEmail'])}&body={quote(C['mensajeWhatsApp'])}"
def fb_url(f): return f if re.match(r"^https?:", f) else "https://www.facebook.com/" + f
def iniciales(n): return "".join(w[0] for w in n.replace("S. ", "").split()[:2]).upper()
def modalidad_txt(p): return p.get("modalidadDetalle") or ("Presencial y online" if len(p["modalidad"]) > 1 else (p["modalidad"][0] if p["modalidad"] else "Modalidad a consultar"))

LOCS = sorted({p["localidad"] for p in PROFS}, key=lambda l: -sum(1 for p in PROFS if p["localidad"] == l))

# ---------- Plantilla común ----------
ICON_WA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>'
LOGO_SVG = '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="15" cy="12" r="7" fill="#555"/><path d="M3 32c2-8 8-12 14-12 3 0 6 1 8 3" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M22 30l5 5 10-12" stroke="#8a3e7f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def cabecera(base, activo=""):
    def a(href, txt, clave, extra=""):
        cur = ' aria-current="page"' if clave == activo else ""
        return f'<a href="{base}{href}"{cur}{extra}>{txt}</a>'
    return f'''<a class="saltar" href="#contenido">Saltar al contenido</a>
<div class="barra-sup"><div class="contenedor">
  <span class="emerg">¿Es una urgencia? Llamá al <a href="tel:911">911</a> · Guardia de salud mental: <a href="tel:+54{re.sub(r"\D","",C["guardiaDiurna"])}">{e(C["guardiaDiurna"])}</a> (día) · <a href="tel:+54{re.sub(r"\D","",C["guardiaNocturna"])}">{e(C["guardiaNocturna"])}</a> (noche)</span>
  <span class="cta-prof"><span><strong>¿Sos profesional?</strong> Sumate a ARANDU</span>
  <a class="btn-accede" href="{base}profesionales.html">Quiero ser parte de la red</a></span>
</div></div>
<header class="encabezado">
  <div class="contenedor">
    <a href="{base}index.html" class="logo" aria-label="{e(C["nombreRed"])}, inicio">{LOGO_SVG}
      <span class="logo-txt"><span class="logo-l1"><b>{e(C["logoLinea1"][0])}</b> <span>{e(C["logoLinea1"][1])}</span></span><span class="logo-l2">{e(C["logoLinea2"])}</span></span></a>
    <button class="hamburguesa" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Principal">
      {a("index.html#profesionales", "Buscar profesionales", "buscar")}
      {a("index.html#motivos", "¿Qué te está pasando?", "motivos")}
      {a("bienestar/index.html", "Bienestar y orientación", "bienestar")}
      {a("talleres.html", "Talleres y saberes", "talleres")}
      {a("profesionales.html", "Para profesionales", "profesionales")}
      <div class="desplegable"><button type="button" aria-haspopup="true" aria-expanded="false">ARANDU</button>
        <div class="sub">{a("nosotros.html","Nosotros","nosotros")}{a("privacidad.html","Privacidad","privacidad")}{a("terminos.html","Términos y condiciones","terminos")}</div></div>
      <a href="{base}index.html#profesionales" class="btn-online">Buscar</a>
    </nav>
  </div>
</header>'''

def pie(base):
    locs = "".join(f'<li><a href="{base}localidad/{slug(l)}.html">Profesionales en {e(l)}</a></li>' for l in LOCS)
    return f'''<footer class="pie2">
  <div class="contenedor">
    <div class="cols">
      <div><h2>{e(C["nombreRed"])}</h2><p>Un directorio regional que conecta a las personas con profesionales de la salud mental y el desarrollo. Empezamos por el Chaco y vamos hacia todo el NEA.</p>
        <p><strong style="color:#fff">¿Urgencia?</strong> 911 · 107 · Guardia de salud mental {e(C["guardiaDiurna"])} (día) / {e(C["guardiaNocturna"])} (noche)</p></div>
      <div><h2>Personas</h2><ul><li><a href="{base}index.html#profesionales">Buscar profesionales</a></li><li><a href="{base}index.html#motivos">¿Qué te está pasando?</a></li><li><a href="{base}bienestar/index.html">Bienestar y orientación</a></li><li><a href="{base}talleres.html">Talleres y saberes</a></li>{locs}</ul></div>
      <div><h2>Profesionales</h2><ul><li><a href="{base}profesionales.html">Sumarme a ARANDU</a></li><li><a href="{base}profesionales.html#verificacion">Cómo verificamos</a></li><li><a href="mailto:{e(C["emailSumarse"])}">{e(C["emailSumarse"])}</a></li></ul></div>
      <div><h2>ARANDU</h2><ul><li><a href="{base}nosotros.html">Nosotros</a></li><li><a href="{base}privacidad.html">Política de privacidad</a></li><li><a href="{base}terminos.html">Términos y condiciones</a></li></ul></div>
    </div>
    <p class="legal">© <span class="anio">{date.today().year}</span> {e(C["nombreRed"])}. Los perfiles muestran información brindada por cada profesional; ARANDU indica en cada ficha si la matrícula fue verificada. Este sitio no reemplaza la atención profesional ni los servicios de emergencia.</p>
  </div>
</footer>
<button class="ir-arriba" type="button" aria-label="Ir arriba">▲</button>'''

def pagina(ruta, titulo, desc, cuerpo, base="", activo="", og_img="img/og-imagen.jpg", ld=None, scripts=(), clase_body="", robots="index,follow"):
    canon = SITIO + "/" + ("" if ruta == "index.html" else ruta)
    og = og_img if og_img.startswith("http") else SITIO + "/" + og_img
    lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
    scr = "".join(f'<script src="{base}assets/{s}" defer></script>' for s in ("datos.js", "comun.js") + tuple(scripts))
    doc = f'''<!DOCTYPE html>
<html lang="es-AR" data-base="{base}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titulo)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{e(canon)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{e(C["nombreRed"])}">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{e(canon)}">
<meta property="og:image" content="{e(og)}">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1b7389">
<link rel="icon" href="{base}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}assets/estilos.css">
{lds}
{scr}
</head>
<body class="{clase_body}">
{cabecera(base, activo)}
{cuerpo}
{pie(base)}
</body>
</html>
'''
    destino = os.path.join(RAIZ, ruta)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino, "w", encoding="utf-8").write(doc)
    return ruta

GENERADAS = []
def migas(base, items):
    li = "".join(f'<li><a href="{base}{h}">{e(t)}</a></li>' if h else f'<li aria-current="page">{e(t)}</li>' for t, h in items)
    ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": t, **({"item": SITIO + "/" + h.replace("index.html", "")} if h else {})} for i, (t, h) in enumerate(items)]}
    return f'<nav class="migas contenedor" aria-label="Ubicación"><ol>{li}</ol></nav>', ld

def sello_html(p):
    if not p["matricula"]: return '<span class="sello pend">Matrícula a confirmar</span>'
    if p.get("verificado"): return f'<span class="sello ok">✓ {e(p["matricula"])} · verificada por ARANDU</span>'
    return f'<span class="sello info">{e(p["matricula"])} · informada por el profesional</span>'
def etq_prof(p):
    c = D["PROFESIONES"].get(p["profesion"], {"etq": p["profesion"], "color": "#eee", "texto": "#333"})
    return f'<span class="t-prof" style="background:{c["color"]};color:{c["texto"]}">{e(c["etq"])}</span>'
def foto_html(p, base, cls=""):
    if p["foto"]: return f'<img src="{base}{e(p["foto"])}" alt="Foto de {e(p["nombre"])}" width="140" height="140" class="{cls}">'
    return f'<span class="t-avatar {cls}" aria-hidden="true">{e(iniciales(p["nombre"]))}</span>'
def boton_contacto(p, base=""):
    wa = enlace_wa(p["whatsapp"])
    if wa: return f'<a class="btn-wa" href="{e(wa)}" target="_blank" rel="noopener">{ICON_WA}<span>Consultar disponibilidad por WhatsApp</span><span class="sr"> (se abre WhatsApp)</span></a>'
    if p["email"]: return f'<a class="btn-wa mail" href="{e(mailto(p["email"]))}">Consultar por email</a>'
    return '<span class="btn-wa off" aria-disabled="true">Contacto a confirmar</span>'


# ---------- Íconos de datos (trazo simple, color de ARANDU) ----------
_IC = {
 "poblacion": '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.3c3 .3 5.5 2.4 5.5 5.7"/>',
 "enfoque": '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 "modalidad": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 "localidad": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 "direccion": '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
 "idiomas": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
 "accesibilidad": '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5l-3 6.5M12 14.5l3 6.5"/>',
 "telefonos": '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 "atencion": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
 "reintegro": '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 "honorarios": '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-1-1.7-1.6-3-1.6-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3.1-1.7M12 6v1.6M12 16.6V18"/>',
 "disponibilidad": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "instagram": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
 "facebook": '<path d="M14 21v-8h3l.5-3.5H14V7.8c0-1 .3-1.8 1.8-1.8h1.8V3a24 24 0 0 0-2.7-.1c-2.6 0-4.4 1.6-4.4 4.5v2.1H7.5V13h3v8"/>',
 "email": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
}
def icono(n): return f'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{_IC[n]}</svg>'

# ======================================================================
# 1) PÁGINAS DE PROFESIONALES
# ======================================================================
def pagina_profesional(p):
    base = "../"
    ruta = f"profesional/{p['slug']}.html"
    url = SITIO + "/" + ruta
    prof_nombre = D["PROFESIONES"].get(p["profesion"], {}).get("etq", p["profesion"])
    nav, ld_m = migas(base, [("Inicio", "index.html"), (f"Profesionales en {p['localidad']}", f"localidad/{slug(p['localidad'])}.html"), (p["nombre"], "")])
    pres = "".join(
        f'<ul>{"".join(f"<li>{e(i)}</li>" for i in x)}</ul>' if isinstance(x, list) else f"<p>{e(x)}</p>" for x in p["presentacion"])
    formacion = "".join(f"<li>{e(f)}</li>" for f in p["formacion"])
    areas = "".join(f"<li>{e(a)}</li>" for a in p["areas"])
    motivos = "".join(f'<li>{e(CAT[c]["nombre"])}</li>' for c in p["cats"])
    def fila(ic, t, v): return f'<li><span class="d-ico" title="{t}">{icono(ic)}</span><span><span class="sr">{t}: </span>{e(v)}</span></li>' if v else ""
    redes = []
    if p["instagram"]: redes.append(f'<a href="https://www.instagram.com/{e(p["instagram"])}/" target="_blank" rel="noopener"><span class="d-ico">{icono("instagram")}</span>@{e(p["instagram"])}</a>')
    if p.get("facebook"): redes.append(f'<a href="{e(fb_url(p["facebook"]))}" target="_blank" rel="noopener"><span class="d-ico">{icono("facebook")}</span>Facebook</a>')
    if p["email"]: redes.append(f'<a href="{e(mailto(p["email"]))}"><span class="d-ico">{icono("email")}</span>{e(p["email"])}</a>')
    verif = ("ARANDU comprobó esta matrícula ante el colegio o consejo profesional." if p.get("verificado")
             else "Matrícula informada por el profesional. La verificación ante el colegio profesional está en curso.")
    mismos = [q for q in PROFS if q["localidad"] == p["localidad"] and q["id"] != p["id"]][:4]
    otros = "".join(f'<a class="otro" href="{q["slug"]}.html">{foto_html(q, base)}<span>{e(q["nombre"])}<small>{e(q["profesion"])}</small></span></a>' for q in mismos)
    titulo = f'{p["nombre"]} – {prof_nombre} en {p["localidad"]}, Chaco | {C["nombreCorto"]}'
    desc = f'{p["nombre"]}, {p["titulo"]}. {p["resumen"]}'[:300]
    ld_p = {"@context": "https://schema.org", "@type": "Person", "name": p["nombre"], "jobTitle": prof_nombre,
            "description": p["resumen"], "url": url, **({"image": SITIO + "/" + p["foto"]} if p["foto"] else {}),
            "address": {"@type": "PostalAddress", "addressLocality": p["localidad"], "addressRegion": p["provincia"], "addressCountry": "AR",
                        **({"streetAddress": p["direccion"]} if p["direccion"] else {})},
            "knowsAbout": p["areas"] or None, "memberOf": {"@type": "Organization", "name": C["nombreRed"], "url": SITIO + "/"},
            "sameAs": [x for x in [p["instagram"] and f'https://www.instagram.com/{p["instagram"]}/', p.get("facebook") and fb_url(p["facebook"])] if x] or None}
    ld_p = {k: v for k, v in ld_p.items() if v}
    cuerpo = f'''{nav}
<main id="contenido" class="pagina">
 <div class="contenedor">
  <div class="perfil-wrap" data-prof-id="{p["id"]}" data-origen="perfil">
   <div>
    <div class="perfil-cab">{foto_html(p, base)}
     <div><div class="t-sellos">{etq_prof(p)}{f'<span class="sello-fund">★ {e(p["rol"])}</span>' if p.get("rol") else ""}</div>
      <h1>{e(p["nombre"])}</h1><p class="tit">{e(p["titulo"])}</p>
      {sello_html(p)} <p class="verif-nota">{verif} <a href="{base}profesionales.html#verificacion">Cómo verificamos</a></p>
      <p class="t-meta" style="margin-top:8px"><span>📍 {e(p["localidad"])}, {e(p["provincia"])}</span><span>{e(modalidad_txt(p))}</span>{f'<span class="t-restr">{e(p["restriccion"])}</span>' if p.get("restriccion") else ""}</p></div>
    </div>
    <section class="p-bloque" aria-labelledby="h-pres"><h2 id="h-pres">Presentación</h2>{pres}</section>
    {f'<section class="p-bloque" aria-labelledby="h-form"><h2 id="h-form">Formación y especializaciones</h2><ul>{formacion}</ul></section>' if formacion else ""}
    <section class="p-bloque" aria-labelledby="h-areas"><h2 id="h-areas">Áreas de trabajo</h2>
      {f"<ul>{areas}</ul>" if areas else ""}
      {f'<h3 class="sr">Motivos de consulta</h3><ul class="p-etiquetas" style="margin-top:14px">{motivos}</ul>' if motivos else ""}
      <ul class="datos-ico" style="margin-top:16px">{fila("poblacion","Población", p.get("poblacionDetalle") or ", ".join(p["poblacion"]))}{fila("enfoque","Enfoque", p["enfoqueDetalle"])}</ul>
    </section>
    {f'<section class="p-bloque" aria-labelledby="h-serv"><h2 id="h-serv">Servicios</h2><ul class="p-etiquetas">{"".join(f"<li>{e(x)}</li>" for x in p.get("servicios") or [])}</ul></section>' if p.get("servicios") else ""}
    <section class="p-bloque" aria-labelledby="h-mod"><h2 id="h-mod">Modalidad de atención</h2><ul class="datos-ico">
      {fila("modalidad","Modalidad", modalidad_txt(p))}{fila("localidad","Localidad", p["localidad"] + ", " + p["provincia"])}{fila("direccion","Dirección", p["direccion"])}{fila("idiomas","Idiomas", p["idiomas"])}{fila("accesibilidad","Accesibilidad", p.get("accesibilidad"))}{fila("telefonos","Teléfonos", p["telefonos"])}
    </ul></section>
    <section class="p-bloque" aria-labelledby="h-cons"><h2 id="h-cons">Información de consulta</h2><ul class="datos-ico">
      {fila("atencion","Atención", p["atencion"])}{fila("reintegro","Reintegros", "Emite factura para gestionar reintegros con tu obra social" if p["reintegro"] else "")}{fila("honorarios","Honorarios", ("Honorarios: " + p["honorarios"]) if p["honorarios"] and len(p["honorarios"])<14 else p["honorarios"])}{fila("disponibilidad","Disponibilidad", p["disponibilidad"])}
    </ul>{'' if (p["atencion"] or p["honorarios"] or p["disponibilidad"] or p["reintegro"]) else '<p>Consultá honorarios, obra social y horarios directamente con el profesional.</p>'}</section>
    {f'<section aria-labelledby="h-otros"><h2 id="h-otros" style="font-size:20px;color:#333;margin:26px 0 12px">Otros profesionales en {e(p["localidad"])}</h2><div class="otros">{otros}</div></section>' if otros else ""}
   </div>
   <aside class="p-lateral" aria-label="Contacto">
    <div class="p-bloque">
     <h2>Contacto directo</h2>
     {boton_contacto(p)}
     <p style="font-size:13.5px;color:#666;margin:10px 0 0">{"Se abre WhatsApp con un mensaje que indica que llegás desde ARANDU." if not p["whatsapp"].startswith("http") else "Se abre WhatsApp."} La conversación es directamente con el profesional.</p>
    </div>
    {f'<div class="p-bloque"><h2>Redes y contacto</h2><div class="p-redes">{"".join(redes)}</div></div>' if redes else ""}
    <div class="p-bloque"><h2>Compartir este perfil</h2>
     <button type="button" class="btn-sec" data-compartir="{e(url)}" data-titulo="{e(p["nombre"])}" data-prof="{p["id"]}">Copiar enlace</button>
     <a class="btn-sec" style="margin-top:8px;width:100%" href="https://wa.me/?text={e(__import__("urllib.parse").parse.quote(p["nombre"] + " – " + url))}" target="_blank" rel="noopener" data-evento="compartir-whatsapp" data-dato="{p["id"]}">Compartir por WhatsApp</a>
    </div>
    <a class="btn-link" href="{base}index.html#profesionales">← Volver al directorio</a>
   </aside>
  </div>
 </div>
 <div class="cta-movil" data-prof-id="{p["id"]}" data-origen="perfil-movil">{boton_contacto(p)}</div>
</main>'''
    return pagina(ruta, titulo, desc, cuerpo, base=base, activo="buscar",
                  og_img=(p["foto"] or "img/og-imagen.jpg"), ld=[ld_p, ld_m], clase_body="con-cta-movil",
                  robots="index,follow")

for p in PROFS: GENERADAS.append(pagina_profesional(p))

# ======================================================================
# 2) PÁGINAS POR LOCALIDAD (solo donde hay profesionales)
# ======================================================================
INTRO_LOC = {
    "Villa Ángela": "Villa Ángela concentra hoy la mayor parte de ARANDU. Acá vas a encontrar psicólogas, psicólogos y otros profesionales de la salud mental y el desarrollo que atienden en consultorio en la ciudad y, en muchos casos, también online.",
    "Resistencia": "Profesionales de ARANDU que atienden en Resistencia, de forma presencial y online. A medida que se sumen más colegas de la capital chaqueña, los vas a ver en esta página.",
    "Presidencia Roque Sáenz Peña": "Profesionales de ARANDU que atienden en Presidencia Roque Sáenz Peña, de forma presencial y online.",
}
def tarjeta_estatica(p, base):
    mot = "".join(f'<li>{e(CAT[c]["nombre"])}</li>' for c in p["cats"][:3])
    return f'''<article class="tarjeta" data-prof-id="{p["id"]}" data-origen="localidad">
    <div class="t-cab">{foto_html(p, base, "t-foto")}<div class="t-id"><h3 class="t-nombre"><a href="{base}profesional/{p["slug"]}.html">{e(p["nombre"])}</a></h3><div class="t-sellos">{etq_prof(p)}</div>{sello_html(p)}</div></div>
    <p class="t-resumen">{e(p["resumen"])}</p>
    <p class="t-meta"><span>📍 {e(p["localidad"])}</span><span>{e(modalidad_txt(p))}</span>{f'<span class="t-restr">{e(p["restriccion"])}</span>' if p.get("restriccion") else ""}</p>
    {f'<ul class="t-motivos">{mot}</ul>' if mot else ""}
    <div class="t-acciones">{boton_contacto(p)}<a class="btn-sec" href="{base}profesional/{p["slug"]}.html">Ver perfil completo</a></div></article>'''

for loc in LOCS:
    base = "../"
    lista = [p for p in PROFS if p["localidad"] == loc]
    ps = sorted({p["profesion"] for p in lista})
    nombre_prof = "Psicólogos y profesionales de la salud mental" if "Psicología" in ps else "Profesionales de la salud mental y el desarrollo"
    ruta = f"localidad/{slug(loc)}.html"
    nav, ld_m = migas(base, [("Inicio", "index.html"), (f"Profesionales en {loc}", "")])
    online = sum(1 for p in lista if "Online" in p["modalidad"])
    cuerpo = f'''{nav}
<main id="contenido" class="pagina"><div class="contenedor">
 <div class="pagina-texto"><h1>{nombre_prof} en {e(loc)}, Chaco</h1>
 <p class="bajada">{e(INTRO_LOC.get(loc, f"Profesionales de ARANDU que atienden en {loc}."))}</p>
 <p>{len(lista)} {"profesional" if len(lista)==1 else "profesionales"} · {online} con atención online · Disciplinas: {e(", ".join(ps))}.</p></div>
 <div class="grilla" style="margin-top:20px">{"".join(tarjeta_estatica(p, base) for p in lista)}</div>
 <div class="cta-final"><p>¿Buscás por motivo de consulta, profesión o atención online?</p><a class="btn-sec" href="{base}index.html#profesionales">Ir al buscador completo</a></div>
</div></main>'''
    ld_l = {"@context": "https://schema.org", "@type": "ItemList", "name": f"{nombre_prof} en {loc}",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{SITIO}/profesional/{p['slug']}.html", "name": p["nombre"]} for i, p in enumerate(lista)]}
    GENERADAS.append(pagina(ruta, f"{nombre_prof} en {loc}, Chaco | {C['nombreCorto']}",
                            f"{nombre_prof} en {loc}, Chaco: {len(lista)} profesionales con matrícula, atención presencial y online. Contacto directo por WhatsApp.",
                            cuerpo, base=base, activo="buscar", ld=[ld_l, ld_m]))

# ======================================================================
# 3) BIENESTAR Y ORIENTACIÓN
# ======================================================================
AUTORIA = '<p class="autoria">Texto: equipo de ARANDU. <strong>Revisión profesional: pendiente.</strong> Este contenido es orientativo y no reemplaza una consulta con un profesional.</p>'
CTA_BUSCAR = lambda base: f'<div class="cta-final"><p>¿Querés hablarlo con alguien?</p><a class="btn-sec" href="{base}index.html#profesionales">Buscar profesionales</a></div>'
AVISO_EJ = '<p class="aviso">Este ejercicio puede ayudarte a bajar la intensidad en un momento difícil, pero no reemplaza la atención profesional. Si te sentís en riesgo, llamá al 911 o a la guardia de salud mental: ' + C["guardiaDiurna"] + ' (día) · ' + C["guardiaNocturna"] + ' (noche).</p>'

RECURSOS = [
 # (grupo, slug, tipo, titulo, resumen, contenido_html)
 ("B", "respiracion-guiada", "Ejercicio guiado", "Respiración guiada de 2 minutos",
  "Un círculo que se expande y se contrae para acompañar tu respiración y bajar el ritmo.",
  AVISO_EJ + '''<p>Este ejercicio usa una respiración en la que la exhalación dura más que la inhalación. Exhalar despacio suele ayudar al cuerpo a pasar a un estado de más calma.</p>
<ol><li>Buscá una posición cómoda, sentado o acostado.</li><li>Tocá <strong>Empezar</strong> y seguí el círculo: inhalá por la nariz mientras crece (4 segundos) y exhalá despacio por la boca mientras se achica (6 segundos).</li><li>Repetí unas 12 veces, unos 2 minutos. Si te mareás, pará y respirá normalmente.</li></ol>
<div class="respira" id="respira"><div class="circ" aria-hidden="true"></div><p class="fase" aria-live="polite">Cuando quieras, empezamos</p><button type="button" id="respira-btn">Empezar</button></div>
<script>
(function(){const c=document.querySelector("#respira .circ"),f=document.querySelector("#respira .fase"),b=document.getElementById("respira-btn");let t=null,n=0;
function ciclo(){c.className="circ inhala";f.textContent="Inhalá…";t=setTimeout(()=>{c.className="circ exhala";f.textContent="Exhalá despacio…";t=setTimeout(()=>{n++;if(n>=12){parar(true);}else ciclo();},6000);},4000);}
function parar(fin){clearTimeout(t);t=null;n=0;c.className="circ";f.textContent=fin?"Bien hecho. Tomate un momento antes de seguir.":"Cuando quieras, empezamos";b.textContent="Empezar";}
b.addEventListener("click",()=>{if(t){parar(false);}else{b.textContent="Detener";ciclo();}});})();
</script>'''),
 ("B", "ejercicio-5-4-3-2-1", "Ejercicio", "Ejercicio 5-4-3-2-1 para volver al presente",
  "Una técnica sencilla con los sentidos para cuando la ansiedad o los pensamientos te desbordan.",
  AVISO_EJ + '''<p>Cuando la mente se acelera, llevar la atención a los sentidos ayuda a volver al aquí y ahora. Hacelo despacio, sin apuro:</p>
<ol><li><strong>5 cosas que podés ver.</strong> Nombralas en voz baja o mentalmente: un color, una forma, un objeto.</li>
<li><strong>4 cosas que podés tocar.</strong> La tela de tu ropa, la silla, tus manos, el piso bajo los pies.</li>
<li><strong>3 cosas que podés escuchar.</strong> Sonidos cercanos y lejanos.</li>
<li><strong>2 cosas que podés oler.</strong> Si no notás ninguna, recordá un olor que te guste.</li>
<li><strong>1 cosa que podés saborear.</strong> O un sabor que te resulte agradable.</li></ol>
<p>Al terminar, hacé una respiración lenta y fijate cómo estás ahora. Si la sensación de angustia es frecuente, hablarlo con un profesional puede ayudarte a entender qué la provoca.</p>'''),
 ("B", "pausa-consciente", "Pausa", "Pausa consciente de un minuto",
  "Un alto breve en medio del día para registrar cómo estás y bajar un cambio.",
  AVISO_EJ + '''<ol><li><strong>Pará.</strong> Dejá lo que estés haciendo y apoyá los pies en el piso.</li>
<li><strong>Respirá.</strong> Tres respiraciones lentas, sintiendo cómo entra y sale el aire.</li>
<li><strong>Registrá.</strong> ¿Qué sentís en el cuerpo? ¿Qué emoción aparece? No hace falta cambiar nada, solo notarlo.</li>
<li><strong>Elegí.</strong> Preguntate qué necesitás ahora: agua, moverte, pedir ayuda, terminar algo o descansar.</li></ol>
<p>También podés activar el <strong>ambiente relajante</strong> con el botón de abajo a la izquierda y quedarte un minuto escuchándolo.</p>'''),
 ("C", "cuando-consultar", "Guía", "¿Cuándo consultar a un profesional?",
  "Señales para darte cuenta de que pedir ayuda puede hacerte bien, aunque no estés en crisis.",
  '''<p>No hace falta estar mal para empezar terapia. Muchas personas consultan para entender algo que les pasa, atravesar un cambio o sentirse mejor. Algunas señales de que puede ser un buen momento:</p>
<ul><li>La ansiedad, la tristeza o el enojo duran semanas y afectan tu día a día.</li><li>Te cuesta dormir, concentrarte o disfrutar lo que antes te gustaba.</li>
<li>Estás atravesando una pérdida, una separación, un cambio de trabajo o una mudanza.</li><li>Hay conflictos repetidos en la pareja, la familia o el trabajo.</li>
<li>Te preocupa el desarrollo, el lenguaje, el aprendizaje o la conducta de un niño o una niña.</li><li>Alguien cercano te sugirió consultar.</li></ul>
<p class="aviso">Si pensás en hacerte daño o sentís que no podés más, no esperes: llamá al 911 o a la guardia de salud mental del Chaco, ''' + C["guardiaDiurna"] + ''' (día) · ''' + C["guardiaNocturna"] + ''' (noche).</p>'''),
 ("C", "como-elegir-profesional", "Guía", "Cómo elegir a tu profesional",
  "Qué mirar en un perfil y qué preguntar en el primer contacto.",
  '''<ol><li><strong>Empezá por lo que te pasa.</strong> En el buscador podés elegir un motivo (por ejemplo, ansiedad, duelo o crianza) y ver quiénes trabajan con eso.</li>
<li><strong>Mirá la disciplina.</strong> No es lo mismo una psicóloga que una psiquiatra o una fonoaudióloga. Si tenés dudas, leé la guía sobre las diferencias entre disciplinas.</li>
<li><strong>Revisá la matrícula.</strong> Cada ficha indica la matrícula y si ARANDU ya la verificó.</li>
<li><strong>Pensá en lo práctico.</strong> Presencial u online, horarios, obra social o reintegro, honorarios.</li>
<li><strong>Escribí sin compromiso.</strong> Preguntar disponibilidad o modalidad no te obliga a nada.</li>
<li><strong>Date tiempo.</strong> Sentirte cómodo con la persona que te acompaña es importante. Si después de algunos encuentros no te sentís a gusto, podés buscar a otra persona.</li></ol>'''),
 ("C", "primera-consulta", "Guía", "Qué esperar de una primera consulta",
  "Cómo suele ser el primer encuentro y qué podés preguntar.",
  '''<p>Cada profesional trabaja a su manera, pero en general el primer encuentro sirve para conocerse:</p>
<ul><li>Vas a poder contar qué te trae a consulta, con tus palabras y a tu ritmo. No hace falta tener todo claro.</li>
<li>El profesional puede hacerte preguntas sobre tu historia, tu presente y lo que esperás.</li>
<li>Es un buen momento para preguntar cómo trabaja, con qué frecuencia serían los encuentros, cuánto dura cada sesión y cuáles son los honorarios.</li>
<li>Lo que se habla en consulta está protegido por el secreto profesional.</li></ul>
<p>Es normal sentir nervios. Podés decirlo: también es parte de lo que se puede trabajar.</p>'''),
 ("C", "diferencias-entre-disciplinas", "Guía", "Diferencias entre las disciplinas de ARANDU",
  "Psicología, psiquiatría, psicopedagogía, fonoaudiología y más: qué hace cada una.",
  '''<dl class="datos" style="grid-template-columns:1fr">
<dt>Psicología</dt><dd>Acompaña el malestar emocional y los conflictos a través de la palabra (psicoterapia). También realiza evaluaciones y orientación vocacional.</dd>
<dt>Psiquiatría</dt><dd>Es una especialidad médica: diagnostica y trata problemas de salud mental y, cuando hace falta, indica medicación. Muchas veces trabaja junto con la psicología.</dd>
<dt>Psicopedagogía</dt><dd>Se ocupa de los procesos de aprendizaje y de las dificultades en la escuela o en el estudio.</dd>
<dt>Fonoaudiología</dt><dd>Trabaja el lenguaje, el habla, la voz, la audición, la respiración y la deglución, en niños y adultos.</dd>
<dt>Terapia ocupacional</dt><dd>Busca que la persona gane autonomía en las actividades de la vida diaria, el juego, el estudio o el trabajo.</dd>
<dt>Psicomotricidad</dt><dd>Acompaña el desarrollo a través del cuerpo y el movimiento, sobre todo en la infancia.</dd>
<dt>Estimulación temprana</dt><dd>Acompaña el desarrollo de bebés y niños pequeños, y orienta a sus familias.</dd>
<dt>Acompañamiento terapéutico</dt><dd>Brinda apoyo cotidiano a una persona en su entorno, como parte de un tratamiento indicado por un equipo de salud.</dd></dl>
<p>Si no sabés por dónde empezar, una consulta psicológica suele ser un buen primer paso: el profesional te puede orientar si necesitás otra disciplina.</p>'''),
 ("C", "presencial-u-online", "Guía", "Atención presencial u online: cómo elegir",
  "Ventajas de cada modalidad y algunos consejos para las sesiones por videollamada.",
  '''<ul><li><strong>Presencial:</strong> el encuentro cara a cara en un consultorio. Puede ser mejor si preferís separar el espacio de terapia de tu casa, o para el trabajo con niños.</li>
<li><strong>Online:</strong> evita traslados, permite atenderte con profesionales de otras localidades y se adapta mejor a horarios ajustados.</li></ul>
<p>Para las sesiones online: buscá un lugar donde puedas hablar con privacidad, usá auriculares si podés y revisá la conexión unos minutos antes.</p>
<p>En el buscador podés filtrar por <strong>Online</strong> para ver quiénes atienden desde cualquier lugar.</p>'''),
 ("C", "acompanar-ninos-y-adolescentes", "Guía", "Cómo acompañar a niños y adolescentes",
  "Señales a las que prestar atención y cómo hablar del tema en casa.",
  '''<p>Las infancias y adolescencias atraviesan cambios constantes, y no todo malestar necesita una consulta. Algunas señales que conviene mirar con más atención:</p>
<ul><li>Cambios marcados y sostenidos en el sueño, la alimentación, el humor o el rendimiento escolar.</li><li>Aislamiento, miedos intensos o enojo que no cede.</li>
<li>Dificultades para hablar, comprender o aprender que se mantienen en el tiempo.</li><li>Situaciones difíciles en la familia: separaciones, duelos, mudanzas.</li></ul>
<p>Hablar con calma, escuchar sin juzgar y contarle a tu hijo o hija que van a buscar ayuda juntos suele bajar la ansiedad. En ARANDU hay profesionales de distintas disciplinas que trabajan con niñas, niños, adolescentes y sus familias.</p>'''),
]
PROXIMOS_A = ["Ansiedad", "Estrés", "Duelo", "Salud emocional", "Crianza", "Adolescencia", "Vínculos", "Desarrollo infantil", "Salud mental familiar"]
GRUPOS = {"A": ("Entender lo que me pasa", "Artículos escritos por profesionales de ARANDU.", "📖", "#e0eff3"),
          "B": ("Tomarme un momento", "Ejercicios breves de respiración, pausa y regulación emocional.", "🌿", "#f3e6f0"),
          "C": ("Encontrar orientación", "Guías prácticas para dar el primer paso.", "🧭", "#fdf1d8")}

for g, sl, tipo, tit, res, contenido in RECURSOS:
    base = "../"
    ruta = f"bienestar/{sl}.html"
    nav, ld_m = migas(base, [("Inicio", "index.html"), ("Bienestar y orientación", "bienestar/index.html"), (tit, "")])
    cuerpo = f'''{nav}<main id="contenido" class="pagina"><div class="contenedor"><article class="pagina-texto">
<p class="rec"><span class="tipo" style="border:0">{e(GRUPOS[g][0])} · {e(tipo)}</span></p>
<h1>{e(tit)}</h1><p class="bajada">{e(res)}</p>{contenido}{AUTORIA}{CTA_BUSCAR(base)}</article></div></main>'''
    ld_a = {"@context": "https://schema.org", "@type": "Article", "headline": tit, "description": res, "inLanguage": "es-AR",
            "publisher": {"@type": "Organization", "name": C["nombreRed"]}, "dateModified": HOY}
    GENERADAS.append(pagina(ruta, f"{tit} | {C['nombreCorto']}", res, cuerpo, base=base, activo="bienestar", ld=[ld_a, ld_m]))

def tarjetas_grupo(g, base):
    if g == "A":
        return "".join(f'<article class="rec prox"><span class="tipo">Artículo</span><h3>{e(t)}</h3><p>Escrito por profesionales de ARANDU.</p><div class="acc"><span class="etq-prox">Próximamente</span></div></article>' for t in PROXIMOS_A)
    return "".join(f'<article class="rec"><span class="tipo">{e(tipo)}</span><h3>{e(tit)}</h3><p>{e(res)}</p><div class="acc"><a class="btn-sec" href="{base}bienestar/{sl}.html">{"Hacer el ejercicio" if gg=="B" else "Leer la guía"}<span class="sr">: {e(tit)}</span></a></div></article>'
                   for gg, sl, tipo, tit, res, _ in RECURSOS if gg == g)

base = "../"
nav, ld_m = migas(base, [("Inicio", "index.html"), ("Bienestar y orientación", "")])
secciones = "".join(f'''<section aria-labelledby="g-{g}" style="margin-top:40px"><h2 id="g-{g}" style="font-size:24px;color:#333;display:flex;gap:10px;align-items:center"><span aria-hidden="true">{GRUPOS[g][2]}</span>{e(GRUPOS[g][0])}</h2>
<p style="margin:0 0 16px">{e(GRUPOS[g][1])}</p><div class="recursos-grid">{tarjetas_grupo(g, base)}</div></section>''' for g in "ABC")
cuerpo = f'''{nav}<main id="contenido" class="pagina"><div class="contenedor">
<div class="pagina-texto"><h1>Bienestar y orientación</h1><p class="bajada">Recursos para entender lo que te pasa, tomarte un momento y encontrar el acompañamiento adecuado.</p>
<p class="aviso">Estos recursos no reemplazan la atención profesional. Si estás en una situación de urgencia, llamá al 911 o a la guardia de salud mental del Chaco: {e(C["guardiaDiurna"])} (día) · {e(C["guardiaNocturna"])} (noche).</p></div>
{secciones}{CTA_BUSCAR(base)}</div></main>'''
GENERADAS.append(pagina("bienestar/index.html", f"Bienestar y orientación en salud mental | {C['nombreCorto']}",
                        "Ejercicios de respiración, guías para elegir profesional y saber cuándo consultar. Recursos gratuitos de ARANDU, red de salud mental del Chaco y el NEA.",
                        cuerpo, base=base, activo="bienestar", ld=[ld_m]))

# ======================================================================
# 4) PÁGINAS INSTITUCIONALES
# ======================================================================
def texto_modal(nombre):
    h = open(os.path.join(FUENTE, "textos", nombre), encoding="utf-8").read()
    h = re.sub(r'<(strong|span) class="nombre-red"[^>]*></\1>', lambda m: f'<{m.group(1)}>{e(C["nombreRed"])}</{m.group(1)}>', h)
    h = re.sub(r'<strong class="mail-red"></strong>', f'<a href="mailto:{e(C["emailRed"])}">{e(C["emailRed"])}</a>', h)
    h = re.sub(r'<span id="fecha-(priv|term)"></span>', e(C["fechaLegales"]), h)
    h = re.sub(r'<button type="button" data-abrir="modal-privacidad"[^>]*>(.*?)</button>', r'<a href="privacidad.html">\1</a>', h)
    h = re.sub(r'<button type="button" data-abrir="modal-terminos"[^>]*>(.*?)</button>', r'<a href="terminos.html">\1</a>', h)
    h = re.sub(r'<h2 id="t-[a-z]+">', '<h1>', h, count=1).replace("</h2>", "</h1>", 1)
    h = re.sub(r'<h3>', '<h2>', h).replace("</h3>", "</h2>")
    return h

nav, ld_m = migas("", [("Inicio", "index.html"), ("Nosotros", "")])
nos = texto_modal("nosotros.html")
que = texto_modal("que-hacemos.html").replace("<h1>", '<h2 id="que-hacemos">').replace("</h1>", "</h2>")
GENERADAS.append(pagina("nosotros.html", f"Nosotros | {C['nombreCorto']}",
    "Quiénes somos, nuestra misión y cómo verificamos a los profesionales de ARANDU, red de salud mental, neurodesarrollo y bienestar del Chaco.",
    f'{nav}<main id="contenido" class="pagina"><div class="contenedor"><div class="pagina-texto">{nos}{que}{CTA_BUSCAR("")}</div></div></main>',
    activo="nosotros", ld=[ld_m, {"@context": "https://schema.org", "@type": "AboutPage", "name": "Nosotros", "url": SITIO + "/nosotros.html"}]))

PENDIENTE_TITULAR = f'''<div class="pendiente-legal" style="border-color:var(--petroleo);background:#eef6f8"><strong>Responsable:</strong>
<ul><li>Lorena C. Insaurralde, licenciada en Psicología, M.P. 750</li><li>{e(C["nombreRed"])}</li></ul></div>'''
priv = texto_modal("privacidad.html")
priv = priv.replace("<h2>1. Quiénes somos</h2>", "<h2>1. Quiénes somos</h2>" + PENDIENTE_TITULAR, 1)
priv = priv.replace("<h2>3. Lo que NO hacemos</h2>", '''<h2>2 bis. Páginas de cada profesional</h2><p>Cada profesional tiene una página propia. Las métricas cuentan cuántas veces se visita cada página y cuántos clics recibe cada botón de contacto, siempre en forma agregada y sin identificar a quien la visita. Nunca registramos lo que escribís en el buscador ni el motivo de consulta que elegís.</p>
<h2>3. Lo que NO hacemos</h2>''', 1)
nav, ld_m = migas("", [("Inicio", "index.html"), ("Política de privacidad", "")])
GENERADAS.append(pagina("privacidad.html", f"Política de privacidad | {C['nombreCorto']}",
    "Cómo cuida ARANDU tu privacidad: métricas anónimas sin cookies, sin registro de mensajes ni motivos de consulta.",
    f'{nav}<main id="contenido" class="pagina"><div class="contenedor"><div class="pagina-texto">{priv}</div></div></main>', activo="privacidad", ld=[ld_m]))
term = texto_modal("terminos.html")
nav, ld_m = migas("", [("Inicio", "index.html"), ("Términos y condiciones", "")])
GENERADAS.append(pagina("terminos.html", f"Términos y condiciones | {C['nombreCorto']}",
    "Términos y condiciones de uso del directorio de profesionales de salud mental y desarrollo del Chaco.",
    f'{nav}<main id="contenido" class="pagina"><div class="contenedor"><div class="pagina-texto">{term}</div></div></main>', activo="terminos", ld=[ld_m]))

# ---------- Para profesionales (Sumate a ARANDU) ----------
from urllib.parse import quote
mail_alta = f'mailto:{C["emailSumarse"]}?subject={quote("Quiero sumarme a ARANDU")}&body={quote("Hola, soy profesional de la salud mental / desarrollo y quiero sumarme a ARANDU." + chr(10)*2 + "Nombre y apellido:" + chr(10) + "Profesión:" + chr(10) + "Matrícula:" + chr(10) + "Localidad:" + chr(10) + "WhatsApp:" + chr(10) + "Instagram:" + chr(10))}'
WA_ALTA = "https://wa.me/message/YNFMM2C46JB6M1"
nav, ld_m = migas("", [("Inicio", "index.html"), ("Sumate a ARANDU", "")])
n_prof, n_loc, n_disc = len(PROFS), len(LOCS), len({p["profesion"] for p in PROFS})
def botones(txt_mail):
    return f"""<div class="btns-par"><a class="btn-buscar" href="{e(mail_alta)}" data-evento="alta-profesional" data-dato="email">{txt_mail}</a>
<a class="btn-wa" href="{WA_ALTA}" target="_blank" rel="noopener" data-evento="alta-profesional" data-dato="whatsapp">{ICON_WA}<span>Escribime por WhatsApp</span><span class="sr"> (se abre en una pestaña nueva)</span></a></div>"""
cuerpo = f"""{nav}<main id="contenido" class="pagina"><div class="contenedor"><div class="pagina-texto">
<h1>Sumate a ARANDU</h1>
<p class="bajada">Arandu significa sabiduría en guaraní: escuchar y sentir al mismo tiempo. Así queremos acompañar. Somos una red regional creada por profesionales, para que tu consulta llegue a quienes la necesitan y para que nadie trabaje solo.</p>
<p><em>Un ecosistema de sabiduría colectiva al servicio de la comunidad.</em></p>
{botones("Soy profesional y quiero sumarme")}
<p style="font-size:14px;color:#666">Podés mandarnos tus datos por email o escribirme directamente por WhatsApp.</p>

<h2>Qué es ARANDU</h2>
<p>ARANDU es un ecosistema para profesionales de la salud mental, el neurodesarrollo y el bienestar del Chaco, con proyección a todo el NEA. Su primer espacio es el directorio: hoy reúne {n_prof} profesionales de {n_disc} {"disciplina" if n_disc==1 else "disciplinas"} en {n_loc} {"localidad" if n_loc==1 else "localidades"}.</p>
<p>Como para el pueblo guaraní y muchos originarios de nuestra región, creemos que la salud es una trama: no depende solo de lo que pasa dentro de una persona, sino también de sus vínculos, su comunidad y el lugar donde vive. Por eso apostamos a profesionales cercanos, que conocen el territorio y trabajan en red. Que integra y eleva la consciencia en las formas de tratar la enfermedad y generar salud a través del equilibrio entre todas las partes que componen a una persona, su entorno, la naturaleza, la espiritualidad y su propia manera de estar en la vida. En guaraní, ñe’ẽ es palabra y es alma. Acá cada voz cuenta. Sumá la tuya y compartí lo que tu trabajo ya está sembrando en las personas.</p>
<p>No intermediamos en la relación terapéutica ni en el cobro de honorarios: las personas te escriben directamente.</p>

<h2>Qué te ofrece</h2>
<p><strong>Visibilidad con criterio y alineado a la esencia de tu trabajo</strong></p>
<ul><li>Una ficha completa y una página propia con un enlace para compartir en tus redes.</li>
<li>Contacto directo por WhatsApp, con un mensaje que indica que la consulta llega desde ARANDU.</li>
<li>Búsqueda por localidad, disciplina y motivo de consulta. Te encuentran incluso quienes no conocen el nombre de tu especialidad.</li>
<li>Orden rotativo: los perfiles cambian de lugar en cada visita y nadie queda siempre primero.</li>
<li>Un informe mensual con las visitas a tu perfil y los clics en tus botones de contacto.</li></ul>
<p><strong>Comunidad ARANDU</strong></p>
<p>Al sumarte formás parte de la Comunidad ARANDU, un espacio de colegas para:</p>
<ul><li>Armar equipos interdisciplinarios con profesionales de distintas disciplinas.</li>
<li>Derivar e interconsultar con confianza, pensando siempre en la persona.</li>
<li>Recibir material para mejorar tus servicios y tu visibilidad con un marketing sostenible, consciente y transformador: comunicar quién sos con honestidad, estrategia y conocimiento, sin perder tu forma de trabajar.</li>
<li>Publicar artículos en <a href="https://redprofesionales-chaco-vercel.vercel.app/bienestar/index.html">Bienestar y orientación</a>.</li>
<li><span class="etq-prox">Próximamente</span> mentorías Profesiones con alma, para estructurar tu consultorio, tus servicios y tus productos. Integraciones de calendario, agenda, reservas, turnos y pagos.</li></ul>
<p>Creemos que cada profesional tiene su propia verdad para compartir, y que ese saber se nutre todos los días de nuestros pacientes, que también nos enseñan.</p>

<h2>Lo que nos une</h2>
<p>Quienes formamos ARANDU compartimos un manifiesto y estos compromisos:</p>
<ul><li>Ejercer con matrícula vigente y dentro de nuestra incumbencia.</li><li>Cuidar la confidencialidad de cada persona.</li>
<li>Comunicar con evidencia, sin prometer curas ni resultados.</li><li>Derivar pensando en la persona, no en la competencia.</li>
<li>Respetar los saberes originarios que inspiran nuestro nombre.</li></ul>

<h2>Cómo es la inscripción</h2>
<ol><li>Completás el formulario con tu formación, enfoque, población, modalidad, contacto y una presentación breve, y nos mandás una foto.</li>
<li>Nos enviás tu autorización escrita para publicar tu foto, tu matrícula, tus datos de contacto y tu presentación.</li>
<li>Verificamos tu matrícula y revisamos la ficha con vos antes de publicarla.</li>
<li>Publicamos tu perfil y te enviamos el enlace. ¡Bienvenida, bienvenido a la trama!</li></ol>

<h2 id="verificacion">Cómo verificamos la documentación</h2>
<ul><li><strong>Matrícula:</strong> confirmamos ante el colegio o consejo profesional correspondiente que tengas título habilitante y matrícula provincial vigente.</li>
<li><strong>Revisión del perfil:</strong> controlamos que los datos publicados sean claros y te correspondan.</li>
<li><strong>Seguimiento:</strong> revisamos periódicamente que la información siga vigente.</li></ul>
<p>Mientras la verificación está en curso, la ficha muestra la matrícula como "informada por el profesional". Cuando termina, pasa a "verificada por ARANDU".</p>
<p class="destacado">La verificación nunca depende de un pago.</p>

<h2>Opciones de participación</h2>
<p>Durante la etapa de lanzamiento, sumarte a ARANDU no tiene costo. Incluye el perfil básico: ficha completa en el directorio, página propia y contacto directo.</p>
<p>Más adelante vamos a sumar un perfil ampliado y servicios para tu consultorio. Te vamos a avisar con anticipación, antes de cualquier cambio. Si en algún momento hay espacios de visibilidad pagos, siempre van a estar identificados como "espacio promocionado", separados de la verificación y sin alterar el orden rotativo.</p>

<h2>Cómo tener más visibilidad hoy</h2>
<ul><li>Completá todos los campos de tu ficha: áreas de trabajo, población, modalidad y disponibilidad.</li>
<li>Escribí una presentación clara y cercana. Si querés, te ayudamos a redactarla.</li>
<li>Compartí el enlace de tu perfil en tus redes y en tu estado de WhatsApp.</li>
<li>Proponé un artículo para <a href="https://redprofesionales-chaco-vercel.vercel.app/bienestar/index.html">Bienestar y orientación</a>.</li></ul>

<div class="cta-final cierre-arandu">
<p class="destacado grande">Escuchar y sentir. Así se teje ARANDU.</p>
<p>Sumá tu voz a ARANDU y hacé que tu trabajo llegue más lejos.</p>
<p>¿Tenés dudas? Escribinos a <a href="mailto:{e(C["emailSumarse"])}">{e(C["emailSumarse"])}</a> o por <a href="{WA_ALTA}" target="_blank" rel="noopener">WhatsApp</a>.</p>
{botones("Quiero sumarme")}
</div>
</div></div></main>"""
GENERADAS.append(pagina("profesionales.html", "Sumate a ARANDU | Profesionales de la salud mental, del desarrollo y bienestar",
    "ARANDU es un ecosistema de profesionales de la salud mental, el neurodesarrollo y el bienestar del Chaco y el NEA. Sumate: ficha verificada, página propia, contacto directo y comunidad de colegas.",
    cuerpo, activo="profesionales", ld=[ld_m]))


# ---------- Talleres y saberes ----------
TALLERES = D.get("TALLERES") or []
def tarjeta_taller(t):
    filas = [("Para quién", t.get("paraQuien")), ("Modalidad", " · ".join(x for x in [t.get("modalidad"), t.get("lugar")] if x)),
             ("Fecha", t.get("fecha")), ("Duración", t.get("duracion")), ("Valor", t.get("valor")), ("Facilita", t.get("facilitador"))]
    dl = "".join(f"<dt>{e(k)}</dt><dd>{e(v)}</dd>" for k, v in filas if v)
    img = f'<img src="{e(t["imagen"])}" alt="" class="tl-img">' if t.get("imagen") else ""
    btn = f'<a class="btn-buscar" href="{e(t["inscripcion"])}" target="_blank" rel="noopener" data-evento="inscripcion-taller" data-dato="{e(t.get("titulo"))}">Quiero participar</a>' if t.get("inscripcion") else ""
    return f'<article class="tl-card">{img}<div class="tl-cuerpo"><span class="tl-tipo">{e(t.get("tipo") or "Taller")}</span><h2>{e(t.get("titulo"))}</h2><p>{e(t.get("descripcion"))}</p><dl class="tl-datos">{dl}</dl>{btn}</div></article>'
nav, ld_m = migas("", [("Inicio", "index.html"), ("Talleres y saberes", "")])
if TALLERES:
    contenido_t = '<div class="tl-grid">' + "".join(tarjeta_taller(t) for t in TALLERES) + "</div>"
else:
    contenido_t = ('<div class="tl-vacio"><span class="etq-prox">Próximamente</span>'
                   '<p>Estamos preparando las primeras propuestas. Muy pronto vas a encontrar acá talleres, cursos y programas para acompañarte en tu bienestar.</p>'
                   '<a class="btn-sec" href="index.html#profesionales">Mientras tanto, buscá un profesional</a></div>')
cuerpo = (f'{nav}<main id="contenido" class="pagina"><div class="contenedor">'
          f'<div class="pagina-texto"><h1>Talleres y saberes</h1><p class="bajada">Talleres, cursos y programas.</p></div>'
          f'{contenido_t}</div></main>')
GENERADAS.append(pagina("talleres.html", f"Talleres y saberes | {C['nombreCorto']}",
    "Talleres, cursos y programas de ARANDU para la comunidad: salud mental, desarrollo y bienestar.",
    cuerpo, activo="talleres", ld=[ld_m]))

# ---------- 404 ----------
GENERADAS_404 = pagina("404.html", f"Página no encontrada | {C['nombreCorto']}", "La página que buscás no existe.",
    '<main id="contenido" class="pagina"><div class="contenedor"><div class="pagina-texto"><h1>No encontramos esta página</h1><p>Puede que el enlace haya cambiado. Volvé al inicio para buscar profesionales.</p><p><a class="btn-sec" href="/index.html">Ir al inicio</a></p></div></div></main>',
    robots="noindex")

# ======================================================================
# 5) INICIO
# ======================================================================
GENERADAS.append("index.html")
plantilla_inicio = open(os.path.join(FUENTE, "inicio.html"), encoding="utf-8").read()
bienestar_teaser = "".join(f'''<article class="b-card"><span class="b-ico" style="background:{GRUPOS[g][3]}" aria-hidden="true">{GRUPOS[g][2]}</span><h3>{e(GRUPOS[g][0])}</h3><p style="margin:0">{e(GRUPOS[g][1])}</p>
<ul>{"".join(f"<li>{e(t)}</li>" for t in ([*PROXIMOS_A[:3]] if g=="A" else [r[3] for r in RECURSOS if r[0]==g][:3]))}</ul>
<a class="btn-sec" href="bienestar/index.html#g-{g}">{"Ver artículos" if g=="A" else ("Tomarme un momento" if g=="B" else "Ver guías")}</a></article>''' for g in "ABC")
tarjetas_ssr = "".join(tarjeta_estatica(p, "") for p in PROFS)
ld_home = [{"@context": "https://schema.org", "@type": "WebSite", "name": C["nombreRed"], "url": SITIO + "/", "inLanguage": "es-AR"},
           {"@context": "https://schema.org", "@type": "Organization", "name": C["nombreRed"], "url": SITIO + "/", "logo": SITIO + "/favicon.svg",
            "areaServed": {"@type": "AdministrativeArea", "name": "Chaco, Argentina"}, "email": C["emailRed"]},
           {"@context": "https://schema.org", "@type": "ItemList", "name": "Profesionales de ARANDU",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{SITIO}/profesional/{p['slug']}.html", "name": p["nombre"]} for i, p in enumerate(PROFS)]}]
cuerpo = (plantilla_inicio.replace("{{BIENESTAR}}", bienestar_teaser).replace("{{TARJETAS}}", tarjetas_ssr)
          .replace("{{N_PROF}}", str(n_prof)).replace("{{N_LOC}}", str(n_loc)).replace("{{N_DISC}}", str(n_disc))
          .replace("{{G_DIA}}", e(C["guardiaDiurna"])).replace("{{G_NOCHE}}", e(C["guardiaNocturna"]))
          .replace("{{G_DIA_TEL}}", re.sub(r"\D", "", C["guardiaDiurna"])).replace("{{G_NOCHE_TEL}}", re.sub(r"\D", "", C["guardiaNocturna"]))
          .replace("{{NOMBRE_RED}}", e(C["nombreRed"])))
pagina("index.html", f"{C['nombreRed']} | Chaco",
       "Encontrá psicólogos, fonoaudiólogos y profesionales de la salud mental y el desarrollo en Villa Ángela, Resistencia, Sáenz Peña y todo el Chaco. Atención presencial y online, contacto directo por WhatsApp.",
       cuerpo, activo="buscar", ld=ld_home, scripts=("inicio.js",))

# ======================================================================
# 6) DATOS PARA EL NAVEGADOR, SITEMAP, ROBOTS
# ======================================================================
shutil.copy(os.path.join(FUENTE, "datos.js"), os.path.join(RAIZ, "assets", "datos.js"))
urls = [("", "1.0", "weekly")] + [(r, "0.8" if r.startswith("profesional/") else "0.7", "monthly") for r in GENERADAS if r != "index.html"]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    f"  <url><loc>{SITIO}/{r}</loc><lastmod>{HOY}</lastmod><changefreq>{f}</changefreq><priority>{pr}</priority></url>\n" for r, pr, f in urls) + "</urlset>\n"
open(os.path.join(RAIZ, "sitemap.xml"), "w").write(sm)
open(os.path.join(RAIZ, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nDisallow: /_fuente/\n\nSitemap: {SITIO}/sitemap.xml\n")
print(f"Listo: {len(GENERADAS)+1} páginas generadas. Sitio: {SITIO}")
