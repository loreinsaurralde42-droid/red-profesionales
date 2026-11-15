/* =====================================================================
   inicio.js — página principal: bienvenida, buscador y directorio
   ===================================================================== */
(function(){
"use strict";
const U = window.REDUI, C = RED.CONFIG, $ = U.$, esc = U.esc;
const PROFS = RED.PROFESIONALES.map(p => Object.assign({}, p, {cats: U.categoriasDe(p)}));
const CATS = RED.CATEGORIAS.map(c => Object.assign({}, c, {n: PROFS.filter(p => p.cats.includes(c.id)).length}));
const LOCS_CHACO = RED.LOCALIDADES.Chaco;
const cLoc = l => PROFS.filter(p => p.localidad === l).length;
const POBLACIONES = ["Bebés y primera infancia","Niños","Adolescentes","Jóvenes","Adultos","Adultos mayores","Familias","Parejas"];
const MODALIDADES = ["Presencial","Online","Domiciliaria"];
const ENFOQUES = [...new Set(PROFS.map(p => p.enfoque).filter(Boolean))].sort();

/* ---------- Bienvenida inmersiva con red 3D ---------- */
(function(){
  const bv=$("#bienvenida"); if(!bv) return;
  // Reutiliza el texto de la barra superior
  let visto=false; try{ visto=sessionStorage.getItem("bienvenidaVista")==="1"; }catch(e){}
  if(visto){ bv.remove(); return; }
  document.body.style.overflow="hidden";
  const reducido=matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Texto que acompaña la respiración (ciclo de 10 s)
  const rt=$("#bv-resp-txt"); let fase=0;
  const tResp=setInterval(()=>{ fase=(fase+1)%2; rt.textContent=fase?"Exhalá":"Inhalá"; },5000);
  // Red 3D: nodos sobre una esfera que gira lentamente, unidos por hilos de luz
  const cv=$("#bv-canvas"), cx=cv.getContext("2d"); let W,H,DPR, raf, mx=0, my=0;
  const COLS=["#7fd6e6","#ffd987","#e6a8dc","#ffffff"];
  const N=110, nodos=[];
  for(let i=0;i<N;i++){ const u=Math.random()*2-1, th=Math.random()*Math.PI*2, r=0.75+Math.random()*0.35, s=Math.sqrt(1-u*u);
    nodos.push({x:r*s*Math.cos(th),y:r*u,z:r*s*Math.sin(th),c:COLS[i%COLS.length],tam:1+Math.random()*2.2,fase:Math.random()*6.28}); }
  const polvo=Array.from({length:70},()=>({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random(),v:0.0006+Math.random()*0.001}));
  function medir(){ DPR=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight; cv.width=W*DPR; cv.height=H*DPR; cx.setTransform(DPR,0,0,DPR,0,0); }
  medir(); addEventListener("resize",medir);
  bv.addEventListener("pointermove",e=>{ mx=(e.clientX/W-0.5); my=(e.clientY/H-0.5); });
  let ang=0, t0=performance.now();
  function cuadro(now){
    const t=(now-t0)/1000; ang+=reducido?0:0.0016;
    cx.clearRect(0,0,W,H);
    // polvo de luz que flota hacia adelante (profundidad)
    polvo.forEach(p=>{ if(!reducido){ p.z+=p.v; if(p.z>1){p.z=0;p.x=Math.random()*2-1;p.y=Math.random()*2-1;} }
      const k=0.3+p.z*1.4, px=W/2+p.x*W*0.6*k, py=H/2+p.y*H*0.6*k, a=Math.sin(p.z*Math.PI)*0.5;
      cx.fillStyle=`rgba(255,255,255,${a})`; cx.beginPath(); cx.arc(px,py,0.6+p.z*1.6,0,6.28); cx.fill(); });
    const R=Math.min(W,H)*0.42, cy=Math.cos(ang+mx*0.6), sy=Math.sin(ang+mx*0.6), cxr=Math.cos(0.35+my*0.5), sxr=Math.sin(0.35+my*0.5);
    const proy=nodos.map(n=>{ let x=n.x*cy-n.z*sy, z=n.x*sy+n.z*cy, y=n.y*cxr-z*sxr; z=n.y*sxr+z*cxr;
      const f=2.6/(2.6+z), resp=1+0.04*Math.sin(t*0.628); return {sx:W/2+x*R*f*resp, sy:H/2+y*R*f*resp, z, f, n}; });
    // hilos entre nodos cercanos
    cx.lineWidth=0.7;
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){ const a=nodos[i], b=nodos[j], d=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2;
      if(d<0.09){ const pa=proy[i], pb=proy[j], prof=(2-(pa.z+pb.z)/2)/3; cx.strokeStyle=`rgba(160,225,236,${(0.09-d)/0.09*0.35*prof})`;
        cx.beginPath(); cx.moveTo(pa.sx,pa.sy); cx.lineTo(pb.sx,pb.sy); cx.stroke(); } }
    // nodos con brillo
    proy.sort((a,b)=>b.z-a.z).forEach(p=>{ const brillo=0.55+0.45*Math.sin(t*1.2+p.n.fase), r=p.n.tam*p.f;
      cx.globalAlpha=Math.max(0.15,(1.4-p.z)/2)*brillo; cx.fillStyle=p.n.c; cx.beginPath(); cx.arc(p.sx,p.sy,r,0,6.28); cx.fill();
      cx.globalAlpha*=0.25; cx.beginPath(); cx.arc(p.sx,p.sy,r*3.2,0,6.28); cx.fill(); cx.globalAlpha=1; });
    raf=requestAnimationFrame(cuadro);
  }
  raf=requestAnimationFrame(cuadro);
  function cerrar(conSonido){
    try{ sessionStorage.setItem("bienvenidaVista","1"); }catch(e){}
    if(conSonido){ try{ U.activarSonido(); }catch(e){} }
    bv.classList.add("oculta"); document.body.style.overflow="";
    medirEvento(conSonido);
    setTimeout(()=>{ cancelAnimationFrame(raf); clearInterval(tResp); bv.remove(); },1000);
  }
  function medirEvento(s){ U.medir(s?"bienvenida-con-sonido":"bienvenida-entrar",{}); }
  $("#bv-entrar").onclick=()=>cerrar(true);
  const bs=$("#bv-entrar-sonido"); if(bs) bs.onclick=()=>cerrar(true);
  bv.addEventListener("keydown",e=>{ if(e.key==="Escape") cerrar(false); });
  setTimeout(()=>$("#bv-entrar").focus(),300);
})();



/* ---------- Fotos del inicio (fundido lento) ---------- */
const fondo = $("#hero-fotos");
if (fondo) {
  fondo.innerHTML = C.fotosInicio.map((f,i) => `<img src="${esc(f.foto)}" alt="" style="object-position:${esc(f.posicion)}" class="${i===0?"activa":""}" ${i?'loading="lazy"':'fetchpriority="high"'}>`).join("");
  const imgs = [...fondo.children]; let act = 0, timer = null, pausado = false;
  const pasar = () => { imgs[act].classList.remove("activa"); act = (act+1)%imgs.length; imgs[act].classList.add("activa"); };
  const correr = () => { clearInterval(timer); if (!pausado && !matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(pasar, C.velocidadCarrusel); };
  const bp = $("#hero-pausa");
  bp.addEventListener("click", () => { pausado = !pausado; bp.setAttribute("aria-pressed", pausado); bp.setAttribute("aria-label", pausado ? "Reanudar fotos" : "Pausar fotos"); bp.textContent = pausado ? "▶" : "❚❚"; correr(); });
  correr();
}

/* ---------- Estado de búsqueda ---------- */
const estado = {texto:"", cat:"", profesion:"", lugar:"", modalidad:"", poblacion:new Set(), enfoque:"", reintegro:false, orden:"azar"};
const ORDEN = PROFS.map(p=>p.id); for (let i=ORDEN.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [ORDEN[i],ORDEN[j]]=[ORDEN[j],ORDEN[i]]; }

/* ---------- Opciones de los selectores ---------- */
const opt = (v,t,dis) => `<option value="${esc(v)}"${dis?" disabled":""}>${esc(t)}</option>`;
const conProf = LOCS_CHACO.filter(l=>cLoc(l)).sort((a,b)=>cLoc(b)-cLoc(a));
const sinProf = LOCS_CHACO.filter(l=>!cLoc(l)).sort((a,b)=>a.localeCompare(b,"es"));
const htmlLoc = `${opt("","Todas las localidades")}<optgroup label="Con profesionales">${conProf.map(l=>opt(l,`${l} (${cLoc(l)})`)).join("")}</optgroup><optgroup label="Próximamente">${sinProf.map(l=>opt(l,l)).join("")}</optgroup>`;
const htmlCat = opt("","Cualquier motivo") + CATS.map(c=>opt(c.id, c.n ? c.nombre : `${c.nombre} (próximamente)`, !c.n)).join("");
const profsConGente = Object.keys(RED.PROFESIONES);
const htmlProf = opt("","Todas las profesiones") + profsConGente.map(k=>{ const n=PROFS.filter(p=>p.profesion===k).length; return opt(k, n?`${k} (${n})`:`${k} (próximamente)`, !n); }).join("");
const htmlMod = opt("","Presencial u online") + opt("Presencial","Presencial") + opt("Online","Online");
[["#b-motivo",htmlCat],["#b-profesion",htmlProf],["#b-lugar",htmlLoc],["#b-modalidad",htmlMod],["#f-profesion",htmlProf],["#f-lugar",htmlLoc],["#f-modalidad",htmlMod]].forEach(([s,h])=>{ const el=$(s); if(el) el.innerHTML=h; });
$("#f-enfoque").innerHTML = opt("","Cualquier enfoque") + ENFOQUES.map(e=>opt(e,e)).join("");

/* ---------- Chips de motivo y población ---------- */
function pintarChips(){
  $("#f-motivos").innerHTML = CATS.filter(c=>c.n).map(c=>`<button type="button" class="chip" aria-pressed="${estado.cat===c.id}" data-cat="${c.id}"><span aria-hidden="true">${c.icono}</span> ${esc(c.nombre)}<span class="cuenta">${c.n}</span></button>`).join("");
  $("#f-poblacion").innerHTML = POBLACIONES.map(x=>`<button type="button" class="chip" aria-pressed="${estado.poblacion.has(x)}" data-pob="${esc(x)}">${esc(x)}</button>`).join("");
}

/* ---------- Filtrado ---------- */
function coincide(p){
  if (estado.cat && !p.cats.includes(estado.cat)) return false;
  if (estado.profesion && p.profesion !== estado.profesion) return false;
  if (estado.lugar && p.localidad !== estado.lugar) return false;
  if (estado.modalidad && !p.modalidad.includes(estado.modalidad)) return false;
  if (estado.poblacion.size && ![...estado.poblacion].some(x=>p.poblacion.includes(x))) return false;
  if (estado.enfoque && p.enfoque !== estado.enfoque) return false;
  if (estado.reintegro && !p.reintegro) return false;
  if (estado.texto){
    const hay = U.norm([p.nombre,p.profesion,p.localidad,p.resumen,p.enfoqueDetalle,p.areas.join(" "),p.poblacion.join(" "),p.poblacionDetalle,p.presentacion.flat().join(" "),p.cats.map(id=>RED.CATEGORIAS.find(c=>c.id===id).nombre).join(" ")].join(" "));
    if (!U.norm(estado.texto).split(/\s+/).filter(Boolean).every(t=>hay.includes(t))) return false;
  }
  return true;
}
const ICON = {
  wa:`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>`,
  mail:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>`
};
function botonContacto(p){
  const wa = U.enlaceWA(p.whatsapp);
  if (wa) return `<a class="btn-wa" href="${esc(wa)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar disponibilidad por WhatsApp</span><span class="sr"> con ${esc(p.nombre)} (se abre WhatsApp)</span></a>`;
  if (p.email) return `<a class="btn-wa mail" href="${esc(U.mailtoProf(p.email))}">${ICON.mail}<span>Consultar por email</span><span class="sr"> a ${esc(p.nombre)}</span></a>`;
  return `<span class="btn-wa off" aria-disabled="true">Contacto a confirmar</span>`;
}
function selloMatricula(p){
  if (!p.matricula) return `<span class="sello pend">Matrícula a confirmar</span>`;
  return p.verificado ? `<span class="sello ok" title="ARANDU comprobó la matrícula ante el colegio profesional">✓ ${esc(p.matricula)} · verificada</span>`
                      : `<span class="sello info" title="Matrícula informada por el profesional; verificación en curso">${esc(p.matricula)} · informada</span>`;
}
function etqProf(p){ const c=RED.PROFESIONES[p.profesion]||{etq:p.profesion,color:"#eee",texto:"#333"}; return `<span class="t-prof" style="background:${c.color};color:${c.texto}">${esc(c.etq)}</span>`; }
function modalidad(p){ return p.modalidadDetalle || (p.modalidad.length>1 ? "Presencial y online" : p.modalidad[0] || "Modalidad a consultar"); }
function tarjeta(p){
  const url = U.urlPerfil(p);
  const foto = p.foto ? `<img class="t-foto" src="${esc(p.foto)}" alt="" loading="lazy" width="80" height="80">` : `<span class="t-avatar" aria-hidden="true">${esc(U.iniciales(p.nombre))}</span>`;
  const motivos = p.cats.slice(0,3).map(id=>`<li>${esc(RED.CATEGORIAS.find(c=>c.id===id).nombre)}</li>`).join("");
  return `<article class="tarjeta" data-prof-id="${p.id}" data-origen="tarjeta">
    <div class="t-cab">${foto}
      <div class="t-id">
        <h3 class="t-nombre"><a href="${url}">${esc(p.nombre)}</a></h3>
        <div class="t-sellos">${etqProf(p)}${p.rol?`<span class="sello-fund">★ ${esc(p.rol)}</span>`:""}</div>
        ${selloMatricula(p)}
      </div>
    </div>
    <p class="t-resumen">${esc(p.resumen)}</p>
    <p class="t-meta"><span>📍 ${esc(p.localidad)}</span><span>${esc(modalidad(p))}</span></p>
    ${motivos?`<ul class="t-motivos" aria-label="Trabaja con">${motivos}</ul>`:""}
    <div class="t-acciones">${botonContacto(p)}<a class="btn-sec" href="${url}">Ver perfil completo</a></div>
  </article>`;
}
function render(){
  let lista = PROFS.filter(coincide);
  lista.sort(estado.orden==="az" ? (a,b)=>a.nombre.replace(/^S\. /,"").localeCompare(b.nombre.replace(/^S\. /,""),"es") : (a,b)=>ORDEN.indexOf(a.id)-ORDEN.indexOf(b.id));
  const n = lista.length;
  $("#contador").textContent = n===1 ? "1 profesional" : `${n} profesionales`;
  const activos = [estado.cat && RED.CATEGORIAS.find(c=>c.id===estado.cat).nombre, estado.profesion, estado.lugar, estado.modalidad, ...estado.poblacion, estado.enfoque, estado.reintegro&&"Factura para reintegro", estado.texto&&`“${estado.texto}”`].filter(Boolean);
  $("#filtros-activos").textContent = activos.length ? "Filtros: " + activos.join(" · ") : "";
  $("#limpiar").hidden = !activos.length;
  $("#grilla").innerHTML = n ? lista.map(tarjeta).join("") :
    `<div class="sin-res"><p><strong>No encontramos profesionales con esa combinación.</strong></p>
     <p>Probá quitando algún filtro${estado.lugar && !cLoc(estado.lugar) ? `, o buscá profesionales que atienden <strong>online</strong> desde cualquier localidad` : ""}.</p>
     <button type="button" class="btn-sec" id="ver-todo">Ver todos los profesionales</button></div>`;
  const vt = $("#ver-todo"); if (vt) vt.addEventListener("click", ()=>{ limpiar(); if(estado.lugar===""){} });
}
function sincronizar(){
  $("#f-profesion").value=estado.profesion; $("#f-lugar").value=estado.lugar; $("#f-modalidad").value=estado.modalidad;
  $("#f-enfoque").value=estado.enfoque; $("#f-reintegro").checked=estado.reintegro; $("#f-texto").value=estado.texto; $("#f-orden").value=estado.orden;
  pintarChips(); render();
}
function limpiar(){ Object.assign(estado,{texto:"",cat:"",profesion:"",lugar:"",modalidad:"",enfoque:"",reintegro:false}); estado.poblacion.clear(); sincronizar(); }
const irDir = () => document.getElementById("profesionales").scrollIntoView({behavior:"smooth", block:"start"});

/* ---------- Buscador principal ---------- */
$("#buscador").addEventListener("submit", e => {
  e.preventDefault();
  estado.cat=$("#b-motivo").value; estado.profesion=$("#b-profesion").value; estado.lugar=$("#b-lugar").value; estado.modalidad=$("#b-modalidad").value;
  estado.texto=""; estado.poblacion.clear(); estado.enfoque=""; estado.reintegro=false;
  U.medir("busqueda",{profesion:estado.profesion||"todas", localidad:estado.lugar||"todas", modalidad:estado.modalidad||"todas"});
  sincronizar(); irDir();
});

/* ---------- Filtros del directorio ---------- */
$("#f-motivos").addEventListener("click", e => { const b=e.target.closest("[data-cat]"); if(!b) return; estado.cat = estado.cat===b.dataset.cat ? "" : b.dataset.cat; sincronizar(); });
$("#f-poblacion").addEventListener("click", e => { const b=e.target.closest("[data-pob]"); if(!b) return; const v=b.dataset.pob; estado.poblacion.has(v)?estado.poblacion.delete(v):estado.poblacion.add(v); sincronizar(); });
[["#f-profesion","profesion"],["#f-lugar","lugar"],["#f-modalidad","modalidad"],["#f-enfoque","enfoque"],["#f-orden","orden"]].forEach(([s,k])=>$(s).addEventListener("change",e=>{ estado[k]=e.target.value; sincronizar(); }));
$("#f-reintegro").addEventListener("change",e=>{ estado.reintegro=e.target.checked; sincronizar(); });
let tTexto; $("#f-texto").addEventListener("input",e=>{ clearTimeout(tTexto); tTexto=setTimeout(()=>{ estado.texto=e.target.value.trim(); render(); },200); });
$("#limpiar").addEventListener("click", limpiar);
const mf=$("#mas-filtros"); mf.addEventListener("click",()=>{ const ex=$("#extra"); ex.hidden=!ex.hidden; mf.setAttribute("aria-expanded",!ex.hidden); mf.textContent=ex.hidden?"Más filtros +":"Menos filtros −"; });

/* ---------- Motivos de consulta (sección) ---------- */
$("#lista-motivos").innerHTML = CATS.map(c => c.n
  ? `<li><button type="button" class="motivo" data-ir-cat="${c.id}"><span class="m-ico" aria-hidden="true">${c.icono}</span><span class="m-nom">${esc(c.nombre)}</span><span class="m-n">${c.n} ${c.n===1?"profesional":"profesionales"}</span></button></li>`
  : `<li><div class="motivo vacio" aria-disabled="true"><span class="m-ico" aria-hidden="true">${c.icono}</span><span class="m-nom">${esc(c.nombre)}</span><span class="m-n">Próximamente</span></div></li>`).join("");
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ir-cat],[data-ir-prof],[data-ir-online]"); if (!b) return;
  e.preventDefault(); limpiar();
  if (b.dataset.irCat) estado.cat=b.dataset.irCat;
  if (b.dataset.irProf) estado.profesion=b.dataset.irProf;
  if (b.dataset.irOnline!==undefined) estado.modalidad="Online";
  sincronizar(); irDir();
});

/* ---------- Explorar ---------- */
$("#exp-loc").innerHTML = conProf.map(l=>`<li><a href="localidad/${U.slugLoc(l)}.html">Profesionales en ${esc(l)}</a> <span class="cnt">(${cLoc(l)})</span></li>`).join("");
$("#exp-prof").innerHTML = profsConGente.map(k=>{ const n=PROFS.filter(p=>p.profesion===k).length; return n?`<li><button type="button" data-ir-prof="${esc(k)}">${esc(k)}</button> <span class="cnt">(${n})</span></li>`:`<li class="prox">${esc(k)} <span>· próximamente</span></li>`; }).join("");
$("#n-prof").textContent = PROFS.length; $("#n-loc").textContent = conProf.length; $("#n-disc").textContent = new Set(PROFS.map(p=>p.profesion)).size;

sincronizar();
})();
