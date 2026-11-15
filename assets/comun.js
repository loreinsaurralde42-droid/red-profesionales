/* =====================================================================
   comun.js — funciones compartidas por todas las páginas
   (contacto, métricas, menú, reproductor de ambiente sonoro)
   ===================================================================== */
(function(){
"use strict";
const C = RED.CONFIG;
const BASE = document.documentElement.dataset.base || "";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const iniciales = n => n.replace(/^S\. /,"").split(" ").filter(Boolean).slice(0,2).map(p=>p[0]).join("").toUpperCase();
const enlaceWA = w => !w ? "" : /^https?:\/\//.test(w) ? w : "https://wa.me/"+String(w).replace(/\D/g,"")+"?text="+encodeURIComponent(C.mensajeWhatsApp);
const mailtoProf = e => "mailto:"+e+"?subject="+encodeURIComponent(C.asuntoEmail)+"&body="+encodeURIComponent(C.mensajeWhatsApp);
const fbURL = f => /^https?:/.test(f) ? f : "https://www.facebook.com/"+f;
const urlPerfil = p => BASE+"profesional/"+p.slug+".html";
const slugLoc = s => norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

/* Categorías (motivos de consulta): solo por lo que el profesional declaró */
function categoriasDe(p){
  const texto = norm(p.areas.join(" | "));  // solo las áreas que declaró cada profesional
  return RED.CATEGORIAS.filter(c =>
    (p.categorias||[]).includes(c.id) ||
    (c.poblaciones||[]).some(x => p.poblacion.includes(x)) ||
    c.claves.some(k => new RegExp(k).test(texto))
  ).filter(c => !(p.categoriasExcluir||[]).includes(c.id)).map(c => c.id);
}

/* ---------- Métricas anónimas (Umami, sin cookies) ---------- */
if (C.umamiWebsiteId) {
  const u=document.createElement("script"); u.defer=true; u.src="https://cloud.umami.is/script.js";
  u.setAttribute("data-website-id", C.umamiWebsiteId);
  if (C.umamiDominios) u.setAttribute("data-domains", C.umamiDominios);
  document.head.appendChild(u);
}
function medir(evento, datos){
  try{
    if (window.umami && umami.track) umami.track(evento, datos||{});
    if (window.va) window.va("event",{name:evento,data:datos||{}});
  }catch(e){}
}
/* Clics de contacto: se registran con el profesional y el lugar del clic (tarjeta o perfil).
   Nunca se registra lo que la persona escribe ni el motivo de consulta. */
document.addEventListener("click", e => {
  const a = e.target.closest("a,button"); if (!a) return;
  if (a.dataset.evento) { medir(a.dataset.evento, a.dataset.dato ? {detalle:a.dataset.dato} : {}); return; }
  const cont = a.closest("[data-prof-id]"); if (!cont) return;
  const prof = cont.dataset.profId, origen = cont.dataset.origen || "tarjeta";
  const href = a.getAttribute("href") || "";
  if (/wa\.me|wa\.link|whatsapp\.com/.test(href)) medir("contacto-whatsapp",{profesional:prof, origen});
  else if (href.startsWith("mailto:")) medir("contacto-email",{profesional:prof, origen});
  else if (href.includes("instagram.com")) medir("instagram",{profesional:prof, origen});
  else if (href.includes("facebook.com")) medir("facebook",{profesional:prof, origen});
  else if (href.includes("profesional/")) medir("ver-perfil",{profesional:prof, origen});
}, true);

/* ---------- Menú ---------- */
const hb=$(".hamburguesa"), nav=$("#nav");
function cerrarMenu(){ if(nav){ nav.classList.remove("abierto"); hb && hb.setAttribute("aria-expanded","false"); } }
if (hb && nav){
  hb.addEventListener("click",()=>{ const a=nav.classList.toggle("abierto"); hb.setAttribute("aria-expanded",a); });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",cerrarMenu));
}
document.querySelectorAll(".desplegable>button").forEach(b=>b.addEventListener("click",()=>{
  const ab=b.parentElement.classList.toggle("abierto"); b.setAttribute("aria-expanded",ab); }));
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ cerrarMenu(); document.querySelectorAll(".desplegable.abierto").forEach(d=>d.classList.remove("abierto")); } });

