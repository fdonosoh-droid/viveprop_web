(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const $={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},wt=24,ce="/api";async function mt(t){const e=await fetch(ce+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const gt={stock:()=>mt("/stock"),projects:()=>mt("/projects"),cc:()=>mt("/cc"),uf:()=>mt("/uf"),geocodes:()=>mt("/geocodes"),priGeo:()=>mt("/pri-geocodes"),reloadData:()=>fetch(ce+"/data/reload",{method:"POST"}).then(t=>t.json())},Lt={sec:new Set,pri:new Set};let le=[],re=[];function de(t,e){t==="sec"?le=e:re=e}function pe(t){return Lt[t]}function ue(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?le:re,n=Lt[t],s=document.getElementById(t+"-mc-dropdown"),i=o.filter(a=>(!e||a.toLowerCase().includes(e))&&!n.has(a));if(!i.length){s.style.display="none";return}s.innerHTML=i.slice(0,14).map(a=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${a.replace(/'/g,"\\'")}');return false">${a}</div>`).join(""),s.style.display="block"}function Ke(t){ue(t)}function We(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function Ze(t,e){Lt[t].add(e),me(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function Ye(t,e){Lt[t].delete(e),me(t),t==="sec"?window.secFilter():window.priFilter()}function me(t){document.getElementById(t+"-mc-tags").innerHTML=[...Lt[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function M(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const u={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function ge(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function Qe(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function Xe(t){var s,i;const e=(t||"").toLowerCase(),o=parseInt((s=e.match(/(\d+)d/))==null?void 0:s[1])||0,n=parseInt((i=e.match(/(\d+)b/))==null?void 0:i[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:n}}function dt(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function to(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const eo={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let vt=null,_t=null,ft=null,At=null,tt=null,It=null;function qt(t){const e=`${t.direccion}|${t.comuna}`;if($._GC[e]!==void 0)return $._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function oo(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function ve(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function no(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function io(){vt||(vt=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(vt),_t=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),vt.addLayer(_t))}function so(){return vt}function fe(t){if(!vt)return;_t.clearLayers();const e=[];t.forEach(o=>{const n=qt(o);n?be(o,n):n===void 0&&e.push(o)}),e.length&&co(e)}let he="lista";function ao(t){he=t}function be(t,e){const o=M(t.precioSinBono),n=M(t.m2total)||M(t.m2interior),s=eo[t.estado]||"#94A3B8",i=ge(t.estado),a=`<div class="map-popup">
    <div class="mp-photo" id="mpp-${r(t.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${s}22;color:${s}">${i}</span>
        ${t.bonoPct>0?`<span class="mp-bono">Bono Pie ${t.bonoPct}%</span>`:""}
      </div>
      <div class="mp-title">${r(t.condominio||t.direccion||"—")}</div>
      <div class="mp-addr">📍 ${r(t.direccion||"")}${t.comuna?" · "+r(t.comuna):""}</div>
      <div class="mp-specs">
        ${t.tipologia?`<span class="mp-spec">${r(t.tipologia)}</span>`:""}
        ${n?`<span class="mp-spec">${n.toFixed(0)} m²</span>`:""}
        ${t.orientacion&&t.orientacion!=="-"?`<span class="mp-spec">${r(t.orientacion)}</span>`:""}
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</span>
      </div>
      <button class="mp-btn" onclick="openSecDetail('${r(t.id)}')">Ver ficha →</button>
    </div>
  </div>`,c=L.marker(e,{icon:oo(s)});c.bindPopup(a,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(f=>f.json()).then(f=>{var m,C;const p=(m=f.data)==null?void 0:m[0],g=((C=p==null?void 0:p.fotos_originales)!=null&&C.length?p.fotos_originales:p==null?void 0:p.fotos)||[];if(g.length){const b=document.getElementById("mpp-"+t.id);if(b){const v=no(t.id,g[0]);b.style.backgroundImage=`url('${v}')`,b.textContent=""}}}).catch(()=>{})}),_t.addLayer(c)}async function co(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&he==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;n.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const d=encodeURIComponent(`${a.direccion}, ${a.comuna}, Santiago, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${d}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const g=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=g,$._GC[c]=g,be(a,g)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(f=>setTimeout(f,1200))}e.style.display="none"}function lo(){ft||(ft=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ft),At=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ft.addLayer(At))}function ro(){return ft}let ye="lista";function po(t){ye=t}function $e(t){if(!ft)return;At.clearLayers();const e=[];t.forEach(o=>{const n=qt({direccion:o.direccion,comuna:o.comuna});n?Ce(o,n):n===void 0&&e.push(o)}),e.length&&uo(e)}function Ce(t,e){const{isExtra:o}=window._mapUtils||{},n=(t.unidades||[]).filter(m=>m.disponible&&!/estac|bode|parking|reja|local\s/i.test(m.tipologia||"")),s=n.map(m=>m.precio_uf).filter(m=>m>0),i=s.length?Math.min(...s):0,a=s.length?Math.max(...s):0,c=[...new Set(n.map(m=>{const C=parseInt(m.dormitorios)||0;return C===0?"Estudio":C+"D"}))].sort().slice(0,3).join(", "),d=t.foto_portada||"",f=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),p=L.marker(e,{icon:f}),g=`<div class="map-popup">
    <div class="mp-photo" ${d?`style="background-image:url('${d}')"`:""}>${d?"":"🏗️"}</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:#FEE2E2;color:#B91C1C">Nuevo</span>
        ${t.entrega?`<span class="mp-badge" style="background:#F3F4F6;color:#374151">${r(t.entrega)}</span>`:""}
      </div>
      <div class="mp-title">${r(t.nombre)}</div>
      <div class="mp-inmob">${r(t.inmobiliaria||"")}</div>
      <div class="mp-addr">📍 ${r(t.direccion||"")}${t.comuna?" · "+r(t.comuna):""}</div>
      <div class="mp-specs">
        ${c?`<span class="mp-spec">${c}</span>`:""}
        <span class="mp-spec">${n.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${i?"UF "+i.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${a>i?`<span style="font-size:11px;color:var(--g400)">— ${a.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(t.id)}')">Ver proyecto →</button>
    </div>
  </div>`;p.bindPopup(g,{className:"lf-popup",maxWidth:270,closeButton:!1}),At.addLayer(p)}async function uo(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&ye==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;n.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const d=encodeURIComponent(`${a.direccion||a.nombre}, ${a.comuna||""}, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${d}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const g=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=g,$._GC[c]=g,Ce(a,g)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(f=>setTimeout(f,1200))}e.style.display="none"}function mo(t){if(!t)return;tt?tt.invalidateSize():(tt=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(tt)),It&&(tt.removeLayer(It),It=null);const e=qt({direccion:t.direccion,comuna:t.comuna});e?Fe(t,e):go(t),setTimeout(()=>{tt&&tt.invalidateSize()},200)}function Fe(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});It=L.marker(e,{icon:o}).addTo(tt),It.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),tt.setView(e,15)}async function go(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const s=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let i={};try{i=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}i[`${t.direccion}|${t.comuna}`]=s;try{localStorage.setItem("_geo_cache",JSON.stringify(i))}catch{}$._GC[`${t.direccion}|${t.comuna}`]=s,Fe(t,s)}}catch{}}let bt=[],Z=1,Pe="lista",Rt={},Et=null,G=[],Y=0,J=null,K=null,Nt="";function vo(){if(!$.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set($.STOCK.map(e=>e.comuna).filter(Boolean))].sort();de("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Tt()}function Tt(){var C,b,v,P,E,w;if(!$.STOCK.length)return;const t=(((C=document.getElementById("sec-search"))==null?void 0:C.value)||"").toLowerCase(),e=pe("sec"),o=parseFloat((b=document.getElementById("sec-precio-min"))==null?void 0:b.value)||0,n=parseFloat((v=document.getElementById("sec-precio-max"))==null?void 0:v.value)||0,s=((P=document.getElementById("sec-op"))==null?void 0:P.checked)||!1,i=((E=document.getElementById("sec-est"))==null?void 0:E.checked)||!1,a=((w=document.getElementById("sec-bod"))==null?void 0:w.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(l=>parseInt(l.dataset.val)),d=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(l=>parseInt(l.dataset.val)),f=[...document.querySelectorAll(".sec-estado-cb")],p=f.filter(l=>l.checked).map(l=>l.value),g=p.length===f.length,m=window._secMaxUF||null;bt=$.STOCK.filter(l=>{if(t&&!`${l.condominio||""} ${l.direccion||""} ${l.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(l.comuna)||s&&!l.oportunidad||i&&(!l.est||l.est==="0")||a&&(!l.bod||l.bod==="0")||!g&&!p.some(U=>to(l.estado,U)))return!1;const{dorm:y,banos:B}=Xe(l.tipologia);if(c.length&&!c.some(U=>U===4?y>=4:y===U)||d.length&&!d.some(U=>U===3?B>=3:B===U))return!1;const F=parseFloat((l.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&F<o||n&&F>n||m&&F>m)}),Z=1,Pe==="mapa"?fe(bt):Ee()}function Ee(){const t=document.getElementById("sec-grid"),e=bt.length,o=Math.max(1,Math.ceil(e/wt));Z>o&&(Z=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${Z} / ${o}`,document.getElementById("sec-prev").disabled=Z<=1,document.getElementById("sec-next").disabled=Z>=o;const n=$.STOCK.length,s=$.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,i=document.getElementById("tb-stats");i&&(i.textContent=`${s.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const a=bt.slice((Z-1)*wt,Z*wt);if(!a.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=a.map(c=>{const d=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),f=c.bonoPct>0,p=c.m2interior||c.m2total||"—",g=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",m=ge(c.estado),C=Qe(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${C}">${m}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(p)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(g)}</div><div class="pc-stat-l">Orient.</div></div>
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
    </div>`}).join(""),Et&&Et.disconnect(),Et=new IntersectionObserver(c=>{c.forEach(d=>{if(!d.isIntersecting)return;const f=d.target.id.replace("pcimg-","");fo(f),Et.unobserve(d.target)})},{rootMargin:"150px"}),a.forEach(c=>{const d=document.getElementById("pcimg-"+c.id);d&&Et.observe(d)})}async function fo(t){var o,n;const e=document.getElementById("pcimg-"+t);if(e){if(Rt[t]){ne(e,Rt[t]);return}try{const i=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],a=((n=i==null?void 0:i.fotos_originales)!=null&&n.length?i.fotos_originales:i==null?void 0:i.fotos)||[];if(a.length){Rt[t]=a[0];const c=document.getElementById("pcimg-"+t);c&&ne(c,a[0],a.length)}}catch{}}}function ne(t,e,o){const n=e.replace(/^https?:\/\//,""),s=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${s}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const i=t.querySelector(".pc-img-icon");if(i&&(i.style.display="none"),o>1){const a=t.id.match(/pcimg-(.+)/);if(a){const c=document.getElementById("pcfc-"+a[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function ho(t){const e=Math.max(1,Math.ceil(bt.length/wt));Z=Math.min(Math.max(1,Z+t),e),Ee(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function bo(t){Pe=t,ao(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(io(),setTimeout(()=>so().invalidateSize(),120),fe(bt))}async function xe(t){var n,s,i;if(J=$.STOCK.find(a=>a.id===t)||null,!J)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",G=[],Y=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=J;try{K=((s=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:s[0])||null}catch{K=null}const o=((i=K==null?void 0:K.fotos_originales)!=null&&i.length?K.fotos_originales:K==null?void 0:K.fotos)||[];if(o.length)G=o,document.getElementById("dp-spin").style.display="none",Jt(0),document.getElementById("dp-thumbs").innerHTML=o.map((a,c)=>{const d=a.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(d)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const a=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",a.appendChild(c)}$o(e,K)}function yo(t){xe(t)}function Jt(t){var n;Y=Math.max(0,Math.min(t,G.length-1));const e=document.getElementById("dp-img"),o=G[Y].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${Y+1} / ${G.length}`,document.getElementById("dp-prev").disabled=Y===0,document.getElementById("dp-next").disabled=Y===G.length-1,document.querySelectorAll(".dp-thumbs img").forEach((s,i)=>s.classList.toggle("active",i===Y)),(n=document.getElementById("dp-thumbs").children[Y])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Ht(t){Jt(Y+t)}function $o(t,e){var v;const o=M(t.precioSinBono),n=M(t.m2total)||M(e==null?void 0:e.superficie),s=M(t.m2interior)||M(e==null?void 0:e.m2_utiles),i=M(t.m2terraza)||M(e==null?void 0:e.m2_terraza),a=(e==null?void 0:e.dormitorios)??"",c=(e==null?void 0:e.banios)??"",d=(e==null?void 0:e.piso)??"",f=((v=e==null?void 0:e.unitggcc)==null?void 0:v.monto)||(e==null?void 0:e.ggcc)||"",p=(e==null?void 0:e.youtube_video_id)||"",g=(e==null?void 0:e.espacios)||"",m=(e==null?void 0:e.building_finishes)||[],C=(t.oportunidad||"").toLowerCase().includes("oportunidad"),b=g?g.split(",").map(P=>P.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
    <div class="detail-top">
      <div>
        <div class="detail-title">${r(t.condominio||t.direccion||"—")}</div>
        <div class="detail-addr">📍 ${r(t.direccion||"—")} · ${r(t.comuna||"")}${t.dp?" · DP "+r(t.dp):""}</div>
      </div>
      <div class="detail-badges">
        ${C?'<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>':""}
      </div>
    </div>
    <div class="dt-section">Características</div>
    <div class="specs-grid">
      <div class="spec-card"><div class="sv">${r(t.tipologia||"—")}</div><div class="sl">Tipología</div></div>
      ${n?`<div class="spec-card"><div class="sv">${n.toFixed(1)} m²</div><div class="sl">Sup. total</div></div>`:""}
      ${s&&s!==n?`<div class="spec-card"><div class="sv">${s.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>`:""}
      ${i?`<div class="spec-card"><div class="sv">${i.toFixed(1)} m²</div><div class="sl">Terraza</div></div>`:""}
      ${a!==""?`<div class="spec-card"><div class="sv">${a} 🛏</div><div class="sl">Dormitorios</div></div>`:""}
      ${c!==""?`<div class="spec-card"><div class="sv">${c} 🚿</div><div class="sl">Baños</div></div>`:""}
      ${d!==""?`<div class="spec-card"><div class="sv">Piso ${d}</div><div class="sl">Nivel</div></div>`:""}
      ${t.orientacion&&t.orientacion!=="-"?`<div class="spec-card"><div class="sv">${r(t.orientacion)}</div><div class="sl">Orientación</div></div>`:""}
      ${t.est&&t.est!=="0"?'<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>':""}
      ${t.bod&&t.bod!=="0"?'<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>':""}
      ${t.anio?`<div class="spec-card"><div class="sv">${r(t.anio)}</div><div class="sl">Año</div></div>`:""}
      ${f?`<div class="spec-card"><div class="sv">$${Number(f).toLocaleString("es-CL")}</div><div class="sl">Gastos comunes</div></div>`:""}
    </div>
    <div class="dt-section">Precio y condición comercial</div>
    <div class="price-block">
      <div class="dp-price-card">
        <div class="pc-label">Precio sin bono pie</div>
        <div class="pc-value">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
        ${o?`<div class="pc-sub">$${Math.round(o*$.UF).toLocaleString("es-CL")}</div>`:""}
      </div>
      ${t.bonoPct>0?`
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${t.bonoPct}%</div>
        ${M(t.bonoUF)?`<div class="bc-sub">${M(t.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${b.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${b.map(P=>`<span class="dt-amenity">${r(P)}</span>`).join("")}</div>`:""}
    ${m.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${m.map(P=>{var y;const E=String(P).split(":"),w=((y=E[0])==null?void 0:y.trim())||"",l=E.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(w)}</div><div class="dt-finish-v">${r(l)}</div></div>`}).join("")}</div>`:""}
    ${p?`
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${r(p)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>`:""}
    ${t.video&&!p?`
    <div class="dt-section">Video de la propiedad</div>
    <div style="margin:4px 0 12px">
      <button onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer">▶ Ver video</button>
    </div>`:""}
    ${Co(t)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizFromProp(${o||0},'${r(t.condominio||"")} DP${r(t.dp||"")}')">📊 Cotizar</button>
      ${t.video?`<button class="btn-fotos" onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(t.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${G.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${G.length})</button>`:""}
    </div>`}function Co(t){const e=t.condominio||t.direccion;if(!e||!$.STOCK.length)return"";const o=$.STOCK.filter(s=>s.id!==t.id&&(s.condominio||s.direccion)===e);if(!o.length)return"";const n=o.map(s=>{const i=M(s.precioSinBono),a=M(s.m2total)||M(s.m2interior),c=[];return s.dp&&c.push("DP "+s.dp),a&&c.push(a.toFixed(0)+" m²"),s.orientacion&&s.orientacion!=="-"&&c.push(s.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(s.id)}')">
      <div class="ur-tipo">${r(s.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${i?i.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function Kt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",G=[],Y=0,J=null,K=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function Fo(t){const e=J;if(!e)return;const o=M(e.precioSinBono),n=M(e.m2total)||M(e.m2interior),s=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),i=`https://wa.me/?text=${encodeURIComponent(s)}`,a=document.createElement("div");a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",a.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${s}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${i}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(a),a.addEventListener("click",c=>{c.target===a&&a.remove()})}async function Po(){if(!G.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),n.style.width="0%";const s=new JSZip,i=s.folder("fotos-propiedad"),a=G.length;async function c(g){try{const m=await fetch(ve(g));if(m.ok)return await m.blob()}catch{}try{const m=await fetch(g,{mode:"cors"});if(m.ok)return await m.blob()}catch{}return null}let d=0;for(let g=0;g<a;g++){o.textContent=`Descargando foto ${g+1} de ${a}…`,n.style.width=`${Math.round(g/a*90)}%`;const m=await c(G[g]);if(m){const C=m.type.includes("png")?"png":"jpg";i.file(`foto-${String(g+1).padStart(2,"0")}.${C}`,m),d++}}o.textContent="Generando ZIP…",n.style.width="95%";const f=await s.generateAsync({type:"blob"});if(n.style.width="100%",d===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`;return}const p=document.createElement("a");p.href=URL.createObjectURL(f),p.download=`fotos-${((J==null?void 0:J.condominio)||(J==null?void 0:J.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,p.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`},800)}async function Eo(){var Pt;if(!J)return;const t=J,e=K,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const s=M(t.precioSinBono),i=M(t.m2total)||M(e==null?void 0:e.superficie),a=M(t.m2interior)||M(e==null?void 0:e.m2_utiles),c=M(t.m2terraza)||M(e==null?void 0:e.m2_terraza),d=(e==null?void 0:e.dormitorios)??"",f=(e==null?void 0:e.banios)??"",p=(e==null?void 0:e.piso)??"",g=((Pt=e==null?void 0:e.unitggcc)==null?void 0:Pt.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(D=>D.trim()).filter(Boolean),e!=null&&e.building_finishes;const m=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),C=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function b(D){for(const A of[ve(D),D])try{const j=await fetch(A);if(!j.ok)continue;const R=await j.blob();return await new Promise(k=>{const O=new FileReader;O.onload=X=>k(X.target.result),O.readAsDataURL(R)})}catch{}return null}o.textContent="⏳ Cargando logo…";const v=await b("images/logo.png");o.textContent="⏳ Cargando fotos…";const E=(await Promise.all(G.slice(0,5).map(b))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:w}=window.jspdf,l=new w({unit:"mm",format:"a4",orientation:"portrait"}),y=210,B=297,F=10,U=190,x=[67,56,202],h=[107,114,128],S=[249,250,251],I=[255,255,255],q=[17,24,39],W=[5,150,105],Bt=[209,250,229],ot=D=>l.setFillColor(D[0],D[1],D[2]),z=D=>l.setTextColor(D[0],D[1],D[2]),pt=(D,A,j,R,k,O)=>{ot(O),l.roundedRect(D,A,j,R,k,k,"F")},St=(D,A)=>(ot([229,231,235]),l.rect(F,A,U,.3,"F"),l.setFontSize(7.5),l.setFont("helvetica","bold"),z(h),l.text(D.toUpperCase(),F,A+4.5),A+8);let T=0;ot(x),l.rect(0,0,y,22,"F"),v?(pt(F-1,3,44,15,2.5,I),l.addImage(v,"PNG",F+1,5,40,7.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(16),z(I),l.text("ViveProp",F,14)),l.setFont("helvetica","normal"),l.setFontSize(8.5),z([200,200,230]),l.text("Ficha de Propiedad",y-F,10,{align:"right"}),l.text(C,y-F,16,{align:"right"}),T=22,ot([238,242,255]),l.rect(0,T,y,32,"F"),l.setFont("helvetica","bold"),l.setFontSize(15),z(q);const it=t.condominio||t.direccion||"—";l.text(it.length>38?it.slice(0,36)+"…":it,F,T+11),l.setFont("helvetica","normal"),l.setFontSize(9),z(h);const Ct=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(l.text(Ct.length>55?Ct.slice(0,53)+"…":Ct,F,T+18),l.setFont("helvetica","bold"),l.setFontSize(20),z(x),l.text(s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",y-F,T+13,{align:"right"}),l.setFontSize(8),z(h),l.setFont("helvetica","normal"),l.text("Precio sin bono pie",y-F,T+8,{align:"right"}),t.bonoPct>0&&(pt(y-F-42,T+18,42,9,2,Bt),l.setFont("helvetica","bold"),l.setFontSize(8),z(W),l.text(`Acepta Bono Pie ${t.bonoPct}%`,y-F-21,T+23.5,{align:"center"})),T+=34,E.length){const R=E.length>1?118:U,k=U-R-2;try{l.addImage(E[0],"JPEG",F,T,R,52,void 0,"FAST")}catch{}if(E[1])try{l.addImage(E[1],"JPEG",F+R+2,T,k,25,void 0,"FAST")}catch{}if(E[2])try{l.addImage(E[2],"JPEG",F+R+2,T+25+2,k,25,void 0,"FAST")}catch{}if(T+=54,E[3]||E[4]){const O=E[4]?(U-2)/2:U;if(E[3])try{l.addImage(E[3],"JPEG",F,T,O,32,void 0,"FAST")}catch{}if(E[4])try{l.addImage(E[4],"JPEG",F+O+2,T,O,32,void 0,"FAST")}catch{}T+=34}}T+=4,T=St("Características",T);const ut=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,i?{v:i.toFixed(0)+" m²",l:"Superficie"}:null,a?{v:a.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,d!==""?{v:d+" dorm.",l:"Dormitorios"}:null,f!==""?{v:f+" baños",l:"Baños"}:null,p!==""?{v:"Piso "+p,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,g?{v:"$"+Number(g).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),st=4,at=(U-(st-1)*3)/st,Ft=14;ut.forEach((D,A)=>{const j=A%st,R=Math.floor(A/st),k=F+j*(at+3),O=T+R*(Ft+3);pt(k,O,at,Ft,2,S),l.setFont("helvetica","bold"),l.setFontSize(9),z(q),l.text(String(D.v).slice(0,18),k+at/2,O+6.5,{align:"center"}),l.setFont("helvetica","normal"),l.setFontSize(7),z(h),l.text(D.l,k+at/2,O+11,{align:"center"})}),T+=Math.ceil(ut.length/st)*(Ft+3)+4,ot(x),l.rect(0,B-16,y,16,"F"),v?(pt(F-1,B-14,33,11,2,I),l.addImage(v,"PNG",F+1,B-12.5,29,5.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(11),z(I),l.text("ViveProp",F,B-7)),l.setFont("helvetica","normal"),l.setFontSize(8),z([200,200,230]),l.text("www.viveprop.cl · Stock de propiedades en gestión",y-F,B-7,{align:"right"}),l.save(`ficha-${m}.pdf`),o.textContent=n,o.disabled=!1}function xo(t){Nt=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function wo(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Nt).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Nt)})}function we(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function V(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Ot(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function Io(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function xt(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function Lo(t){const e={};for(const[o,n]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(n??"").trim());return e}function Bo(t,e){const o=Lo(t),n=(e||"").toUpperCase(),s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(n.includes("INGEVEC")){const i=xt(o["Cuotas pie"]);return{...s,descuentoDepto:V(o["Dcto. depto."]),aporteInmobiliario:V(o["Aporte inmobiliario"]),reservaCLP:Ot(o.Reserva),cuotasPieN:Math.max(i-1,0),pieConstPct:V(o["Pie período const."]),creditoDirectoPct:V(o["Pie crédito s/int."]),cuotonPct:V(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("MAESTRA")){const i=V(o.Upfront),a=V(o["Pie en cuotas"]);return{...s,descuentoDepto:V(o["Descuento Base"])+V(o["Dcto Adicional"]),aporteInmobiliario:V(o["Certificado Pago"]),upfrontPct:i,piePctDefault:i+a||null,cuotasPieN:xt(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("RVC")){const i=V(o["Pie mínimo"]);return{...s,descuentoDepto:V(o["Descuento RVC"]),piePctDefault:i||null,cuotasPieN:xt(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const i=o["Monto Reserva"]||"",a=/uf/i.test(i),c=V(o["Pie minimo %"]);return{...s,descuentoDepto:V(o["Descuento autorizado"]),reservaCLP:a?0:Ot(i),reservaUF:a?Io(i):0,piePctDefault:c||null,cuotasPieN:xt(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("URMENETA")){const i=(t==null?void 0:t.nota)||"",a=i.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||i.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||i.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=a?parseFloat(a[1].replace(",","."))/100:0;return{...s,descuentoDepto:V(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Ot(o["Valor reserva"]),pieConstPct:V(o["% cuotas const."]),cuotasPieN:xt(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:i}}return s}const Ut={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},ie={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},So=[.04,.045,.05],Ie=30,Le=.12;function Mo(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function Uo(t){const e=(t||"").toUpperCase();return ie[e]||ie.DEFAULT}function To(t){const{precioListaDepto:e,descuentoPct:o,bonoPiePct:n,reservaCLP:s,preciosConjuntos:i,piePct:a,upfrontPct:c,plazoAnios:d,tasasCAE:f,valorUF:p,cuotonPct:g,piePeriodoConstruccionPct:m,pieCreditoDirectoPct:C,cuotasPieN:b,arriendosMensualesCLP:v,plusvaliaAnual:P,tipoCalculoBono:E}=t,w=t.pieConjuntosPct??.2,l=(i||[]).reduce((ct,kt)=>ct+kt,0),y=e+l,B=Math.min(o+0,1),F=e*(1-B),U=l,x=F+U,h=x*p,S=E==="maestra"?a:w,I=Math.round(F*a*100)/100,q=Math.round(l*S*100)/100,W=I+q,Bt=s/p,ot=Math.round(x*(c||0)*100)/100,z=W-Bt-ot,pt=z*p,St=b>0?z/b:z,T=St*p,it=Math.round(x*(g||0)*100)/100,Ct=Math.round(it*p),ut=Math.round(x*(m||0)*100)/100,st=Math.round(ut*p),at=Math.round(x*(C||0)*100)/100,Ft=Math.round(at*p),Pt=W+it+ut,D=x*(1-a);let A,j,R,k,O,X;if(E==="maestra"){const ct=1-a-n;j=n>0?Math.round(D/ct*100)/100:x,A=Math.round(j*n*100)/100,R=Math.round(j*ct*100)/100,X=W,k=Math.round((j-X-R)*100)/100,O=j>0?k/j:0}else E==="precio-lista-total"?(A=Math.round(y*n*100)/100,j=n>0?Math.round((x+A)*100)/100:x,k=A,O=n,X=W,R=Math.round((x-X-k)*100)/100):(A=Math.round(e*n*100)/100,j=n>0?Math.round((x+A)*100)/100:x,k=A,O=n,X=W,R=Math.round((x-X-k)*100)/100);const Xt=R*p,ke=j*p,te=Math.pow(1+(P||Ut.PLUSVALIA_DEFAULT),5)-1,ze=h*(1+te)*Ut.HAIRCUT_VENTA,Re=Pt*p,Oe=f.map((ct,kt)=>{const Mt=(v||[0,0,0])[kt]||0,Ve=d*12,zt=Mo(ct/12,Ve,Xt),Ne=zt/p,ee=Mt-zt,He=ee*Ut.MESES_ARRIENDO_ANIO*5,Ge=j>0?Mt*Ut.MESES_ARRIENDO_ANIO/p/j:0,qe=Mt*.9,oe=h>0?Math.round(qe*12/h*1e4)/1e4:0,Je=Math.round(oe*5*1e4)/1e4;return{cae:ct,arriendoMensualCLP:Mt,cuotaMensualCLP:Math.round(zt),cuotaMensualUF:Math.round(Ne*100)/100,flujoMensualCLP:Math.round(ee),flujoAcumuladoCLP:Math.round(He),capRate:Math.round(Ge*1e4)/1e4,roi5Anios:Je,roiAnual:oe}});return{valorUF:p,precioListaDepto:e,precioListaOtros:l,precioListaTotal:y,precioDescDepto:Math.round(F*100)/100,precioDescOtros:U,valorVentaUF:Math.round(x*100)/100,valorVentaCLP:Math.round(h),piePct:a,upfrontPct:c||0,pieTotalDeptoUF:Math.round(I*100)/100,pieTotalConjuntosUF:Math.round(q*100)/100,pieTotalUF:Math.round(W*100)/100,reservaUF:Math.round(Bt*100)/100,upfrontUF:ot,saldoPieUF:Math.round(z*100)/100,saldoPieCLP:Math.round(pt),cuotasPieN:b,valorCuotaPieUF:Math.round(St*100)/100,valorCuotaPieCLP:Math.round(T),cuotonUF:it,cuotonCLP:Ct,piePeriodoConstruccionUF:ut,piePeriodoConstruccionCLP:st,pieCreditoDirectoUF:at,pieCreditoDirectoCLP:Ft,totalPieInmobUF:Math.round(Pt*100)/100,descuentoAdicionalPct:0,bonoPieUF:A,saldoAporteInmobUF:Math.round(k*100)/100,aportePct:Math.round(O*1e4)/1e4,pieCreditoHipUF:Math.round(X*100)/100,tasacionUF:Math.round(j*100)/100,tasacionCLP:Math.round(ke),creditoHipBaseUF:Math.round(D*100)/100,creditoHipFinalUF:Math.round(R*100)/100,creditoHipFinalCLP:Math.round(Xt),plusvaliaAcumulada:Math.round(te*1e4)/1e4,precioVentaAnio5CLP:Math.round(ze),piePagadoCLP:Math.round(Re),escenarios:Oe}}let _=null;function Be(t){try{const{project:e,depto:o,secundarios:n=[]}=t;console.log("[Cotizador] cotizFromProp",{project:e,depto:o,secundarios:n});const s=$.CC_DATA[e.id]||null,i=Bo(s,e.inmobiliaria),a=Uo(e.inmobiliaria),c=i.reservaUF>0?Math.round(i.reservaUF*$.UF):i.reservaCLP;_={project:e,depto:o,secundarios:n,parsedCC:i,regla:a,reservaCLP:c,cliente:null},_o(),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(e){console.error("[Cotizador] Error en cotizFromProp:",e),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}

${r(e.stack||"")}</div>`}}function Se(){if(_)try{const t=Oo(),e=Vo(t),o=To(e);console.log("[Cotizador] Input:",e),console.log("[Cotizador] Resultado:",o),No(o,t)}catch(t){console.error("[Cotizador] Error en recalcCotizPanel:",t),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(t))}

${r(t.stack||"")}</div>`}}function Do(){var e,o;const t=_?{pid:(e=_.project)==null?void 0:e.id,dp:(o=_.depto)==null?void 0:o.dp,extraDps:(_.secundarios??[]).map(n=>n.dp)}:null;_=null,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.openModule("pri"),t!=null&&t.pid&&window.reopenWithUnit(t.pid,t.dp,t.extraDps)}function lt(t){return+((t??0)*100).toFixed(2)}function _o(){const{project:t,depto:e,secundarios:o}=_,n=[`${t.nombre} · DP ${e.dp}${e.tipologia?" "+e.tipologia:""}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp}`)];document.getElementById("ccf-header-title").textContent=n.join(" + ");const s=e.precio_uf+o.reduce((c,d)=>c+d.precio_uf,0),i=[`DP ${e.dp}${e.tipologia?" — "+e.tipologia:""} · ${u.uf2(e.precio_uf)}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp} · ${u.uf2(c.precio_uf)}`)];document.getElementById("ccf-prop-summary").innerHTML=`<div class="ccf-prop-lines">${i.map(c=>`<div class="ccf-prop-line">${r(c)}</div>`).join("")}</div><div class="ccf-prop-total">Total precio lista: <strong>${u.uf2(s)}</strong></div>`,["ccf-nombre","ccf-rut","ccf-email","ccf-tel"].forEach(c=>{const d=document.getElementById(c);d&&(d.value="",d.classList.remove("cp-input--err"))});const a=document.getElementById("ccf-objetivo");a&&(a.value="",a.classList.remove("cp-input--err")),document.querySelectorAll(".ccf-err").forEach(c=>{c.textContent=""});try{const c=JSON.parse(localStorage.getItem("_corredor")||"{}");c.nombre&&(document.getElementById("ccf-cor-nombre").value=c.nombre),c.email&&(document.getElementById("ccf-cor-email").value=c.email),c.tel&&(document.getElementById("ccf-cor-tel").value=c.tel)}catch{}}function Ao(t){const e=t.replace(/[.\s]/g,"").toUpperCase();if(!/^\d{7,8}-?[0-9K]$/.test(e))return!1;const o=e.replace("-",""),n=o.slice(0,-1),s=o.slice(-1);let i=0,a=2;for(let f=n.length-1;f>=0;f--)i+=parseInt(n[f])*a,a=a===7?2:a+1;const c=11-i%11,d=c===11?"0":c===10?"K":String(c);return s===d}function se(t){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim())}function ae(t){const e=t.replace(/[\s\-\(\)\.]/g,"");return/^(\+?56)?9\d{8}$/.test(e)||/^\+?56[2-9]\d{7}$/.test(e)}function H(t,e){const o=document.getElementById(t),n=document.getElementById(t+"-err");o&&o.classList.toggle("cp-input--err",!!e),n&&(n.textContent=e||"")}function jo(t){H(t,"")}function ko(t){const e=document.getElementById(t);if(!e)return;const o=e.value.replace(/[^\dkK]/g,"").toUpperCase();if(o.length>1){const n=o.slice(0,-1),s=o.slice(-1);e.value=n.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+s}H(t,"")}function zo(){if(!_)return;let t=!0;const e=p=>{var g;return(((g=document.getElementById(p))==null?void 0:g.value)||"").trim()},o=e("ccf-nombre");o.length<2&&(H("ccf-nombre","Ingresa el nombre completo"),t=!1);const n=e("ccf-rut");n?Ao(n)||(H("ccf-rut","RUT inválido — verifica el dígito verificador"),t=!1):(H("ccf-rut","Ingresa el RUT"),t=!1);const s=e("ccf-email");s?se(s)||(H("ccf-email","Formato de email inválido"),t=!1):(H("ccf-email","Ingresa el email"),t=!1);const i=e("ccf-tel");i?ae(i)||(H("ccf-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-tel","Ingresa el teléfono"),t=!1);const a=e("ccf-objetivo");a||(H("ccf-objetivo","Selecciona un objetivo"),t=!1);const c=e("ccf-cor-nombre");c.length<2&&(H("ccf-cor-nombre","Ingresa el nombre del corredor"),t=!1);const d=e("ccf-cor-email");d?se(d)||(H("ccf-cor-email","Formato de email inválido"),t=!1):(H("ccf-cor-email","Ingresa el email del corredor"),t=!1);const f=e("ccf-cor-tel");if(f?ae(f)||(H("ccf-cor-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-cor-tel","Ingresa el teléfono del corredor"),t=!1),!!t){try{localStorage.setItem("_corredor",JSON.stringify({nombre:c,email:d,tel:f}))}catch{}_.cliente={nombre:o,rut:n,email:s,tel:i,objetivo:a,corNombre:c,corEmail:d,corTel:f},_.cotizId=Ko(),Ro(_.parsedCC),document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",Se()}}function Ro(t){const e=Math.round((t.piePctDefault??Le)*100),o=lt((t.descuentoDepto??0)+(t.descuentoAdicional??0)),n=lt(t.aporteInmobiliario),s=t.cuotasPieN??0,i=lt(t.pieConstPct),a=lt(t.cuotonPct),c=lt(t.upfrontPct),d=lt(t.creditoDirectoPct),[f,p,g]=So.map(v=>lt(v)),m=`Cuotas pie${s>0?` <span class="cp-fg-base">base ${s}</span>`:""}`,C=`Cuotón %${a===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,b=(v,P,E,w,l,y)=>`<div class="cp-fg"><label class="cp-fg-lbl">${v}</label><input id="${P}" class="cp-input" type="number" min="${w}" max="${l}" step="${y}" value="${E}" onchange="recalcCotizPanel()"></div>`;document.getElementById("cp-params-grid").innerHTML=`
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${b("Pie %","cpg-pie",e,0,100,1)}
        ${b("Plazo (años)","cpg-plazo",Ie,5,30,1)}
        ${b("Dcto. depto %","cpg-dcto",o,0,100,.1)}
        ${b("Aporte inmob %","cpg-aporte",n,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${b(m,"cpg-cuotas",s,0,48,1)}
        ${b("Pie const %","cpg-piecst",i,0,100,.1)}
        ${b(C,"cpg-cuoton",a,0,100,.1)}
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
        ${b("CAE escenario 3","cpg-cae3",g,0,20,.1)}
      </div>
    </div>`}function Oo(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:t("cpg-pie")||Le*100,plazo:t("cpg-plazo")||Ie,dcto:t("cpg-dcto"),aporte:t("cpg-aporte"),cuotas:t("cpg-cuotas"),piecst:t("cpg-piecst"),cuoton:t("cpg-cuoton"),upfront:t("cpg-upfront"),cdir:t("cpg-cdir"),plusvalia:t("cpg-plusvalia")||2,cae1:t("cpg-cae1")||4,cae2:t("cpg-cae2")||4.5,cae3:t("cpg-cae3")||5}}function Vo(t){const{reservaCLP:e,regla:o,depto:n,secundarios:s}=_;return{precioListaDepto:n.precio_uf,descuentoPct:t.dcto/100,descuentoAdicionalPct:0,bonoPiePct:t.aporte/100,reservaCLP:e,preciosConjuntos:s.map(i=>i.precio_uf),piePct:t.pie/100,upfrontPct:t.upfront/100,cuotasPieN:t.cuotas,cuotonPct:t.cuoton/100,piePeriodoConstruccionPct:t.piecst/100,pieCreditoDirectoPct:t.cdir/100,plazoAnios:t.plazo,tasasCAE:[t.cae1/100,t.cae2/100,t.cae3/100],valorUF:$.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:t.plusvalia/100}}function N(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function No(t,e){const{project:o,depto:n,secundarios:s}=_,i=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...s.map(a=>`${a.tipologia?a.tipologia+" ":""}DP ${a.dp}`)];document.getElementById("cp-header-title").textContent=i.join(" + "),document.getElementById("cp-results").innerHTML=Ho(t,n,s)+Go(t)+(t.pieCreditoDirectoUF>0?qo(t):"")+Jo(t,e.plazo),Wo(t,e)}function Ho(t,e,o){const n=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,s=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(e.dp))}${e.tipologia?" &mdash; "+r(e.tipologia):""}</td>
      <td>${u.uf2(t.precioListaDepto)}</td>
      <td>${n>1e-4?`<span class="cp-val-dcto">&minus;${N(n)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${u.uf2(t.precioDescDepto)}</td>
    </tr>`,i=o.map(a=>`
    <tr>
      <td class="cp-val-unit">${a.tipologia?r(a.tipologia)+" ":""}DP ${r(String(a.dp))}</td>
      <td>${u.uf2(a.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${u.uf2(a.precio_uf)}</td>
    </tr>`).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Valores</div>
    <div class="cp-section-body">
      <table class="cp-val-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Dcto.</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${s}${i}
          <tr class="cp-val-total">
            <td>Total</td>
            <td>${u.uf2(t.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${u.uf2(t.valorVentaUF)}<br>
              <small class="cp-val-clp">${u.pesos(t.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function Go(t){let e="";if(e+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${N(t.piePct)}</span></span>
      <span class="cp-plan-val">${u.uf2(t.pieTotalUF)}<small>${u.pesos(t.pieTotalUF*t.valorUF)}</small></span>
    </div>`,e+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${u.uf2(t.reservaUF)}<small>${u.pesos(t.reservaUF*t.valorUF)}</small></span>
    </div>`,t.upfrontUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${N(t.upfrontPct)}</span></span>
        <span class="cp-plan-val">${u.uf2(t.upfrontUF)}<small>${u.pesos(t.upfrontUF*t.valorUF)}</small></span>
      </div>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${t.cuotasPieN} cuotas &times; ${u.uf2(t.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${u.uf2(t.saldoPieUF)}<small>${u.pesos(t.saldoPieCLP)}</small></span>
      </div>`),t.piePeriodoConstruccionUF>0){const n=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${N(n)}</span></span>
        <span class="cp-plan-val">${u.uf2(t.piePeriodoConstruccionUF)}<small>${u.pesos(t.piePeriodoConstruccionCLP)}</small></span>
      </div>`}t.cuotonUF>0&&(e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${u.uf2(t.cuotonUF)}<small>${u.pesos(t.cuotonCLP)}</small></span>
      </div>`);const o=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;return e+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${N(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${u.uf2(t.totalPieInmobUF)}<small>${u.pesos(t.totalPieInmobUF*t.valorUF)}</small></span>
    </div>`,t.bonoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${N(t.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${u.uf2(t.bonoPieUF)}<small>${u.pesos(t.bonoPieUF*t.valorUF)}</small></span>
      </div>`),`
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${e}</div>
    </div>
  </div>`}function qo(t){const e=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${N(e)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${u.uf2(t.pieCreditoDirectoUF)}<small>${u.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function Jo(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,n=t.escenarios.map((s,i)=>{const a=s.cuotaMensualCLP/.25;return`
      <tr${i===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(s.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${u.pesos(s.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${u.uf2(s.cuotaMensualUF)}</td>
        <td>${u.pesos(a)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${e} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${u.uf2(t.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${u.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${N(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${u.uf2(t.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${u.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${n}</tbody>
      </table>
    </div>
  </div>`}function Ko(){const t=new Date().getFullYear(),e=`_cotiz_counter_${t}`,o=parseInt(localStorage.getItem(e)||"0")+1;try{localStorage.setItem(e,String(o))}catch{}return`COT-${t}-${String(o).padStart(4,"0")}`}function Wo(t,e){const o=document.getElementById("cotiz-print-doc");if(!o||!(_!=null&&_.cliente))return;const{project:n,depto:s,secundarios:i,cliente:a,cotizId:c}=_,f=new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"}),p={vivienda:"Vivienda propia",inversion:"Inversión / arriendo",segunda:"Segunda vivienda",subsidio:"Subsidio habitacional"},g=[`${s.tipologia?s.tipologia+" ":""}DP ${s.dp} · ${u.uf2(s.precio_uf)}`,...i.map(y=>`${y.tipologia?y.tipologia+" ":""}DP ${y.dp} · ${u.uf2(y.precio_uf)}`)].map(y=>`<div class="prd-unit-line">${r(y)}</div>`).join(""),m=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,C=`<tr>
    <td>${r(String(s.dp))}${s.tipologia?" — "+r(s.tipologia):""}</td>
    <td>${u.uf2(t.precioListaDepto)}</td>
    <td>${m>1e-4?"−"+N(m):"—"}</td>
    <td>${u.uf2(t.precioDescDepto)}</td>
  </tr>`,b=i.map(y=>`<tr>
    <td>${y.tipologia?r(y.tipologia)+" ":""}DP ${r(String(y.dp))}</td>
    <td>${u.uf2(y.precio_uf)}</td><td>—</td>
    <td>${u.uf2(y.precio_uf)}</td>
  </tr>`).join("");let v="";if(v+=`<tr><td><strong>Pie total</strong> ${N(t.piePct)}</td><td>${u.uf2(t.pieTotalUF)}</td><td>${u.pesos(t.pieTotalUF*t.valorUF)}</td></tr>`,v+=`<tr class="prd-tbl-sub"><td>Reserva</td><td>${u.uf2(t.reservaUF)}</td><td>${u.pesos(t.reservaUF*t.valorUF)}</td></tr>`,t.upfrontUF>0&&(v+=`<tr class="prd-tbl-sub"><td>Upfront ${N(t.upfrontPct)}</td><td>${u.uf2(t.upfrontUF)}</td><td>${u.pesos(t.upfrontUF*t.valorUF)}</td></tr>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(v+=`<tr class="prd-tbl-sub"><td>Saldo pie — ${t.cuotasPieN} cuotas × ${u.uf2(t.valorCuotaPieUF)}/mes</td><td>${u.uf2(t.saldoPieUF)}</td><td>${u.pesos(t.saldoPieCLP)}</td></tr>`),t.piePeriodoConstruccionUF>0){const y=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;v+=`<tr><td>Pie período construcción ${N(y)}</td><td>${u.uf2(t.piePeriodoConstruccionUF)}</td><td>${u.pesos(t.piePeriodoConstruccionCLP)}</td></tr>`}t.cuotonUF>0&&(v+=`<tr><td>Cuotón</td><td>${u.uf2(t.cuotonUF)}</td><td>${u.pesos(t.cuotonCLP)}</td></tr>`);const P=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;v+=`<tr class="prd-tbl-total"><td><strong>Total pie a inmobiliaria</strong> ${N(P)}</td><td>${u.uf2(t.totalPieInmobUF)}</td><td>${u.pesos(t.totalPieInmobUF*t.valorUF)}</td></tr>`,t.bonoPieUF>0&&(v+=`<tr class="prd-tbl-aporte"><td>Aporte inmobiliaria ${N(t.aportePct)}</td><td>${u.uf2(t.bonoPieUF)}</td><td>${u.pesos(t.bonoPieUF*t.valorUF)}</td></tr>`);let E="";if(t.pieCreditoDirectoUF>0){const y=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;E=`<div class="prd-section">
      <div class="prd-section-title">Crédito Directo Inmobiliaria</div>
      <table class="prd-tbl"><tbody>
        <tr><td>Financiamiento directo ${N(y)} × valor venta</td><td>${u.uf2(t.pieCreditoDirectoUF)}</td><td>${u.pesos(t.pieCreditoDirectoCLP)}</td></tr>
      </tbody></table>
    </div>`}const w=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,l=t.escenarios.map((y,B)=>{const F=y.cuotaMensualCLP/.25;return`<tr${B===1?' class="prd-esc-hl"':""}>
      <td>CAE ${(y.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
      <td>${u.pesos(y.cuotaMensualCLP)}</td>
      <td>${u.uf2(y.cuotaMensualUF)}</td>
      <td>${u.pesos(F)}</td>
    </tr>`}).join("");o.innerHTML=`
  <div class="prd-wrap">
    <div class="prd-header">
      <img src="/images/logo.png" alt="ViveProp" class="prd-logo">
      <div class="prd-header-mid">COTIZACIÓN</div>
      <div class="prd-header-right">
        <div class="prd-cot-num">${r(c)}</div>
        <div class="prd-cot-date">${f}</div>
      </div>
    </div>

    <div class="prd-meta-row">
      <div class="prd-meta-block">
        <div class="prd-meta-title">Proyecto</div>
        <div class="prd-meta-main">${r(n.nombre)}</div>
        <div class="prd-meta-sub">${r(n.inmobiliaria)}${n.comuna?" · "+r(n.comuna):""}</div>
        <div class="prd-units-list">${g}</div>
      </div>
      <div class="prd-meta-block">
        <div class="prd-meta-title">Cliente</div>
        <div class="prd-meta-main">${r(a.nombre)}</div>
        <div class="prd-meta-sub">RUT ${r(a.rut)}</div>
        <div class="prd-meta-sub">${r(a.email)}</div>
        <div class="prd-meta-sub">${r(a.tel)}</div>
        <div class="prd-meta-obj">${p[a.objetivo]||r(a.objetivo)}</div>
      </div>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Valores</div>
      <table class="prd-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Descuento</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${C}${b}
          <tr class="prd-tbl-total"><td>Total</td><td>${u.uf2(t.precioListaTotal)}</td><td></td><td>${u.uf2(t.valorVentaUF)} <small>(${u.pesos(t.valorVentaCLP)})</small></td></tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Plan de Pago</div>
      <table class="prd-tbl">
        <thead><tr><th>Concepto</th><th>UF</th><th>$</th></tr></thead>
        <tbody>${v}</tbody>
      </table>
    </div>

    ${E}

    <div class="prd-section">
      <div class="prd-section-title">Crédito Hipotecario · ${e.plazo} años</div>
      <div class="prd-hip-summary">
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Tasación banco</span>
          <span class="prd-hip-val">${u.uf2(t.tasacionUF)}</span>
          <span class="prd-hip-sub">${u.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">LTV</span>
          <span class="prd-hip-val">${N(w)}</span>
          <span class="prd-hip-sub">× tasación</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Crédito hipotecario</span>
          <span class="prd-hip-val">${u.uf2(t.creditoHipFinalUF)}</span>
          <span class="prd-hip-sub">${u.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="prd-tbl">
        <thead><tr><th>CAE</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr></thead>
        <tbody>${l}</tbody>
      </table>
    </div>

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${r(a.corNombre)} · ${r(a.corEmail)} · ${r(a.corTel)}
      </div>
      <div class="prd-disclaimer">
        Cotización referencial — no constituye oferta formal de venta. Valores UF calculados al ${f} (1 UF = ${u.pesos(t.valorUF)}). Los dividendos son estimaciones según escenarios de tasa CAE indicados y pueden variar según condiciones del banco y perfil del solicitante.
      </div>
    </div>
  </div>`}function Zo(){_!=null&&_.cliente&&window.print()}const Dt=wt,Yo=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let yt=[],Vt=null,Q=1,Me="lista",$t=null,nt=null,rt=[],et=0;function Ue(t){return t?Yo.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function Qo(){if(!$.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set($.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();de("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),jt()}function jt(){var f,p,g,m,C,b;if(!$.PROJECTS.length)return;const t=(((f=document.getElementById("pri-search"))==null?void 0:f.value)||"").toLowerCase(),e=pe("pri"),o=((p=document.getElementById("pri-entrega"))==null?void 0:p.value)||"",n=parseFloat((g=document.getElementById("pri-precio-min"))==null?void 0:g.value)||0,s=parseFloat((m=document.getElementById("pri-precio-max"))==null?void 0:m.value)||0,i=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(v=>parseInt(v.dataset.val)),a=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(v=>parseInt(v.dataset.val)),c=((C=document.getElementById("pri-est"))==null?void 0:C.checked)||!1,d=((b=document.getElementById("pri-bod"))==null?void 0:b.checked)||!1;Vt=window._priMaxUF||null,yt=$.PROJECTS.filter(v=>{var w;let P=(v.unidades||[]).filter(l=>l.disponible&&!dt(l.tipologia));if(!P.length||t&&!`${v.nombre||""} ${v.inmobiliaria||""} ${v.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(v.comuna)||o&&!((w=v.entrega)!=null&&w.toLowerCase().includes(o.toLowerCase()))||c&&!(v.unidades||[]).some(l=>l.disponible&&/estac|parking|reja/i.test(l.tipologia||""))||d&&!(v.unidades||[]).some(l=>l.disponible&&/bode/i.test(l.tipologia||""))||i.length&&(P=P.filter(l=>{const y=parseInt(l.dormitorios)||0;return i.some(B=>B===4?y>=4:y===B)}),!P.length)||a.length&&(P=P.filter(l=>{const y=parseInt(l.banos)||0;return a.some(B=>B===3?y>=3:y===B)}),!P.length))return!1;const E=Math.min(...P.map(l=>l.precio_uf).filter(l=>l>0));return!(n&&E<n||s&&E>s||Vt&&!P.some(l=>l.precio_uf<=Vt))}),Q=1,Te(),Me==="mapa"&&$e(yt)}function Xo(t){const e=Math.max(1,Math.ceil(yt.length/Dt));Q=Math.min(Math.max(1,Q+t),e),Te(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Te(){const t=document.getElementById("pri-grid"),e=yt.length,o=Math.max(1,Math.ceil(e/Dt));Q>o&&(Q=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${Q} / ${o}`,document.getElementById("pri-prev").disabled=Q<=1,document.getElementById("pri-next").disabled=Q>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${e.toLocaleString("es-CL")} proyectos · ${$.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const s=yt.slice((Q-1)*Dt,Q*Dt);t.innerHTML=s.map(i=>{const a=(i.unidades||[]).filter(v=>v.disponible&&!dt(v.tipologia)),c=a.map(v=>v.precio_uf).filter(v=>v>0),d=c.length?Math.min(...c):0,f=c.length?Math.max(...c):0,p=i.foto_portada||"",g=[...new Set(a.map(v=>{const P=parseInt(v.dormitorios)||0;return P===0?"Estudio":P+"D"}))].sort().slice(0,3).join(", "),m=a.reduce((v,P)=>P.m2_interior&&P.m2_interior<v?P.m2_interior:v,9999),C=m<9999?m.toFixed(0)+" m²":"—",b=$.CC_DATA[i.id]||Ue(i.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(i.id)}')">
      <div class="prj-img" style="${p?`background-image:url('${p}');background-size:cover;background-position:center`:""}">
        ${p?"":'<div class="prj-img-icon">🏗️</div>'}
        <span class="prj-badge">Nuevo</span>
        ${i.entrega?`<span class="prj-entrega">${r(i.entrega)}</span>`:""}
      </div>
      <div class="prj-body">
        <div class="prj-row1">
          <div class="prj-name">${r(i.nombre)}</div>
          <span class="prj-new-badge">${a.length} uds</span>
        </div>
        <div class="prj-sub">${r(i.inmobiliaria||"—")}${i.comuna?" · "+r(i.comuna):""}</div>
        ${i.direccion?`<div class="prj-addr">📍 ${r(i.direccion)}</div>`:'<div style="margin-bottom:9px"></div>'}
        <div class="prj-stats">
          <div class="prj-stat"><div class="prj-stat-v">${g||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${C}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${a.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${d?"UF "+d.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${f>d?`<span class="prj-hasta">— ${f.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(i.id)}')">Ver proyecto →</button>
          ${b?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function tn(t){Me=t,po(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"){lo();const s=ro();setTimeout(()=>s&&s.invalidateSize(),120),$e(yt)}}function Wt(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),n=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),n&&(n.style.display=e===t?"flex":"none")}),t==="map"&&mo($t)}function en(t){const e=t.unidades||[],o=e.filter(h=>h.disponible&&!dt(h.tipologia)),n=o.map(h=>h.precio_uf).filter(h=>h>0),s=n.length?Math.min(...n):0,i=n.length?Math.max(...n):0,a=o.map(h=>h.m2_interior).filter(h=>h>0),c=a.length?Math.min(...a):0,d=a.length?Math.max(...a):0,f=[...new Set(o.map(h=>{const S=parseInt(h.dormitorios)||0;return S===0?"Estudio":S+"D"}))].sort(),p=h=>h.toLocaleString("es-CL",{maximumFractionDigits:0}),g=s?i>s?`UF ${p(s)} – ${p(i)}`:`UF ${p(s)}`:" — ",m=c?d>c?`${c.toFixed(0)} – ${d.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",C=[t.direccion,t.comuna].filter(Boolean).join(", ");let b="";C&&(b+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r(C)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
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
      <span class="pm-stat-card-val" style="font-size:${d>c?"11px":"15px"}">${m}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${i>s?"11px":"15px"}">${g}</span>
      <span class="pm-stat-card-sub">${s?"en UF":""}</span>
    </div>
  </div>`;const v=[...new Set(o.map(h=>parseInt(h.piso)).filter(h=>h>0))].sort((h,S)=>h-S),P=[...new Set(o.map(h=>(h.orientacion||"").trim()).filter(Boolean))],E=o.map(h=>h.m2_terraza).filter(h=>h>0),w=[];if(v.length>0){const h=v.length===1?`Piso ${v[0]}`:`Pisos ${v[0]} – ${v[v.length-1]}`;w.push(`<div class="pm-detail-pill"><strong>${h}</strong></div>`)}if(P.length>0&&w.push(`<div class="pm-detail-pill">🧭 <strong>${P.slice(0,3).join(" · ")}</strong></div>`),E.length>0){const h=Math.min(...E).toFixed(0);w.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${h} m²</strong></div>`)}w.length&&(b+=`<div class="pm-detail-row">${w.join("")}</div>`);const l=e.filter(h=>dt(h.tipologia)&&/estac|parking/i.test(h.tipologia||"")),y=e.filter(h=>dt(h.tipologia)&&/bode/i.test(h.tipologia||"")),B=l.filter(h=>h.disponible),F=y.filter(h=>h.disponible),U=[];if(l.length>0){const h=B.map(I=>I.precio_uf).filter(I=>I>0),S=h.length?Math.min(...h):0;U.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${B.length} disp.</span>
        <span class="pm-extra-sub">${S?`Desde UF ${p(S)}`:`${l.length} en total`}</span>
      </div>
    </div>`)}if(y.length>0){const h=F.map(I=>I.precio_uf).filter(I=>I>0),S=h.length?Math.min(...h):0;U.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${F.length} disp.</span>
        <span class="pm-extra-sub">${S?`Desde UF ${p(S)}`:`${y.length} en total`}</span>
      </div>
    </div>`)}U.length&&(b+=`<div class="pm-extras-row">${U.join("")}</div>`);const x=$.CC_DATA[t.id];if(x&&x.campos&&x.campos.length){const h=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],S=[];for(const I of h){const q=x.campos.find(([W])=>W===I);if(q&&S.push(q),S.length===6)break}S.length<6&&x.campos.filter(([I])=>!S.find(([q])=>q===I)).slice(0,6-S.length).forEach(I=>S.push(I)),b+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${S.map(([I,q])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(I)}</span>
          <span class="pm-cc-prev-val">${r(q)}</span>
        </div>`).join("")}
      </div>
      ${x.nota?`<div class="pm-cc-nota">${r(x.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=b}function De(t){const e=document.getElementById("pm-cc-inner"),o=$.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const s=o.campos.filter(([,a])=>a.length<=60),i=o.campos.filter(([,a])=>a.length>60);s.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',s.forEach(([a,c])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(a)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),n+="</div>"),i.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',i.forEach(([a,c])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(a)}</div>`,n+=`<div class="pm-cc-val-long">${r(c)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(s=>{n+=`<th>${r(s)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(s=>{n+="<tr>",s.forEach(i=>{n+=`<td>${r(i||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=n}function _e(t){const e=$.PROJECTS.find(m=>m.id===t);if(!e)return;$t=e,nt=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),Wt("gal"),en(e),rt=e.fotos||[],et=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),s=document.getElementById("pm-gal-nophoto"),i=document.getElementById("pm-gal-thumbs"),a=document.getElementById("pm-gal-counter");n.style.display="none",rt.length?(s.style.display="none",Zt(0),i.innerHTML=rt.map((m,C)=>`<img src="${m}" onclick="pmShowGalPhoto(${C})" ${C===0?'class="active"':""}>`).join("")):(o.style.display="none",s.style.display="flex",i.innerHTML="",a.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(m=>`<a class="pm-pdf-item" href="${m.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(m.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const d=document.getElementById("pm-tab-cc"),f=$.CC_DATA[e.id],p=Ue(e.inmobiliaria).length>0;f||p?(d.style.display="",De(e.id)):d.style.display="none";const g=(e.unidades||[]).filter(m=>m.disponible&&!dt(m.tipologia));document.getElementById("pm-units-body").innerHTML=g.map(m=>`
    <tr>
      <td>${r(m.dp)}</td>
      <td>${r(m.tipologia)}</td>
      <td>${r(m.piso||"—")}</td>
      <td>${m.m2_interior?m.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${m.m2_terraza?m.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(m.orientacion||"—")}</td>
      <td class="td-precio">${u.uf(m.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(m.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Zt(t){var n;et=Math.max(0,Math.min(t,rt.length-1));const e=document.getElementById("pm-gal-img");e.src=rt[et],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${et+1} / ${rt.length}`,document.getElementById("pm-gal-prev").disabled=et===0,document.getElementById("pm-gal-next").disabled=et===rt.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((s,i)=>s.classList.toggle("active",i===et)),(n=document.getElementById("pm-gal-thumbs").children[et])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function on(t){Zt(et+t)}function Yt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",$t=null,nt=null}function Ae(t){const e=$t,o=(e.unidades||[]).find(a=>a.dp===t);if(!o)return;nt=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(e.unidades||[]).filter(a=>a.disponible&&dt(a.tipologia)),s=document.getElementById("pm-extras-wrap"),i=document.getElementById("pm-extras-list");n.length?(s.style.display="",i.innerHTML=n.map(a=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${a.precio_uf}" data-dp="${r(a.dp)}" data-label="${r(a.tipologia)} DP ${r(a.dp)}">
        <span class="extra-label">${r(a.tipologia)} — DP ${r(a.dp)}</span>
        <span class="extra-price">${u.uf(a.precio_uf)}</span>
      </label>`).join("")):(s.style.display="none",i.innerHTML=""),Qt(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function Qt(){if(!nt)return;let t=nt.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=u.uf(t)}function nn(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),nt=null}function sn(){if(!nt||!$t)return;const t=$t,e=nt,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const s=(t.unidades||[]).find(i=>i.dp===n.dataset.dp);s&&o.push(s)}),Yt(),Be({project:t,depto:e,secundarios:o})}function an(t){t.classList.toggle("active"),jt()}function cn(t,e,o=[]){_e(t),Wt("units"),e&&(Ae(e),o.length&&(o.forEach(n=>{const s=document.querySelector(`#pm-extras-list input[data-dp="${n}"]`);s&&(s.checked=!0)}),Qt()))}let ht=null;function ln(t){const{rentaLiquida:e=0,ingresosVariables:o=0,otrosIngresos:n=0,cuotasCreditos:s=0,pagoTarjetas:i=0,otrasDeudas:a=0,pieDisponible:c=0,plazo:d=25,tasa:f=4.5,morosidad:p=!1}=t,g=e+o*.5+n,m=s+i+a,C=[];let b="apto";if(p&&(b="no_apto",C.push("Presenta morosidades o protestos vigentes")),!g)return{resultado:"no_apto",razones:["Sin ingresos registrados"],ingresoEvaluable:0,cargaSinHip:0,rciActual:0,dividendoMax:0,creditoMax:0,propMaxCLP:0,propMaxUF:0};const v=m/g;v>.5&&(b="no_apto",C.push(`Carga mensual actual (${(v*100).toFixed(0)}%) supera el 50% del ingreso evaluable`));const P=g*.3,E=g*.5-m,w=Math.max(0,Math.min(P,E));w<=0&&b==="apto"&&(b="no_apto",C.push("Sin capacidad de pago disponible para un dividendo")),!c&&b==="apto"&&(b="no_apto",C.push("Sin pie disponible registrado"));const l=g>0?w/g:0,y=g>0?(m+w)/g:0;b==="apto"&&(l>.25||y>.45)&&(b="apto_con_condiciones",C.push("Relación dividendo/ingreso en zona de tolerancia (25–30%)")),b==="apto"&&C.push("Cumple todos los criterios de evaluación");const B=f/100/12,F=d*12,U=B>0?(1-Math.pow(1+B,-F))/B:F,x=w*U,h=c>0?c/.2:0,S=x/.8,I=h>0?Math.min(h,S):S,q=$.UF>0?I/$.UF:0;return{resultado:b,razones:C,ingresoEvaluable:g,cargaSinHip:m,rciActual:v,dividendoMax:w,creditoMax:x,propMaxCLP:I,propMaxUF:q}}function rn(){const t=p=>{var g;return parseFloat(((g=document.getElementById(p))==null?void 0:g.value)||"")||0},e=p=>{var g;return((g=document.getElementById(p))==null?void 0:g.checked)||!1},o={rentaLiquida:t("p-renta"),ingresosVariables:t("p-variables"),otrosIngresos:t("p-otros-ing"),cuotasCreditos:t("p-cuotas"),pagoTarjetas:t("p-tarjetas"),otrasDeudas:t("p-otras-deudas"),pieDisponible:t("p-ahorro"),plazo:t("p-plazo")||25,tasa:t("p-tasa")||4.5,morosidad:e("p-morosidad")},n=document.getElementById("p-results"),s=document.getElementById("p-btns");if(s.style.display="none",!o.rentaLiquida){n.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente para evaluar su capacidad</p></div>';return}const i=ln(o);ht=i.resultado!=="no_apto"&&i.propMaxUF>0?i.propMaxUF:null;const a={apto:{cls:"pf-badge--apto",label:"✓ Apto"},apto_con_condiciones:{cls:"pf-badge--cond",label:"⚠ Apto con condiciones"},no_apto:{cls:"pf-badge--noapto",label:"✗ No apto"}},c=a[i.resultado]||a.no_apto,d=p=>(p*100).toFixed(1).replace(/\.0$/,"")+"%",f=$.UF||1;n.innerHTML=`
  <div class="perfil-card">
    <div class="pf-status-row">
      <span class="pf-badge ${c.cls}">${c.label}</span>
      <ul class="pf-razones">${i.razones.map(p=>`<li>${p}</li>`).join("")}</ul>
    </div>
    <div class="rc-hero">
      <div class="rc-big">${i.propMaxUF>0?u.uf(i.propMaxUF):"—"}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${i.propMaxCLP>0?u.pesos(i.propMaxCLP):"—"}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell">
        <span class="rcv">${u.pesos(i.ingresoEvaluable)}</span>
        <span class="rcl">Ingreso evaluable / mes</span>
        <span class="rcp">Renta + 50% variables + otros</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${u.pesos(i.dividendoMax)}</span>
        <span class="rcl">Dividendo máximo / mes</span>
        <span class="rcp">${i.ingresoEvaluable>0?d(i.dividendoMax/i.ingresoEvaluable):"—"} del ingreso</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${u.uf(i.creditoMax/f)}</span>
        <span class="rcl">Crédito hipotecario máx.</span>
        <span class="rcp">${u.pesos(i.creditoMax)}</span>
      </div>
      <div class="rc-cell${i.rciActual>.4?" warn":""}">
        <span class="rcv">${d(i.rciActual)}</span>
        <span class="rcl">Carga actual sin hipoteca</span>
        <span class="rcp">Límite: 50%</span>
      </div>
    </div>
  </div>`,ht&&(s.style.display="flex")}function dn(t){ht&&(t==="sec"?(window._secMaxUF=ht,window.secFilter(),window.openModule("sec"),Gt("sec")):(window._priMaxUF=ht,window.priFilter(),window.openModule("pri"),Gt("pri")))}function Gt(t){var n;(n=document.getElementById("bb-"+t))==null||n.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Presupuesto máximo: <strong>${u.uf(ht)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function pn(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}function un(){const t=document.getElementById("casc-comuna");if(!t||!$.PROJECTS.length)return;const e=[...new Set($.PROJECTS.map(o=>o.comuna).filter(Boolean))].sort();t.innerHTML='<option value="">Selecciona comuna</option>'+e.map(o=>`<option value="${o}">${o}</option>`).join("")}function mn(t){const e=c=>{var d;return((d=document.getElementById(c))==null?void 0:d.value)||""},o=(c,d,f)=>{const p=document.getElementById(c);p&&(p.innerHTML=d,p.disabled=f)},n=e("casc-comuna"),s=e("casc-entrega"),i=e("casc-inmob");if(t==="comuna"){if(n){const c=[...new Set($.PROJECTS.filter(d=>d.comuna===n).map(d=>d.entrega).filter(Boolean))].sort();o("casc-entrega",'<option value="">Selecciona entrega</option>'+c.map(d=>`<option value="${d}">${d}</option>`).join(""),!1)}else o("casc-entrega",'<option value="">Selecciona entrega</option>',!0);o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0),o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="entrega"){if(s){const c=[...new Set($.PROJECTS.filter(d=>d.comuna===n&&d.entrega===s).map(d=>d.inmobiliaria).filter(Boolean))].sort();o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>'+c.map(d=>`<option value="${d}">${d}</option>`).join(""),!1)}else o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0);o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="inmob")if(i){const c=$.PROJECTS.filter(d=>d.comuna===n&&d.entrega===s&&d.inmobiliaria===i);o("casc-proyecto",'<option value="">Selecciona proyecto</option>'+c.map(d=>`<option value="${d.id}">${d.nombre}</option>`).join(""),!1)}else o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0);const a=document.getElementById("casc-continuar");a&&(a.disabled=!e("casc-proyecto"))}function gn(){var e;const t=(e=document.getElementById("casc-proyecto"))==null?void 0:e.value;t&&(window.openProject(t),window.pmTab("units"))}const vn={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:je,mcFilter:ue,mcOpen:Ke,mcClose:We,mcSelect:Ze,mcRemove:Ye,secFilter:Tt,secPage:ho,setSecView:bo,openDetail:xe,openSecDetail:yo,showDpPhoto:Jt,navDp:Ht,closeDetail:Kt,shareProperty:Fo,downloadPhotos:Po,printFicha:Eo,openVideo:xo,copyVideoLink:wo,closeVideo:we,toggleSecPill:t=>{t.classList.toggle("active"),Tt()},togglePriPill:t=>{t.classList.toggle("active"),jt()},toggleTipPill:t=>{t.classList.toggle("active"),Tt()},toggleDormPill:an,priFilter:jt,priPage:Xo,setPriView:tn,openProject:_e,closeProjModal:Yt,pmTab:Wt,renderCC:De,pmShowGalPhoto:Zt,pmGalNav:on,selectProjUnit:Ae,pmUpdateTotal:Qt,pmBack:nn,pmCotizar:sn,reopenWithUnit:cn,calcPerfil:rn,searchFromPerfil:dn,showBudgetBanner:Gt,clearBudget:pn,cotizFromProp:Be,recalcCotizPanel:Se,volverDesdeCotiz:Do,submitClientForm:zo,formatRutInput:ko,clearCCFError:jo,printCotiz:Zo,cascUpdate:mn,cascContinuar:gn});function je(t){document.querySelectorAll(".module").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(n=>n.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=vn[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Kt(),t.key==="ArrowLeft"&&Ht(-1),t.key==="ArrowRight"&&Ht(1);return}t.key==="Escape"&&we()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Kt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Yt()});async function fn(){try{const[t,e,o,n,s,i]=await Promise.all([gt.uf(),gt.stock(),gt.projects(),gt.cc(),gt.geocodes(),gt.priGeo()]);$.UF=t.valor??$.UF,$.STOCK=e??[],$.PROJECTS=o??[],$.CC_DATA=n??{};const a=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(a&&(a.textContent=$.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&t.fecha){const d=new Date(t.fecha);c.textContent=d.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}s&&Object.assign($._GC,s),i&&Object.assign($._GC,i);try{const d=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign($._GC,d)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}vo(),Qo(),un(),je("sec")}fn();
