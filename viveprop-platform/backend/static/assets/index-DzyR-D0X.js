(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const $={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},xt=24,ce="/api";async function mt(t){const e=await fetch(ce+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const gt={stock:()=>mt("/stock"),projects:()=>mt("/projects"),cc:()=>mt("/cc"),uf:()=>mt("/uf"),geocodes:()=>mt("/geocodes"),priGeo:()=>mt("/pri-geocodes"),reloadData:()=>fetch(ce+"/data/reload",{method:"POST"}).then(t=>t.json())},Lt={sec:new Set,pri:new Set};let le=[],re=[];function de(t,e){t==="sec"?le=e:re=e}function pe(t){return Lt[t]}function ue(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?le:re,n=Lt[t],s=document.getElementById(t+"-mc-dropdown"),a=o.filter(i=>(!e||i.toLowerCase().includes(e))&&!n.has(i));if(!a.length){s.style.display="none";return}s.innerHTML=a.slice(0,14).map(i=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${i.replace(/'/g,"\\'")}');return false">${i}</div>`).join(""),s.style.display="block"}function Ke(t){ue(t)}function We(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function Ze(t,e){Lt[t].add(e),me(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function Ye(t,e){Lt[t].delete(e),me(t),t==="sec"?window.secFilter():window.priFilter()}function me(t){document.getElementById(t+"-mc-tags").innerHTML=[...Lt[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function I(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const d={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function ge(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function Qe(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function Xe(t){var s,a;const e=(t||"").toLowerCase(),o=parseInt((s=e.match(/(\d+)d/))==null?void 0:s[1])||0,n=parseInt((a=e.match(/(\d+)b/))==null?void 0:a[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:n}}function dt(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function to(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const eo={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let vt=null,_t=null,ft=null,At=null,tt=null,It=null;function Jt(t){const e=`${t.direccion}|${t.comuna}`;if($._GC[e]!==void 0)return $._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function oo(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function ve(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function no(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function so(){vt||(vt=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(vt),_t=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),vt.addLayer(_t))}function io(){return vt}function fe(t){if(!vt)return;_t.clearLayers();const e=[];t.forEach(o=>{const n=Jt(o);n?be(o,n):n===void 0&&e.push(o)}),e.length&&co(e)}let he="lista";function ao(t){he=t}function be(t,e){const o=I(t.precioSinBono),n=I(t.m2total)||I(t.m2interior),s=eo[t.estado]||"#94A3B8",a=ge(t.estado),i=`<div class="map-popup">
    <div class="mp-photo" id="mpp-${r(t.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${s}22;color:${s}">${a}</span>
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
  </div>`,c=L.marker(e,{icon:oo(s)});c.bindPopup(i,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(v=>v.json()).then(v=>{var m,P;const u=(m=v.data)==null?void 0:m[0],h=((P=u==null?void 0:u.fotos_originales)!=null&&P.length?u.fotos_originales:u==null?void 0:u.fotos)||[];if(h.length){const y=document.getElementById("mpp-"+t.id);if(y){const g=no(t.id,h[0]);y.style.backgroundImage=`url('${g}')`,y.textContent=""}}}).catch(()=>{})}),_t.addLayer(c)}async function co(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<t.length&&he==="mapa";a++){const i=t[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${t.length}`,o.style.width=`${Math.round((a+1)/t.length*100)}%`;const p=encodeURIComponent(`${i.direccion}, ${i.comuna}, Santiago, Chile`);try{const u=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${p}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(u[0]){const h=[parseFloat(u[0].lat),parseFloat(u[0].lon)];s[c]=h,$._GC[c]=h,be(i,h)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(v=>setTimeout(v,1200))}e.style.display="none"}function lo(){ft||(ft=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ft),At=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ft.addLayer(At))}function ro(){return ft}let ye="lista";function po(t){ye=t}function $e(t){if(!ft)return;At.clearLayers();const e=[];t.forEach(o=>{const n=Jt({direccion:o.direccion,comuna:o.comuna});n?Ce(o,n):n===void 0&&e.push(o)}),e.length&&uo(e)}function Ce(t,e){const{isExtra:o}=window._mapUtils||{},n=(t.unidades||[]).filter(m=>m.disponible&&!/estac|bode|parking|reja|local\s/i.test(m.tipologia||"")),s=n.map(m=>m.precio_uf).filter(m=>m>0),a=s.length?Math.min(...s):0,i=s.length?Math.max(...s):0,c=[...new Set(n.map(m=>{const P=parseInt(m.dormitorios)||0;return P===0?"Estudio":P+"D"}))].sort().slice(0,3).join(", "),p=t.foto_portada||"",v=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),u=L.marker(e,{icon:v}),h=`<div class="map-popup">
    <div class="mp-photo" ${p?`style="background-image:url('${p}')"`:""}>${p?"":"🏗️"}</div>
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
        <span class="mp-price">${a?"UF "+a.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${i>a?`<span style="font-size:11px;color:var(--g400)">— ${i.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(t.id)}')">Ver proyecto →</button>
    </div>
  </div>`;u.bindPopup(h,{className:"lf-popup",maxWidth:270,closeButton:!1}),At.addLayer(u)}async function uo(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<t.length&&ye==="mapa";a++){const i=t[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${t.length}`,o.style.width=`${Math.round((a+1)/t.length*100)}%`;const p=encodeURIComponent(`${i.direccion||i.nombre}, ${i.comuna||""}, Chile`);try{const u=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${p}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(u[0]){const h=[parseFloat(u[0].lat),parseFloat(u[0].lon)];s[c]=h,$._GC[c]=h,Ce(i,h)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(v=>setTimeout(v,1200))}e.style.display="none"}function mo(t){if(!t)return;tt?tt.invalidateSize():(tt=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(tt)),It&&(tt.removeLayer(It),It=null);const e=Jt({direccion:t.direccion,comuna:t.comuna});e?Fe(t,e):go(t),setTimeout(()=>{tt&&tt.invalidateSize()},200)}function Fe(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});It=L.marker(e,{icon:o}).addTo(tt),It.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),tt.setView(e,15)}async function go(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const s=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let a={};try{a=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}a[`${t.direccion}|${t.comuna}`]=s;try{localStorage.setItem("_geo_cache",JSON.stringify(a))}catch{}$._GC[`${t.direccion}|${t.comuna}`]=s,Fe(t,s)}}catch{}}let ht=[],Z=1,Pe="lista",Ot={},Pt=null,G=[],Y=0,q=null,K=null,Ht="";function vo(){if(!$.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set($.STOCK.map(e=>e.comuna).filter(Boolean))].sort();de("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Tt()}function Tt(){var P,y,g,C,F,w;if(!$.STOCK.length)return;const t=(((P=document.getElementById("sec-search"))==null?void 0:P.value)||"").toLowerCase(),e=pe("sec"),o=parseFloat((y=document.getElementById("sec-precio-min"))==null?void 0:y.value)||0,n=parseFloat((g=document.getElementById("sec-precio-max"))==null?void 0:g.value)||0,s=((C=document.getElementById("sec-op"))==null?void 0:C.checked)||!1,a=((F=document.getElementById("sec-est"))==null?void 0:F.checked)||!1,i=((w=document.getElementById("sec-bod"))==null?void 0:w.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(l=>parseInt(l.dataset.val)),p=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(l=>parseInt(l.dataset.val)),v=[...document.querySelectorAll(".sec-estado-cb")],u=v.filter(l=>l.checked).map(l=>l.value),h=u.length===v.length,m=window._secMaxUF||null;ht=$.STOCK.filter(l=>{if(t&&!`${l.condominio||""} ${l.direccion||""} ${l.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(l.comuna)||s&&!l.oportunidad||a&&(!l.est||l.est==="0")||i&&(!l.bod||l.bod==="0")||!h&&!u.some(S=>to(l.estado,S)))return!1;const{dorm:b,banos:D}=Xe(l.tipologia);if(c.length&&!c.some(S=>S===4?b>=4:b===S)||p.length&&!p.some(S=>S===3?D>=3:D===S))return!1;const E=parseFloat((l.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&E<o||n&&E>n||m&&E>m)}),Z=1,Pe==="mapa"?fe(ht):Ee()}function Ee(){const t=document.getElementById("sec-grid"),e=ht.length,o=Math.max(1,Math.ceil(e/xt));Z>o&&(Z=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${Z} / ${o}`,document.getElementById("sec-prev").disabled=Z<=1,document.getElementById("sec-next").disabled=Z>=o;const n=$.STOCK.length,s=$.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,a=document.getElementById("tb-stats");a&&(a.textContent=`${s.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const i=ht.slice((Z-1)*xt,Z*xt);if(!i.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=i.map(c=>{const p=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),v=c.bonoPct>0,u=c.m2interior||c.m2total||"—",h=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",m=ge(c.estado),P=Qe(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${P}">${m}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(u)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(h)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${p?"UF "+p.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${v?`<span class="pc-bono-badge">✅ Bono ${c.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(c.id)}')">Ver ficha →</button>
          ${c.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(c.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),Pt&&Pt.disconnect(),Pt=new IntersectionObserver(c=>{c.forEach(p=>{if(!p.isIntersecting)return;const v=p.target.id.replace("pcimg-","");fo(v),Pt.unobserve(p.target)})},{rootMargin:"150px"}),i.forEach(c=>{const p=document.getElementById("pcimg-"+c.id);p&&Pt.observe(p)})}async function fo(t){var o,n;const e=document.getElementById("pcimg-"+t);if(e){if(Ot[t]){ne(e,Ot[t]);return}try{const a=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],i=((n=a==null?void 0:a.fotos_originales)!=null&&n.length?a.fotos_originales:a==null?void 0:a.fotos)||[];if(i.length){Ot[t]=i[0];const c=document.getElementById("pcimg-"+t);c&&ne(c,i[0],i.length)}}catch{}}}function ne(t,e,o){const n=e.replace(/^https?:\/\//,""),s=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${s}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const a=t.querySelector(".pc-img-icon");if(a&&(a.style.display="none"),o>1){const i=t.id.match(/pcimg-(.+)/);if(i){const c=document.getElementById("pcfc-"+i[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function ho(t){const e=Math.max(1,Math.ceil(ht.length/xt));Z=Math.min(Math.max(1,Z+t),e),Ee(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function bo(t){Pe=t,ao(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(so(),setTimeout(()=>io().invalidateSize(),120),fe(ht))}async function xe(t){var n,s,a;if(q=$.STOCK.find(i=>i.id===t)||null,!q)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",G=[],Y=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=q;try{K=((s=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:s[0])||null}catch{K=null}const o=((a=K==null?void 0:K.fotos_originales)!=null&&a.length?K.fotos_originales:K==null?void 0:K.fotos)||[];if(o.length)G=o,document.getElementById("dp-spin").style.display="none",Kt(0),document.getElementById("dp-thumbs").innerHTML=o.map((i,c)=>{const p=i.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(p)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const i=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",i.appendChild(c)}$o(e,K)}function yo(t){xe(t)}function Kt(t){var n;Y=Math.max(0,Math.min(t,G.length-1));const e=document.getElementById("dp-img"),o=G[Y].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${Y+1} / ${G.length}`,document.getElementById("dp-prev").disabled=Y===0,document.getElementById("dp-next").disabled=Y===G.length-1,document.querySelectorAll(".dp-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===Y)),(n=document.getElementById("dp-thumbs").children[Y])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Gt(t){Kt(Y+t)}function $o(t,e){var g;const o=I(t.precioSinBono),n=I(t.m2total)||I(e==null?void 0:e.superficie),s=I(t.m2interior)||I(e==null?void 0:e.m2_utiles),a=I(t.m2terraza)||I(e==null?void 0:e.m2_terraza),i=(e==null?void 0:e.dormitorios)??"",c=(e==null?void 0:e.banios)??"",p=(e==null?void 0:e.piso)??"",v=((g=e==null?void 0:e.unitggcc)==null?void 0:g.monto)||(e==null?void 0:e.ggcc)||"",u=(e==null?void 0:e.youtube_video_id)||"",h=(e==null?void 0:e.espacios)||"",m=(e==null?void 0:e.building_finishes)||[],P=(t.oportunidad||"").toLowerCase().includes("oportunidad"),y=h?h.split(",").map(C=>C.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
    <div class="detail-top">
      <div>
        <div class="detail-title">${r(t.condominio||t.direccion||"—")}</div>
        <div class="detail-addr">📍 ${r(t.direccion||"—")} · ${r(t.comuna||"")}${t.dp?" · DP "+r(t.dp):""}</div>
      </div>
      <div class="detail-badges">
        ${P?'<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>':""}
      </div>
    </div>
    <div class="dt-section">Características</div>
    <div class="specs-grid">
      <div class="spec-card"><div class="sv">${r(t.tipologia||"—")}</div><div class="sl">Tipología</div></div>
      ${n?`<div class="spec-card"><div class="sv">${n.toFixed(1)} m²</div><div class="sl">Sup. total</div></div>`:""}
      ${s&&s!==n?`<div class="spec-card"><div class="sv">${s.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>`:""}
      ${a?`<div class="spec-card"><div class="sv">${a.toFixed(1)} m²</div><div class="sl">Terraza</div></div>`:""}
      ${i!==""?`<div class="spec-card"><div class="sv">${i} 🛏</div><div class="sl">Dormitorios</div></div>`:""}
      ${c!==""?`<div class="spec-card"><div class="sv">${c} 🚿</div><div class="sl">Baños</div></div>`:""}
      ${p!==""?`<div class="spec-card"><div class="sv">Piso ${p}</div><div class="sl">Nivel</div></div>`:""}
      ${t.orientacion&&t.orientacion!=="-"?`<div class="spec-card"><div class="sv">${r(t.orientacion)}</div><div class="sl">Orientación</div></div>`:""}
      ${t.est&&t.est!=="0"?'<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>':""}
      ${t.bod&&t.bod!=="0"?'<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>':""}
      ${t.anio?`<div class="spec-card"><div class="sv">${r(t.anio)}</div><div class="sl">Año</div></div>`:""}
      ${v?`<div class="spec-card"><div class="sv">$${Number(v).toLocaleString("es-CL")}</div><div class="sl">Gastos comunes</div></div>`:""}
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
        ${I(t.bonoUF)?`<div class="bc-sub">${I(t.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${y.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${y.map(C=>`<span class="dt-amenity">${r(C)}</span>`).join("")}</div>`:""}
    ${m.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${m.map(C=>{var b;const F=String(C).split(":"),w=((b=F[0])==null?void 0:b.trim())||"",l=F.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(w)}</div><div class="dt-finish-v">${r(l)}</div></div>`}).join("")}</div>`:""}
    ${u?`
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${r(u)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>`:""}
    ${t.video&&!u?`
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
    </div>`}function Co(t){const e=t.condominio||t.direccion;if(!e||!$.STOCK.length)return"";const o=$.STOCK.filter(s=>s.id!==t.id&&(s.condominio||s.direccion)===e);if(!o.length)return"";const n=o.map(s=>{const a=I(s.precioSinBono),i=I(s.m2total)||I(s.m2interior),c=[];return s.dp&&c.push("DP "+s.dp),i&&c.push(i.toFixed(0)+" m²"),s.orientacion&&s.orientacion!=="-"&&c.push(s.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(s.id)}')">
      <div class="ur-tipo">${r(s.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${a?a.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function Wt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",G=[],Y=0,q=null,K=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function Fo(t){const e=q;if(!e)return;const o=I(e.precioSinBono),n=I(e.m2total)||I(e.m2interior),s=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),a=`https://wa.me/?text=${encodeURIComponent(s)}`,i=document.createElement("div");i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",i.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${s}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${a}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(i),i.addEventListener("click",c=>{c.target===i&&i.remove()})}async function Po(){if(!G.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),n.style.width="0%";const s=new JSZip,a=s.folder("fotos-propiedad"),i=G.length;async function c(h){try{const m=await fetch(ve(h));if(m.ok)return await m.blob()}catch{}try{const m=await fetch(h,{mode:"cors"});if(m.ok)return await m.blob()}catch{}return null}let p=0;for(let h=0;h<i;h++){o.textContent=`Descargando foto ${h+1} de ${i}…`,n.style.width=`${Math.round(h/i*90)}%`;const m=await c(G[h]);if(m){const P=m.type.includes("png")?"png":"jpg";a.file(`foto-${String(h+1).padStart(2,"0")}.${P}`,m),p++}}o.textContent="Generando ZIP…",n.style.width="95%";const v=await s.generateAsync({type:"blob"});if(n.style.width="100%",p===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`;return}const u=document.createElement("a");u.href=URL.createObjectURL(v),u.download=`fotos-${((q==null?void 0:q.condominio)||(q==null?void 0:q.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,u.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`},800)}async function Eo(){var Ft;if(!q)return;const t=q,e=K,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const s=I(t.precioSinBono),a=I(t.m2total)||I(e==null?void 0:e.superficie),i=I(t.m2interior)||I(e==null?void 0:e.m2_utiles),c=I(t.m2terraza)||I(e==null?void 0:e.m2_terraza),p=(e==null?void 0:e.dormitorios)??"",v=(e==null?void 0:e.banios)??"",u=(e==null?void 0:e.piso)??"",h=((Ft=e==null?void 0:e.unitggcc)==null?void 0:Ft.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(U=>U.trim()).filter(Boolean),e!=null&&e.building_finishes;const m=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),P=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function y(U){for(const _ of[ve(U),U])try{const A=await fetch(_);if(!A.ok)continue;const z=await A.blob();return await new Promise(k=>{const R=new FileReader;R.onload=X=>k(X.target.result),R.readAsDataURL(z)})}catch{}return null}o.textContent="⏳ Cargando logo…";const g=await y("images/logo.png");o.textContent="⏳ Cargando fotos…";const F=(await Promise.all(G.slice(0,5).map(y))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:w}=window.jspdf,l=new w({unit:"mm",format:"a4",orientation:"portrait"}),b=210,D=297,E=10,S=190,x=[67,56,202],f=[107,114,128],T=[249,250,251],B=[255,255,255],J=[17,24,39],W=[5,150,105],Bt=[209,250,229],ot=U=>l.setFillColor(U[0],U[1],U[2]),j=U=>l.setTextColor(U[0],U[1],U[2]),pt=(U,_,A,z,k,R)=>{ot(R),l.roundedRect(U,_,A,z,k,k,"F")},Mt=(U,_)=>(ot([229,231,235]),l.rect(E,_,S,.3,"F"),l.setFontSize(7.5),l.setFont("helvetica","bold"),j(f),l.text(U.toUpperCase(),E,_+4.5),_+8);let M=0;ot(x),l.rect(0,0,b,22,"F"),g?(pt(E-1,3,44,15,2.5,B),l.addImage(g,"PNG",E+1,5,40,7.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(16),j(B),l.text("ViveProp",E,14)),l.setFont("helvetica","normal"),l.setFontSize(8.5),j([200,200,230]),l.text("Ficha de Propiedad",b-E,10,{align:"right"}),l.text(P,b-E,16,{align:"right"}),M=22,ot([238,242,255]),l.rect(0,M,b,32,"F"),l.setFont("helvetica","bold"),l.setFontSize(15),j(J);const st=t.condominio||t.direccion||"—";l.text(st.length>38?st.slice(0,36)+"…":st,E,M+11),l.setFont("helvetica","normal"),l.setFontSize(9),j(f);const $t=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(l.text($t.length>55?$t.slice(0,53)+"…":$t,E,M+18),l.setFont("helvetica","bold"),l.setFontSize(20),j(x),l.text(s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",b-E,M+13,{align:"right"}),l.setFontSize(8),j(f),l.setFont("helvetica","normal"),l.text("Precio sin bono pie",b-E,M+8,{align:"right"}),t.bonoPct>0&&(pt(b-E-42,M+18,42,9,2,Bt),l.setFont("helvetica","bold"),l.setFontSize(8),j(W),l.text(`Acepta Bono Pie ${t.bonoPct}%`,b-E-21,M+23.5,{align:"center"})),M+=34,F.length){const z=F.length>1?118:S,k=S-z-2;try{l.addImage(F[0],"JPEG",E,M,z,52,void 0,"FAST")}catch{}if(F[1])try{l.addImage(F[1],"JPEG",E+z+2,M,k,25,void 0,"FAST")}catch{}if(F[2])try{l.addImage(F[2],"JPEG",E+z+2,M+25+2,k,25,void 0,"FAST")}catch{}if(M+=54,F[3]||F[4]){const R=F[4]?(S-2)/2:S;if(F[3])try{l.addImage(F[3],"JPEG",E,M,R,32,void 0,"FAST")}catch{}if(F[4])try{l.addImage(F[4],"JPEG",E+R+2,M,R,32,void 0,"FAST")}catch{}M+=34}}M+=4,M=Mt("Características",M);const ut=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,a?{v:a.toFixed(0)+" m²",l:"Superficie"}:null,i?{v:i.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,p!==""?{v:p+" dorm.",l:"Dormitorios"}:null,v!==""?{v:v+" baños",l:"Baños"}:null,u!==""?{v:"Piso "+u,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,h?{v:"$"+Number(h).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),it=4,at=(S-(it-1)*3)/it,Ct=14;ut.forEach((U,_)=>{const A=_%it,z=Math.floor(_/it),k=E+A*(at+3),R=M+z*(Ct+3);pt(k,R,at,Ct,2,T),l.setFont("helvetica","bold"),l.setFontSize(9),j(J),l.text(String(U.v).slice(0,18),k+at/2,R+6.5,{align:"center"}),l.setFont("helvetica","normal"),l.setFontSize(7),j(f),l.text(U.l,k+at/2,R+11,{align:"center"})}),M+=Math.ceil(ut.length/it)*(Ct+3)+4,ot(x),l.rect(0,D-16,b,16,"F"),g?(pt(E-1,D-14,33,11,2,B),l.addImage(g,"PNG",E+1,D-12.5,29,5.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(11),j(B),l.text("ViveProp",E,D-7)),l.setFont("helvetica","normal"),l.setFontSize(8),j([200,200,230]),l.text("www.viveprop.cl · Stock de propiedades en gestión",b-E,D-7,{align:"right"}),l.save(`ficha-${m}.pdf`),o.textContent=n,o.disabled=!1}function xo(t){Ht=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function Io(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Ht).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Ht)})}function Ie(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function V(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Vt(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function wo(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function Et(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function Lo(t){const e={};for(const[o,n]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(n??"").trim());return e}function Bo(t,e){const o=Lo(t),n=(e||"").toUpperCase(),s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(n.includes("INGEVEC")){const a=Et(o["Cuotas pie"]);return{...s,descuentoDepto:V(o["Dcto. depto."]),aporteInmobiliario:V(o["Aporte inmobiliario"]),reservaCLP:Vt(o.Reserva),cuotasPieN:Math.max(a-1,0),pieConstPct:V(o["Pie período const."]),creditoDirectoPct:V(o["Pie crédito s/int."]),cuotonPct:V(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("MAESTRA")){const a=V(o.Upfront),i=V(o["Pie en cuotas"]);return{...s,descuentoDepto:V(o["Descuento Base"])+V(o["Dcto Adicional"]),aporteInmobiliario:V(o["Certificado Pago"]),upfrontPct:a,piePctDefault:a+i||null,cuotasPieN:Et(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("RVC")){const a=V(o["Pie mínimo"]);return{...s,descuentoDepto:V(o["Descuento RVC"]),piePctDefault:a||null,cuotasPieN:Et(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const a=o["Monto Reserva"]||"",i=/uf/i.test(a),c=V(o["Pie minimo %"]);return{...s,descuentoDepto:V(o["Descuento autorizado"]),reservaCLP:i?0:Vt(a),reservaUF:i?wo(a):0,piePctDefault:c||null,cuotasPieN:Et(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("URMENETA")){const a=(t==null?void 0:t.nota)||"",i=a.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||a.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||a.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=i?parseFloat(i[1].replace(",","."))/100:0;return{...s,descuentoDepto:V(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Vt(o["Valor reserva"]),pieConstPct:V(o["% cuotas const."]),cuotasPieN:Et(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:a}}return s}const St={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},se={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},Mo=[.04,.045,.05],we=30,Le=.12;function Uo(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function So(t){const e=(t||"").toUpperCase();return se[e]||se.DEFAULT}function To(t){const{precioListaDepto:e,descuentoPct:o,bonoPiePct:n,reservaCLP:s,preciosConjuntos:a,piePct:i,upfrontPct:c,plazoAnios:p,tasasCAE:v,valorUF:u,cuotonPct:h,piePeriodoConstruccionPct:m,pieCreditoDirectoPct:P,cuotasPieN:y,arriendosMensualesCLP:g,plusvaliaAnual:C,tipoCalculoBono:F}=t,w=t.pieConjuntosPct??.2,l=(a||[]).reduce((ct,zt)=>ct+zt,0),b=e+l,D=Math.min(o+0,1),E=e*(1-D),S=l,x=E+S,f=x*u,T=F==="maestra"?i:w,B=Math.round(E*i*100)/100,J=Math.round(l*T*100)/100,W=B+J,Bt=s/u,ot=Math.round(x*(c||0)*100)/100,j=W-Bt-ot,pt=j*u,Mt=y>0?j/y:j,M=Mt*u,st=Math.round(x*(h||0)*100)/100,$t=Math.round(st*u),ut=Math.round(x*(m||0)*100)/100,it=Math.round(ut*u),at=Math.round(x*(P||0)*100)/100,Ct=Math.round(at*u),Ft=W+st+ut,U=x*(1-i);let _,A,z,k,R,X;if(F==="maestra"){const ct=1-i-n;A=n>0?Math.round(U/ct*100)/100:x,_=Math.round(A*n*100)/100,z=Math.round(A*ct*100)/100,X=W,k=Math.round((A-X-z)*100)/100,R=A>0?k/A:0}else F==="precio-lista-total"?(_=Math.round(b*n*100)/100,A=n>0?Math.round((x+_)*100)/100:x,k=_,R=n,X=W,z=Math.round((x-X-k)*100)/100):(_=Math.round(e*n*100)/100,A=n>0?Math.round((x+_)*100)/100:x,k=_,R=n,X=W,z=Math.round((x-X-k)*100)/100);const Xt=z*u,je=A*u,te=Math.pow(1+(C||St.PLUSVALIA_DEFAULT),5)-1,ze=f*(1+te)*St.HAIRCUT_VENTA,Re=Ft*u,Oe=v.map((ct,zt)=>{const Ut=(g||[0,0,0])[zt]||0,Ve=p*12,Rt=Uo(ct/12,Ve,Xt),Ne=Rt/u,ee=Ut-Rt,He=ee*St.MESES_ARRIENDO_ANIO*5,Ge=A>0?Ut*St.MESES_ARRIENDO_ANIO/u/A:0,qe=Ut*.9,oe=f>0?Math.round(qe*12/f*1e4)/1e4:0,Je=Math.round(oe*5*1e4)/1e4;return{cae:ct,arriendoMensualCLP:Ut,cuotaMensualCLP:Math.round(Rt),cuotaMensualUF:Math.round(Ne*100)/100,flujoMensualCLP:Math.round(ee),flujoAcumuladoCLP:Math.round(He),capRate:Math.round(Ge*1e4)/1e4,roi5Anios:Je,roiAnual:oe}});return{valorUF:u,precioListaDepto:e,precioListaOtros:l,precioListaTotal:b,precioDescDepto:Math.round(E*100)/100,precioDescOtros:S,valorVentaUF:Math.round(x*100)/100,valorVentaCLP:Math.round(f),piePct:i,upfrontPct:c||0,pieTotalDeptoUF:Math.round(B*100)/100,pieTotalConjuntosUF:Math.round(J*100)/100,pieTotalUF:Math.round(W*100)/100,reservaUF:Math.round(Bt*100)/100,upfrontUF:ot,saldoPieUF:Math.round(j*100)/100,saldoPieCLP:Math.round(pt),cuotasPieN:y,valorCuotaPieUF:Math.round(Mt*100)/100,valorCuotaPieCLP:Math.round(M),cuotonUF:st,cuotonCLP:$t,piePeriodoConstruccionUF:ut,piePeriodoConstruccionCLP:it,pieCreditoDirectoUF:at,pieCreditoDirectoCLP:Ct,totalPieInmobUF:Math.round(Ft*100)/100,descuentoAdicionalPct:0,bonoPieUF:_,saldoAporteInmobUF:Math.round(k*100)/100,aportePct:Math.round(R*1e4)/1e4,pieCreditoHipUF:Math.round(X*100)/100,tasacionUF:Math.round(A*100)/100,tasacionCLP:Math.round(je),creditoHipBaseUF:Math.round(U*100)/100,creditoHipFinalUF:Math.round(z*100)/100,creditoHipFinalCLP:Math.round(Xt),plusvaliaAcumulada:Math.round(te*1e4)/1e4,precioVentaAnio5CLP:Math.round(ze),piePagadoCLP:Math.round(Re),escenarios:Oe}}let O=null,kt="";function Be(t,e){if(typeof t=="number"){Yo(t,e);return}try{const{project:o,depto:n,secundarios:s=[]}=t;console.log("[Cotizador] cotizFromProp",{project:o,depto:n,secundarios:s});const a=$.CC_DATA[o.id]||null,i=Bo(a,o.inmobiliaria),c=So(o.inmobiliaria),p=i.reservaUF>0?Math.round(i.reservaUF*$.UF):i.reservaCLP;O={project:o,depto:n,secundarios:s,parsedCC:i,regla:c,reservaCLP:p,cliente:null},_o(),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(o){console.error("[Cotizador] Error en cotizFromProp:",o),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(o))}

${r(o.stack||"")}</div>`}}function Me(){if(O)try{const t=Oo(),e=Vo(t),o=To(e);console.log("[Cotizador] Input:",e),console.log("[Cotizador] Resultado:",o),No(o,t)}catch(t){console.error("[Cotizador] Error en recalcCotizPanel:",t),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(t))}

${r(t.stack||"")}</div>`}}function Do(){O=null,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",window.openModule("pri")}function lt(t){return+((t??0)*100).toFixed(2)}function _o(){const{project:t,depto:e,secundarios:o}=O,n=[`${t.nombre} · DP ${e.dp}${e.tipologia?" "+e.tipologia:""}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp}`)];document.getElementById("ccf-header-title").textContent=n.join(" + ");const s=e.precio_uf+o.reduce((c,p)=>c+p.precio_uf,0),a=[`DP ${e.dp}${e.tipologia?" — "+e.tipologia:""} · ${d.uf2(e.precio_uf)}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp} · ${d.uf2(c.precio_uf)}`)];document.getElementById("ccf-prop-summary").innerHTML=`<div class="ccf-prop-lines">${a.map(c=>`<div class="ccf-prop-line">${r(c)}</div>`).join("")}</div><div class="ccf-prop-total">Total precio lista: <strong>${d.uf2(s)}</strong></div>`,["ccf-nombre","ccf-rut","ccf-email","ccf-tel"].forEach(c=>{const p=document.getElementById(c);p&&(p.value="",p.classList.remove("cp-input--err"))});const i=document.getElementById("ccf-objetivo");i&&(i.value="",i.classList.remove("cp-input--err")),document.querySelectorAll(".ccf-err").forEach(c=>{c.textContent=""});try{const c=JSON.parse(localStorage.getItem("_corredor")||"{}");c.nombre&&(document.getElementById("ccf-cor-nombre").value=c.nombre),c.email&&(document.getElementById("ccf-cor-email").value=c.email),c.tel&&(document.getElementById("ccf-cor-tel").value=c.tel)}catch{}}function Ao(t){const e=t.replace(/[.\s]/g,"").toUpperCase();if(!/^\d{7,8}-?[0-9K]$/.test(e))return!1;const o=e.replace("-",""),n=o.slice(0,-1),s=o.slice(-1);let a=0,i=2;for(let v=n.length-1;v>=0;v--)a+=parseInt(n[v])*i,i=i===7?2:i+1;const c=11-a%11,p=c===11?"0":c===10?"K":String(c);return s===p}function ie(t){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim())}function ae(t){const e=t.replace(/[\s\-\(\)\.]/g,"");return/^(\+?56)?9\d{8}$/.test(e)||/^\+?56[2-9]\d{7}$/.test(e)}function H(t,e){const o=document.getElementById(t),n=document.getElementById(t+"-err");o&&o.classList.toggle("cp-input--err",!!e),n&&(n.textContent=e||"")}function ko(t){H(t,"")}function jo(t){const e=document.getElementById(t);if(!e)return;const o=e.value.replace(/[^\dkK]/g,"").toUpperCase();if(o.length>1){const n=o.slice(0,-1),s=o.slice(-1);e.value=n.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+s}H(t,"")}function zo(){if(!O)return;let t=!0;const e=u=>{var h;return(((h=document.getElementById(u))==null?void 0:h.value)||"").trim()},o=e("ccf-nombre");o.length<2&&(H("ccf-nombre","Ingresa el nombre completo"),t=!1);const n=e("ccf-rut");n?Ao(n)||(H("ccf-rut","RUT inválido — verifica el dígito verificador"),t=!1):(H("ccf-rut","Ingresa el RUT"),t=!1);const s=e("ccf-email");s?ie(s)||(H("ccf-email","Formato de email inválido"),t=!1):(H("ccf-email","Ingresa el email"),t=!1);const a=e("ccf-tel");a?ae(a)||(H("ccf-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-tel","Ingresa el teléfono"),t=!1);const i=e("ccf-objetivo");i||(H("ccf-objetivo","Selecciona un objetivo"),t=!1);const c=e("ccf-cor-nombre");c.length<2&&(H("ccf-cor-nombre","Ingresa el nombre del corredor"),t=!1);const p=e("ccf-cor-email");p?ie(p)||(H("ccf-cor-email","Formato de email inválido"),t=!1):(H("ccf-cor-email","Ingresa el email del corredor"),t=!1);const v=e("ccf-cor-tel");if(v?ae(v)||(H("ccf-cor-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-cor-tel","Ingresa el teléfono del corredor"),t=!1),!!t){try{localStorage.setItem("_corredor",JSON.stringify({nombre:c,email:p,tel:v}))}catch{}O.cliente={nombre:o,rut:n,email:s,tel:a,objetivo:i,corNombre:c,corEmail:p,corTel:v},O.cotizId=Ko(),Ro(O.parsedCC),document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",Me()}}function Ro(t){const e=Math.round((t.piePctDefault??Le)*100),o=lt((t.descuentoDepto??0)+(t.descuentoAdicional??0)),n=lt(t.aporteInmobiliario),s=t.cuotasPieN??0,a=lt(t.pieConstPct),i=lt(t.cuotonPct),c=lt(t.upfrontPct),p=lt(t.creditoDirectoPct),[v,u,h]=Mo.map(g=>lt(g)),m=`Cuotas pie${s>0?` <span class="cp-fg-base">base ${s}</span>`:""}`,P=`Cuotón %${i===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,y=(g,C,F,w,l,b)=>`<div class="cp-fg"><label class="cp-fg-lbl">${g}</label><input id="${C}" class="cp-input" type="number" min="${w}" max="${l}" step="${b}" value="${F}" onchange="recalcCotizPanel()"></div>`;document.getElementById("cp-params-grid").innerHTML=`
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${y("Pie %","cpg-pie",e,0,100,1)}
        ${y("Plazo (años)","cpg-plazo",we,5,30,1)}
        ${y("Dcto. depto %","cpg-dcto",o,0,100,.1)}
        ${y("Aporte inmob %","cpg-aporte",n,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${y(m,"cpg-cuotas",s,0,48,1)}
        ${y("Pie const %","cpg-piecst",a,0,100,.1)}
        ${y(P,"cpg-cuoton",i,0,100,.1)}
        ${y("Upfront %","cpg-upfront",c,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${y("Crédito directo %","cpg-cdir",p,0,100,.1)}
        ${y("Plusvalía anual %","cpg-plusvalia",2,0,20,.1)}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${y("CAE escenario 1","cpg-cae1",v,0,20,.1)}
        ${y("CAE escenario 2","cpg-cae2",u,0,20,.1)}
        ${y("CAE escenario 3","cpg-cae3",h,0,20,.1)}
      </div>
    </div>`}function Oo(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:t("cpg-pie")||Le*100,plazo:t("cpg-plazo")||we,dcto:t("cpg-dcto"),aporte:t("cpg-aporte"),cuotas:t("cpg-cuotas"),piecst:t("cpg-piecst"),cuoton:t("cpg-cuoton"),upfront:t("cpg-upfront"),cdir:t("cpg-cdir"),plusvalia:t("cpg-plusvalia")||2,cae1:t("cpg-cae1")||4,cae2:t("cpg-cae2")||4.5,cae3:t("cpg-cae3")||5}}function Vo(t){const{reservaCLP:e,regla:o,depto:n,secundarios:s}=O;return{precioListaDepto:n.precio_uf,descuentoPct:t.dcto/100,descuentoAdicionalPct:0,bonoPiePct:t.aporte/100,reservaCLP:e,preciosConjuntos:s.map(a=>a.precio_uf),piePct:t.pie/100,upfrontPct:t.upfront/100,cuotasPieN:t.cuotas,cuotonPct:t.cuoton/100,piePeriodoConstruccionPct:t.piecst/100,pieCreditoDirectoPct:t.cdir/100,plazoAnios:t.plazo,tasasCAE:[t.cae1/100,t.cae2/100,t.cae3/100],valorUF:$.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:t.plusvalia/100}}function N(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function No(t,e){const{project:o,depto:n,secundarios:s}=O,a=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...s.map(i=>`${i.tipologia?i.tipologia+" ":""}DP ${i.dp}`)];document.getElementById("cp-header-title").textContent=a.join(" + "),document.getElementById("cp-results").innerHTML=Ho(t,n,s)+Go(t)+(t.pieCreditoDirectoUF>0?qo(t):"")+Jo(t,e.plazo),Wo(t,e)}function Ho(t,e,o){const n=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,s=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(e.dp))}${e.tipologia?" &mdash; "+r(e.tipologia):""}</td>
      <td>${d.uf2(t.precioListaDepto)}</td>
      <td>${n>1e-4?`<span class="cp-val-dcto">&minus;${N(n)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${d.uf2(t.precioDescDepto)}</td>
    </tr>`,a=o.map(i=>`
    <tr>
      <td class="cp-val-unit">${i.tipologia?r(i.tipologia)+" ":""}DP ${r(String(i.dp))}</td>
      <td>${d.uf2(i.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${d.uf2(i.precio_uf)}</td>
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
            <td>${d.uf2(t.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${d.uf2(t.valorVentaUF)}<br>
              <small class="cp-val-clp">${d.pesos(t.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function Go(t){let e="";if(e+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${N(t.piePct)}</span></span>
      <span class="cp-plan-val">${d.uf2(t.pieTotalUF)}<small>${d.pesos(t.pieTotalUF*t.valorUF)}</small></span>
    </div>`,e+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${d.uf2(t.reservaUF)}<small>${d.pesos(t.reservaUF*t.valorUF)}</small></span>
    </div>`,t.upfrontUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${N(t.upfrontPct)}</span></span>
        <span class="cp-plan-val">${d.uf2(t.upfrontUF)}<small>${d.pesos(t.upfrontUF*t.valorUF)}</small></span>
      </div>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${t.cuotasPieN} cuotas &times; ${d.uf2(t.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${d.uf2(t.saldoPieUF)}<small>${d.pesos(t.saldoPieCLP)}</small></span>
      </div>`),t.piePeriodoConstruccionUF>0){const n=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${N(n)}</span></span>
        <span class="cp-plan-val">${d.uf2(t.piePeriodoConstruccionUF)}<small>${d.pesos(t.piePeriodoConstruccionCLP)}</small></span>
      </div>`}t.cuotonUF>0&&(e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${d.uf2(t.cuotonUF)}<small>${d.pesos(t.cuotonCLP)}</small></span>
      </div>`);const o=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;return e+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${N(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${d.uf2(t.totalPieInmobUF)}<small>${d.pesos(t.totalPieInmobUF*t.valorUF)}</small></span>
    </div>`,t.bonoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${N(t.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${d.uf2(t.bonoPieUF)}<small>${d.pesos(t.bonoPieUF*t.valorUF)}</small></span>
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
        <span class="cp-plan-val">${d.uf2(t.pieCreditoDirectoUF)}<small>${d.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function Jo(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,n=t.escenarios.map((s,a)=>{const i=s.cuotaMensualCLP/.25;return`
      <tr${a===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(s.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${d.pesos(s.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${d.uf2(s.cuotaMensualUF)}</td>
        <td>${d.pesos(i)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${e} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${d.uf2(t.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${d.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${N(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${d.uf2(t.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${d.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${n}</tbody>
      </table>
    </div>
  </div>`}function Ko(){const t=new Date().getFullYear(),e=`_cotiz_counter_${t}`,o=parseInt(localStorage.getItem(e)||"0")+1;try{localStorage.setItem(e,String(o))}catch{}return`COT-${t}-${String(o).padStart(4,"0")}`}function Wo(t,e){const o=document.getElementById("cotiz-print-doc");if(!o||!(O!=null&&O.cliente))return;const{project:n,depto:s,secundarios:a,cliente:i,cotizId:c}=O,v=new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"}),u={vivienda:"Vivienda propia",inversion:"Inversión / arriendo",segunda:"Segunda vivienda",subsidio:"Subsidio habitacional"},h=[`${s.tipologia?s.tipologia+" ":""}DP ${s.dp} · ${d.uf2(s.precio_uf)}`,...a.map(b=>`${b.tipologia?b.tipologia+" ":""}DP ${b.dp} · ${d.uf2(b.precio_uf)}`)].map(b=>`<div class="prd-unit-line">${r(b)}</div>`).join(""),m=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,P=`<tr>
    <td>${r(String(s.dp))}${s.tipologia?" — "+r(s.tipologia):""}</td>
    <td>${d.uf2(t.precioListaDepto)}</td>
    <td>${m>1e-4?"−"+N(m):"—"}</td>
    <td>${d.uf2(t.precioDescDepto)}</td>
  </tr>`,y=a.map(b=>`<tr>
    <td>${b.tipologia?r(b.tipologia)+" ":""}DP ${r(String(b.dp))}</td>
    <td>${d.uf2(b.precio_uf)}</td><td>—</td>
    <td>${d.uf2(b.precio_uf)}</td>
  </tr>`).join("");let g="";if(g+=`<tr><td><strong>Pie total</strong> ${N(t.piePct)}</td><td>${d.uf2(t.pieTotalUF)}</td><td>${d.pesos(t.pieTotalUF*t.valorUF)}</td></tr>`,g+=`<tr class="prd-tbl-sub"><td>Reserva</td><td>${d.uf2(t.reservaUF)}</td><td>${d.pesos(t.reservaUF*t.valorUF)}</td></tr>`,t.upfrontUF>0&&(g+=`<tr class="prd-tbl-sub"><td>Upfront ${N(t.upfrontPct)}</td><td>${d.uf2(t.upfrontUF)}</td><td>${d.pesos(t.upfrontUF*t.valorUF)}</td></tr>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(g+=`<tr class="prd-tbl-sub"><td>Saldo pie — ${t.cuotasPieN} cuotas × ${d.uf2(t.valorCuotaPieUF)}/mes</td><td>${d.uf2(t.saldoPieUF)}</td><td>${d.pesos(t.saldoPieCLP)}</td></tr>`),t.piePeriodoConstruccionUF>0){const b=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;g+=`<tr><td>Pie período construcción ${N(b)}</td><td>${d.uf2(t.piePeriodoConstruccionUF)}</td><td>${d.pesos(t.piePeriodoConstruccionCLP)}</td></tr>`}t.cuotonUF>0&&(g+=`<tr><td>Cuotón</td><td>${d.uf2(t.cuotonUF)}</td><td>${d.pesos(t.cuotonCLP)}</td></tr>`);const C=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;g+=`<tr class="prd-tbl-total"><td><strong>Total pie a inmobiliaria</strong> ${N(C)}</td><td>${d.uf2(t.totalPieInmobUF)}</td><td>${d.pesos(t.totalPieInmobUF*t.valorUF)}</td></tr>`,t.bonoPieUF>0&&(g+=`<tr class="prd-tbl-aporte"><td>Aporte inmobiliaria ${N(t.aportePct)}</td><td>${d.uf2(t.bonoPieUF)}</td><td>${d.pesos(t.bonoPieUF*t.valorUF)}</td></tr>`);let F="";if(t.pieCreditoDirectoUF>0){const b=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;F=`<div class="prd-section">
      <div class="prd-section-title">Crédito Directo Inmobiliaria</div>
      <table class="prd-tbl"><tbody>
        <tr><td>Financiamiento directo ${N(b)} × valor venta</td><td>${d.uf2(t.pieCreditoDirectoUF)}</td><td>${d.pesos(t.pieCreditoDirectoCLP)}</td></tr>
      </tbody></table>
    </div>`}const w=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,l=t.escenarios.map((b,D)=>{const E=b.cuotaMensualCLP/.25;return`<tr${D===1?' class="prd-esc-hl"':""}>
      <td>CAE ${(b.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
      <td>${d.pesos(b.cuotaMensualCLP)}</td>
      <td>${d.uf2(b.cuotaMensualUF)}</td>
      <td>${d.pesos(E)}</td>
    </tr>`}).join("");o.innerHTML=`
  <div class="prd-wrap">
    <div class="prd-header">
      <img src="/images/logo.png" alt="ViveProp" class="prd-logo">
      <div class="prd-header-mid">COTIZACIÓN</div>
      <div class="prd-header-right">
        <div class="prd-cot-num">${r(c)}</div>
        <div class="prd-cot-date">${v}</div>
      </div>
    </div>

    <div class="prd-meta-row">
      <div class="prd-meta-block">
        <div class="prd-meta-title">Proyecto</div>
        <div class="prd-meta-main">${r(n.nombre)}</div>
        <div class="prd-meta-sub">${r(n.inmobiliaria)}${n.comuna?" · "+r(n.comuna):""}</div>
        <div class="prd-units-list">${h}</div>
      </div>
      <div class="prd-meta-block">
        <div class="prd-meta-title">Cliente</div>
        <div class="prd-meta-main">${r(i.nombre)}</div>
        <div class="prd-meta-sub">RUT ${r(i.rut)}</div>
        <div class="prd-meta-sub">${r(i.email)}</div>
        <div class="prd-meta-sub">${r(i.tel)}</div>
        <div class="prd-meta-obj">${u[i.objetivo]||r(i.objetivo)}</div>
      </div>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Valores</div>
      <table class="prd-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Descuento</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${P}${y}
          <tr class="prd-tbl-total"><td>Total</td><td>${d.uf2(t.precioListaTotal)}</td><td></td><td>${d.uf2(t.valorVentaUF)} <small>(${d.pesos(t.valorVentaCLP)})</small></td></tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Plan de Pago</div>
      <table class="prd-tbl">
        <thead><tr><th>Concepto</th><th>UF</th><th>$</th></tr></thead>
        <tbody>${g}</tbody>
      </table>
    </div>

    ${F}

    <div class="prd-section">
      <div class="prd-section-title">Crédito Hipotecario · ${e.plazo} años</div>
      <div class="prd-hip-summary">
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Tasación banco</span>
          <span class="prd-hip-val">${d.uf2(t.tasacionUF)}</span>
          <span class="prd-hip-sub">${d.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">LTV</span>
          <span class="prd-hip-val">${N(w)}</span>
          <span class="prd-hip-sub">× tasación</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Crédito hipotecario</span>
          <span class="prd-hip-val">${d.uf2(t.creditoHipFinalUF)}</span>
          <span class="prd-hip-sub">${d.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="prd-tbl">
        <thead><tr><th>CAE</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr></thead>
        <tbody>${l}</tbody>
      </table>
    </div>

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${r(i.corNombre)} · ${r(i.corEmail)} · ${r(i.corTel)}
      </div>
      <div class="prd-disclaimer">
        Cotización referencial — no constituye oferta formal de venta. Valores UF calculados al ${v} (1 UF = ${d.pesos(t.valorUF)}). Los dividendos son estimaciones según escenarios de tasa CAE indicados y pueden variar según condiciones del banco y perfil del solicitante.
      </div>
    </div>
  </div>`}function Zo(){O!=null&&O.cliente&&window.print()}function Yo(t,e){document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",document.getElementById("c-precio").value=t,kt=e||"";const o=document.getElementById("c-prop-info");o.innerHTML=`📦 ${r(kt)}`,o.style.display="block",window.openModule("cotiz"),Zt()}function Qo(t){const e=document.getElementById("c-pie-r"),o=document.getElementById("c-pie-n");t==="r"?o.value=e.value:e.value=o.value,document.getElementById("pie-lbl").textContent=e.value+"%",Zt()}function Zt(){const t=parseFloat(document.getElementById("c-precio").value)||0,e=parseFloat(document.getElementById("c-pie-n").value)||20,o=parseFloat(document.getElementById("c-plazo").value)||25,n=parseFloat(document.getElementById("c-tasa").value)||5,s=parseFloat(document.getElementById("c-gc").value)||0;document.getElementById("pie-lbl").textContent=e+"%";const a=document.getElementById("c-results");if(!t){a.innerHTML='<div class="empty-tool"><div class="ei">📊</div><p>Ingresa el precio para simular</p></div>';return}const i=t*e/100,c=t-i,p=n/100/12,v=o*12,u=c*p*Math.pow(1+p,v)/(Math.pow(1+p,v)-1),h=s/$.UF,m=u/.25,P=(u+h)/.25,y=[15,20,25,30];a.innerHTML=`<div class="cotiz-card">
    ${kt?`<div style="font-size:12px;font-weight:600;color:var(--brand);margin-bottom:14px">📦 ${r(kt)}</div>`:""}
    <div class="rc-hero">
      <div class="rc-big">${d.pesos(u*$.UF)}</div>
      <div class="rc-lbl">Dividendo mensual estimado</div>
      <div class="rc-pesos">${d.uf1(u)} · ${o} años al ${n}%</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${d.uf(t)}</span><span class="rcl">Precio propiedad</span><span class="rcp">${d.pesos(t*$.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${d.uf(i)} (${e}%)</span><span class="rcl">Pie inicial</span><span class="rcp">${d.pesos(i*$.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${d.uf(c)}</span><span class="rcl">Monto crédito</span><span class="rcp">${d.pesos(c*$.UF)}</span></div>
      <div class="rc-cell hi"><span class="rcv">${d.pesos(m*$.UF)}</span><span class="rcl">Renta mínima necesaria</span><span class="rcp">${s?`Con GC: ${d.pesos(P*$.UF)}`:"Regla 25%"}</span></div>
    </div>
    <div class="rc-tbl-title">Comparativa por plazo · Pie ${e}% · Tasa ${n}%</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th><th>Total pagado</th></tr></thead>
      <tbody>${y.map(g=>{const C=g*12,F=c*p*Math.pow(1+p,C)/(Math.pow(1+p,C)-1);return`<tr class="${g==o?"tr-hl":""}"><td>${g} años</td><td><strong>${d.pesos(F*$.UF)}</strong></td><td>${d.uf1(F)}</td><td>${d.pesos(F/.25*$.UF)}</td><td>${d.uf(F*C)}</td></tr>`}).join("")}</tbody>
    </table>
    ${s?`<p style="font-size:11px;color:var(--g400);margin-top:10px;font-style:italic">* GC de ${d.pesos(s)}/mes incluidos en renta necesaria</p>`:""}
  </div>`}const Dt=xt,Xo=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let bt=[],Nt=null,Q=1,Ue="lista",yt=null,nt=null,rt=[],et=0;function Se(t){return t?Xo.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function tn(){if(!$.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set($.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();de("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),jt()}function jt(){var v,u,h,m,P,y;if(!$.PROJECTS.length)return;const t=(((v=document.getElementById("pri-search"))==null?void 0:v.value)||"").toLowerCase(),e=pe("pri"),o=((u=document.getElementById("pri-entrega"))==null?void 0:u.value)||"",n=parseFloat((h=document.getElementById("pri-precio-min"))==null?void 0:h.value)||0,s=parseFloat((m=document.getElementById("pri-precio-max"))==null?void 0:m.value)||0,a=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(g=>parseInt(g.dataset.val)),i=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(g=>parseInt(g.dataset.val)),c=((P=document.getElementById("pri-est"))==null?void 0:P.checked)||!1,p=((y=document.getElementById("pri-bod"))==null?void 0:y.checked)||!1;Nt=window._priMaxUF||null,bt=$.PROJECTS.filter(g=>{var w;let C=(g.unidades||[]).filter(l=>l.disponible&&!dt(l.tipologia));if(!C.length||t&&!`${g.nombre||""} ${g.inmobiliaria||""} ${g.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(g.comuna)||o&&!((w=g.entrega)!=null&&w.toLowerCase().includes(o.toLowerCase()))||c&&!(g.unidades||[]).some(l=>l.disponible&&/estac|parking|reja/i.test(l.tipologia||""))||p&&!(g.unidades||[]).some(l=>l.disponible&&/bode/i.test(l.tipologia||""))||a.length&&(C=C.filter(l=>{const b=parseInt(l.dormitorios)||0;return a.some(D=>D===4?b>=4:b===D)}),!C.length)||i.length&&(C=C.filter(l=>{const b=parseInt(l.banos)||0;return i.some(D=>D===3?b>=3:b===D)}),!C.length))return!1;const F=Math.min(...C.map(l=>l.precio_uf).filter(l=>l>0));return!(n&&F<n||s&&F>s||Nt&&!C.some(l=>l.precio_uf<=Nt))}),Q=1,Te(),Ue==="mapa"&&$e(bt)}function en(t){const e=Math.max(1,Math.ceil(bt.length/Dt));Q=Math.min(Math.max(1,Q+t),e),Te(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Te(){const t=document.getElementById("pri-grid"),e=bt.length,o=Math.max(1,Math.ceil(e/Dt));Q>o&&(Q=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${Q} / ${o}`,document.getElementById("pri-prev").disabled=Q<=1,document.getElementById("pri-next").disabled=Q>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${e.toLocaleString("es-CL")} proyectos · ${$.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const s=bt.slice((Q-1)*Dt,Q*Dt);t.innerHTML=s.map(a=>{const i=(a.unidades||[]).filter(g=>g.disponible&&!dt(g.tipologia)),c=i.map(g=>g.precio_uf).filter(g=>g>0),p=c.length?Math.min(...c):0,v=c.length?Math.max(...c):0,u=a.foto_portada||"",h=[...new Set(i.map(g=>{const C=parseInt(g.dormitorios)||0;return C===0?"Estudio":C+"D"}))].sort().slice(0,3).join(", "),m=i.reduce((g,C)=>C.m2_interior&&C.m2_interior<g?C.m2_interior:g,9999),P=m<9999?m.toFixed(0)+" m²":"—",y=$.CC_DATA[a.id]||Se(a.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(a.id)}')">
      <div class="prj-img" style="${u?`background-image:url('${u}');background-size:cover;background-position:center`:""}">
        ${u?"":'<div class="prj-img-icon">🏗️</div>'}
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
          <div class="prj-stat"><div class="prj-stat-v">${P}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${i.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${p?"UF "+p.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${v>p?`<span class="prj-hasta">— ${v.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(a.id)}')">Ver proyecto →</button>
          ${y?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function on(t){Ue=t,po(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"){lo();const s=ro();setTimeout(()=>s&&s.invalidateSize(),120),$e(bt)}}function De(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),n=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),n&&(n.style.display=e===t?"flex":"none")}),t==="map"&&mo(yt)}function nn(t){const e=t.unidades||[],o=e.filter(f=>f.disponible&&!dt(f.tipologia)),n=o.map(f=>f.precio_uf).filter(f=>f>0),s=n.length?Math.min(...n):0,a=n.length?Math.max(...n):0,i=o.map(f=>f.m2_interior).filter(f=>f>0),c=i.length?Math.min(...i):0,p=i.length?Math.max(...i):0,v=[...new Set(o.map(f=>{const T=parseInt(f.dormitorios)||0;return T===0?"Estudio":T+"D"}))].sort(),u=f=>f.toLocaleString("es-CL",{maximumFractionDigits:0}),h=s?a>s?`UF ${u(s)} – ${u(a)}`:`UF ${u(s)}`:" — ",m=c?p>c?`${c.toFixed(0)} – ${p.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",P=[t.direccion,t.comuna].filter(Boolean).join(", ");let y="";P&&(y+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r(P)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
    </div>`),y+=`<div class="pm-stats-grid">
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Disponibles</span>
      <span class="pm-stat-card-val">${o.length}</span>
      <span class="pm-stat-card-sub">unidades</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Tipologías</span>
      <span class="pm-stat-card-val" style="font-size:${v.length>3?"11px":"15px"}">${v.join(", ")||"—"}</span>
      <span class="pm-stat-card-sub">${v.length} tipo${v.length!==1?"s":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">M² útil</span>
      <span class="pm-stat-card-val" style="font-size:${p>c?"11px":"15px"}">${m}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${a>s?"11px":"15px"}">${h}</span>
      <span class="pm-stat-card-sub">${s?"en UF":""}</span>
    </div>
  </div>`;const g=[...new Set(o.map(f=>parseInt(f.piso)).filter(f=>f>0))].sort((f,T)=>f-T),C=[...new Set(o.map(f=>(f.orientacion||"").trim()).filter(Boolean))],F=o.map(f=>f.m2_terraza).filter(f=>f>0),w=[];if(g.length>0){const f=g.length===1?`Piso ${g[0]}`:`Pisos ${g[0]} – ${g[g.length-1]}`;w.push(`<div class="pm-detail-pill"><strong>${f}</strong></div>`)}if(C.length>0&&w.push(`<div class="pm-detail-pill">🧭 <strong>${C.slice(0,3).join(" · ")}</strong></div>`),F.length>0){const f=Math.min(...F).toFixed(0);w.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${f} m²</strong></div>`)}w.length&&(y+=`<div class="pm-detail-row">${w.join("")}</div>`);const l=e.filter(f=>dt(f.tipologia)&&/estac|parking/i.test(f.tipologia||"")),b=e.filter(f=>dt(f.tipologia)&&/bode/i.test(f.tipologia||"")),D=l.filter(f=>f.disponible),E=b.filter(f=>f.disponible),S=[];if(l.length>0){const f=D.map(B=>B.precio_uf).filter(B=>B>0),T=f.length?Math.min(...f):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${D.length} disp.</span>
        <span class="pm-extra-sub">${T?`Desde UF ${u(T)}`:`${l.length} en total`}</span>
      </div>
    </div>`)}if(b.length>0){const f=E.map(B=>B.precio_uf).filter(B=>B>0),T=f.length?Math.min(...f):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${E.length} disp.</span>
        <span class="pm-extra-sub">${T?`Desde UF ${u(T)}`:`${b.length} en total`}</span>
      </div>
    </div>`)}S.length&&(y+=`<div class="pm-extras-row">${S.join("")}</div>`);const x=$.CC_DATA[t.id];if(x&&x.campos&&x.campos.length){const f=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],T=[];for(const B of f){const J=x.campos.find(([W])=>W===B);if(J&&T.push(J),T.length===6)break}T.length<6&&x.campos.filter(([B])=>!T.find(([J])=>J===B)).slice(0,6-T.length).forEach(B=>T.push(B)),y+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${T.map(([B,J])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(B)}</span>
          <span class="pm-cc-prev-val">${r(J)}</span>
        </div>`).join("")}
      </div>
      ${x.nota?`<div class="pm-cc-nota">${r(x.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=y}function _e(t){const e=document.getElementById("pm-cc-inner"),o=$.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const s=o.campos.filter(([,i])=>i.length<=60),a=o.campos.filter(([,i])=>i.length>60);s.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',s.forEach(([i,c])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(i)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),n+="</div>"),a.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',a.forEach(([i,c])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(i)}</div>`,n+=`<div class="pm-cc-val-long">${r(c)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(s=>{n+=`<th>${r(s)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(s=>{n+="<tr>",s.forEach(a=>{n+=`<td>${r(a||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=n}function sn(t){const e=$.PROJECTS.find(m=>m.id===t);if(!e)return;yt=e,nt=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),De("gal"),nn(e),rt=e.fotos||[],et=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),s=document.getElementById("pm-gal-nophoto"),a=document.getElementById("pm-gal-thumbs"),i=document.getElementById("pm-gal-counter");n.style.display="none",rt.length?(s.style.display="none",Yt(0),a.innerHTML=rt.map((m,P)=>`<img src="${m}" onclick="pmShowGalPhoto(${P})" ${P===0?'class="active"':""}>`).join("")):(o.style.display="none",s.style.display="flex",a.innerHTML="",i.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(m=>`<a class="pm-pdf-item" href="${m.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(m.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const p=document.getElementById("pm-tab-cc"),v=$.CC_DATA[e.id],u=Se(e.inmobiliaria).length>0;v||u?(p.style.display="",_e(e.id)):p.style.display="none";const h=(e.unidades||[]).filter(m=>m.disponible&&!dt(m.tipologia));document.getElementById("pm-units-body").innerHTML=h.map(m=>`
    <tr>
      <td>${r(m.dp)}</td>
      <td>${r(m.tipologia)}</td>
      <td>${r(m.piso||"—")}</td>
      <td>${m.m2_interior?m.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${m.m2_terraza?m.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(m.orientacion||"—")}</td>
      <td class="td-precio">${d.uf(m.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(m.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Yt(t){var n;et=Math.max(0,Math.min(t,rt.length-1));const e=document.getElementById("pm-gal-img");e.src=rt[et],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${et+1} / ${rt.length}`,document.getElementById("pm-gal-prev").disabled=et===0,document.getElementById("pm-gal-next").disabled=et===rt.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===et)),(n=document.getElementById("pm-gal-thumbs").children[et])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function an(t){Yt(et+t)}function Qt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",yt=null,nt=null}function cn(t){const e=yt,o=(e.unidades||[]).find(i=>i.dp===t);if(!o)return;nt=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(e.unidades||[]).filter(i=>i.disponible&&dt(i.tipologia)),s=document.getElementById("pm-extras-wrap"),a=document.getElementById("pm-extras-list");n.length?(s.style.display="",a.innerHTML=n.map(i=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${i.precio_uf}" data-dp="${r(i.dp)}" data-label="${r(i.tipologia)} DP ${r(i.dp)}">
        <span class="extra-label">${r(i.tipologia)} — DP ${r(i.dp)}</span>
        <span class="extra-price">${d.uf(i.precio_uf)}</span>
      </label>`).join("")):(s.style.display="none",a.innerHTML=""),Ae(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function Ae(){if(!nt)return;let t=nt.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=d.uf(t)}function ln(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),nt=null}function rn(){if(!nt||!yt)return;const t=yt,e=nt,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const s=(t.unidades||[]).find(a=>a.dp===n.dataset.dp);s&&o.push(s)}),Qt(),Be({project:t,depto:e,secundarios:o})}function dn(t){t.classList.toggle("active"),jt()}let wt=null;function pn(){const t=parseFloat(document.getElementById("p-renta").value)||0,e=parseFloat(document.getElementById("p-ahorro").value)||0,o=parseFloat(document.getElementById("p-deudas").value)||0,n=parseFloat(document.getElementById("p-plazo").value)||25,s=parseFloat(document.getElementById("p-tasa").value)||5,a=document.getElementById("p-results");if(document.getElementById("p-btns").style.display="none",!t){a.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente</p></div>';return}const i=s/100/12,c=n*12,p=t*.25-o;if(p<=0){a.innerHTML='<div class="warn-card">⚠️ Las deudas mensuales superan la capacidad de pago del 25% de la renta.</div>';return}const v=(Math.pow(1+i,c)-1)/(i*Math.pow(1+i,c)),u=p*v/$.UF,h=e/$.UF,m=Math.min(u/.8,u+h),P=m*.2,y=Math.max(0,P-h);wt=m;const g=[15,20,25,30];a.innerHTML=`<div class="perfil-card">
    <div class="rc-hero">
      <div class="rc-big">${d.uf(m)}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${d.pesos(m*$.UF)}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${d.pesos(p)}</span><span class="rcl">Dividendo máximo / mes</span></div>
      <div class="rc-cell"><span class="rcv">${d.uf(u)}</span><span class="rcl">Crédito hipotecario máx.</span></div>
      <div class="rc-cell"><span class="rcv">${d.uf(P)}</span><span class="rcl">Pie requerido (20%)</span></div>
      <div class="rc-cell ${y>0?"warn":"ok"}">
        <span class="rcv">${y>0?"⚠️ Faltan "+d.uf(y):"✅ Ahorro suficiente"}</span>
        <span class="rcl">${d.uf(h)} disponible</span>
      </div>
    </div>
    <div class="rc-tbl-title">Simulación por plazo · Tasa ${s}% anual</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Crédito máx.</th><th>Precio máx.</th></tr></thead>
      <tbody>${g.map(C=>{const F=C*12,w=(Math.pow(1+i,F)-1)/(i*Math.pow(1+i,F)),l=p*w/$.UF,b=Math.min(l/.8,l+h);return`<tr class="${C==n?"tr-hl":""}"><td>${C} años</td><td>${d.pesos(p)}</td><td>${d.uf(l)}</td><td><strong>${d.uf(b)}</strong></td></tr>`}).join("")}</tbody>
    </table>
  </div>`,document.getElementById("p-btns").style.display="flex"}function un(t){wt&&(t==="sec"?(window._secMaxUF=wt,window.secFilter(),window.openModule("sec"),qt("sec")):(window._priMaxUF=wt,window.priFilter(),window.openModule("pri"),qt("pri")))}function qt(t){var n;(n=document.getElementById("bb-"+t))==null||n.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Filtrando por presupuesto: <strong>${d.uf(wt)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function mn(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}const gn={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:ke,mcFilter:ue,mcOpen:Ke,mcClose:We,mcSelect:Ze,mcRemove:Ye,secFilter:Tt,secPage:ho,setSecView:bo,openDetail:xe,openSecDetail:yo,showDpPhoto:Kt,navDp:Gt,closeDetail:Wt,shareProperty:Fo,downloadPhotos:Po,printFicha:Eo,openVideo:xo,copyVideoLink:Io,closeVideo:Ie,toggleSecPill:t=>{t.classList.toggle("active"),Tt()},togglePriPill:t=>{t.classList.toggle("active"),jt()},toggleTipPill:t=>{t.classList.toggle("active"),Tt()},toggleDormPill:dn,priFilter:jt,priPage:en,setPriView:on,openProject:sn,closeProjModal:Qt,pmTab:De,renderCC:_e,pmShowGalPhoto:Yt,pmGalNav:an,selectProjUnit:cn,pmUpdateTotal:Ae,pmBack:ln,pmCotizar:rn,calcPerfil:pn,searchFromPerfil:un,showBudgetBanner:qt,clearBudget:mn,cotizFromProp:Be,syncPie:Qo,calcCotiz:Zt,recalcCotizPanel:Me,volverDesdeCotiz:Do,submitClientForm:zo,formatRutInput:jo,clearCCFError:ko,printCotiz:Zo});function ke(t){document.querySelectorAll(".module").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(n=>n.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=gn[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Wt(),t.key==="ArrowLeft"&&Gt(-1),t.key==="ArrowRight"&&Gt(1);return}t.key==="Escape"&&Ie()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Wt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Qt()});async function vn(){try{const[t,e,o,n,s,a]=await Promise.all([gt.uf(),gt.stock(),gt.projects(),gt.cc(),gt.geocodes(),gt.priGeo()]);$.UF=t.valor??$.UF,$.STOCK=e??[],$.PROJECTS=o??[],$.CC_DATA=n??{};const i=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(i&&(i.textContent=$.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&t.fecha){const p=new Date(t.fecha);c.textContent=p.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}s&&Object.assign($._GC,s),a&&Object.assign($._GC,a);try{const p=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign($._GC,p)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}vo(),tn(),ke("sec")}vn();