/* ---------- Ir arriba ---------- */
const ia=$(".ir-arriba");
if (ia){ addEventListener("scroll",()=>ia.classList.toggle("visible",scrollY>700),{passive:true}); ia.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"})); }

/* ---------- Año ---------- */
document.querySelectorAll(".anio").forEach(e=>e.textContent=new Date().getFullYear());

/* ---------- Ambiente sonoro opcional ----------
   Generado en el navegador: sin archivos ni derechos de autor, no pesa en la carga.
   Siempre empieza apagado; solo suena si la persona lo activa. */
const Musica=(()=>{
  let ctx=null, master=null, sonando=false, volumen=0.3, tCampana=null, tCuenco=null, tPajaros=null, tGotas=null;
  const CUENCOS=[277.2,349.2,415.3,523.3];   // afinados con el acorde (Db–F–Ab–C)
  // Frecuencias medidas en la pista de referencia y su peso relativo
  const VOCES=[[34.8,1.0],[51.9,0.37],[69.6,0.10],[104,0.14],[131.8,0.06],[139.2,0.11],[174.3,0.15],[208,0.12],[263.7,0.045],[276.9,0.035],[348.6,0.05],[414.6,0.03],[522.9,0.022]];
  const CAMPANAS=[830.6,932.3,1046.5,1244.5];
  function iniciar(){
    const AC=window.AudioContext||window.webkitAudioContext;
    try{ ctx=new AC({latencyHint:"playback"}); }catch(e){ ctx=new AC(); }   // búfer más grande: evita cortes cuando la página trabaja
    master=ctx.createGain(); master.gain.value=0;
    const lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=1300; lp.Q.value=0.1;
    master.connect(lp); lp.connect(ctx.destination);
    // eco amplio y suave
    const eco=ctx.createDelay(2), real=ctx.createGain(), wet=ctx.createGain();
    eco.delayTime.value=0.9; real.gain.value=0.28; wet.gain.value=0.22;
    lp.connect(eco); eco.connect(real); real.connect(eco); eco.connect(wet); wet.connect(ctx.destination);
    // Ola lenta: todo el colchón sube y baja cada ~12 s
    const ola=ctx.createGain(); ola.gain.value=0.62; ola.connect(master);
    const lfo=ctx.createOscillator(); lfo.frequency.value=1/12; const prof=ctx.createGain(); prof.gain.value=0.38;
    lfo.connect(prof); prof.connect(ola.gain); lfo.start();
    VOCES.forEach(([f,peso],k)=>{
      const o=ctx.createOscillator(); o.type="sine"; o.frequency.value=f;
      const g=ctx.createGain(); g.gain.value=peso*0.9;
      const pn=ctx.createStereoPanner(); pn.pan.value=f<120?0:(k%2?0.25:-0.25);
      // cada voz entra y sale muy despacio, desfasada, para que el acorde vaya cambiando de color
      const l=ctx.createOscillator(); l.frequency.value=0.01+((k*7)%10)*0.003; const lg=ctx.createGain(); lg.gain.value=f<120?0:peso*0.35;
      l.connect(lg); lg.connect(g.gain); l.start();
      o.connect(g); g.connect(pn); pn.connect(ola); o.start();
    });
    // Agua: arroyo suave de fondo
    const n=ctx.sampleRate*5, buf=ctx.createBuffer(2,n,ctx.sampleRate);
    for(let c=0;c<2;c++){ const d=buf.getChannelData(c); let u=0; for(let q=0;q<n;q++){ u=(u+0.02*(Math.random()*2-1))/1.02; d[q]=u*3.2; } }
    [[550,0.6,0.1],[1800,0.9,0.025]].forEach(([fc,qq,vol],i)=>{
      const s=ctx.createBufferSource(); s.buffer=buf; s.loop=true; s.playbackRate.value=1+i*0.07;
      const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=fc; bp.Q.value=qq;
      const g=ctx.createGain(); g.gain.value=vol;
      const l=ctx.createOscillator(); l.frequency.value=0.05+i*0.04; const lg=ctx.createGain(); lg.gain.value=vol*0.08; l.connect(lg); lg.connect(g.gain); l.start();
      s.connect(bp); bp.connect(g); g.connect(master); s.start();
    });
  }
  function cuenco(){
    if(!sonando) return;
    const f=CUENCOS[Math.floor(Math.random()*CUENCOS.length)], t=ctx.currentTime+0.05, pan=Math.random()*1.2-0.6;
    [[1,0.05,8],[2.71,0.008,4]].forEach(([m,v,d])=>{
      const o=ctx.createOscillator(), g=ctx.createGain(), p=ctx.createStereoPanner();
      o.type="sine"; o.frequency.value=f*m;
      g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+0.4); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      p.pan.value=pan; o.connect(g); g.connect(p); p.connect(master); o.start(t); o.stop(t+d+0.1);
    });
    tCuenco=setTimeout(cuenco,10000+Math.random()*10000);
  }
  function gota(){
    if(!sonando) return;
    const t=ctx.currentTime+0.05, o=ctx.createOscillator(), g=ctx.createGain(), p=ctx.createStereoPanner(), f=700+Math.random()*700;
    o.type="sine"; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*0.55,t+0.07);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.025,t+0.006); g.gain.exponentialRampToValueAtTime(0.0001,t+0.1);
    p.pan.value=Math.random()*1.4-0.7; o.connect(g); g.connect(p); p.connect(master); o.start(t); o.stop(t+0.12);
    tGotas=setTimeout(gota,250+Math.random()*1100);
  }
  function nota(t,f1,f2,dur,vol,pan){
    const o=ctx.createOscillator(), g=ctx.createGain(), p=ctx.createStereoPanner();
    o.type="sine"; o.frequency.setValueAtTime(f1,t); o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+dur*0.3); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    p.pan.value=pan; o.connect(g); g.connect(p); p.connect(master); o.start(t); o.stop(t+dur+0.02);
  }
  function pajaro(){
    if(!sonando) return;
    const t=ctx.currentTime+0.05, pan=Math.random()*1.6-0.8, v=0.018+Math.random()*0.012, tipo=Math.floor(Math.random()*3);
    if(tipo===0){ nota(t,1900,2600,0.2,v,pan); nota(t+0.27,2600,2100,0.22,v,pan); }
    else if(tipo===1){ const b=3000+Math.random()*700, k=4+Math.floor(Math.random()*4); for(let q=0;q<k;q++) nota(t+q*0.08,b,b*1.15,0.06,v*0.7,pan); }
    else { const b=2300+Math.random()*500; nota(t,b,b*1.2,0.11,v,pan); nota(t+0.15,b*1.2,b*1.02,0.12,v,pan); nota(t+0.3,b*1.08,b*1.3,0.13,v,pan); }
    tPajaros=setTimeout(pajaro,4000+Math.random()*8000);
  }
  function campana(){
    if(!sonando) return;
    const f=CAMPANAS[Math.floor(Math.random()*CAMPANAS.length)], t=ctx.currentTime+0.05;
    const o=ctx.createOscillator(), g=ctx.createGain(), p=ctx.createStereoPanner();
    o.type="sine"; o.frequency.value=f; p.pan.value=Math.random()*1.2-0.6;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.012,t+0.6); g.gain.exponentialRampToValueAtTime(0.0001,t+6);
    o.connect(g); g.connect(p); p.connect(master); o.start(t); o.stop(t+6.2);
    tCampana=setTimeout(campana,7000+Math.random()*9000);
  }
  // Cambia el volumen general sin saltos (cancelScheduledValues solo generaba chasquidos)
  function rampa(destino,tc){
    const g=master.gain, t=ctx.currentTime;
    if(g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(t); else { const v=g.value; g.cancelScheduledValues(t); g.setValueAtTime(v,t); }
    g.setTargetAtTime(destino,t+0.01,tc);
  }
  function encender(){
    if(!ctx) iniciar();
    ctx.resume(); sonando=true;
    rampa(0.28*volumen,2.5);
    clearTimeout(tCampana); clearTimeout(tCuenco); clearTimeout(tPajaros); clearTimeout(tGotas);
    tCampana=setTimeout(campana,5000); tCuenco=setTimeout(cuenco,2500); tPajaros=setTimeout(pajaro,4000); tGotas=setTimeout(gota,1200);
  }
  function apagar(){
    if(!ctx) return;
    sonando=false; clearTimeout(tCampana); clearTimeout(tCuenco); clearTimeout(tPajaros); clearTimeout(tGotas);
    rampa(0,0.6);
    setTimeout(()=>{ if(!sonando) ctx.suspend(); },5000);
  }
  return {
    encender, apagar, sonando:()=>sonando,
    volumen(v){ volumen=v; if(ctx&&sonando) rampa(0.28*v,0.15); },
    salir(){ if(ctx&&sonando) rampa(0,0.08); }
  };
})();

