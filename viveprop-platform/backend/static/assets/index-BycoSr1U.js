(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const y={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},xe=24,ct="/api";async function me(e){const t=await fetch(ct+e);if(!t.ok)throw new Error(`API ${e}: ${t.status}`);return t.json()}const ge={stock:()=>me("/stock"),projects:()=>me("/projects"),cc:()=>me("/cc"),uf:()=>me("/uf"),geocodes:()=>me("/geocodes"),priGeo:()=>me("/pri-geocodes"),reloadData:()=>fetch(ct+"/data/reload",{method:"POST"}).then(e=>e.json())},Be={sec:new Set,pri:new Set};let lt=[],rt=[];function dt(e,t){e==="sec"?lt=t:rt=t}function pt(e){return Be[e]}function ut(e){const t=(document.getElementById(e+"-mc-input").value||"").toLowerCase(),o=e==="sec"?lt:rt,n=Be[e],s=document.getElementById(e+"-mc-dropdown"),a=o.filter(i=>(!t||i.toLowerCase().includes(t))&&!n.has(i));if(!a.length){s.style.display="none";return}s.innerHTML=a.slice(0,14).map(i=>`<div class="mc-opt" onmousedown="mcSelect('${e}','${i.replace(/'/g,"\\'")}');return false">${i}</div>`).join(""),s.style.display="block"}function Kt(e){ut(e)}function Wt(e){setTimeout(()=>{const t=document.getElementById(e+"-mc-dropdown");t&&(t.style.display="none")},150)}function Zt(e,t){Be[e].add(t),mt(e),document.getElementById(e+"-mc-input").value="",document.getElementById(e+"-mc-dropdown").style.display="none",e==="sec"?window.secFilter():window.priFilter()}function Qt(e,t){Be[e].delete(t),mt(e),e==="sec"?window.secFilter():window.priFilter()}function mt(e){document.getElementById(e+"-mc-tags").innerHTML=[...Be[e]].map(t=>`<span class="mc-tag">${t} <span onclick="mcRemove('${e}','${t.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=e=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function w(e){if(!e)return null;const t=parseFloat(String(e).replace(/\./g,"").replace(",","."));return isNaN(t)?null:t}const m={uf:e=>`UF ${(+e).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:e=>`UF ${(+e).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:e=>`UF ${(+e).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:e=>`$${Math.round(+e).toLocaleString("es-CL")}`};function gt(e){const t=(e||"").toLowerCase();return t.includes("lista para arrendar")?"Disponible":t.includes("re-acondicionamiento")?"Reacondicionando":t.includes("por desocuparse")?"Por desocuparse":t.includes("aviso")?"Aviso salida":t.includes("check-in")?"Prox. check-in":t.includes("arrendado")?"Arrendado":e||"—"}function Xt(e){const t=(e||"").toLowerCase();return t.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":t.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":t.includes("re-acondicionamiento")||t.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":t.includes("aviso")?"background:#FEE2E2;color:#991B1B":t.includes("check-in")||t.includes("esperando")?"background:#EDE9FE;color:#5B21B6":t.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function Yt(e){var s,a;const t=(e||"").toLowerCase(),o=parseInt((s=t.match(/(\d+)d/))==null?void 0:s[1])||0,n=parseInt((a=t.match(/(\d+)b/))==null?void 0:a[1])||(t.includes("estudio")?1:0);return{dorm:o,banos:n}}function de(e){return/estac|bode|parking|reja|local\s/i.test(e||"")}function eo(e,t){const o=(e||"").toLowerCase();return t==="lista"?o.includes("lista para arrendar"):t==="desocupar"?o.includes("desocuparse"):t==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):t==="aviso"?o.includes("aviso"):t==="proximo"?o.includes("check-in")||o.includes("esperando"):t==="arrendado"?o.includes("arrendado"):!1}const to={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let fe=null,_e=null,ve=null,Ae=null,X=null,we=null;function Je(e){const t=`${e.direccion}|${e.comuna}`;if(y._GC[t]!==void 0)return y._GC[t];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[t]!==void 0)return o[t]}catch{}}function oo(e){const t=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${e}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:t,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function ft(e){if(!e)return"";const t=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(t)}&output=jpg&q=88`}function no(e,t){const o=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function so(){fe||(fe=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(fe),_e=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),fe.addLayer(_e))}function io(){return fe}function vt(e){if(!fe)return;_e.clearLayers();const t=[];e.forEach(o=>{const n=Je(o);n?yt(o,n):n===void 0&&t.push(o)}),t.length&&co(t)}let ht="lista";function ao(e){ht=e}function yt(e,t){const o=w(e.precioSinBono),n=w(e.m2total)||w(e.m2interior),s=to[e.estado]||"#94A3B8",a=gt(e.estado),i=`<div class="map-popup">
    <div class="mp-photo" id="mpp-${r(e.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${s}22;color:${s}">${a}</span>
        ${e.bonoPct>0?`<span class="mp-bono">Bono Pie ${e.bonoPct}%</span>`:""}
      </div>
      <div class="mp-title">${r(e.condominio||e.direccion||"—")}</div>
      <div class="mp-addr">📍 ${r(e.direccion||"")}${e.comuna?" · "+r(e.comuna):""}</div>
      <div class="mp-specs">
        ${e.tipologia?`<span class="mp-spec">${r(e.tipologia)}</span>`:""}
        ${n?`<span class="mp-spec">${n.toFixed(0)} m²</span>`:""}
        ${e.orientacion&&e.orientacion!=="-"?`<span class="mp-spec">${r(e.orientacion)}</span>`:""}
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</span>
      </div>
      <button class="mp-btn" onclick="openSecDetail('${r(e.id)}')">Ver ficha →</button>
    </div>
  </div>`,c=L.marker(t,{icon:oo(s)});c.bindPopup(i,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+e.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`).then(f=>f.json()).then(f=>{var u,F;const p=(u=f.data)==null?void 0:u[0],h=((F=p==null?void 0:p.fotos_originales)!=null&&F.length?p.fotos_originales:p==null?void 0:p.fotos)||[];if(h.length){const b=document.getElementById("mpp-"+e.id);if(b){const v=no(e.id,h[0]);b.style.backgroundImage=`url('${v}')`,b.textContent=""}}}).catch(()=>{})}),_e.addLayer(c)}async function co(e){const t=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");t.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<e.length&&ht==="mapa";a++){const i=e[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${e.length}`,o.style.width=`${Math.round((a+1)/e.length*100)}%`;const d=encodeURIComponent(`${i.direccion}, ${i.comuna}, Santiago, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${d}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const h=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=h,y._GC[c]=h,yt(i,h)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(f=>setTimeout(f,1200))}t.style.display="none"}function lo(){ve||(ve=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ve),Ae=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ve.addLayer(Ae))}function ro(){return ve}let bt="lista";function po(e){bt=e}function $t(e){if(!ve)return;Ae.clearLayers();const t=[];e.forEach(o=>{const n=Je({direccion:o.direccion,comuna:o.comuna});n?Ct(o,n):n===void 0&&t.push(o)}),t.length&&uo(t)}function Ct(e,t){const{isExtra:o}=window._mapUtils||{},n=(e.unidades||[]).filter(u=>u.disponible&&!/estac|bode|parking|reja|local\s/i.test(u.tipologia||"")),s=n.map(u=>u.precio_uf).filter(u=>u>0),a=s.length?Math.min(...s):0,i=s.length?Math.max(...s):0,c=[...new Set(n.map(u=>{const F=parseInt(u.dormitorios)||0;return F===0?"Estudio":F+"D"}))].sort().slice(0,3).join(", "),d=e.foto_portada||"",f=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),p=L.marker(t,{icon:f}),h=`<div class="map-popup">
    <div class="mp-photo" ${d?`style="background-image:url('${d}')"`:""}>${d?"":"🏗️"}</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:#FEE2E2;color:#B91C1C">Nuevo</span>
        ${e.entrega?`<span class="mp-badge" style="background:#F3F4F6;color:#374151">${r(e.entrega)}</span>`:""}
      </div>
      <div class="mp-title">${r(e.nombre)}</div>
      <div class="mp-inmob">${r(e.inmobiliaria||"")}</div>
      <div class="mp-addr">📍 ${r(e.direccion||"")}${e.comuna?" · "+r(e.comuna):""}</div>
      <div class="mp-specs">
        ${c?`<span class="mp-spec">${c}</span>`:""}
        <span class="mp-spec">${n.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${a?"UF "+a.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${i>a?`<span style="font-size:11px;color:var(--g400)">— ${i.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(e.id)}')">Ver proyecto →</button>
    </div>
  </div>`;p.bindPopup(h,{className:"lf-popup",maxWidth:270,closeButton:!1}),Ae.addLayer(p)}async function uo(e){const t=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");t.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<e.length&&bt==="mapa";a++){const i=e[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${e.length}`,o.style.width=`${Math.round((a+1)/e.length*100)}%`;const d=encodeURIComponent(`${i.direccion||i.nombre}, ${i.comuna||""}, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${d}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const h=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=h,y._GC[c]=h,Ct(i,h)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(f=>setTimeout(f,1200))}t.style.display="none"}function mo(e){if(!e)return;X?X.invalidateSize():(X=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(X)),we&&(X.removeLayer(we),we=null);const t=Je({direccion:e.direccion,comuna:e.comuna});t?Ft(e,t):go(e),setTimeout(()=>{X&&X.invalidateSize()},200)}function Ft(e,t){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});we=L.marker(t,{icon:o}).addTo(X),we.bindPopup(`<b>${r(e.nombre)}</b><br>${r(e.direccion||"")}${e.comuna?", "+r(e.comuna):""}`).openPopup(),X.setView(t,15)}async function go(e){const t=encodeURIComponent(`${e.direccion||e.nombre}, ${e.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${t}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const s=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let a={};try{a=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}a[`${e.direccion}|${e.comuna}`]=s;try{localStorage.setItem("_geo_cache",JSON.stringify(a))}catch{}y._GC[`${e.direccion}|${e.comuna}`]=s,Ft(e,s)}}catch{}}let he=[],K=1,Et="lista",Oe={},Ee=null,V=[],W=0,H=null,q=null,He="";function fo(){if(!y.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const e=[...new Set(y.STOCK.map(t=>t.comuna).filter(Boolean))].sort();dt("sec",e),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Te()}function Te(){var F,b,v,$,C,T;if(!y.STOCK.length)return;const e=(((F=document.getElementById("sec-search"))==null?void 0:F.value)||"").toLowerCase(),t=pt("sec"),o=parseFloat((b=document.getElementById("sec-precio-min"))==null?void 0:b.value)||0,n=parseFloat((v=document.getElementById("sec-precio-max"))==null?void 0:v.value)||0,s=(($=document.getElementById("sec-op"))==null?void 0:$.checked)||!1,a=((C=document.getElementById("sec-est"))==null?void 0:C.checked)||!1,i=((T=document.getElementById("sec-bod"))==null?void 0:T.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(l=>parseInt(l.dataset.val)),d=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(l=>parseInt(l.dataset.val)),f=[...document.querySelectorAll(".sec-estado-cb")],p=f.filter(l=>l.checked).map(l=>l.value),h=p.length===f.length,u=window._secMaxUF||null;he=y.STOCK.filter(l=>{if(e&&!`${l.condominio||""} ${l.direccion||""} ${l.comuna||""}`.toLowerCase().includes(e)||t.size&&!t.has(l.comuna)||s&&!l.oportunidad||a&&(!l.est||l.est==="0")||i&&(!l.bod||l.bod==="0")||!h&&!p.some(S=>eo(l.estado,S)))return!1;const{dorm:P,banos:A}=Yt(l.tipologia);if(c.length&&!c.some(S=>S===4?P>=4:P===S)||d.length&&!d.some(S=>S===3?A>=3:A===S))return!1;const E=parseFloat((l.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&E<o||n&&E>n||u&&E>u)}),K=1,Et==="mapa"?vt(he):Pt()}function Pt(){const e=document.getElementById("sec-grid"),t=he.length,o=Math.max(1,Math.ceil(t/xe));K>o&&(K=o),document.getElementById("sec-count").textContent=`${t.toLocaleString("es-CL")} propiedad${t!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${K} / ${o}`,document.getElementById("sec-prev").disabled=K<=1,document.getElementById("sec-next").disabled=K>=o;const n=y.STOCK.length,s=y.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,a=document.getElementById("tb-stats");a&&(a.textContent=`${s.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const i=he.slice((K-1)*xe,K*xe);if(!i.length){e.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}e.innerHTML=i.map(c=>{const d=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),f=c.bonoPct>0,p=c.m2interior||c.m2total||"—",h=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",u=gt(c.estado),F=Xt(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${F}">${u}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(p)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(h)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${d?"UF "+d.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${f?`<span class="pc-bono-badge">✅ Bono ${c.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(c.id)}')">Ver ficha →</button>
          ${c.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(c.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),Ee&&Ee.disconnect(),Ee=new IntersectionObserver(c=>{c.forEach(d=>{if(!d.isIntersecting)return;const f=d.target.id.replace("pcimg-","");vo(f),Ee.unobserve(d.target)})},{rootMargin:"150px"}),i.forEach(c=>{const d=document.getElementById("pcimg-"+c.id);d&&Ee.observe(d)})}async function vo(e){var o,n;const t=document.getElementById("pcimg-"+e);if(t){if(Oe[e]){nt(t,Oe[e]);return}try{const a=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e}?list=1`)).json()).data)==null?void 0:o[0],i=((n=a==null?void 0:a.fotos_originales)!=null&&n.length?a.fotos_originales:a==null?void 0:a.fotos)||[];if(i.length){Oe[e]=i[0];const c=document.getElementById("pcimg-"+e);c&&nt(c,i[0],i.length)}}catch{}}}function nt(e,t,o){const n=t.replace(/^https?:\/\//,""),s=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;e.style.backgroundImage=`url('${s}')`,e.style.backgroundSize="cover",e.style.backgroundPosition="center";const a=e.querySelector(".pc-img-icon");if(a&&(a.style.display="none"),o>1){const i=e.id.match(/pcimg-(.+)/);if(i){const c=document.getElementById("pcfc-"+i[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function ho(e){const t=Math.max(1,Math.ceil(he.length/xe));K=Math.min(Math.max(1,K+e),t),Pt(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function yo(e){Et=e,ao(e),document.getElementById("btn-lista").classList.toggle("active",e==="lista"),document.getElementById("btn-mapa").classList.toggle("active",e==="mapa");const t=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");t.style.display=e==="lista"?"":"none",o.style.display=e==="mapa"?"flex":"none",n&&(n.style.display=e==="lista"?"flex":"none"),e==="mapa"&&(so(),setTimeout(()=>io().invalidateSize(),120),vt(he))}async function xt(e){var n,s,a;if(H=y.STOCK.find(i=>i.id===e)||null,!H)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",V=[],W=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const t=H;try{q=((s=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`)).json()).data)==null?void 0:s[0])||null}catch{q=null}const o=((a=q==null?void 0:q.fotos_originales)!=null&&a.length?q.fotos_originales:q==null?void 0:q.fotos)||[];if(o.length)V=o,document.getElementById("dp-spin").style.display="none",Ke(0),document.getElementById("dp-thumbs").innerHTML=o.map((i,c)=>{const d=i.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(d)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const i=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",i.appendChild(c)}$o(t,q)}function bo(e){xt(e)}function Ke(e){var n;W=Math.max(0,Math.min(e,V.length-1));const t=document.getElementById("dp-img"),o=V[W].replace(/^https?:\/\//,"");t.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,t.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${W+1} / ${V.length}`,document.getElementById("dp-prev").disabled=W===0,document.getElementById("dp-next").disabled=W===V.length-1,document.querySelectorAll(".dp-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===W)),(n=document.getElementById("dp-thumbs").children[W])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Ge(e){Ke(W+e)}function $o(e,t){var v;const o=w(e.precioSinBono),n=w(e.m2total)||w(t==null?void 0:t.superficie),s=w(e.m2interior)||w(t==null?void 0:t.m2_utiles),a=w(e.m2terraza)||w(t==null?void 0:t.m2_terraza),i=(t==null?void 0:t.dormitorios)??"",c=(t==null?void 0:t.banios)??"",d=(t==null?void 0:t.piso)??"",f=((v=t==null?void 0:t.unitggcc)==null?void 0:v.monto)||(t==null?void 0:t.ggcc)||"",p=(t==null?void 0:t.youtube_video_id)||"",h=(t==null?void 0:t.espacios)||"",u=(t==null?void 0:t.building_finishes)||[],F=(e.oportunidad||"").toLowerCase().includes("oportunidad"),b=h?h.split(",").map($=>$.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
    <div class="detail-top">
      <div>
        <div class="detail-title">${r(e.condominio||e.direccion||"—")}</div>
        <div class="detail-addr">📍 ${r(e.direccion||"—")} · ${r(e.comuna||"")}${e.dp?" · DP "+r(e.dp):""}</div>
      </div>
      <div class="detail-badges">
        ${F?'<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>':""}
      </div>
    </div>
    <div class="dt-section">Características</div>
    <div class="specs-grid">
      <div class="spec-card"><div class="sv">${r(e.tipologia||"—")}</div><div class="sl">Tipología</div></div>
      ${n?`<div class="spec-card"><div class="sv">${n.toFixed(1)} m²</div><div class="sl">Sup. total</div></div>`:""}
      ${s&&s!==n?`<div class="spec-card"><div class="sv">${s.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>`:""}
      ${a?`<div class="spec-card"><div class="sv">${a.toFixed(1)} m²</div><div class="sl">Terraza</div></div>`:""}
      ${i!==""?`<div class="spec-card"><div class="sv">${i} 🛏</div><div class="sl">Dormitorios</div></div>`:""}
      ${c!==""?`<div class="spec-card"><div class="sv">${c} 🚿</div><div class="sl">Baños</div></div>`:""}
      ${d!==""?`<div class="spec-card"><div class="sv">Piso ${d}</div><div class="sl">Nivel</div></div>`:""}
      ${e.orientacion&&e.orientacion!=="-"?`<div class="spec-card"><div class="sv">${r(e.orientacion)}</div><div class="sl">Orientación</div></div>`:""}
      ${e.est&&e.est!=="0"?'<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>':""}
      ${e.bod&&e.bod!=="0"?'<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>':""}
      ${e.anio?`<div class="spec-card"><div class="sv">${r(e.anio)}</div><div class="sl">Año</div></div>`:""}
      ${f?`<div class="spec-card"><div class="sv">$${Number(f).toLocaleString("es-CL")}</div><div class="sl">Gastos comunes</div></div>`:""}
    </div>
    <div class="dt-section">Precio y condición comercial</div>
    <div class="price-block">
      <div class="dp-price-card">
        <div class="pc-label">Precio sin bono pie</div>
        <div class="pc-value">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
        ${o?`<div class="pc-sub">$${Math.round(o*y.UF).toLocaleString("es-CL")}</div>`:""}
      </div>
      ${e.bonoPct>0?`
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${e.bonoPct}%</div>
        ${w(e.bonoUF)?`<div class="bc-sub">${w(e.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${b.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${b.map($=>`<span class="dt-amenity">${r($)}</span>`).join("")}</div>`:""}
    ${u.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${u.map($=>{var P;const C=String($).split(":"),T=((P=C[0])==null?void 0:P.trim())||"",l=C.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(T)}</div><div class="dt-finish-v">${r(l)}</div></div>`}).join("")}</div>`:""}
    ${p?`
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${r(p)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>`:""}
    ${e.video&&!p?`
    <div class="dt-section">Video de la propiedad</div>
    <div style="margin:4px 0 12px">
      <button onclick="openVideo('${r(e.video)}')" style="background:#DC2626;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer">▶ Ver video</button>
    </div>`:""}
    ${Co(e)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizFromProp(${o||0},'${r(e.condominio||"")} DP${r(e.dp||"")}')">📊 Cotizar</button>
      ${e.video?`<button class="btn-fotos" onclick="openVideo('${r(e.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(e.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${V.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${V.length})</button>`:""}
    </div>`}function Co(e){const t=e.condominio||e.direccion;if(!t||!y.STOCK.length)return"";const o=y.STOCK.filter(s=>s.id!==e.id&&(s.condominio||s.direccion)===t);if(!o.length)return"";const n=o.map(s=>{const a=w(s.precioSinBono),i=w(s.m2total)||w(s.m2interior),c=[];return s.dp&&c.push("DP "+s.dp),i&&c.push(i.toFixed(0)+" m²"),s.orientacion&&s.orientacion!=="-"&&c.push(s.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(s.id)}')">
      <div class="ur-tipo">${r(s.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${a?a.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function We(){var e;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",V=[],W=0,H=null,q=null,(e=document.getElementById("dp-nophoto"))==null||e.remove()}function Fo(e){const t=H;if(!t)return;const o=w(t.precioSinBono),n=w(t.m2total)||w(t.m2interior),s=[`🏢 *${t.condominio||t.direccion}*`,`📍 ${t.direccion}${t.dp?" · DP "+t.dp:""} · ${t.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${t.tipologia||""}`,t.est&&t.est!=="0"?"🚗 Estacionamiento incluido":"",t.bod&&t.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",t.bonoPct>0?`✅ Acepta Bono Pie ${t.bonoPct}%`:"",t.video?`
▶ Video: ${t.video}`:""].filter(Boolean).join(`
`),a=`https://wa.me/?text=${encodeURIComponent(s)}`,i=document.createElement("div");i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",i.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${s}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${a}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(i),i.addEventListener("click",c=>{c.target===i&&i.remove()})}async function Eo(){if(!V.length)return;const e=document.getElementById("btn-dl-fotos"),t=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");e.classList.add("loading"),e.textContent="⏳ Descargando…",t.classList.add("show"),n.style.width="0%";const s=new JSZip,a=s.folder("fotos-propiedad"),i=V.length;async function c(h){try{const u=await fetch(ft(h));if(u.ok)return await u.blob()}catch{}try{const u=await fetch(h,{mode:"cors"});if(u.ok)return await u.blob()}catch{}return null}let d=0;for(let h=0;h<i;h++){o.textContent=`Descargando foto ${h+1} de ${i}…`,n.style.width=`${Math.round(h/i*90)}%`;const u=await c(V[h]);if(u){const F=u.type.includes("png")?"png":"jpg";a.file(`foto-${String(h+1).padStart(2,"0")}.${F}`,u),d++}}o.textContent="Generando ZIP…",n.style.width="95%";const f=await s.generateAsync({type:"blob"});if(n.style.width="100%",d===0){alert("No se pudieron descargar las fotos."),t.classList.remove("show"),e.classList.remove("loading"),e.textContent=`📥 Descargar Fotos (${V.length})`;return}const p=document.createElement("a");p.href=URL.createObjectURL(f),p.download=`fotos-${((H==null?void 0:H.condominio)||(H==null?void 0:H.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,p.click(),setTimeout(()=>{t.classList.remove("show"),e.classList.remove("loading"),e.textContent=`📥 Descargar Fotos (${V.length})`},800)}async function Po(){var Fe;if(!H)return;const e=H,t=q,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const s=w(e.precioSinBono),a=w(e.m2total)||w(t==null?void 0:t.superficie),i=w(e.m2interior)||w(t==null?void 0:t.m2_utiles),c=w(e.m2terraza)||w(t==null?void 0:t.m2_terraza),d=(t==null?void 0:t.dormitorios)??"",f=(t==null?void 0:t.banios)??"",p=(t==null?void 0:t.piso)??"",h=((Fe=t==null?void 0:t.unitggcc)==null?void 0:Fe.monto)||(t==null?void 0:t.ggcc)||"";((t==null?void 0:t.espacios)||"").split(",").map(M=>M.trim()).filter(Boolean),t!=null&&t.building_finishes;const u=(e.condominio||e.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),F=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function b(M){for(const D of[ft(M),M])try{const _=await fetch(D);if(!_.ok)continue;const z=await _.blob();return await new Promise(k=>{const R=new FileReader;R.onload=Q=>k(Q.target.result),R.readAsDataURL(z)})}catch{}return null}o.textContent="⏳ Cargando logo…";const v=await b("images/logo.png");o.textContent="⏳ Cargando fotos…";const C=(await Promise.all(V.slice(0,5).map(b))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:T}=window.jspdf,l=new T({unit:"mm",format:"a4",orientation:"portrait"}),P=210,A=297,E=10,S=190,x=[67,56,202],g=[107,114,128],U=[249,250,251],I=[255,255,255],G=[17,24,39],J=[5,150,105],Le=[209,250,229],te=M=>l.setFillColor(M[0],M[1],M[2]),j=M=>l.setTextColor(M[0],M[1],M[2]),pe=(M,D,_,z,k,R)=>{te(R),l.roundedRect(M,D,_,z,k,k,"F")},Me=(M,D)=>(te([229,231,235]),l.rect(E,D,S,.3,"F"),l.setFontSize(7.5),l.setFont("helvetica","bold"),j(g),l.text(M.toUpperCase(),E,D+4.5),D+8);let B=0;te(x),l.rect(0,0,P,22,"F"),v?(pe(E-1,3,44,15,2.5,I),l.addImage(v,"PNG",E+1,5,40,7.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(16),j(I),l.text("ViveProp",E,14)),l.setFont("helvetica","normal"),l.setFontSize(8.5),j([200,200,230]),l.text("Ficha de Propiedad",P-E,10,{align:"right"}),l.text(F,P-E,16,{align:"right"}),B=22,te([238,242,255]),l.rect(0,B,P,32,"F"),l.setFont("helvetica","bold"),l.setFontSize(15),j(G);const se=e.condominio||e.direccion||"—";l.text(se.length>38?se.slice(0,36)+"…":se,E,B+11),l.setFont("helvetica","normal"),l.setFontSize(9),j(g);const $e=`${e.direccion||"—"} · ${e.comuna||""}${e.dp?" · DP "+e.dp:""}`;if(l.text($e.length>55?$e.slice(0,53)+"…":$e,E,B+18),l.setFont("helvetica","bold"),l.setFontSize(20),j(x),l.text(s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",P-E,B+13,{align:"right"}),l.setFontSize(8),j(g),l.setFont("helvetica","normal"),l.text("Precio sin bono pie",P-E,B+8,{align:"right"}),e.bonoPct>0&&(pe(P-E-42,B+18,42,9,2,Le),l.setFont("helvetica","bold"),l.setFontSize(8),j(J),l.text(`Acepta Bono Pie ${e.bonoPct}%`,P-E-21,B+23.5,{align:"center"})),B+=34,C.length){const z=C.length>1?118:S,k=S-z-2;try{l.addImage(C[0],"JPEG",E,B,z,52,void 0,"FAST")}catch{}if(C[1])try{l.addImage(C[1],"JPEG",E+z+2,B,k,25,void 0,"FAST")}catch{}if(C[2])try{l.addImage(C[2],"JPEG",E+z+2,B+25+2,k,25,void 0,"FAST")}catch{}if(B+=54,C[3]||C[4]){const R=C[4]?(S-2)/2:S;if(C[3])try{l.addImage(C[3],"JPEG",E,B,R,32,void 0,"FAST")}catch{}if(C[4])try{l.addImage(C[4],"JPEG",E+R+2,B,R,32,void 0,"FAST")}catch{}B+=34}}B+=4,B=Me("Características",B);const ue=[e.tipologia?{v:e.tipologia,l:"Tipología"}:null,a?{v:a.toFixed(0)+" m²",l:"Superficie"}:null,i?{v:i.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,d!==""?{v:d+" dorm.",l:"Dormitorios"}:null,f!==""?{v:f+" baños",l:"Baños"}:null,p!==""?{v:"Piso "+p,l:"Nivel"}:null,e.orientacion&&e.orientacion!=="-"?{v:e.orientacion,l:"Orientación"}:null,e.est&&e.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,e.bod&&e.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,e.anio?{v:e.anio,l:"Año"}:null,h?{v:"$"+Number(h).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),ie=4,ae=(S-(ie-1)*3)/ie,Ce=14;ue.forEach((M,D)=>{const _=D%ie,z=Math.floor(D/ie),k=E+_*(ae+3),R=B+z*(Ce+3);pe(k,R,ae,Ce,2,U),l.setFont("helvetica","bold"),l.setFontSize(9),j(G),l.text(String(M.v).slice(0,18),k+ae/2,R+6.5,{align:"center"}),l.setFont("helvetica","normal"),l.setFontSize(7),j(g),l.text(M.l,k+ae/2,R+11,{align:"center"})}),B+=Math.ceil(ue.length/ie)*(Ce+3)+4,te(x),l.rect(0,A-16,P,16,"F"),v?(pe(E-1,A-14,33,11,2,I),l.addImage(v,"PNG",E+1,A-12.5,29,5.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(11),j(I),l.text("ViveProp",E,A-7)),l.setFont("helvetica","normal"),l.setFontSize(8),j([200,200,230]),l.text("www.viveprop.cl · Stock de propiedades en gestión",P-E,A-7,{align:"right"}),l.save(`ficha-${u}.pdf`),o.textContent=n,o.disabled=!1}function xo(e){He=e;const t=document.getElementById("video-player-wrap"),o=e.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(t.style.paddingTop="56.25%",t.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(t.style.paddingTop="0",t.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(e)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function wo(){const e=document.getElementById("video-copy-btn");navigator.clipboard.writeText(He).then(()=>{e.textContent="✅ Enlace copiado",setTimeout(()=>{e.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",He)})}function wt(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function O(e){if(!e)return 0;const t=String(e).match(/(\d+(?:[.,]\d+)?)/);return t?parseFloat(t[1].replace(",","."))/100:0}function Ne(e){if(!e)return 0;const t=parseFloat(String(e).replace(/\./g,"").replace(",","."));return isFinite(t)&&t>=1e3?Math.round(t):0}function Io(e){if(!e)return 0;const t=String(e).match(/(\d+(?:[.,]\d+)?)/);return t?parseFloat(t[1].replace(",",".")):0}function Pe(e){if(!e)return 0;const t=String(e).match(/(\d+)/);return t?parseInt(t[1]):0}function Bo(e){const t={};for(const[o,n]of(e==null?void 0:e.campos)||[])o&&(t[String(o).trim()]=String(n??"").trim());return t}function Lo(e,t){const o=Bo(e),n=(t||"").toUpperCase(),s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(e==null?void 0:e.nota)||""};if(n.includes("INGEVEC")){const a=Pe(o["Cuotas pie"]);return{...s,descuentoDepto:O(o["Dcto. depto."]),aporteInmobiliario:O(o["Aporte inmobiliario"]),reservaCLP:Ne(o.Reserva),cuotasPieN:Math.max(a-1,0),pieConstPct:O(o["Pie período const."]),creditoDirectoPct:O(o["Pie crédito s/int."]),cuotonPct:O(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(e==null?void 0:e.nota)||""}}if(n.includes("MAESTRA")){const a=O(o.Upfront),i=O(o["Pie en cuotas"]);return{...s,descuentoDepto:O(o["Descuento Base"])+O(o["Dcto Adicional"]),aporteInmobiliario:O(o["Certificado Pago"]),upfrontPct:a,piePctDefault:a+i||null,cuotasPieN:Pe(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(e==null?void 0:e.nota)||""}}if(n.includes("RVC")){const a=O(o["Pie mínimo"]);return{...s,descuentoDepto:O(o["Descuento RVC"]),piePctDefault:a||null,cuotasPieN:Pe(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(e==null?void 0:e.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const a=o["Monto Reserva"]||"",i=/uf/i.test(a),c=O(o["Pie minimo %"]);return{...s,descuentoDepto:O(o["Descuento autorizado"]),reservaCLP:i?0:Ne(a),reservaUF:i?Io(a):0,piePctDefault:c||null,cuotasPieN:Pe(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(e==null?void 0:e.nota)||""}}if(n.includes("URMENETA")){const a=(e==null?void 0:e.nota)||"",i=a.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||a.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||a.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=i?parseFloat(i[1].replace(",","."))/100:0;return{...s,descuentoDepto:O(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Ne(o["Valor reserva"]),pieConstPct:O(o["% cuotas const."]),cuotasPieN:Pe(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:a}}return s}const Ue={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},st={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},Mo=[.04,.045,.05],It=30,Bt=.12;function So(e,t,o){return e===0?o/t:o*e/(1-Math.pow(1+e,-t))}function Uo(e){const t=(e||"").toUpperCase();return st[t]||st.DEFAULT}function To(e){const{precioListaDepto:t,descuentoPct:o,bonoPiePct:n,reservaCLP:s,preciosConjuntos:a,piePct:i,upfrontPct:c,plazoAnios:d,tasasCAE:f,valorUF:p,cuotonPct:h,piePeriodoConstruccionPct:u,pieCreditoDirectoPct:F,cuotasPieN:b,arriendosMensualesCLP:v,plusvaliaAnual:$,tipoCalculoBono:C}=e,T=e.pieConjuntosPct??.2,l=(a||[]).reduce((ce,ze)=>ce+ze,0),P=t+l,A=Math.min(o+0,1),E=t*(1-A),S=l,x=E+S,g=x*p,U=C==="maestra"?i:T,I=Math.round(E*i*100)/100,G=Math.round(l*U*100)/100,J=I+G,Le=s/p,te=Math.round(x*(c||0)*100)/100,j=J-Le-te,pe=j*p,Me=b>0?j/b:j,B=Me*p,se=Math.round(x*(h||0)*100)/100,$e=Math.round(se*p),ue=Math.round(x*(u||0)*100)/100,ie=Math.round(ue*p),ae=Math.round(x*(F||0)*100)/100,Ce=Math.round(ae*p),Fe=J+se+ue,M=x*(1-i);let D,_,z,k,R,Q;if(C==="maestra"){const ce=1-i-n;_=n>0?Math.round(M/ce*100)/100:x,D=Math.round(_*n*100)/100,z=Math.round(_*ce*100)/100,Q=J,k=Math.round((_-Q-z)*100)/100,R=_>0?k/_:0}else C==="precio-lista-total"?(D=Math.round(P*n*100)/100,_=n>0?Math.round((x+D)*100)/100:x,k=D,R=n,Q=J,z=Math.round((x-Q-k)*100)/100):(D=Math.round(t*n*100)/100,_=n>0?Math.round((x+D)*100)/100:x,k=D,R=n,Q=J,z=Math.round((x-Q-k)*100)/100);const Ye=z*p,jt=_*p,et=Math.pow(1+($||Ue.PLUSVALIA_DEFAULT),5)-1,zt=g*(1+et)*Ue.HAIRCUT_VENTA,Rt=Fe*p,Ot=f.map((ce,ze)=>{const Se=(v||[0,0,0])[ze]||0,Nt=d*12,Re=So(ce/12,Nt,Ye),Vt=Re/p,tt=Se-Re,Ht=tt*Ue.MESES_ARRIENDO_ANIO*5,Gt=_>0?Se*Ue.MESES_ARRIENDO_ANIO/p/_:0,qt=Se*.9,ot=g>0?Math.round(qt*12/g*1e4)/1e4:0,Jt=Math.round(ot*5*1e4)/1e4;return{cae:ce,arriendoMensualCLP:Se,cuotaMensualCLP:Math.round(Re),cuotaMensualUF:Math.round(Vt*100)/100,flujoMensualCLP:Math.round(tt),flujoAcumuladoCLP:Math.round(Ht),capRate:Math.round(Gt*1e4)/1e4,roi5Anios:Jt,roiAnual:ot}});return{valorUF:p,precioListaDepto:t,precioListaOtros:l,precioListaTotal:P,precioDescDepto:Math.round(E*100)/100,precioDescOtros:S,valorVentaUF:Math.round(x*100)/100,valorVentaCLP:Math.round(g),piePct:i,upfrontPct:c||0,pieTotalDeptoUF:Math.round(I*100)/100,pieTotalConjuntosUF:Math.round(G*100)/100,pieTotalUF:Math.round(J*100)/100,reservaUF:Math.round(Le*100)/100,upfrontUF:te,saldoPieUF:Math.round(j*100)/100,saldoPieCLP:Math.round(pe),cuotasPieN:b,valorCuotaPieUF:Math.round(Me*100)/100,valorCuotaPieCLP:Math.round(B),cuotonUF:se,cuotonCLP:$e,piePeriodoConstruccionUF:ue,piePeriodoConstruccionCLP:ie,pieCreditoDirectoUF:ae,pieCreditoDirectoCLP:Ce,totalPieInmobUF:Math.round(Fe*100)/100,descuentoAdicionalPct:0,bonoPieUF:D,saldoAporteInmobUF:Math.round(k*100)/100,aportePct:Math.round(R*1e4)/1e4,pieCreditoHipUF:Math.round(Q*100)/100,tasacionUF:Math.round(_*100)/100,tasacionCLP:Math.round(jt),creditoHipBaseUF:Math.round(M*100)/100,creditoHipFinalUF:Math.round(z*100)/100,creditoHipFinalCLP:Math.round(Ye),plusvaliaAcumulada:Math.round(et*1e4)/1e4,precioVentaAnio5CLP:Math.round(zt),piePagadoCLP:Math.round(Rt),escenarios:Ot}}let ee=null,ke="";function Lt(e,t){if(typeof e=="number"){Ko(e,t);return}try{const{project:o,depto:n,secundarios:s=[]}=e;console.log("[Cotizador] cotizFromProp",{project:o,depto:n,secundarios:s});const a=y.CC_DATA[o.id]||null,i=Lo(a,o.inmobiliaria),c=Uo(o.inmobiliaria),d=i.reservaUF>0?Math.round(i.reservaUF*y.UF):i.reservaCLP;ee={project:o,depto:n,secundarios:s,parsedCC:i,regla:c,reservaCLP:d,cliente:null},_o(),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(o){console.error("[Cotizador] Error en cotizFromProp:",o),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(o))}

${r(o.stack||"")}</div>`}}function Mt(){if(ee)try{const e=Oo(),t=No(e),o=To(t);console.log("[Cotizador] Input:",t),console.log("[Cotizador] Resultado:",o),Vo(o,e)}catch(e){console.error("[Cotizador] Error en recalcCotizPanel:",e),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}

${r(e.stack||"")}</div>`}}function Do(){ee=null,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",window.openModule("pri")}function le(e){return+((e??0)*100).toFixed(2)}function _o(){const{project:e,depto:t,secundarios:o}=ee,n=[`${e.nombre} · DP ${t.dp}${t.tipologia?" "+t.tipologia:""}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp}`)];document.getElementById("ccf-header-title").textContent=n.join(" + ");const s=t.precio_uf+o.reduce((c,d)=>c+d.precio_uf,0),a=[`DP ${t.dp}${t.tipologia?" — "+t.tipologia:""} · ${m.uf2(t.precio_uf)}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp} · ${m.uf2(c.precio_uf)}`)];document.getElementById("ccf-prop-summary").innerHTML=`<div class="ccf-prop-lines">${a.map(c=>`<div class="ccf-prop-line">${r(c)}</div>`).join("")}</div><div class="ccf-prop-total">Total precio lista: <strong>${m.uf2(s)}</strong></div>`,["ccf-nombre","ccf-rut","ccf-email","ccf-tel"].forEach(c=>{const d=document.getElementById(c);d&&(d.value="",d.classList.remove("cp-input--err"))});const i=document.getElementById("ccf-objetivo");i&&(i.value="",i.classList.remove("cp-input--err")),document.querySelectorAll(".ccf-err").forEach(c=>{c.textContent=""});try{const c=JSON.parse(localStorage.getItem("_corredor")||"{}");c.nombre&&(document.getElementById("ccf-cor-nombre").value=c.nombre),c.email&&(document.getElementById("ccf-cor-email").value=c.email),c.tel&&(document.getElementById("ccf-cor-tel").value=c.tel)}catch{}}function Ao(e){const t=e.replace(/[.\s]/g,"").toUpperCase();if(!/^\d{7,8}-?[0-9K]$/.test(t))return!1;const o=t.replace("-",""),n=o.slice(0,-1),s=o.slice(-1);let a=0,i=2;for(let f=n.length-1;f>=0;f--)a+=parseInt(n[f])*i,i=i===7?2:i+1;const c=11-a%11,d=c===11?"0":c===10?"K":String(c);return s===d}function it(e){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())}function at(e){const t=e.replace(/[\s\-\(\)\.]/g,"");return/^(\+?56)?9\d{8}$/.test(t)||/^\+?56[2-9]\d{7}$/.test(t)}function N(e,t){const o=document.getElementById(e),n=document.getElementById(e+"-err");o&&o.classList.toggle("cp-input--err",!!t),n&&(n.textContent=t||"")}function ko(e){N(e,"")}function jo(e){const t=document.getElementById(e);if(!t)return;const o=t.value.replace(/[^\dkK]/g,"").toUpperCase();if(o.length>1){const n=o.slice(0,-1),s=o.slice(-1);t.value=n.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+s}N(e,"")}function zo(){if(!ee)return;let e=!0;const t=p=>{var h;return(((h=document.getElementById(p))==null?void 0:h.value)||"").trim()},o=t("ccf-nombre");o.length<2&&(N("ccf-nombre","Ingresa el nombre completo"),e=!1);const n=t("ccf-rut");n?Ao(n)||(N("ccf-rut","RUT inválido — verifica el dígito verificador"),e=!1):(N("ccf-rut","Ingresa el RUT"),e=!1);const s=t("ccf-email");s?it(s)||(N("ccf-email","Formato de email inválido"),e=!1):(N("ccf-email","Ingresa el email"),e=!1);const a=t("ccf-tel");a?at(a)||(N("ccf-tel","Formato inválido — ej: +56 9 1234 5678"),e=!1):(N("ccf-tel","Ingresa el teléfono"),e=!1);const i=t("ccf-objetivo");i||(N("ccf-objetivo","Selecciona un objetivo"),e=!1);const c=t("ccf-cor-nombre");c.length<2&&(N("ccf-cor-nombre","Ingresa el nombre del corredor"),e=!1);const d=t("ccf-cor-email");d?it(d)||(N("ccf-cor-email","Formato de email inválido"),e=!1):(N("ccf-cor-email","Ingresa el email del corredor"),e=!1);const f=t("ccf-cor-tel");if(f?at(f)||(N("ccf-cor-tel","Formato inválido — ej: +56 9 1234 5678"),e=!1):(N("ccf-cor-tel","Ingresa el teléfono del corredor"),e=!1),!!e){try{localStorage.setItem("_corredor",JSON.stringify({nombre:c,email:d,tel:f}))}catch{}ee.cliente={nombre:o,rut:n,email:s,tel:a,objetivo:i,corNombre:c,corEmail:d,corTel:f},Ro(ee.parsedCC),document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",Mt()}}function Ro(e){const t=Math.round((e.piePctDefault??Bt)*100),o=le((e.descuentoDepto??0)+(e.descuentoAdicional??0)),n=le(e.aporteInmobiliario),s=e.cuotasPieN??0,a=le(e.pieConstPct),i=le(e.cuotonPct),c=le(e.upfrontPct),d=le(e.creditoDirectoPct),[f,p,h]=Mo.map(v=>le(v)),u=`Cuotas pie${s>0?` <span class="cp-fg-base">base ${s}</span>`:""}`,F=`Cuotón %${i===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,b=(v,$,C,T,l,P)=>`<div class="cp-fg"><label class="cp-fg-lbl">${v}</label><input id="${$}" class="cp-input" type="number" min="${T}" max="${l}" step="${P}" value="${C}" onchange="recalcCotizPanel()"></div>`;document.getElementById("cp-params-grid").innerHTML=`
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${b("Pie %","cpg-pie",t,0,100,1)}
        ${b("Plazo (años)","cpg-plazo",It,5,30,1)}
        ${b("Dcto. depto %","cpg-dcto",o,0,100,.1)}
        ${b("Aporte inmob %","cpg-aporte",n,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${b(u,"cpg-cuotas",s,0,48,1)}
        ${b("Pie const %","cpg-piecst",a,0,100,.1)}
        ${b(F,"cpg-cuoton",i,0,100,.1)}
        ${b("Upfront %","cpg-upfront",c,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("Crédito directo %","cpg-cdir",d,0,100,.1)}
        ${b("Plusvalía anual %","cpg-plusvalia",2,0,20,.1)}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("CAE escenario 1","cpg-cae1",f,0,20,.1)}
        ${b("CAE escenario 2","cpg-cae2",p,0,20,.1)}
        ${b("CAE escenario 3","cpg-cae3",h,0,20,.1)}
      </div>
    </div>`}function Oo(){const e=t=>{var n;const o=parseFloat((n=document.getElementById(t))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:e("cpg-pie")||Bt*100,plazo:e("cpg-plazo")||It,dcto:e("cpg-dcto"),aporte:e("cpg-aporte"),cuotas:e("cpg-cuotas"),piecst:e("cpg-piecst"),cuoton:e("cpg-cuoton"),upfront:e("cpg-upfront"),cdir:e("cpg-cdir"),plusvalia:e("cpg-plusvalia")||2,cae1:e("cpg-cae1")||4,cae2:e("cpg-cae2")||4.5,cae3:e("cpg-cae3")||5}}function No(e){const{reservaCLP:t,regla:o,depto:n,secundarios:s}=ee;return{precioListaDepto:n.precio_uf,descuentoPct:e.dcto/100,descuentoAdicionalPct:0,bonoPiePct:e.aporte/100,reservaCLP:t,preciosConjuntos:s.map(a=>a.precio_uf),piePct:e.pie/100,upfrontPct:e.upfront/100,cuotasPieN:e.cuotas,cuotonPct:e.cuoton/100,piePeriodoConstruccionPct:e.piecst/100,pieCreditoDirectoPct:e.cdir/100,plazoAnios:e.plazo,tasasCAE:[e.cae1/100,e.cae2/100,e.cae3/100],valorUF:y.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:e.plusvalia/100}}function oe(e){return(Math.round(parseFloat(e)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function Vo(e,t){const{project:o,depto:n,secundarios:s}=ee,a=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...s.map(i=>`${i.tipologia?i.tipologia+" ":""}DP ${i.dp}`)];document.getElementById("cp-header-title").textContent=a.join(" + "),document.getElementById("cp-results").innerHTML=Ho(e,n,s)+Go(e)+(e.pieCreditoDirectoUF>0?qo(e):"")+Jo(e,t.plazo)}function Ho(e,t,o){const n=e.precioListaDepto>0?1-e.precioDescDepto/e.precioListaDepto:0,s=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(t.dp))}${t.tipologia?" &mdash; "+r(t.tipologia):""}</td>
      <td>${m.uf2(e.precioListaDepto)}</td>
      <td>${n>1e-4?`<span class="cp-val-dcto">&minus;${oe(n)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${m.uf2(e.precioDescDepto)}</td>
    </tr>`,a=o.map(i=>`
    <tr>
      <td class="cp-val-unit">${i.tipologia?r(i.tipologia)+" ":""}DP ${r(String(i.dp))}</td>
      <td>${m.uf2(i.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${m.uf2(i.precio_uf)}</td>
    </tr>`).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Valores</div>
    <div class="cp-section-body">
      <table class="cp-val-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Dcto.</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${s}${a}
          <tr class="cp-val-total">
            <td>Total</td>
            <td>${m.uf2(e.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${m.uf2(e.valorVentaUF)}<br>
              <small class="cp-val-clp">${m.pesos(e.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function Go(e){let t="";if(t+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${oe(e.piePct)}</span></span>
      <span class="cp-plan-val">${m.uf2(e.pieTotalUF)}<small>${m.pesos(e.pieTotalUF*e.valorUF)}</small></span>
    </div>`,t+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${m.uf2(e.reservaUF)}<small>${m.pesos(e.reservaUF*e.valorUF)}</small></span>
    </div>`,e.upfrontUF>0&&(t+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${oe(e.upfrontPct)}</span></span>
        <span class="cp-plan-val">${m.uf2(e.upfrontUF)}<small>${m.pesos(e.upfrontUF*e.valorUF)}</small></span>
      </div>`),e.cuotasPieN>0&&e.saldoPieUF>0&&(t+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${e.cuotasPieN} cuotas &times; ${m.uf2(e.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${m.uf2(e.saldoPieUF)}<small>${m.pesos(e.saldoPieCLP)}</small></span>
      </div>`),e.piePeriodoConstruccionUF>0){const n=e.valorVentaUF>0?e.piePeriodoConstruccionUF/e.valorVentaUF:0;t+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${oe(n)}</span></span>
        <span class="cp-plan-val">${m.uf2(e.piePeriodoConstruccionUF)}<small>${m.pesos(e.piePeriodoConstruccionCLP)}</small></span>
      </div>`}e.cuotonUF>0&&(t+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${m.uf2(e.cuotonUF)}<small>${m.pesos(e.cuotonCLP)}</small></span>
      </div>`);const o=e.valorVentaUF>0?e.totalPieInmobUF/e.valorVentaUF:0;return t+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${oe(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${m.uf2(e.totalPieInmobUF)}<small>${m.pesos(e.totalPieInmobUF*e.valorUF)}</small></span>
    </div>`,e.bonoPieUF>0&&(t+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${oe(e.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${m.uf2(e.bonoPieUF)}<small>${m.pesos(e.bonoPieUF*e.valorUF)}</small></span>
      </div>`),`
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${t}</div>
    </div>
  </div>`}function qo(e){const t=e.valorVentaUF>0?e.pieCreditoDirectoUF/e.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${oe(t)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${m.uf2(e.pieCreditoDirectoUF)}<small>${m.pesos(e.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function Jo(e,t){const o=e.tasacionUF>0?e.creditoHipFinalUF/e.tasacionUF:0,n=e.escenarios.map((s,a)=>{const i=s.cuotaMensualCLP/.25;return`
      <tr${a===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(s.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${m.pesos(s.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${m.uf2(s.cuotaMensualUF)}</td>
        <td>${m.pesos(i)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${t} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${m.uf2(e.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${m.pesos(e.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${oe(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${m.uf2(e.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${m.pesos(e.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${n}</tbody>
      </table>
    </div>
  </div>`}function Ko(e,t){document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",document.getElementById("c-precio").value=e,ke=t||"";const o=document.getElementById("c-prop-info");o.innerHTML=`📦 ${r(ke)}`,o.style.display="block",window.openModule("cotiz"),Ze()}function Wo(e){const t=document.getElementById("c-pie-r"),o=document.getElementById("c-pie-n");e==="r"?o.value=t.value:t.value=o.value,document.getElementById("pie-lbl").textContent=t.value+"%",Ze()}function Ze(){const e=parseFloat(document.getElementById("c-precio").value)||0,t=parseFloat(document.getElementById("c-pie-n").value)||20,o=parseFloat(document.getElementById("c-plazo").value)||25,n=parseFloat(document.getElementById("c-tasa").value)||5,s=parseFloat(document.getElementById("c-gc").value)||0;document.getElementById("pie-lbl").textContent=t+"%";const a=document.getElementById("c-results");if(!e){a.innerHTML='<div class="empty-tool"><div class="ei">📊</div><p>Ingresa el precio para simular</p></div>';return}const i=e*t/100,c=e-i,d=n/100/12,f=o*12,p=c*d*Math.pow(1+d,f)/(Math.pow(1+d,f)-1),h=s/y.UF,u=p/.25,F=(p+h)/.25,b=[15,20,25,30];a.innerHTML=`<div class="cotiz-card">
    ${ke?`<div style="font-size:12px;font-weight:600;color:var(--brand);margin-bottom:14px">📦 ${r(ke)}</div>`:""}
    <div class="rc-hero">
      <div class="rc-big">${m.pesos(p*y.UF)}</div>
      <div class="rc-lbl">Dividendo mensual estimado</div>
      <div class="rc-pesos">${m.uf1(p)} · ${o} años al ${n}%</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${m.uf(e)}</span><span class="rcl">Precio propiedad</span><span class="rcp">${m.pesos(e*y.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(i)} (${t}%)</span><span class="rcl">Pie inicial</span><span class="rcp">${m.pesos(i*y.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(c)}</span><span class="rcl">Monto crédito</span><span class="rcp">${m.pesos(c*y.UF)}</span></div>
      <div class="rc-cell hi"><span class="rcv">${m.pesos(u*y.UF)}</span><span class="rcl">Renta mínima necesaria</span><span class="rcp">${s?`Con GC: ${m.pesos(F*y.UF)}`:"Regla 25%"}</span></div>
    </div>
    <div class="rc-tbl-title">Comparativa por plazo · Pie ${t}% · Tasa ${n}%</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th><th>Total pagado</th></tr></thead>
      <tbody>${b.map(v=>{const $=v*12,C=c*d*Math.pow(1+d,$)/(Math.pow(1+d,$)-1);return`<tr class="${v==o?"tr-hl":""}"><td>${v} años</td><td><strong>${m.pesos(C*y.UF)}</strong></td><td>${m.uf1(C)}</td><td>${m.pesos(C/.25*y.UF)}</td><td>${m.uf(C*$)}</td></tr>`}).join("")}</tbody>
    </table>
    ${s?`<p style="font-size:11px;color:var(--g400);margin-top:10px;font-style:italic">* GC de ${m.pesos(s)}/mes incluidos en renta necesaria</p>`:""}
  </div>`}const De=xe,Zo=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let ye=[],Ve=null,Z=1,St="lista",be=null,ne=null,re=[],Y=0;function Ut(e){return e?Zo.some(t=>e.toUpperCase().includes(t))?[1]:[]:[]}function Qo(){if(!y.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const e=[...new Set(y.PROJECTS.map(t=>t.comuna).filter(Boolean))].sort();dt("pri",e),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),je()}function je(){var f,p,h,u,F,b;if(!y.PROJECTS.length)return;const e=(((f=document.getElementById("pri-search"))==null?void 0:f.value)||"").toLowerCase(),t=pt("pri"),o=((p=document.getElementById("pri-entrega"))==null?void 0:p.value)||"",n=parseFloat((h=document.getElementById("pri-precio-min"))==null?void 0:h.value)||0,s=parseFloat((u=document.getElementById("pri-precio-max"))==null?void 0:u.value)||0,a=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(v=>parseInt(v.dataset.val)),i=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(v=>parseInt(v.dataset.val)),c=((F=document.getElementById("pri-est"))==null?void 0:F.checked)||!1,d=((b=document.getElementById("pri-bod"))==null?void 0:b.checked)||!1;Ve=window._priMaxUF||null,ye=y.PROJECTS.filter(v=>{var T;let $=(v.unidades||[]).filter(l=>l.disponible&&!de(l.tipologia));if(!$.length||e&&!`${v.nombre||""} ${v.inmobiliaria||""} ${v.comuna||""}`.toLowerCase().includes(e)||t.size&&!t.has(v.comuna)||o&&!((T=v.entrega)!=null&&T.toLowerCase().includes(o.toLowerCase()))||c&&!(v.unidades||[]).some(l=>l.disponible&&/estac|parking|reja/i.test(l.tipologia||""))||d&&!(v.unidades||[]).some(l=>l.disponible&&/bode/i.test(l.tipologia||""))||a.length&&($=$.filter(l=>{const P=parseInt(l.dormitorios)||0;return a.some(A=>A===4?P>=4:P===A)}),!$.length)||i.length&&($=$.filter(l=>{const P=parseInt(l.banos)||0;return i.some(A=>A===3?P>=3:P===A)}),!$.length))return!1;const C=Math.min(...$.map(l=>l.precio_uf).filter(l=>l>0));return!(n&&C<n||s&&C>s||Ve&&!$.some(l=>l.precio_uf<=Ve))}),Z=1,Tt(),St==="mapa"&&$t(ye)}function Xo(e){const t=Math.max(1,Math.ceil(ye.length/De));Z=Math.min(Math.max(1,Z+e),t),Tt(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Tt(){const e=document.getElementById("pri-grid"),t=ye.length,o=Math.max(1,Math.ceil(t/De));Z>o&&(Z=o),document.getElementById("pri-count").textContent=`${t.toLocaleString("es-CL")} proyecto${t!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${Z} / ${o}`,document.getElementById("pri-prev").disabled=Z<=1,document.getElementById("pri-next").disabled=Z>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${t.toLocaleString("es-CL")} proyectos · ${y.PROJECTS.length.toLocaleString("es-CL")} total`),!t){e.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const s=ye.slice((Z-1)*De,Z*De);e.innerHTML=s.map(a=>{const i=(a.unidades||[]).filter(v=>v.disponible&&!de(v.tipologia)),c=i.map(v=>v.precio_uf).filter(v=>v>0),d=c.length?Math.min(...c):0,f=c.length?Math.max(...c):0,p=a.foto_portada||"",h=[...new Set(i.map(v=>{const $=parseInt(v.dormitorios)||0;return $===0?"Estudio":$+"D"}))].sort().slice(0,3).join(", "),u=i.reduce((v,$)=>$.m2_interior&&$.m2_interior<v?$.m2_interior:v,9999),F=u<9999?u.toFixed(0)+" m²":"—",b=y.CC_DATA[a.id]||Ut(a.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(a.id)}')">
      <div class="prj-img" style="${p?`background-image:url('${p}');background-size:cover;background-position:center`:""}">
        ${p?"":'<div class="prj-img-icon">🏗️</div>'}
        <span class="prj-badge">Nuevo</span>
        ${a.entrega?`<span class="prj-entrega">${r(a.entrega)}</span>`:""}
      </div>
      <div class="prj-body">
        <div class="prj-row1">
          <div class="prj-name">${r(a.nombre)}</div>
          <span class="prj-new-badge">${i.length} uds</span>
        </div>
        <div class="prj-sub">${r(a.inmobiliaria||"—")}${a.comuna?" · "+r(a.comuna):""}</div>
        ${a.direccion?`<div class="prj-addr">📍 ${r(a.direccion)}</div>`:'<div style="margin-bottom:9px"></div>'}
        <div class="prj-stats">
          <div class="prj-stat"><div class="prj-stat-v">${h||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${F}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${i.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${d?"UF "+d.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${f>d?`<span class="prj-hasta">— ${f.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(a.id)}')">Ver proyecto →</button>
          ${b?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function Yo(e){St=e,po(e),document.getElementById("pri-btn-lista").classList.toggle("active",e==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",e==="mapa");const t=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(t.style.display=e==="lista"?"":"none",o.style.display=e==="mapa"?"flex":"none",n&&(n.style.display=e==="lista"?"flex":"none"),e==="mapa"){lo();const s=ro();setTimeout(()=>s&&s.invalidateSize(),120),$t(ye)}}function Dt(e){["gal","map","units","cc"].forEach(t=>{const o=document.getElementById("pm-tab-"+t),n=document.getElementById("pm-pane-"+t);o&&o.classList.toggle("active",t===e),n&&(n.style.display=t===e?"flex":"none")}),e==="map"&&mo(be)}function en(e){const t=e.unidades||[],o=t.filter(g=>g.disponible&&!de(g.tipologia)),n=o.map(g=>g.precio_uf).filter(g=>g>0),s=n.length?Math.min(...n):0,a=n.length?Math.max(...n):0,i=o.map(g=>g.m2_interior).filter(g=>g>0),c=i.length?Math.min(...i):0,d=i.length?Math.max(...i):0,f=[...new Set(o.map(g=>{const U=parseInt(g.dormitorios)||0;return U===0?"Estudio":U+"D"}))].sort(),p=g=>g.toLocaleString("es-CL",{maximumFractionDigits:0}),h=s?a>s?`UF ${p(s)} – ${p(a)}`:`UF ${p(s)}`:" — ",u=c?d>c?`${c.toFixed(0)} – ${d.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",F=[e.direccion,e.comuna].filter(Boolean).join(", ");let b="";F&&(b+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r(F)}</span>
      ${e.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(e.entrega)}</span>`:""}
    </div>`),b+=`<div class="pm-stats-grid">
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Disponibles</span>
      <span class="pm-stat-card-val">${o.length}</span>
      <span class="pm-stat-card-sub">unidades</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Tipologías</span>
      <span class="pm-stat-card-val" style="font-size:${f.length>3?"11px":"15px"}">${f.join(", ")||"—"}</span>
      <span class="pm-stat-card-sub">${f.length} tipo${f.length!==1?"s":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">M² útil</span>
      <span class="pm-stat-card-val" style="font-size:${d>c?"11px":"15px"}">${u}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${a>s?"11px":"15px"}">${h}</span>
      <span class="pm-stat-card-sub">${s?"en UF":""}</span>
    </div>
  </div>`;const v=[...new Set(o.map(g=>parseInt(g.piso)).filter(g=>g>0))].sort((g,U)=>g-U),$=[...new Set(o.map(g=>(g.orientacion||"").trim()).filter(Boolean))],C=o.map(g=>g.m2_terraza).filter(g=>g>0),T=[];if(v.length>0){const g=v.length===1?`Piso ${v[0]}`:`Pisos ${v[0]} – ${v[v.length-1]}`;T.push(`<div class="pm-detail-pill"><strong>${g}</strong></div>`)}if($.length>0&&T.push(`<div class="pm-detail-pill">🧭 <strong>${$.slice(0,3).join(" · ")}</strong></div>`),C.length>0){const g=Math.min(...C).toFixed(0);T.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${g} m²</strong></div>`)}T.length&&(b+=`<div class="pm-detail-row">${T.join("")}</div>`);const l=t.filter(g=>de(g.tipologia)&&/estac|parking/i.test(g.tipologia||"")),P=t.filter(g=>de(g.tipologia)&&/bode/i.test(g.tipologia||"")),A=l.filter(g=>g.disponible),E=P.filter(g=>g.disponible),S=[];if(l.length>0){const g=A.map(I=>I.precio_uf).filter(I=>I>0),U=g.length?Math.min(...g):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${A.length} disp.</span>
        <span class="pm-extra-sub">${U?`Desde UF ${p(U)}`:`${l.length} en total`}</span>
      </div>
    </div>`)}if(P.length>0){const g=E.map(I=>I.precio_uf).filter(I=>I>0),U=g.length?Math.min(...g):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${E.length} disp.</span>
        <span class="pm-extra-sub">${U?`Desde UF ${p(U)}`:`${P.length} en total`}</span>
      </div>
    </div>`)}S.length&&(b+=`<div class="pm-extras-row">${S.join("")}</div>`);const x=y.CC_DATA[e.id];if(x&&x.campos&&x.campos.length){const g=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],U=[];for(const I of g){const G=x.campos.find(([J])=>J===I);if(G&&U.push(G),U.length===6)break}U.length<6&&x.campos.filter(([I])=>!U.find(([G])=>G===I)).slice(0,6-U.length).forEach(I=>U.push(I)),b+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${U.map(([I,G])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(I)}</span>
          <span class="pm-cc-prev-val">${r(G)}</span>
        </div>`).join("")}
      </div>
      ${x.nota?`<div class="pm-cc-nota">${r(x.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=b}function _t(e){const t=document.getElementById("pm-cc-inner"),o=y.CC_DATA[e]||null;if(!o){t.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const s=o.campos.filter(([,i])=>i.length<=60),a=o.campos.filter(([,i])=>i.length>60);s.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',s.forEach(([i,c])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(i)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),n+="</div>"),a.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',a.forEach(([i,c])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(i)}</div>`,n+=`<div class="pm-cc-val-long">${r(c)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(s=>{n+=`<th>${r(s)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(s=>{n+="<tr>",s.forEach(a=>{n+=`<td>${r(a||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),t.innerHTML=n}function tn(e){const t=y.PROJECTS.find(u=>u.id===e);if(!t)return;be=t,ne=null,document.getElementById("pm-title").textContent=t.nombre,document.getElementById("pm-sub").textContent=[t.inmobiliaria,t.comuna,t.entrega?"Entrega "+t.entrega:""].filter(Boolean).join(" · "),Dt("gal"),en(t),re=t.fotos||[],Y=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),s=document.getElementById("pm-gal-nophoto"),a=document.getElementById("pm-gal-thumbs"),i=document.getElementById("pm-gal-counter");n.style.display="none",re.length?(s.style.display="none",Qe(0),a.innerHTML=re.map((u,F)=>`<img src="${u}" onclick="pmShowGalPhoto(${F})" ${F===0?'class="active"':""}>`).join("")):(o.style.display="none",s.style.display="flex",a.innerHTML="",i.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=t.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(u=>`<a class="pm-pdf-item" href="${u.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(u.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const d=document.getElementById("pm-tab-cc"),f=y.CC_DATA[t.id],p=Ut(t.inmobiliaria).length>0;f||p?(d.style.display="",_t(t.id)):d.style.display="none";const h=(t.unidades||[]).filter(u=>u.disponible&&!de(u.tipologia));document.getElementById("pm-units-body").innerHTML=h.map(u=>`
    <tr>
      <td>${r(u.dp)}</td>
      <td>${r(u.tipologia)}</td>
      <td>${r(u.piso||"—")}</td>
      <td>${u.m2_interior?u.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${u.m2_terraza?u.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(u.orientacion||"—")}</td>
      <td class="td-precio">${m.uf(u.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(u.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Qe(e){var n;Y=Math.max(0,Math.min(e,re.length-1));const t=document.getElementById("pm-gal-img");t.src=re[Y],t.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${Y+1} / ${re.length}`,document.getElementById("pm-gal-prev").disabled=Y===0,document.getElementById("pm-gal-next").disabled=Y===re.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===Y)),(n=document.getElementById("pm-gal-thumbs").children[Y])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function on(e){Qe(Y+e)}function Xe(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",be=null,ne=null}function nn(e){const t=be,o=(t.unidades||[]).find(i=>i.dp===e);if(!o)return;ne=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(t.unidades||[]).filter(i=>i.disponible&&de(i.tipologia)),s=document.getElementById("pm-extras-wrap"),a=document.getElementById("pm-extras-list");n.length?(s.style.display="",a.innerHTML=n.map(i=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${i.precio_uf}" data-dp="${r(i.dp)}" data-label="${r(i.tipologia)} DP ${r(i.dp)}">
        <span class="extra-label">${r(i.tipologia)} — DP ${r(i.dp)}</span>
        <span class="extra-price">${m.uf(i.precio_uf)}</span>
      </label>`).join("")):(s.style.display="none",a.innerHTML=""),At(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function At(){if(!ne)return;let e=ne.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(t=>{e+=parseFloat(t.value)||0}),document.getElementById("pm-total-val").textContent=m.uf(e)}function sn(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),ne=null}function an(){if(!ne||!be)return;const e=be,t=ne,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const s=(e.unidades||[]).find(a=>a.dp===n.dataset.dp);s&&o.push(s)}),Xe(),Lt({project:e,depto:t,secundarios:o})}function cn(e){e.classList.toggle("active"),je()}let Ie=null;function ln(){const e=parseFloat(document.getElementById("p-renta").value)||0,t=parseFloat(document.getElementById("p-ahorro").value)||0,o=parseFloat(document.getElementById("p-deudas").value)||0,n=parseFloat(document.getElementById("p-plazo").value)||25,s=parseFloat(document.getElementById("p-tasa").value)||5,a=document.getElementById("p-results");if(document.getElementById("p-btns").style.display="none",!e){a.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente</p></div>';return}const i=s/100/12,c=n*12,d=e*.25-o;if(d<=0){a.innerHTML='<div class="warn-card">⚠️ Las deudas mensuales superan la capacidad de pago del 25% de la renta.</div>';return}const f=(Math.pow(1+i,c)-1)/(i*Math.pow(1+i,c)),p=d*f/y.UF,h=t/y.UF,u=Math.min(p/.8,p+h),F=u*.2,b=Math.max(0,F-h);Ie=u;const v=[15,20,25,30];a.innerHTML=`<div class="perfil-card">
    <div class="rc-hero">
      <div class="rc-big">${m.uf(u)}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${m.pesos(u*y.UF)}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${m.pesos(d)}</span><span class="rcl">Dividendo máximo / mes</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(p)}</span><span class="rcl">Crédito hipotecario máx.</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(F)}</span><span class="rcl">Pie requerido (20%)</span></div>
      <div class="rc-cell ${b>0?"warn":"ok"}">
        <span class="rcv">${b>0?"⚠️ Faltan "+m.uf(b):"✅ Ahorro suficiente"}</span>
        <span class="rcl">${m.uf(h)} disponible</span>
      </div>
    </div>
    <div class="rc-tbl-title">Simulación por plazo · Tasa ${s}% anual</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Crédito máx.</th><th>Precio máx.</th></tr></thead>
      <tbody>${v.map($=>{const C=$*12,T=(Math.pow(1+i,C)-1)/(i*Math.pow(1+i,C)),l=d*T/y.UF,P=Math.min(l/.8,l+h);return`<tr class="${$==n?"tr-hl":""}"><td>${$} años</td><td>${m.pesos(d)}</td><td>${m.uf(l)}</td><td><strong>${m.uf(P)}</strong></td></tr>`}).join("")}</tbody>
    </table>
  </div>`,document.getElementById("p-btns").style.display="flex"}function rn(e){Ie&&(e==="sec"?(window._secMaxUF=Ie,window.secFilter(),window.openModule("sec"),qe("sec")):(window._priMaxUF=Ie,window.priFilter(),window.openModule("pri"),qe("pri")))}function qe(e){var n;(n=document.getElementById("bb-"+e))==null||n.remove();const t=document.createElement("div");t.id="bb-"+e,t.className="filter-strip",t.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",t.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Filtrando por presupuesto: <strong>${m.uf(Ie)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${e}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+e);o.insertBefore(t,o.querySelector(".filter-strip"))}function dn(e){var t;e==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(t=document.getElementById("bb-"+e))==null||t.remove()}const pn={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:kt,mcFilter:ut,mcOpen:Kt,mcClose:Wt,mcSelect:Zt,mcRemove:Qt,secFilter:Te,secPage:ho,setSecView:yo,openDetail:xt,openSecDetail:bo,showDpPhoto:Ke,navDp:Ge,closeDetail:We,shareProperty:Fo,downloadPhotos:Eo,printFicha:Po,openVideo:xo,copyVideoLink:wo,closeVideo:wt,toggleSecPill:e=>{e.classList.toggle("active"),Te()},togglePriPill:e=>{e.classList.toggle("active"),je()},toggleTipPill:e=>{e.classList.toggle("active"),Te()},toggleDormPill:cn,priFilter:je,priPage:Xo,setPriView:Yo,openProject:tn,closeProjModal:Xe,pmTab:Dt,renderCC:_t,pmShowGalPhoto:Qe,pmGalNav:on,selectProjUnit:nn,pmUpdateTotal:At,pmBack:sn,pmCotizar:an,calcPerfil:ln,searchFromPerfil:rn,showBudgetBanner:qe,clearBudget:dn,cotizFromProp:Lt,syncPie:Wo,calcCotiz:Ze,recalcCotizPanel:Mt,volverDesdeCotiz:Do,submitClientForm:zo,formatRutInput:jo,clearCCFError:ko});function kt(e){document.querySelectorAll(".module").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(n=>n.classList.remove("active")),document.getElementById("mod-"+e).classList.add("active"),document.querySelector(`.snav-btn[data-m="${e}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=pn[e]||e;const t=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");t&&(t.style.display=e==="sec"?"":"none"),o&&(o.style.display=e==="pri"?"":"none")}document.addEventListener("keydown",e=>{if(document.getElementById("detail-modal").classList.contains("open")){e.key==="Escape"&&We(),e.key==="ArrowLeft"&&Ge(-1),e.key==="ArrowRight"&&Ge(1);return}e.key==="Escape"&&wt()});document.getElementById("detail-modal").addEventListener("click",e=>{e.target===e.currentTarget&&We()});document.getElementById("proj-modal").addEventListener("click",e=>{e.target===e.currentTarget&&Xe()});async function un(){try{const[e,t,o,n,s,a]=await Promise.all([ge.uf(),ge.stock(),ge.projects(),ge.cc(),ge.geocodes(),ge.priGeo()]);y.UF=e.valor??y.UF,y.STOCK=t??[],y.PROJECTS=o??[],y.CC_DATA=n??{};const i=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(i&&(i.textContent=y.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&e.fecha){const d=new Date(e.fecha);c.textContent=d.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}s&&Object.assign(y._GC,s),a&&Object.assign(y._GC,a);try{const d=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign(y._GC,d)}catch{}}catch(e){console.error("Bootstrap data load failed:",e)}fo(),Qo(),kt("sec")}un();
