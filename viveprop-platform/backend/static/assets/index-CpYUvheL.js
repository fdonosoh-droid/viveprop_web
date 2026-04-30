(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const y={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},Ft=24,ie="/api";async function mt(t){const e=await fetch(ie+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const gt={stock:()=>mt("/stock"),projects:()=>mt("/projects"),cc:()=>mt("/cc"),uf:()=>mt("/uf"),geocodes:()=>mt("/geocodes"),priGeo:()=>mt("/pri-geocodes"),reloadData:()=>fetch(ie+"/data/reload",{method:"POST"}).then(t=>t.json())},xt={sec:new Set,pri:new Set};let ae=[],ce=[];function le(t,e){t==="sec"?ae=e:ce=e}function re(t){return xt[t]}function de(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?ae:ce,s=xt[t],n=document.getElementById(t+"-mc-dropdown"),i=o.filter(a=>(!e||a.toLowerCase().includes(e))&&!s.has(a));if(!i.length){n.style.display="none";return}n.innerHTML=i.slice(0,14).map(a=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${a.replace(/'/g,"\\'")}');return false">${a}</div>`).join(""),n.style.display="block"}function He(t){de(t)}function Ge(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function qe(t,e){xt[t].add(e),pe(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function Je(t,e){xt[t].delete(e),pe(t),t==="sec"?window.secFilter():window.priFilter()}function pe(t){document.getElementById(t+"-mc-tags").innerHTML=[...xt[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function w(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const g={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function ue(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function Ke(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function We(t){var n,i;const e=(t||"").toLowerCase(),o=parseInt((n=e.match(/(\d+)d/))==null?void 0:n[1])||0,s=parseInt((i=e.match(/(\d+)b/))==null?void 0:i[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:s}}function ct(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function Ze(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const Qe={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let vt=null,Ut=null,ft=null,Tt=null,Q=null,Pt=null;function qt(t){const e=`${t.direccion}|${t.comuna}`;if(y._GC[e]!==void 0)return y._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function Xe(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function me(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function Ye(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function to(){vt||(vt=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(vt),Ut=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),vt.addLayer(Ut))}function eo(){return vt}function ge(t){if(!vt)return;Ut.clearLayers();const e=[];t.forEach(o=>{const s=qt(o);s?fe(o,s):s===void 0&&e.push(o)}),e.length&&no(e)}let ve="lista";function oo(t){ve=t}function fe(t,e){const o=w(t.precioSinBono),s=w(t.m2total)||w(t.m2interior),n=Qe[t.estado]||"#94A3B8",i=ue(t.estado),a=`<div class="map-popup">
    <div class="mp-photo" id="mpp-${r(t.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${n}22;color:${n}">${i}</span>
        ${t.bonoPct>0?`<span class="mp-bono">Bono Pie ${t.bonoPct}%</span>`:""}
      </div>
      <div class="mp-title">${r(t.condominio||t.direccion||"—")}</div>
      <div class="mp-addr">📍 ${r(t.direccion||"")}${t.comuna?" · "+r(t.comuna):""}</div>
      <div class="mp-specs">
        ${t.tipologia?`<span class="mp-spec">${r(t.tipologia)}</span>`:""}
        ${s?`<span class="mp-spec">${s.toFixed(0)} m²</span>`:""}
        ${t.orientacion&&t.orientacion!=="-"?`<span class="mp-spec">${r(t.orientacion)}</span>`:""}
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</span>
      </div>
      <button class="mp-btn" onclick="openSecDetail('${r(t.id)}')">Ver ficha →</button>
    </div>
  </div>`,c=L.marker(e,{icon:Xe(n)});c.bindPopup(a,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(h=>h.json()).then(h=>{var d,C;const v=(d=h.data)==null?void 0:d[0],m=((C=v==null?void 0:v.fotos_originales)!=null&&C.length?v.fotos_originales:v==null?void 0:v.fotos)||[];if(m.length){const P=document.getElementById("mpp-"+t.id);if(P){const f=Ye(t.id,m[0]);P.style.backgroundImage=`url('${f}')`,P.textContent=""}}}).catch(()=>{})}),Ut.addLayer(c)}async function no(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),s=document.getElementById("geo-msg");e.style.display="flex";let n={};try{n=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&ve==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;s.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const u=encodeURIComponent(`${a.direccion}, ${a.comuna}, Santiago, Chile`);try{const v=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${u}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(v[0]){const m=[parseFloat(v[0].lat),parseFloat(v[0].lon)];n[c]=m,y._GC[c]=m,fe(a,m)}else n[c]=null}catch{n[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(n))}catch{}await new Promise(h=>setTimeout(h,1200))}e.style.display="none"}function so(){ft||(ft=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ft),Tt=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ft.addLayer(Tt))}function io(){return ft}let he="lista";function ao(t){he=t}function ye(t){if(!ft)return;Tt.clearLayers();const e=[];t.forEach(o=>{const s=qt({direccion:o.direccion,comuna:o.comuna});s?be(o,s):s===void 0&&e.push(o)}),e.length&&co(e)}function be(t,e){const{isExtra:o}=window._mapUtils||{},s=(t.unidades||[]).filter(d=>d.disponible&&!/estac|bode|parking|reja|local\s/i.test(d.tipologia||"")),n=s.map(d=>d.precio_uf).filter(d=>d>0),i=n.length?Math.min(...n):0,a=n.length?Math.max(...n):0,c=[...new Set(s.map(d=>{const C=parseInt(d.dormitorios)||0;return C===0?"Estudio":C+"D"}))].sort().slice(0,3).join(", "),u=t.foto_portada||"",h=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),v=L.marker(e,{icon:h}),m=`<div class="map-popup">
    <div class="mp-photo" ${u?`style="background-image:url('${u}')"`:""}>${u?"":"🏗️"}</div>
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
        <span class="mp-spec">${s.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${i?"UF "+i.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${a>i?`<span style="font-size:11px;color:var(--g400)">— ${a.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(t.id)}')">Ver proyecto →</button>
    </div>
  </div>`;v.bindPopup(m,{className:"lf-popup",maxWidth:270,closeButton:!1}),Tt.addLayer(v)}async function co(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),s=document.getElementById("pri-geo-msg");e.style.display="flex";let n={};try{n=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&he==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;s.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const u=encodeURIComponent(`${a.direccion||a.nombre}, ${a.comuna||""}, Chile`);try{const v=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${u}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(v[0]){const m=[parseFloat(v[0].lat),parseFloat(v[0].lon)];n[c]=m,y._GC[c]=m,be(a,m)}else n[c]=null}catch{n[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(n))}catch{}await new Promise(h=>setTimeout(h,1200))}e.style.display="none"}function lo(t){if(!t)return;Q?Q.invalidateSize():(Q=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(Q)),Pt&&(Q.removeLayer(Pt),Pt=null);const e=qt({direccion:t.direccion,comuna:t.comuna});e?$e(t,e):ro(t),setTimeout(()=>{Q&&Q.invalidateSize()},200)}function $e(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});Pt=L.marker(e,{icon:o}).addTo(Q),Pt.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),Q.setView(e,15)}async function ro(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const s=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(s[0]){const n=[parseFloat(s[0].lat),parseFloat(s[0].lon)];let i={};try{i=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}i[`${t.direccion}|${t.comuna}`]=n;try{localStorage.setItem("_geo_cache",JSON.stringify(i))}catch{}y._GC[`${t.direccion}|${t.comuna}`]=n,$e(t,n)}}catch{}}let ht=[],q=1,Ce="lista",zt={},$t=null,R=[],J=0,V=null,G=null,Vt="";function po(){if(!y.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set(y.STOCK.map(e=>e.comuna).filter(Boolean))].sort();le("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Mt()}function Mt(){var C,P,f,b,$,T;if(!y.STOCK.length)return;const t=(((C=document.getElementById("sec-search"))==null?void 0:C.value)||"").toLowerCase(),e=re("sec"),o=parseFloat((P=document.getElementById("sec-precio-min"))==null?void 0:P.value)||0,s=parseFloat((f=document.getElementById("sec-precio-max"))==null?void 0:f.value)||0,n=((b=document.getElementById("sec-op"))==null?void 0:b.checked)||!1,i=(($=document.getElementById("sec-est"))==null?void 0:$.checked)||!1,a=((T=document.getElementById("sec-bod"))==null?void 0:T.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(l=>parseInt(l.dataset.val)),u=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(l=>parseInt(l.dataset.val)),h=[...document.querySelectorAll(".sec-estado-cb")],v=h.filter(l=>l.checked).map(l=>l.value),m=v.length===h.length,d=window._secMaxUF||null;ht=y.STOCK.filter(l=>{if(t&&!`${l.condominio||""} ${l.direccion||""} ${l.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(l.comuna)||n&&!l.oportunidad||i&&(!l.est||l.est==="0")||a&&(!l.bod||l.bod==="0")||!m&&!v.some(B=>Ze(l.estado,B)))return!1;const{dorm:F,banos:D}=We(l.tipologia);if(c.length&&!c.some(B=>B===4?F>=4:F===B)||u.length&&!u.some(B=>B===3?D>=3:D===B))return!1;const E=parseFloat((l.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&E<o||s&&E>s||d&&E>d)}),q=1,Ce==="mapa"?ge(ht):Fe()}function Fe(){const t=document.getElementById("sec-grid"),e=ht.length,o=Math.max(1,Math.ceil(e/Ft));q>o&&(q=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${q} / ${o}`,document.getElementById("sec-prev").disabled=q<=1,document.getElementById("sec-next").disabled=q>=o;const s=y.STOCK.length,n=y.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,i=document.getElementById("tb-stats");i&&(i.textContent=`${n.toLocaleString("es-CL")} disponibles · ${s.toLocaleString("es-CL")} total`);const a=ht.slice((q-1)*Ft,q*Ft);if(!a.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=a.map(c=>{const u=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),h=c.bonoPct>0,v=c.m2interior||c.m2total||"—",m=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",d=ue(c.estado),C=Ke(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${C}">${d}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(v)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(m)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${u?"UF "+u.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${h?`<span class="pc-bono-badge">✅ Bono ${c.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(c.id)}')">Ver ficha →</button>
          ${c.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(c.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),$t&&$t.disconnect(),$t=new IntersectionObserver(c=>{c.forEach(u=>{if(!u.isIntersecting)return;const h=u.target.id.replace("pcimg-","");uo(h),$t.unobserve(u.target)})},{rootMargin:"150px"}),a.forEach(c=>{const u=document.getElementById("pcimg-"+c.id);u&&$t.observe(u)})}async function uo(t){var o,s;const e=document.getElementById("pcimg-"+t);if(e){if(zt[t]){ne(e,zt[t]);return}try{const i=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],a=((s=i==null?void 0:i.fotos_originales)!=null&&s.length?i.fotos_originales:i==null?void 0:i.fotos)||[];if(a.length){zt[t]=a[0];const c=document.getElementById("pcimg-"+t);c&&ne(c,a[0],a.length)}}catch{}}}function ne(t,e,o){const s=e.replace(/^https?:\/\//,""),n=`https://images.weserv.nl/?url=${encodeURIComponent(s)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${n}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const i=t.querySelector(".pc-img-icon");if(i&&(i.style.display="none"),o>1){const a=t.id.match(/pcimg-(.+)/);if(a){const c=document.getElementById("pcfc-"+a[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function mo(t){const e=Math.max(1,Math.ceil(ht.length/Ft));q=Math.min(Math.max(1,q+t),e),Fe(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function go(t){Ce=t,oo(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),s=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",s&&(s.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(to(),setTimeout(()=>eo().invalidateSize(),120),ge(ht))}async function Pe(t){var s,n,i;if(V=y.STOCK.find(a=>a.id===t)||null,!V)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",R=[],J=0,(s=document.getElementById("dp-nophoto"))==null||s.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=V;try{G=((n=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:n[0])||null}catch{G=null}const o=((i=G==null?void 0:G.fotos_originales)!=null&&i.length?G.fotos_originales:G==null?void 0:G.fotos)||[];if(o.length)R=o,document.getElementById("dp-spin").style.display="none",Jt(0),document.getElementById("dp-thumbs").innerHTML=o.map((a,c)=>{const u=a.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(u)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const a=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",a.appendChild(c)}fo(e,G)}function vo(t){Pe(t)}function Jt(t){var s;J=Math.max(0,Math.min(t,R.length-1));const e=document.getElementById("dp-img"),o=R[J].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${J+1} / ${R.length}`,document.getElementById("dp-prev").disabled=J===0,document.getElementById("dp-next").disabled=J===R.length-1,document.querySelectorAll(".dp-thumbs img").forEach((n,i)=>n.classList.toggle("active",i===J)),(s=document.getElementById("dp-thumbs").children[J])==null||s.scrollIntoView({inline:"nearest",block:"nearest"})}function Ht(t){Jt(J+t)}function fo(t,e){var f;const o=w(t.precioSinBono),s=w(t.m2total)||w(e==null?void 0:e.superficie),n=w(t.m2interior)||w(e==null?void 0:e.m2_utiles),i=w(t.m2terraza)||w(e==null?void 0:e.m2_terraza),a=(e==null?void 0:e.dormitorios)??"",c=(e==null?void 0:e.banios)??"",u=(e==null?void 0:e.piso)??"",h=((f=e==null?void 0:e.unitggcc)==null?void 0:f.monto)||(e==null?void 0:e.ggcc)||"",v=(e==null?void 0:e.youtube_video_id)||"",m=(e==null?void 0:e.espacios)||"",d=(e==null?void 0:e.building_finishes)||[],C=(t.oportunidad||"").toLowerCase().includes("oportunidad"),P=m?m.split(",").map(b=>b.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
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
      ${s?`<div class="spec-card"><div class="sv">${s.toFixed(1)} m²</div><div class="sl">Sup. total</div></div>`:""}
      ${n&&n!==s?`<div class="spec-card"><div class="sv">${n.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>`:""}
      ${i?`<div class="spec-card"><div class="sv">${i.toFixed(1)} m²</div><div class="sl">Terraza</div></div>`:""}
      ${a!==""?`<div class="spec-card"><div class="sv">${a} 🛏</div><div class="sl">Dormitorios</div></div>`:""}
      ${c!==""?`<div class="spec-card"><div class="sv">${c} 🚿</div><div class="sl">Baños</div></div>`:""}
      ${u!==""?`<div class="spec-card"><div class="sv">Piso ${u}</div><div class="sl">Nivel</div></div>`:""}
      ${t.orientacion&&t.orientacion!=="-"?`<div class="spec-card"><div class="sv">${r(t.orientacion)}</div><div class="sl">Orientación</div></div>`:""}
      ${t.est&&t.est!=="0"?'<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>':""}
      ${t.bod&&t.bod!=="0"?'<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>':""}
      ${t.anio?`<div class="spec-card"><div class="sv">${r(t.anio)}</div><div class="sl">Año</div></div>`:""}
      ${h?`<div class="spec-card"><div class="sv">$${Number(h).toLocaleString("es-CL")}</div><div class="sl">Gastos comunes</div></div>`:""}
    </div>
    <div class="dt-section">Precio y condición comercial</div>
    <div class="price-block">
      <div class="dp-price-card">
        <div class="pc-label">Precio sin bono pie</div>
        <div class="pc-value">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
        ${o?`<div class="pc-sub">$${Math.round(o*y.UF).toLocaleString("es-CL")}</div>`:""}
      </div>
      ${t.bonoPct>0?`
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${t.bonoPct}%</div>
        ${w(t.bonoUF)?`<div class="bc-sub">${w(t.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${P.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${P.map(b=>`<span class="dt-amenity">${r(b)}</span>`).join("")}</div>`:""}
    ${d.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${d.map(b=>{var F;const $=String(b).split(":"),T=((F=$[0])==null?void 0:F.trim())||"",l=$.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(T)}</div><div class="dt-finish-v">${r(l)}</div></div>`}).join("")}</div>`:""}
    ${v?`
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${r(v)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>`:""}
    ${t.video&&!v?`
    <div class="dt-section">Video de la propiedad</div>
    <div style="margin:4px 0 12px">
      <button onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer">▶ Ver video</button>
    </div>`:""}
    ${ho(t)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizFromProp(${o||0},'${r(t.condominio||"")} DP${r(t.dp||"")}')">📊 Cotizar</button>
      ${t.video?`<button class="btn-fotos" onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(t.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${R.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${R.length})</button>`:""}
    </div>`}function ho(t){const e=t.condominio||t.direccion;if(!e||!y.STOCK.length)return"";const o=y.STOCK.filter(n=>n.id!==t.id&&(n.condominio||n.direccion)===e);if(!o.length)return"";const s=o.map(n=>{const i=w(n.precioSinBono),a=w(n.m2total)||w(n.m2interior),c=[];return n.dp&&c.push("DP "+n.dp),a&&c.push(a.toFixed(0)+" m²"),n.orientacion&&n.orientacion!=="-"&&c.push(n.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(n.id)}')">
      <div class="ur-tipo">${r(n.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${i?i.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${s}
  </div>`}function Kt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",R=[],J=0,V=null,G=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function yo(t){const e=V;if(!e)return;const o=w(e.precioSinBono),s=w(e.m2total)||w(e.m2interior),n=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${s?s.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),i=`https://wa.me/?text=${encodeURIComponent(n)}`,a=document.createElement("div");a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",a.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${n}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${i}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(a),a.addEventListener("click",c=>{c.target===a&&a.remove()})}async function bo(){if(!R.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),s=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),s.style.width="0%";const n=new JSZip,i=n.folder("fotos-propiedad"),a=R.length;async function c(m){try{const d=await fetch(me(m));if(d.ok)return await d.blob()}catch{}try{const d=await fetch(m,{mode:"cors"});if(d.ok)return await d.blob()}catch{}return null}let u=0;for(let m=0;m<a;m++){o.textContent=`Descargando foto ${m+1} de ${a}…`,s.style.width=`${Math.round(m/a*90)}%`;const d=await c(R[m]);if(d){const C=d.type.includes("png")?"png":"jpg";i.file(`foto-${String(m+1).padStart(2,"0")}.${C}`,d),u++}}o.textContent="Generando ZIP…",s.style.width="95%";const h=await n.generateAsync({type:"blob"});if(s.style.width="100%",u===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${R.length})`;return}const v=document.createElement("a");v.href=URL.createObjectURL(h),v.download=`fotos-${((V==null?void 0:V.condominio)||(V==null?void 0:V.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,v.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${R.length})`},800)}async function $o(){var Bt;if(!V)return;const t=V,e=G,o=document.querySelector(".btn-ficha"),s=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const n=w(t.precioSinBono),i=w(t.m2total)||w(e==null?void 0:e.superficie),a=w(t.m2interior)||w(e==null?void 0:e.m2_utiles),c=w(t.m2terraza)||w(e==null?void 0:e.m2_terraza),u=(e==null?void 0:e.dormitorios)??"",h=(e==null?void 0:e.banios)??"",v=(e==null?void 0:e.piso)??"",m=((Bt=e==null?void 0:e.unitggcc)==null?void 0:Bt.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(M=>M.trim()).filter(Boolean),e!=null&&e.building_finishes;const d=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),C=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function P(M){for(const N of[me(M),M])try{const A=await fetch(N);if(!A.ok)continue;const S=await A.blob();return await new Promise(_=>{const k=new FileReader;k.onload=ut=>_(ut.target.result),k.readAsDataURL(S)})}catch{}return null}o.textContent="⏳ Cargando logo…";const f=await P("images/logo.png");o.textContent="⏳ Cargando fotos…";const $=(await Promise.all(R.slice(0,5).map(P))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=s,o.disabled=!1;return}const{jsPDF:T}=window.jspdf,l=new T({unit:"mm",format:"a4",orientation:"portrait"}),F=210,D=297,E=10,B=190,O=[67,56,202],p=[107,114,128],x=[249,250,251],U=[255,255,255],H=[17,24,39],rt=[5,150,105],Y=[209,250,229],tt=M=>l.setFillColor(M[0],M[1],M[2]),z=M=>l.setTextColor(M[0],M[1],M[2]),W=(M,N,A,S,_,k)=>{tt(k),l.roundedRect(M,N,A,S,_,_,"F")},_t=(M,N)=>(tt([229,231,235]),l.rect(E,N,B,.3,"F"),l.setFontSize(7.5),l.setFont("helvetica","bold"),z(p),l.text(M.toUpperCase(),E,N+4.5),N+8);let I=0;tt(O),l.rect(0,0,F,22,"F"),f?(W(E-1,3,44,15,2.5,U),l.addImage(f,"PNG",E+1,5,40,7.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(16),z(U),l.text("ViveProp",E,14)),l.setFont("helvetica","normal"),l.setFontSize(8.5),z([200,200,230]),l.text("Ficha de Propiedad",F-E,10,{align:"right"}),l.text(C,F-E,16,{align:"right"}),I=22,tt([238,242,255]),l.rect(0,I,F,32,"F"),l.setFont("helvetica","bold"),l.setFontSize(15),z(H);const bt=t.condominio||t.direccion||"—";l.text(bt.length>38?bt.slice(0,36)+"…":bt,E,I+11),l.setFont("helvetica","normal"),l.setFontSize(9),z(p);const nt=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(l.text(nt.length>55?nt.slice(0,53)+"…":nt,E,I+18),l.setFont("helvetica","bold"),l.setFontSize(20),z(O),l.text(n?n.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",F-E,I+13,{align:"right"}),l.setFontSize(8),z(p),l.setFont("helvetica","normal"),l.text("Precio sin bono pie",F-E,I+8,{align:"right"}),t.bonoPct>0&&(W(F-E-42,I+18,42,9,2,Y),l.setFont("helvetica","bold"),l.setFontSize(8),z(rt),l.text(`Acepta Bono Pie ${t.bonoPct}%`,F-E-21,I+23.5,{align:"center"})),I+=34,$.length){const S=$.length>1?118:B,_=B-S-2;try{l.addImage($[0],"JPEG",E,I,S,52,void 0,"FAST")}catch{}if($[1])try{l.addImage($[1],"JPEG",E+S+2,I,_,25,void 0,"FAST")}catch{}if($[2])try{l.addImage($[2],"JPEG",E+S+2,I+25+2,_,25,void 0,"FAST")}catch{}if(I+=54,$[3]||$[4]){const k=$[4]?(B-2)/2:B;if($[3])try{l.addImage($[3],"JPEG",E,I,k,32,void 0,"FAST")}catch{}if($[4])try{l.addImage($[4],"JPEG",E+k+2,I,k,32,void 0,"FAST")}catch{}I+=34}}I+=4,I=_t("Características",I);const It=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,i?{v:i.toFixed(0)+" m²",l:"Superficie"}:null,a?{v:a.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,u!==""?{v:u+" dorm.",l:"Dormitorios"}:null,h!==""?{v:h+" baños",l:"Baños"}:null,v!==""?{v:"Piso "+v,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,m?{v:"$"+Number(m).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),Z=4,dt=(B-(Z-1)*3)/Z,pt=14;It.forEach((M,N)=>{const A=N%Z,S=Math.floor(N/Z),_=E+A*(dt+3),k=I+S*(pt+3);W(_,k,dt,pt,2,x),l.setFont("helvetica","bold"),l.setFontSize(9),z(H),l.text(String(M.v).slice(0,18),_+dt/2,k+6.5,{align:"center"}),l.setFont("helvetica","normal"),l.setFontSize(7),z(p),l.text(M.l,_+dt/2,k+11,{align:"center"})}),I+=Math.ceil(It.length/Z)*(pt+3)+4,tt(O),l.rect(0,D-16,F,16,"F"),f?(W(E-1,D-14,33,11,2,U),l.addImage(f,"PNG",E+1,D-12.5,29,5.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(11),z(U),l.text("ViveProp",E,D-7)),l.setFont("helvetica","normal"),l.setFontSize(8),z([200,200,230]),l.text("www.viveprop.cl · Stock de propiedades en gestión",F-E,D-7,{align:"right"}),l.save(`ficha-${d}.pdf`),o.textContent=s,o.disabled=!1}function Co(t){Vt=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function Fo(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Vt).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Vt)})}function Ee(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function j(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Rt(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function Po(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function Ct(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function Eo(t){const e={};for(const[o,s]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(s??"").trim());return e}function xo(t,e){const o=Eo(t),s=(e||"").toUpperCase(),n={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(s.includes("INGEVEC")){const i=Ct(o["Cuotas pie"]);return{...n,descuentoDepto:j(o["Dcto. depto."]),aporteInmobiliario:j(o["Aporte inmobiliario"]),reservaCLP:Rt(o.Reserva),cuotasPieN:Math.max(i-1,0),pieConstPct:j(o["Pie período const."]),creditoDirectoPct:j(o["Pie crédito s/int."]),cuotonPct:j(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(s.includes("MAESTRA")){const i=j(o.Upfront),a=j(o["Pie en cuotas"]);return{...n,descuentoDepto:j(o["Descuento Base"])+j(o["Dcto Adicional"]),aporteInmobiliario:j(o["Certificado Pago"]),upfrontPct:i,piePctDefault:i+a||null,cuotasPieN:Ct(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(s.includes("RVC")){const i=j(o["Pie mínimo"]);return{...n,descuentoDepto:j(o["Descuento RVC"]),piePctDefault:i||null,cuotasPieN:Ct(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(s.includes("TOCTOC")||s.includes("TOC TOC")){const i=o["Monto Reserva"]||"",a=/uf/i.test(i),c=j(o["Pie minimo %"]);return{...n,descuentoDepto:j(o["Descuento autorizado"]),reservaCLP:a?0:Rt(i),reservaUF:a?Po(i):0,piePctDefault:c||null,cuotasPieN:Ct(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(s.includes("URMENETA")){const i=(t==null?void 0:t.nota)||"",a=i.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||i.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||i.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=a?parseFloat(a[1].replace(",","."))/100:0;return{...n,descuentoDepto:j(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Rt(o["Valor reserva"]),pieConstPct:j(o["% cuotas const."]),cuotasPieN:Ct(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:i}}return n}const Ot={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95},se={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},wo=[.04,.045,.05],xe=30,Io=.12;function Bo(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function Lo(t){const e=(t||"").toUpperCase();return se[e]||se.DEFAULT}function Mo(t){const{precioListaDepto:e,descuentoPct:o,descuentoAdicionalPct:s,bonoPiePct:n,reservaCLP:i,preciosConjuntos:a,piePct:c,upfrontPct:u,plazoAnios:h,tasasCAE:v,valorUF:m,cuotonPct:d,piePeriodoConstruccionPct:C,pieCreditoDirectoPct:P,cuotasPieN:f,arriendosMensualesCLP:b,plusvaliaAnual:$,tipoCalculoBono:T}=t,l=t.pieConjuntosPct??.2,F=(a||[]).reduce((it,At)=>it+At,0),D=e+F,E=Math.min(o+(s||0),1),B=e*(1-E),O=F,p=B+O,x=p*m,U=T==="maestra"?c:l,H=Math.round(B*c*100)/100,rt=Math.round(F*U*100)/100,Y=H+rt,tt=i/m,z=Math.round(p*(u||0)*100)/100,W=Y-tt-z,_t=W*m,I=f>0?W/f:W,bt=I*m,nt=Math.round(p*(d||0)*100)/100,It=Math.round(nt*m),Z=Math.round(p*(C||0)*100)/100,dt=Math.round(Z*m),pt=Math.round(p*(P||0)*100)/100,Bt=Math.round(pt*m),M=Y+nt+Z,N=p*(1-c);let A,S,_,k,ut,st;if(T==="maestra"){const it=1-c-n;S=n>0?Math.round(N/it*100)/100:p,A=Math.round(S*n*100)/100,_=Math.round(S*it*100)/100,st=Y,k=Math.round((S-st-_)*100)/100,ut=S>0?k/S:0}else T==="precio-lista-total"?(A=Math.round(D*n*100)/100,S=n>0?Math.round((p+A)*100)/100:p,k=A,ut=n,st=Y,_=Math.round((p-st-k)*100)/100):(A=Math.round(e*n*100)/100,S=n>0?Math.round((p+A)*100)/100:p,k=A,ut=n,st=Y,_=Math.round((p-st-k)*100)/100);const Yt=_*m,De=S*m,te=Math.pow(1+$,5)-1,ke=x*(1+te)*Ot.HAIRCUT_VENTA,_e=M*m,Ae=v.map((it,At)=>{const Lt=(b||[0,0,0])[At]||0,je=h*12,jt=Bo(it/12,je,Yt),ze=jt/m,ee=Lt-jt,Re=ee*Ot.MESES_ARRIENDO_ANIO*5,Oe=S>0?Lt*Ot.MESES_ARRIENDO_ANIO/m/S:0,Ne=Lt*.9,oe=x>0?Math.round(Ne*12/x*1e4)/1e4:0,Ve=Math.round(oe*5*1e4)/1e4;return{cae:it,arriendoMensualCLP:Lt,cuotaMensualCLP:Math.round(jt),cuotaMensualUF:Math.round(ze*100)/100,flujoMensualCLP:Math.round(ee),flujoAcumuladoCLP:Math.round(Re),capRate:Math.round(Oe*1e4)/1e4,roi5Anios:Ve,roiAnual:oe}});return{valorUF:m,precioListaDepto:e,precioListaOtros:F,precioListaTotal:D,precioDescDepto:Math.round(B*100)/100,precioDescOtros:O,valorVentaUF:Math.round(p*100)/100,valorVentaCLP:Math.round(x),piePct:c,upfrontPct:u||0,pieTotalDeptoUF:Math.round(H*100)/100,pieTotalConjuntosUF:Math.round(rt*100)/100,pieTotalUF:Math.round(Y*100)/100,reservaUF:Math.round(tt*100)/100,upfrontUF:z,saldoPieUF:Math.round(W*100)/100,saldoPieCLP:Math.round(_t),cuotasPieN:f,valorCuotaPieUF:Math.round(I*100)/100,valorCuotaPieCLP:Math.round(bt),cuotonUF:nt,cuotonCLP:It,piePeriodoConstruccionUF:Z,piePeriodoConstruccionCLP:dt,pieCreditoDirectoUF:pt,pieCreditoDirectoCLP:Bt,totalPieInmobUF:Math.round(M*100)/100,descuentoAdicionalPct:s||0,bonoPieUF:A,saldoAporteInmobUF:Math.round(k*100)/100,aportePct:Math.round(ut*1e4)/1e4,pieCreditoHipUF:Math.round(st*100)/100,tasacionUF:Math.round(S*100)/100,tasacionCLP:Math.round(De),creditoHipBaseUF:Math.round(N*100)/100,creditoHipFinalUF:Math.round(_*100)/100,creditoHipFinalCLP:Math.round(Yt),plusvaliaAcumulada:Math.round(te*1e4)/1e4,precioVentaAnio5CLP:Math.round(ke),piePagadoCLP:Math.round(_e),escenarios:Ae}}let wt=null,Dt="";function we(t,e){if(typeof t=="number"){zo(t,e);return}const{project:o,depto:s,secundarios:n=[]}=t,i=y.CC_DATA[o.id]||null,a=xo(i,o.inmobiliaria),c=Lo(o.inmobiliaria),u=a.reservaUF>0?Math.round(a.reservaUF*y.UF):a.reservaCLP;wt={project:o,depto:s,secundarios:n,parsedCC:a,regla:c,reservaCLP:u};const h=Math.round((a.piePctDefault??Io)*100);document.getElementById("cpanel-pie-r").value=h,document.getElementById("cpanel-pie-n").value=h,document.getElementById("cpanel-pie-lbl").textContent=h+"%",document.getElementById("cpanel-plazo").value=xe,document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),Wt()}function Wt(){if(!wt)return;const t=(parseFloat(document.getElementById("cpanel-pie-n").value)||12)/100,e=parseFloat(document.getElementById("cpanel-plazo").value)||xe,o=To(t,e),s=Mo(o);console.log("[Cotizador] Input:",o),console.log("[Cotizador] Resultado:",s),Do(s,t,e)}function So(t){const e=document.getElementById("cpanel-pie-r"),o=document.getElementById("cpanel-pie-n");t==="r"?o.value=e.value:e.value=o.value,document.getElementById("cpanel-pie-lbl").textContent=(t==="r"?e:o).value+"%",Wt()}function Uo(){wt=null,document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",window.openModule("pri")}function To(t,e){const{parsedCC:o,regla:s,reservaCLP:n,depto:i,secundarios:a}=wt;return{precioListaDepto:i.precio_uf,descuentoPct:o.descuentoDepto,descuentoAdicionalPct:o.descuentoAdicional||0,bonoPiePct:o.aporteInmobiliario,reservaCLP:n,preciosConjuntos:a.map(c=>c.precio_uf),piePct:t,upfrontPct:o.upfrontPct||0,cuotasPieN:o.cuotasPieN,cuotonPct:o.cuotonPct||0,piePeriodoConstruccionPct:o.pieConstPct,pieCreditoDirectoPct:o.creditoDirectoPct,plazoAnios:e,tasasCAE:wo,valorUF:y.UF,tipoCalculoBono:s.tipoCalculoBono,pieConjuntosPct:s.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:.02}}function et(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function Do(t,e,o){const{project:s,depto:n,secundarios:i}=wt,a=[`${s.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...i.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp}`)];document.getElementById("cp-header-title").textContent=a.join(" + "),document.getElementById("cp-body").innerHTML=ko(t,n,i)+_o(t)+(t.pieCreditoDirectoUF>0?Ao(t):"")+jo(t,o)}function ko(t,e,o){const s=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,n=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(e.dp))}${e.tipologia?" &mdash; "+r(e.tipologia):""}</td>
      <td>${g.uf2(t.precioListaDepto)}</td>
      <td>${s>1e-4?`<span class="cp-val-dcto">&minus;${et(s)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${g.uf2(t.precioDescDepto)}</td>
    </tr>`,i=o.map(a=>`
    <tr>
      <td class="cp-val-unit">${a.tipologia?r(a.tipologia)+" ":""}DP ${r(String(a.dp))}</td>
      <td>${g.uf2(a.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${g.uf2(a.precio_uf)}</td>
    </tr>`).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Valores</div>
    <div class="cp-section-body">
      <table class="cp-val-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Dcto.</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${n}${i}
          <tr class="cp-val-total">
            <td>Total</td>
            <td>${g.uf2(t.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${g.uf2(t.valorVentaUF)}<br>
              <small class="cp-val-clp">${g.pesos(t.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function _o(t){let e="";if(e+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${et(t.piePct)}</span></span>
      <span class="cp-plan-val">${g.uf2(t.pieTotalUF)}<small>${g.pesos(t.pieTotalUF*t.valorUF)}</small></span>
    </div>`,e+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${g.uf2(t.reservaUF)}<small>${g.pesos(t.reservaUF*t.valorUF)}</small></span>
    </div>`,t.upfrontUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${et(t.upfrontPct)}</span></span>
        <span class="cp-plan-val">${g.uf2(t.upfrontUF)}<small>${g.pesos(t.upfrontUF*t.valorUF)}</small></span>
      </div>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${t.cuotasPieN} cuotas &times; ${g.uf2(t.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${g.uf2(t.saldoPieUF)}<small>${g.pesos(t.saldoPieCLP)}</small></span>
      </div>`),t.piePeriodoConstruccionUF>0){const s=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${et(s)}</span></span>
        <span class="cp-plan-val">${g.uf2(t.piePeriodoConstruccionUF)}<small>${g.pesos(t.piePeriodoConstruccionCLP)}</small></span>
      </div>`}t.cuotonUF>0&&(e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${g.uf2(t.cuotonUF)}<small>${g.pesos(t.cuotonCLP)}</small></span>
      </div>`);const o=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;return e+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${et(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${g.uf2(t.totalPieInmobUF)}<small>${g.pesos(t.totalPieInmobUF*t.valorUF)}</small></span>
    </div>`,t.bonoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${et(t.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${g.uf2(t.bonoPieUF)}<small>${g.pesos(t.bonoPieUF*t.valorUF)}</small></span>
      </div>`),`
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${e}</div>
    </div>
  </div>`}function Ao(t){const e=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${et(e)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${g.uf2(t.pieCreditoDirectoUF)}<small>${g.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function jo(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,s=t.escenarios.map((n,i)=>{const a=n.cuotaMensualCLP/.25;return`
      <tr${i===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(n.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${g.pesos(n.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${g.uf2(n.cuotaMensualUF)}</td>
        <td>${g.pesos(a)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${e} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${g.uf2(t.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${g.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${et(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${g.uf2(t.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${g.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${s}</tbody>
      </table>
    </div>
  </div>`}function zo(t,e){document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",document.getElementById("c-precio").value=t,Dt=e||"";const o=document.getElementById("c-prop-info");o.innerHTML=`📦 ${r(Dt)}`,o.style.display="block",window.openModule("cotiz"),Zt()}function Ro(t){const e=document.getElementById("c-pie-r"),o=document.getElementById("c-pie-n");t==="r"?o.value=e.value:e.value=o.value,document.getElementById("pie-lbl").textContent=e.value+"%",Zt()}function Zt(){const t=parseFloat(document.getElementById("c-precio").value)||0,e=parseFloat(document.getElementById("c-pie-n").value)||20,o=parseFloat(document.getElementById("c-plazo").value)||25,s=parseFloat(document.getElementById("c-tasa").value)||5,n=parseFloat(document.getElementById("c-gc").value)||0;document.getElementById("pie-lbl").textContent=e+"%";const i=document.getElementById("c-results");if(!t){i.innerHTML='<div class="empty-tool"><div class="ei">📊</div><p>Ingresa el precio para simular</p></div>';return}const a=t*e/100,c=t-a,u=s/100/12,h=o*12,v=c*u*Math.pow(1+u,h)/(Math.pow(1+u,h)-1),m=n/y.UF,d=v/.25,C=(v+m)/.25,P=[15,20,25,30];i.innerHTML=`<div class="cotiz-card">
    ${Dt?`<div style="font-size:12px;font-weight:600;color:var(--brand);margin-bottom:14px">📦 ${r(Dt)}</div>`:""}
    <div class="rc-hero">
      <div class="rc-big">${g.pesos(v*y.UF)}</div>
      <div class="rc-lbl">Dividendo mensual estimado</div>
      <div class="rc-pesos">${g.uf1(v)} · ${o} años al ${s}%</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${g.uf(t)}</span><span class="rcl">Precio propiedad</span><span class="rcp">${g.pesos(t*y.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${g.uf(a)} (${e}%)</span><span class="rcl">Pie inicial</span><span class="rcp">${g.pesos(a*y.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${g.uf(c)}</span><span class="rcl">Monto crédito</span><span class="rcp">${g.pesos(c*y.UF)}</span></div>
      <div class="rc-cell hi"><span class="rcv">${g.pesos(d*y.UF)}</span><span class="rcl">Renta mínima necesaria</span><span class="rcp">${n?`Con GC: ${g.pesos(C*y.UF)}`:"Regla 25%"}</span></div>
    </div>
    <div class="rc-tbl-title">Comparativa por plazo · Pie ${e}% · Tasa ${s}%</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th><th>Total pagado</th></tr></thead>
      <tbody>${P.map(f=>{const b=f*12,$=c*u*Math.pow(1+u,b)/(Math.pow(1+u,b)-1);return`<tr class="${f==o?"tr-hl":""}"><td>${f} años</td><td><strong>${g.pesos($*y.UF)}</strong></td><td>${g.uf1($)}</td><td>${g.pesos($/.25*y.UF)}</td><td>${g.uf($*b)}</td></tr>`}).join("")}</tbody>
    </table>
    ${n?`<p style="font-size:11px;color:var(--g400);margin-top:10px;font-style:italic">* GC de ${g.pesos(n)}/mes incluidos en renta necesaria</p>`:""}
  </div>`}const St=Ft,Oo=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let yt=[],Nt=null,K=1,Ie="lista",lt=null,ot=null,at=[],X=0;function Be(t){return t?Oo.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function No(){if(!y.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set(y.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();le("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),kt()}function kt(){var h,v,m,d,C,P;if(!y.PROJECTS.length)return;const t=(((h=document.getElementById("pri-search"))==null?void 0:h.value)||"").toLowerCase(),e=re("pri"),o=((v=document.getElementById("pri-entrega"))==null?void 0:v.value)||"",s=parseFloat((m=document.getElementById("pri-precio-min"))==null?void 0:m.value)||0,n=parseFloat((d=document.getElementById("pri-precio-max"))==null?void 0:d.value)||0,i=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(f=>parseInt(f.dataset.val)),a=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(f=>parseInt(f.dataset.val)),c=((C=document.getElementById("pri-est"))==null?void 0:C.checked)||!1,u=((P=document.getElementById("pri-bod"))==null?void 0:P.checked)||!1;Nt=window._priMaxUF||null,yt=y.PROJECTS.filter(f=>{var T;let b=(f.unidades||[]).filter(l=>l.disponible&&!ct(l.tipologia));if(!b.length||t&&!`${f.nombre||""} ${f.inmobiliaria||""} ${f.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(f.comuna)||o&&!((T=f.entrega)!=null&&T.toLowerCase().includes(o.toLowerCase()))||c&&!(f.unidades||[]).some(l=>l.disponible&&/estac|parking|reja/i.test(l.tipologia||""))||u&&!(f.unidades||[]).some(l=>l.disponible&&/bode/i.test(l.tipologia||""))||i.length&&(b=b.filter(l=>{const F=parseInt(l.dormitorios)||0;return i.some(D=>D===4?F>=4:F===D)}),!b.length)||a.length&&(b=b.filter(l=>{const F=parseInt(l.banos)||0;return a.some(D=>D===3?F>=3:F===D)}),!b.length))return!1;const $=Math.min(...b.map(l=>l.precio_uf).filter(l=>l>0));return!(s&&$<s||n&&$>n||Nt&&!b.some(l=>l.precio_uf<=Nt))}),K=1,Le(),Ie==="mapa"&&ye(yt)}function Vo(t){const e=Math.max(1,Math.ceil(yt.length/St));K=Math.min(Math.max(1,K+t),e),Le(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Le(){const t=document.getElementById("pri-grid"),e=yt.length,o=Math.max(1,Math.ceil(e/St));K>o&&(K=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${K} / ${o}`,document.getElementById("pri-prev").disabled=K<=1,document.getElementById("pri-next").disabled=K>=o;const s=document.getElementById("tb-stats");if(s&&(s.textContent=`${e.toLocaleString("es-CL")} proyectos · ${y.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const n=yt.slice((K-1)*St,K*St);t.innerHTML=n.map(i=>{const a=(i.unidades||[]).filter(f=>f.disponible&&!ct(f.tipologia)),c=a.map(f=>f.precio_uf).filter(f=>f>0),u=c.length?Math.min(...c):0,h=c.length?Math.max(...c):0,v=i.foto_portada||"",m=[...new Set(a.map(f=>{const b=parseInt(f.dormitorios)||0;return b===0?"Estudio":b+"D"}))].sort().slice(0,3).join(", "),d=a.reduce((f,b)=>b.m2_interior&&b.m2_interior<f?b.m2_interior:f,9999),C=d<9999?d.toFixed(0)+" m²":"—",P=y.CC_DATA[i.id]||Be(i.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(i.id)}')">
      <div class="prj-img" style="${v?`background-image:url('${v}');background-size:cover;background-position:center`:""}">
        ${v?"":'<div class="prj-img-icon">🏗️</div>'}
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
          <div class="prj-stat"><div class="prj-stat-v">${m||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${C}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${a.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${u?"UF "+u.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${h>u?`<span class="prj-hasta">— ${h.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(i.id)}')">Ver proyecto →</button>
          ${P?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function Ho(t){Ie=t,ao(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),s=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",s&&(s.style.display=t==="lista"?"flex":"none"),t==="mapa"){so();const n=io();setTimeout(()=>n&&n.invalidateSize(),120),ye(yt)}}function Me(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),s=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),s&&(s.style.display=e===t?"flex":"none")}),t==="map"&&lo(lt)}function Go(t){const e=t.unidades||[],o=e.filter(p=>p.disponible&&!ct(p.tipologia)),s=o.map(p=>p.precio_uf).filter(p=>p>0),n=s.length?Math.min(...s):0,i=s.length?Math.max(...s):0,a=o.map(p=>p.m2_interior).filter(p=>p>0),c=a.length?Math.min(...a):0,u=a.length?Math.max(...a):0,h=[...new Set(o.map(p=>{const x=parseInt(p.dormitorios)||0;return x===0?"Estudio":x+"D"}))].sort(),v=p=>p.toLocaleString("es-CL",{maximumFractionDigits:0}),m=n?i>n?`UF ${v(n)} – ${v(i)}`:`UF ${v(n)}`:" — ",d=c?u>c?`${c.toFixed(0)} – ${u.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",C=[t.direccion,t.comuna].filter(Boolean).join(", ");let P="";C&&(P+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r(C)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
    </div>`),P+=`<div class="pm-stats-grid">
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Disponibles</span>
      <span class="pm-stat-card-val">${o.length}</span>
      <span class="pm-stat-card-sub">unidades</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Tipologías</span>
      <span class="pm-stat-card-val" style="font-size:${h.length>3?"11px":"15px"}">${h.join(", ")||"—"}</span>
      <span class="pm-stat-card-sub">${h.length} tipo${h.length!==1?"s":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">M² útil</span>
      <span class="pm-stat-card-val" style="font-size:${u>c?"11px":"15px"}">${d}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${i>n?"11px":"15px"}">${m}</span>
      <span class="pm-stat-card-sub">${n?"en UF":""}</span>
    </div>
  </div>`;const f=[...new Set(o.map(p=>parseInt(p.piso)).filter(p=>p>0))].sort((p,x)=>p-x),b=[...new Set(o.map(p=>(p.orientacion||"").trim()).filter(Boolean))],$=o.map(p=>p.m2_terraza).filter(p=>p>0),T=[];if(f.length>0){const p=f.length===1?`Piso ${f[0]}`:`Pisos ${f[0]} – ${f[f.length-1]}`;T.push(`<div class="pm-detail-pill"><strong>${p}</strong></div>`)}if(b.length>0&&T.push(`<div class="pm-detail-pill">🧭 <strong>${b.slice(0,3).join(" · ")}</strong></div>`),$.length>0){const p=Math.min(...$).toFixed(0);T.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${p} m²</strong></div>`)}T.length&&(P+=`<div class="pm-detail-row">${T.join("")}</div>`);const l=e.filter(p=>ct(p.tipologia)&&/estac|parking/i.test(p.tipologia||"")),F=e.filter(p=>ct(p.tipologia)&&/bode/i.test(p.tipologia||"")),D=l.filter(p=>p.disponible),E=F.filter(p=>p.disponible),B=[];if(l.length>0){const p=D.map(U=>U.precio_uf).filter(U=>U>0),x=p.length?Math.min(...p):0;B.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${D.length} disp.</span>
        <span class="pm-extra-sub">${x?`Desde UF ${v(x)}`:`${l.length} en total`}</span>
      </div>
    </div>`)}if(F.length>0){const p=E.map(U=>U.precio_uf).filter(U=>U>0),x=p.length?Math.min(...p):0;B.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${E.length} disp.</span>
        <span class="pm-extra-sub">${x?`Desde UF ${v(x)}`:`${F.length} en total`}</span>
      </div>
    </div>`)}B.length&&(P+=`<div class="pm-extras-row">${B.join("")}</div>`);const O=y.CC_DATA[t.id];if(O&&O.campos&&O.campos.length){const p=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],x=[];for(const U of p){const H=O.campos.find(([rt])=>rt===U);if(H&&x.push(H),x.length===6)break}x.length<6&&O.campos.filter(([U])=>!x.find(([H])=>H===U)).slice(0,6-x.length).forEach(U=>x.push(U)),P+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${x.map(([U,H])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(U)}</span>
          <span class="pm-cc-prev-val">${r(H)}</span>
        </div>`).join("")}
      </div>
      ${O.nota?`<div class="pm-cc-nota">${r(O.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=P}function Se(t){const e=document.getElementById("pm-cc-inner"),o=y.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let s=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const n=o.campos.filter(([,a])=>a.length<=60),i=o.campos.filter(([,a])=>a.length>60);n.length&&(s+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',s+='<div class="pm-cc-grid">',n.forEach(([a,c])=>{s+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(a)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),s+="</div>"),i.length&&(s+='<div class="pm-cc-section-lbl">Información adicional</div>',i.forEach(([a,c])=>{s+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',s+=`<div class="pm-cc-lbl">${r(a)}</div>`,s+=`<div class="pm-cc-val-long">${r(c)}</div>`,s+="</div>"}))}o.tabla&&(s+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,s+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(n=>{s+=`<th>${r(n)}</th>`}),s+="</tr></thead><tbody>",o.tabla.rows.forEach(n=>{s+="<tr>",n.forEach(i=>{s+=`<td>${r(i||"—")}</td>`}),s+="</tr>"}),s+="</tbody></table>"),o.nota&&(s+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=s}function qo(t){const e=y.PROJECTS.find(d=>d.id===t);if(!e)return;lt=e,ot=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),Me("gal"),Go(e),at=e.fotos||[],X=0;const o=document.getElementById("pm-gal-img"),s=document.getElementById("pm-gal-spin"),n=document.getElementById("pm-gal-nophoto"),i=document.getElementById("pm-gal-thumbs"),a=document.getElementById("pm-gal-counter");s.style.display="none",at.length?(n.style.display="none",Qt(0),i.innerHTML=at.map((d,C)=>`<img src="${d}" onclick="pmShowGalPhoto(${C})" ${C===0?'class="active"':""}>`).join("")):(o.style.display="none",n.style.display="flex",i.innerHTML="",a.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(d=>`<a class="pm-pdf-item" href="${d.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(d.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const u=document.getElementById("pm-tab-cc"),h=y.CC_DATA[e.id],v=Be(e.inmobiliaria).length>0;h||v?(u.style.display="",Se(e.id)):u.style.display="none";const m=(e.unidades||[]).filter(d=>d.disponible&&!ct(d.tipologia));document.getElementById("pm-units-body").innerHTML=m.map(d=>`
    <tr>
      <td>${r(d.dp)}</td>
      <td>${r(d.tipologia)}</td>
      <td>${r(d.piso||"—")}</td>
      <td>${d.m2_interior?d.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${d.m2_terraza?d.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(d.orientacion||"—")}</td>
      <td class="td-precio">${g.uf(d.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(d.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Qt(t){var s;X=Math.max(0,Math.min(t,at.length-1));const e=document.getElementById("pm-gal-img");e.src=at[X],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${X+1} / ${at.length}`,document.getElementById("pm-gal-prev").disabled=X===0,document.getElementById("pm-gal-next").disabled=X===at.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((n,i)=>n.classList.toggle("active",i===X)),(s=document.getElementById("pm-gal-thumbs").children[X])==null||s.scrollIntoView({inline:"nearest",block:"nearest"})}function Jo(t){Qt(X+t)}function Xt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",lt=null,ot=null}function Ko(t){const e=lt,o=(e.unidades||[]).find(a=>a.dp===t);if(!o)return;ot=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const s=(e.unidades||[]).filter(a=>a.disponible&&ct(a.tipologia)),n=document.getElementById("pm-extras-wrap"),i=document.getElementById("pm-extras-list");s.length?(n.style.display="",i.innerHTML=s.map(a=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${a.precio_uf}" data-dp="${r(a.dp)}" data-label="${r(a.tipologia)} DP ${r(a.dp)}">
        <span class="extra-label">${r(a.tipologia)} — DP ${r(a.dp)}</span>
        <span class="extra-price">${g.uf(a.precio_uf)}</span>
      </label>`).join("")):(n.style.display="none",i.innerHTML=""),Ue(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function Ue(){if(!ot)return;let t=ot.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=g.uf(t)}function Wo(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),ot=null}function Zo(){if(!ot||!lt)return;const t=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{const o=(lt.unidades||[]).find(s=>s.dp===e.dataset.dp);o&&t.push(o)}),Xt(),we({project:lt,depto:ot,secundarios:t})}function Qo(t){t.classList.toggle("active"),kt()}let Et=null;function Xo(){const t=parseFloat(document.getElementById("p-renta").value)||0,e=parseFloat(document.getElementById("p-ahorro").value)||0,o=parseFloat(document.getElementById("p-deudas").value)||0,s=parseFloat(document.getElementById("p-plazo").value)||25,n=parseFloat(document.getElementById("p-tasa").value)||5,i=document.getElementById("p-results");if(document.getElementById("p-btns").style.display="none",!t){i.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente</p></div>';return}const a=n/100/12,c=s*12,u=t*.25-o;if(u<=0){i.innerHTML='<div class="warn-card">⚠️ Las deudas mensuales superan la capacidad de pago del 25% de la renta.</div>';return}const h=(Math.pow(1+a,c)-1)/(a*Math.pow(1+a,c)),v=u*h/y.UF,m=e/y.UF,d=Math.min(v/.8,v+m),C=d*.2,P=Math.max(0,C-m);Et=d;const f=[15,20,25,30];i.innerHTML=`<div class="perfil-card">
    <div class="rc-hero">
      <div class="rc-big">${g.uf(d)}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${g.pesos(d*y.UF)}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${g.pesos(u)}</span><span class="rcl">Dividendo máximo / mes</span></div>
      <div class="rc-cell"><span class="rcv">${g.uf(v)}</span><span class="rcl">Crédito hipotecario máx.</span></div>
      <div class="rc-cell"><span class="rcv">${g.uf(C)}</span><span class="rcl">Pie requerido (20%)</span></div>
      <div class="rc-cell ${P>0?"warn":"ok"}">
        <span class="rcv">${P>0?"⚠️ Faltan "+g.uf(P):"✅ Ahorro suficiente"}</span>
        <span class="rcl">${g.uf(m)} disponible</span>
      </div>
    </div>
    <div class="rc-tbl-title">Simulación por plazo · Tasa ${n}% anual</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Crédito máx.</th><th>Precio máx.</th></tr></thead>
      <tbody>${f.map(b=>{const $=b*12,T=(Math.pow(1+a,$)-1)/(a*Math.pow(1+a,$)),l=u*T/y.UF,F=Math.min(l/.8,l+m);return`<tr class="${b==s?"tr-hl":""}"><td>${b} años</td><td>${g.pesos(u)}</td><td>${g.uf(l)}</td><td><strong>${g.uf(F)}</strong></td></tr>`}).join("")}</tbody>
    </table>
  </div>`,document.getElementById("p-btns").style.display="flex"}function Yo(t){Et&&(t==="sec"?(window._secMaxUF=Et,window.secFilter(),window.openModule("sec"),Gt("sec")):(window._priMaxUF=Et,window.priFilter(),window.openModule("pri"),Gt("pri")))}function Gt(t){var s;(s=document.getElementById("bb-"+t))==null||s.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Filtrando por presupuesto: <strong>${g.uf(Et)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function tn(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}const en={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:Te,mcFilter:de,mcOpen:He,mcClose:Ge,mcSelect:qe,mcRemove:Je,secFilter:Mt,secPage:mo,setSecView:go,openDetail:Pe,openSecDetail:vo,showDpPhoto:Jt,navDp:Ht,closeDetail:Kt,shareProperty:yo,downloadPhotos:bo,printFicha:$o,openVideo:Co,copyVideoLink:Fo,closeVideo:Ee,toggleSecPill:t=>{t.classList.toggle("active"),Mt()},togglePriPill:t=>{t.classList.toggle("active"),kt()},toggleTipPill:t=>{t.classList.toggle("active"),Mt()},toggleDormPill:Qo,priFilter:kt,priPage:Vo,setPriView:Ho,openProject:qo,closeProjModal:Xt,pmTab:Me,renderCC:Se,pmShowGalPhoto:Qt,pmGalNav:Jo,selectProjUnit:Ko,pmUpdateTotal:Ue,pmBack:Wo,pmCotizar:Zo,calcPerfil:Xo,searchFromPerfil:Yo,showBudgetBanner:Gt,clearBudget:tn,cotizFromProp:we,syncPie:Ro,calcCotiz:Zt,recalcCotizPanel:Wt,syncCPanelPie:So,volverDesdeCotiz:Uo});function Te(t){document.querySelectorAll(".module").forEach(s=>s.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(s=>s.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=en[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Kt(),t.key==="ArrowLeft"&&Ht(-1),t.key==="ArrowRight"&&Ht(1);return}t.key==="Escape"&&Ee()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Kt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Xt()});async function on(){try{const[t,e,o,s,n,i]=await Promise.all([gt.uf(),gt.stock(),gt.projects(),gt.cc(),gt.geocodes(),gt.priGeo()]);y.UF=t.valor??y.UF,y.STOCK=e??[],y.PROJECTS=o??[],y.CC_DATA=s??{};const a=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(a&&(a.textContent=y.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&t.fecha){const u=new Date(t.fecha);c.textContent=u.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}n&&Object.assign(y._GC,n),i&&Object.assign(y._GC,i);try{const u=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign(y._GC,u)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}po(),No(),Te("sec")}on();