const rep = document.createElement("div");
rep.className="reproductor"; rep.setAttribute("role","region"); rep.setAttribute("aria-label","Ambiente sonoro relajante");
rep.innerHTML = `
  <button type="button" class="rep-principal" aria-pressed="false">
    <span class="ondas" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="rep-txt">Activar ambiente relajante</span>
  </button>
  <div class="rep-controles" hidden>
    <button type="button" class="rep-btn rep-pausa" aria-label="Pausar">❚❚</button>
    <button type="button" class="rep-btn rep-detener" aria-label="Detener y cerrar">■</button>
    <label class="rep-vol"><span class="sr">Volumen</span><input type="range" min="0" max="100" value="30" aria-label="Volumen del ambiente sonoro"></label>
  </div>`;
document.body.appendChild(rep);
const bP=rep.querySelector(".rep-principal"), ctrls=rep.querySelector(".rep-controles"), bPausa=rep.querySelector(".rep-pausa"),
      bDet=rep.querySelector(".rep-detener"), vol=rep.querySelector("input"), txt=rep.querySelector(".rep-txt");
function pintar(){
  const on=Musica.sonando();
  bP.setAttribute("aria-pressed",on);
  rep.classList.toggle("activo", on || !ctrls.hidden);
  txt.textContent = on ? "Ambiente sonando" : (ctrls.hidden ? "Activar ambiente relajante" : (window.__ambEspera ? "Ambiente relajante" : "Ambiente en pausa"));
  bPausa.textContent = on ? "❚❚" : "▶"; bPausa.setAttribute("aria-label", on ? "Pausar" : "Reproducir");
}
/* Preferencia guardada: el ambiente suena bajo por defecto; si la persona lo pausa o lo apaga, se respeta en las páginas siguientes */
const PREF="redAmbiente";
const leerPref=()=>{ try{ return JSON.parse(localStorage.getItem(PREF)||"{}"); }catch(e){ return {}; } };
const guardarPref=o=>{ try{ localStorage.setItem(PREF, JSON.stringify(Object.assign(leerPref(),o))); }catch(e){} };
const pref=leerPref();
if (typeof pref.vol==="number"){ vol.value=Math.round(pref.vol*100); Musica.volumen(pref.vol); }
function activar(manual){
  if (Musica.sonando()) return;
  try{ Musica.encender(); ctrls.hidden=false; medir("sonido-on",{auto:manual?"no":"si"}); }catch(e){ rep.remove(); }
  pintar();
}
bP.addEventListener("click",()=>{ window.__ambEspera=false; if(Musica.sonando()) { Musica.apagar(); guardarPref({estado:"pausa"}); } else { activar(true); guardarPref({estado:"on"}); } pintar(); });
bPausa.addEventListener("click",()=>{ window.__ambEspera=false; if(Musica.sonando()){ Musica.apagar(); guardarPref({estado:"pausa"}); } else { Musica.encender(); guardarPref({estado:"on"}); } pintar(); });
bDet.addEventListener("click",()=>{ Musica.apagar(); ctrls.hidden=true; guardarPref({estado:"apagado"}); medir("sonido-off",{}); pintar(); bP.focus(); });
vol.addEventListener("input",()=>{ Musica.volumen(vol.value/100); guardarPref({vol:vol.value/100}); });
/* Inicio automático a volumen bajo. Los navegadores solo permiten sonido después de una interacción,
   así que arranca con el primer toque, clic o tecla (en el inicio, al tocar ENTRAR). */
if (pref.estado!=="pausa" && pref.estado!=="apagado"){
  const ev=["pointerdown","keydown","touchstart"];
  window.__ambEspera=true;
  const arrancar=e=>{ if(rep.contains(e.target) || (e.target.closest && e.target.closest('a[href]'))) return; window.__ambEspera=false; ev.forEach(t=>removeEventListener(t,arrancar,true)); activar(false); };
  ev.forEach(t=>addEventListener(t,arrancar,true));
  pintar();
}

/* Al pasar a otra página del sitio con el ambiente sonando: baja el volumen suavemente antes de salir (sin chasquido) */
document.addEventListener("click",e=>{
  const a=e.target.closest && e.target.closest("a[href]");
  if(!a || !Musica.sonando() || e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || a.target==="_blank") return;
  const u=new URL(a.href, location.href);
  if(u.origin!==location.origin || (u.pathname===location.pathname && u.hash)) return;
  e.preventDefault(); Musica.salir(); setTimeout(()=>{ location.href=a.href; },350);
});
addEventListener("pagehide",()=>Musica.salir());

/* ---------- Compartir perfil ---------- */
// Si el sitio todavía no está en su dominio definitivo (vista previa), se comparte la dirección real de esta página
const urlCompartir=u=>{ try{ return new URL(u).hostname===location.hostname ? u : location.href.split("#")[0]; }catch(e){ return location.href.split("#")[0]; } };
document.querySelectorAll('a[data-evento="compartir-whatsapp"]').forEach(a=>{
  const b=document.querySelector("[data-compartir]"); if(!b) return;
  a.href="https://wa.me/?text="+encodeURIComponent((b.dataset.titulo||document.title)+" – "+urlCompartir(b.dataset.compartir));
});
document.querySelectorAll("[data-compartir]").forEach(b=>b.addEventListener("click",async()=>{
  const url=urlCompartir(b.dataset.compartir), titulo=b.dataset.titulo||document.title;
  medir("compartir-perfil",{profesional:b.dataset.prof||""});
  try{ if(navigator.share){ await navigator.share({title:titulo,url}); return; } }catch(e){ return; }
  try{ await navigator.clipboard.writeText(url); b.textContent="✓ Enlace copiado"; setTimeout(()=>b.textContent="Copiar enlace",2500); }
  catch(e){  b.textContent=url; }
}));

window.REDUI = {$, esc, norm, iniciales, enlaceWA, mailtoProf, fbURL, urlPerfil, slugLoc, categoriasDe, medir, activarSonido:()=>activar(false), BASE};
})();
