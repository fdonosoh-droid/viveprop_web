(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const C={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},It=24,le="/api";async function mt(t){const e=await fetch(le+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const gt={stock:()=>mt("/stock"),projects:()=>mt("/projects"),cc:()=>mt("/cc"),uf:()=>mt("/uf"),geocodes:()=>mt("/geocodes"),priGeo:()=>mt("/pri-geocodes"),reloadData:()=>fetch(le+"/data/reload",{method:"POST"}).then(t=>t.json())},Lt={sec:new Set,pri:new Set};let re=[],de=[];function pe(t,e){t==="sec"?re=e:de=e}function ue(t){return Lt[t]}function me(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?re:de,n=Lt[t],s=document.getElementById(t+"-mc-dropdown"),i=o.filter(a=>(!e||a.toLowerCase().includes(e))&&!n.has(a));if(!i.length){s.style.display="none";return}s.innerHTML=i.slice(0,14).map(a=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${a.replace(/'/g,"\\'")}');return false">${a}</div>`).join(""),s.style.display="block"}function Ye(t){me(t)}function Qe(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function Xe(t,e){Lt[t].add(e),ge(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function to(t,e){Lt[t].delete(e),ge(t),t==="sec"?window.secFilter():window.priFilter()}function ge(t){document.getElementById(t+"-mc-tags").innerHTML=[...Lt[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function M(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const u={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function fe(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function eo(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function oo(t){var s,i;const e=(t||"").toLowerCase(),o=parseInt((s=e.match(/(\d+)d/))==null?void 0:s[1])||0,n=parseInt((i=e.match(/(\d+)b/))==null?void 0:i[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:n}}function dt(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function no(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const io={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let ft=null,_t=null,vt=null,At=null,tt=null,wt=null;function Jt(t){const e=`${t.direccion}|${t.comuna}`;if(C._GC[e]!==void 0)return C._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function so(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function ve(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function ao(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function co(){ft||(ft=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ft),_t=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ft.addLayer(_t))}function lo(){return ft}function he(t){if(!ft)return;_t.clearLayers();const e=[];t.forEach(o=>{const n=Jt(o);n?ye(o,n):n===void 0&&e.push(o)}),e.length&&po(e)}let be="lista";function ro(t){be=t}function ye(t,e){const o=M(t.precioSinBono),n=M(t.m2total)||M(t.m2interior),s=io[t.estado]||"#94A3B8",i=fe(t.estado),a=`<div class="map-popup">
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
  </div>`,c=L.marker(e,{icon:so(s)});c.bindPopup(a,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(v=>v.json()).then(v=>{var f,$;const p=(f=v.data)==null?void 0:f[0],g=(($=p==null?void 0:p.fotos_originales)!=null&&$.length?p.fotos_originales:p==null?void 0:p.fotos)||[];if(g.length){const b=document.getElementById("mpp-"+t.id);if(b){const P=ao(t.id,g[0]);b.style.backgroundImage=`url('${P}')`,b.textContent=""}}}).catch(()=>{})}),_t.addLayer(c)}async function po(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&be==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;n.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const l=encodeURIComponent(`${a.direccion}, ${a.comuna}, Santiago, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${l}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const g=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=g,C._GC[c]=g,ye(a,g)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(v=>setTimeout(v,1200))}e.style.display="none"}function uo(){vt||(vt=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(vt),At=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),vt.addLayer(At))}function mo(){return vt}let $e="lista";function go(t){$e=t}function Ce(t){if(!vt)return;At.clearLayers();const e=[];t.forEach(o=>{const n=Jt({direccion:o.direccion,comuna:o.comuna});n?Fe(o,n):n===void 0&&e.push(o)}),e.length&&fo(e)}function Fe(t,e){const{isExtra:o}=window._mapUtils||{},n=(t.unidades||[]).filter($=>$.disponible&&!/estac|bode|parking|reja|local\s/i.test($.tipologia||"")),s=n.map($=>$.precio_uf).filter($=>$>0),i=s.length?Math.min(...s):0,a=s.length?Math.max(...s):0,c=[...new Set(n.map($=>{const b=parseInt($.dormitorios)||0;return b===0?"Estudio":b+"D"}))].sort().slice(0,3).join(", "),l=t.foto_portada||"",v=l&&(()=>{try{return decodeURI(l),l}catch{return""}})(),p=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),g=L.marker(e,{icon:p}),f=`<div class="map-popup">
    <div class="mp-photo" ${v?`style="background-image:url('${v}')"`:""}>${v?"":"🏗️"}</div>
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
  </div>`;g.bindPopup(f,{className:"lf-popup",maxWidth:270,closeButton:!1}),At.addLayer(g)}async function fo(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let i=0;i<t.length&&$e==="mapa";i++){const a=t[i],c=`${a.direccion}|${a.comuna}`;n.textContent=`Ubicando ${i+1} de ${t.length}`,o.style.width=`${Math.round((i+1)/t.length*100)}%`;const l=encodeURIComponent(`${a.direccion||a.nombre}, ${a.comuna||""}, Chile`);try{const p=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${l}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(p[0]){const g=[parseFloat(p[0].lat),parseFloat(p[0].lon)];s[c]=g,C._GC[c]=g,Fe(a,g)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(v=>setTimeout(v,1200))}e.style.display="none"}function vo(t){if(!t)return;tt?tt.invalidateSize():(tt=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(tt)),wt&&(tt.removeLayer(wt),wt=null);const e=Jt({direccion:t.direccion,comuna:t.comuna});e?Pe(t,e):ho(t),setTimeout(()=>{tt&&tt.invalidateSize()},200)}function Pe(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});wt=L.marker(e,{icon:o}).addTo(tt),wt.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),tt.setView(e,15)}async function ho(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const s=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let i={};try{i=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}i[`${t.direccion}|${t.comuna}`]=s;try{localStorage.setItem("_geo_cache",JSON.stringify(i))}catch{}C._GC[`${t.direccion}|${t.comuna}`]=s,Pe(t,s)}}catch{}}let bt=[],Z=1,Ee="lista",Ot={},Et=null,G=[],Y=0,J=null,K=null,Ht="";function bo(){if(!C.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set(C.STOCK.map(e=>e.comuna).filter(Boolean))].sort();pe("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Tt()}function Tt(){var $,b,P,F,y,I,m;if(!C.STOCK.length)return;const t=((($=document.getElementById("sec-search"))==null?void 0:$.value)||((b=document.getElementById("sec-search-top"))==null?void 0:b.value)||"").toLowerCase(),e=ue("sec"),o=parseFloat((P=document.getElementById("sec-precio-min"))==null?void 0:P.value)||0,n=parseFloat((F=document.getElementById("sec-precio-max"))==null?void 0:F.value)||0,s=((y=document.getElementById("sec-op"))==null?void 0:y.checked)||!1,i=((I=document.getElementById("sec-est"))==null?void 0:I.checked)||!1,a=((m=document.getElementById("sec-bod"))==null?void 0:m.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(d=>parseInt(d.dataset.val)),l=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(d=>parseInt(d.dataset.val)),v=[...document.querySelectorAll(".sec-estado-cb")],p=v.filter(d=>d.checked).map(d=>d.value),g=p.length===v.length,f=window._secMaxUF||null;bt=C.STOCK.filter(d=>{if(t&&!`${d.condominio||""} ${d.direccion||""} ${d.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(d.comuna)||s&&!d.oportunidad||i&&(!d.est||d.est==="0")||a&&(!d.bod||d.bod==="0")||!g&&!p.some(x=>no(d.estado,x)))return!1;const{dorm:B,banos:E}=oo(d.tipologia);if(c.length&&!c.some(x=>x===4?B>=4:B===x)||l.length&&!l.some(x=>x===3?E>=3:E===x))return!1;const _=parseFloat((d.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&_<o||n&&_>n||f&&_>f)}),Z=1,Ee==="mapa"?he(bt):xe()}function xe(){const t=document.getElementById("sec-grid"),e=bt.length,o=Math.max(1,Math.ceil(e/It));Z>o&&(Z=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${Z} / ${o}`,document.getElementById("sec-prev").disabled=Z<=1,document.getElementById("sec-next").disabled=Z>=o;const n=C.STOCK.length,s=C.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,i=document.getElementById("tb-stats");i&&(i.textContent=`${s.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const a=bt.slice((Z-1)*It,Z*It);if(!a.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=a.map(c=>{const l=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),v=c.bonoPct>0,p=c.m2interior||c.m2total||"—",g=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",f=fe(c.estado),$=eo(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${$}">${f}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(p)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(g)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${l?"UF "+l.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${v?`<span class="pc-bono-badge">✅ Bono ${c.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(c.id)}')">Ver ficha →</button>
          ${c.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(c.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),Et&&Et.disconnect(),Et=new IntersectionObserver(c=>{c.forEach(l=>{if(!l.isIntersecting)return;const v=l.target.id.replace("pcimg-","");yo(v),Et.unobserve(l.target)})},{rootMargin:"150px"}),a.forEach(c=>{const l=document.getElementById("pcimg-"+c.id);l&&Et.observe(l)})}async function yo(t){var o,n;const e=document.getElementById("pcimg-"+t);if(e){if(Ot[t]){ie(e,Ot[t]);return}try{const i=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],a=((n=i==null?void 0:i.fotos_originales)!=null&&n.length?i.fotos_originales:i==null?void 0:i.fotos)||[];if(a.length){Ot[t]=a[0];const c=document.getElementById("pcimg-"+t);c&&ie(c,a[0],a.length)}}catch{}}}function ie(t,e,o){const n=e.replace(/^https?:\/\//,""),s=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${s}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const i=t.querySelector(".pc-img-icon");if(i&&(i.style.display="none"),o>1){const a=t.id.match(/pcimg-(.+)/);if(a){const c=document.getElementById("pcfc-"+a[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function $o(t){const e=Math.max(1,Math.ceil(bt.length/It));Z=Math.min(Math.max(1,Z+t),e),xe(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function Co(t){Ee=t,ro(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(co(),setTimeout(()=>lo().invalidateSize(),120),he(bt))}async function Ie(t){var n,s,i;if(J=C.STOCK.find(a=>a.id===t)||null,!J)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",G=[],Y=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=J;try{K=((s=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:s[0])||null}catch{K=null}const o=((i=K==null?void 0:K.fotos_originales)!=null&&i.length?K.fotos_originales:K==null?void 0:K.fotos)||[];if(o.length)G=o,document.getElementById("dp-spin").style.display="none",Kt(0),document.getElementById("dp-thumbs").innerHTML=o.map((a,c)=>{const l=a.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(l)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const a=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",a.appendChild(c)}Po(e,K)}function Fo(t){Ie(t)}function Kt(t){var n;Y=Math.max(0,Math.min(t,G.length-1));const e=document.getElementById("dp-img"),o=G[Y].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${Y+1} / ${G.length}`,document.getElementById("dp-prev").disabled=Y===0,document.getElementById("dp-next").disabled=Y===G.length-1,document.querySelectorAll(".dp-thumbs img").forEach((s,i)=>s.classList.toggle("active",i===Y)),(n=document.getElementById("dp-thumbs").children[Y])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Gt(t){Kt(Y+t)}function Po(t,e){var P;const o=M(t.precioSinBono),n=M(t.m2total)||M(e==null?void 0:e.superficie),s=M(t.m2interior)||M(e==null?void 0:e.m2_utiles),i=M(t.m2terraza)||M(e==null?void 0:e.m2_terraza),a=(e==null?void 0:e.dormitorios)??"",c=(e==null?void 0:e.banios)??"",l=(e==null?void 0:e.piso)??"",v=((P=e==null?void 0:e.unitggcc)==null?void 0:P.monto)||(e==null?void 0:e.ggcc)||"",p=(e==null?void 0:e.youtube_video_id)||"",g=(e==null?void 0:e.espacios)||"",f=(e==null?void 0:e.building_finishes)||[],$=(t.oportunidad||"").toLowerCase().includes("oportunidad"),b=g?g.split(",").map(F=>F.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
    <div class="detail-top">
      <div>
        <div class="detail-title">${r(t.condominio||t.direccion||"—")}</div>
        <div class="detail-addr">📍 ${r(t.direccion||"—")} · ${r(t.comuna||"")}${t.dp?" · DP "+r(t.dp):""}</div>
      </div>
      <div class="detail-badges">
        ${$?'<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>':""}
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
      ${l!==""?`<div class="spec-card"><div class="sv">Piso ${l}</div><div class="sl">Nivel</div></div>`:""}
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
        ${o?`<div class="pc-sub">$${Math.round(o*C.UF).toLocaleString("es-CL")}</div>`:""}
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
    <div class="dt-amenities">${b.map(F=>`<span class="dt-amenity">${r(F)}</span>`).join("")}</div>`:""}
    ${f.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${f.map(F=>{var d;const y=String(F).split(":"),I=((d=y[0])==null?void 0:d.trim())||"",m=y.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(I)}</div><div class="dt-finish-v">${r(m)}</div></div>`}).join("")}</div>`:""}
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
    ${Eo(t)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizSecProp('${r(t.id)}')">📊 Cotizar</button>
      ${t.video?`<button class="btn-fotos" onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(t.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${G.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${G.length})</button>`:""}
    </div>`}function Eo(t){const e=t.condominio||t.direccion;if(!e||!C.STOCK.length)return"";const o=C.STOCK.filter(s=>s.id!==t.id&&(s.condominio||s.direccion)===e);if(!o.length)return"";const n=o.map(s=>{const i=M(s.precioSinBono),a=M(s.m2total)||M(s.m2interior),c=[];return s.dp&&c.push("DP "+s.dp),a&&c.push(a.toFixed(0)+" m²"),s.orientacion&&s.orientacion!=="-"&&c.push(s.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(s.id)}')">
      <div class="ur-tipo">${r(s.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${i?i.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function Wt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",G=[],Y=0,J=null,K=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function xo(t){const e=J;if(!e)return;const o=M(e.precioSinBono),n=M(e.m2total)||M(e.m2interior),s=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),i=`https://wa.me/?text=${encodeURIComponent(s)}`,a=document.createElement("div");a.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",a.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${s}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${i}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(a),a.addEventListener("click",c=>{c.target===a&&a.remove()})}async function Io(){if(!G.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),n.style.width="0%";const s=new JSZip,i=s.folder("fotos-propiedad"),a=G.length;async function c(g){try{const f=await fetch(ve(g));if(f.ok)return await f.blob()}catch{}try{const f=await fetch(g,{mode:"cors"});if(f.ok)return await f.blob()}catch{}return null}let l=0;for(let g=0;g<a;g++){o.textContent=`Descargando foto ${g+1} de ${a}…`,n.style.width=`${Math.round(g/a*90)}%`;const f=await c(G[g]);if(f){const $=f.type.includes("png")?"png":"jpg";i.file(`foto-${String(g+1).padStart(2,"0")}.${$}`,f),l++}}o.textContent="Generando ZIP…",n.style.width="95%";const v=await s.generateAsync({type:"blob"});if(n.style.width="100%",l===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`;return}const p=document.createElement("a");p.href=URL.createObjectURL(v),p.download=`fotos-${((J==null?void 0:J.condominio)||(J==null?void 0:J.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,p.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${G.length})`},800)}async function wo(){var Pt;if(!J)return;const t=J,e=K,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const s=M(t.precioSinBono),i=M(t.m2total)||M(e==null?void 0:e.superficie),a=M(t.m2interior)||M(e==null?void 0:e.m2_utiles),c=M(t.m2terraza)||M(e==null?void 0:e.m2_terraza),l=(e==null?void 0:e.dormitorios)??"",v=(e==null?void 0:e.banios)??"",p=(e==null?void 0:e.piso)??"",g=((Pt=e==null?void 0:e.unitggcc)==null?void 0:Pt.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(D=>D.trim()).filter(Boolean),e!=null&&e.building_finishes;const f=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),$=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function b(D){for(const A of[ve(D),D])try{const j=await fetch(A);if(!j.ok)continue;const R=await j.blob();return await new Promise(k=>{const O=new FileReader;O.onload=X=>k(X.target.result),O.readAsDataURL(R)})}catch{}return null}o.textContent="⏳ Cargando logo…";const P=await b("images/logo.png");o.textContent="⏳ Cargando fotos…";const y=(await Promise.all(G.slice(0,5).map(b))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:I}=window.jspdf,m=new I({unit:"mm",format:"a4",orientation:"portrait"}),d=210,B=297,E=10,_=190,x=[67,56,202],h=[107,114,128],S=[249,250,251],w=[255,255,255],q=[17,24,39],W=[5,150,105],Bt=[209,250,229],ot=D=>m.setFillColor(D[0],D[1],D[2]),z=D=>m.setTextColor(D[0],D[1],D[2]),pt=(D,A,j,R,k,O)=>{ot(O),m.roundedRect(D,A,j,R,k,k,"F")},St=(D,A)=>(ot([229,231,235]),m.rect(E,A,_,.3,"F"),m.setFontSize(7.5),m.setFont("helvetica","bold"),z(h),m.text(D.toUpperCase(),E,A+4.5),A+8);let T=0;ot(x),m.rect(0,0,d,22,"F"),P?(pt(E-1,3,44,15,2.5,w),m.addImage(P,"PNG",E+1,5,40,7.4,void 0,"FAST")):(m.setFont("helvetica","bold"),m.setFontSize(16),z(w),m.text("ViveProp",E,14)),m.setFont("helvetica","normal"),m.setFontSize(8.5),z([200,200,230]),m.text("Ficha de Propiedad",d-E,10,{align:"right"}),m.text($,d-E,16,{align:"right"}),T=22,ot([238,242,255]),m.rect(0,T,d,32,"F"),m.setFont("helvetica","bold"),m.setFontSize(15),z(q);const it=t.condominio||t.direccion||"—";m.text(it.length>38?it.slice(0,36)+"…":it,E,T+11),m.setFont("helvetica","normal"),m.setFontSize(9),z(h);const Ct=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(m.text(Ct.length>55?Ct.slice(0,53)+"…":Ct,E,T+18),m.setFont("helvetica","bold"),m.setFontSize(20),z(x),m.text(s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",d-E,T+13,{align:"right"}),m.setFontSize(8),z(h),m.setFont("helvetica","normal"),m.text("Precio sin bono pie",d-E,T+8,{align:"right"}),t.bonoPct>0&&(pt(d-E-42,T+18,42,9,2,Bt),m.setFont("helvetica","bold"),m.setFontSize(8),z(W),m.text(`Acepta Bono Pie ${t.bonoPct}%`,d-E-21,T+23.5,{align:"center"})),T+=34,y.length){const R=y.length>1?118:_,k=_-R-2;try{m.addImage(y[0],"JPEG",E,T,R,52,void 0,"FAST")}catch{}if(y[1])try{m.addImage(y[1],"JPEG",E+R+2,T,k,25,void 0,"FAST")}catch{}if(y[2])try{m.addImage(y[2],"JPEG",E+R+2,T+25+2,k,25,void 0,"FAST")}catch{}if(T+=54,y[3]||y[4]){const O=y[4]?(_-2)/2:_;if(y[3])try{m.addImage(y[3],"JPEG",E,T,O,32,void 0,"FAST")}catch{}if(y[4])try{m.addImage(y[4],"JPEG",E+O+2,T,O,32,void 0,"FAST")}catch{}T+=34}}T+=4,T=St("Características",T);const ut=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,i?{v:i.toFixed(0)+" m²",l:"Superficie"}:null,a?{v:a.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,l!==""?{v:l+" dorm.",l:"Dormitorios"}:null,v!==""?{v:v+" baños",l:"Baños"}:null,p!==""?{v:"Piso "+p,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,g?{v:"$"+Number(g).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),st=4,at=(_-(st-1)*3)/st,Ft=14;ut.forEach((D,A)=>{const j=A%st,R=Math.floor(A/st),k=E+j*(at+3),O=T+R*(Ft+3);pt(k,O,at,Ft,2,S),m.setFont("helvetica","bold"),m.setFontSize(9),z(q),m.text(String(D.v).slice(0,18),k+at/2,O+6.5,{align:"center"}),m.setFont("helvetica","normal"),m.setFontSize(7),z(h),m.text(D.l,k+at/2,O+11,{align:"center"})}),T+=Math.ceil(ut.length/st)*(Ft+3)+4,ot(x),m.rect(0,B-16,d,16,"F"),P?(pt(E-1,B-14,33,11,2,w),m.addImage(P,"PNG",E+1,B-12.5,29,5.4,void 0,"FAST")):(m.setFont("helvetica","bold"),m.setFontSize(11),z(w),m.text("ViveProp",E,B-7)),m.setFont("helvetica","normal"),m.setFontSize(8),z([200,200,230]),m.text("www.viveprop.cl · Stock de propiedades en gestión",d-E,B-7,{align:"right"}),m.save(`ficha-${f}.pdf`),o.textContent=n,o.disabled=!1}function Lo(t){Ht=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function Bo(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Ht).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Ht)})}function we(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function V(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Vt(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function So(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function xt(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function Mo(t){const e={};for(const[o,n]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(n??"").trim());return e}function Uo(t,e){const o=Mo(t),n=(e||"").toUpperCase(),s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(n.includes("INGEVEC")){const i=xt(o["Cuotas pie"]);return{...s,descuentoDepto:V(o["Dcto. depto."]),aporteInmobiliario:V(o["Aporte inmobiliario"]),reservaCLP:Vt(o.Reserva),cuotasPieN:Math.max(i-1,0),pieConstPct:V(o["Pie período const."]),creditoDirectoPct:V(o["Pie crédito s/int."]),cuotonPct:V(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("MAESTRA")){const i=V(o.Upfront),a=V(o["Pie en cuotas"]);return{...s,descuentoDepto:V(o["Descuento Base"])+V(o["Dcto Adicional"]),aporteInmobiliario:V(o["Certificado Pago"]),upfrontPct:i,piePctDefault:i+a||null,cuotasPieN:xt(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("RVC")){const i=V(o["Pie mínimo"]);return{...s,descuentoDepto:V(o["Descuento RVC"]),piePctDefault:i||null,cuotasPieN:xt(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const i=o["Monto Reserva"]||"",a=/uf/i.test(i),c=V(o["Pie minimo %"]);return{...s,descuentoDepto:V(o["Descuento autorizado"]),reservaCLP:a?0:Vt(i),reservaUF:a?So(i):0,piePctDefault:c||null,cuotasPieN:xt(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("URMENETA")){const i=(t==null?void 0:t.nota)||"",a=i.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||i.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||i.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=a?parseFloat(a[1].replace(",","."))/100:0;return{...s,descuentoDepto:V(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Vt(o["Valor reserva"]),pieConstPct:V(o["% cuotas const."]),cuotasPieN:xt(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:i}}return s}const Ut={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},se={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},To=[.04,.045,.05],Le=30,Be=.12;function Do(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function Se(t){const e=(t||"").toUpperCase();return se[e]||se.DEFAULT}function _o(t){const{precioListaDepto:e,descuentoPct:o,bonoPiePct:n,reservaCLP:s,preciosConjuntos:i,piePct:a,upfrontPct:c,plazoAnios:l,tasasCAE:v,valorUF:p,cuotonPct:g,piePeriodoConstruccionPct:f,pieCreditoDirectoPct:$,cuotasPieN:b,arriendosMensualesCLP:P,plusvaliaAnual:F,tipoCalculoBono:y}=t,I=t.pieConjuntosPct??.2,m=(i||[]).reduce((ct,zt)=>ct+zt,0),d=e+m,B=Math.min(o+0,1),E=e*(1-B),_=m,x=E+_,h=x*p,S=y==="maestra"?a:I,w=Math.round(E*a*100)/100,q=Math.round(m*S*100)/100,W=w+q,Bt=s/p,ot=Math.round(x*(c||0)*100)/100,z=W-Bt-ot,pt=z*p,St=b>0?z/b:z,T=St*p,it=Math.round(x*(g||0)*100)/100,Ct=Math.round(it*p),ut=Math.round(x*(f||0)*100)/100,st=Math.round(ut*p),at=Math.round(x*($||0)*100)/100,Ft=Math.round(at*p),Pt=W+it+ut,D=x*(1-a);let A,j,R,k,O,X;if(y==="maestra"){const ct=1-a-n;j=n>0?Math.round(D/ct*100)/100:x,A=Math.round(j*n*100)/100,R=Math.round(j*ct*100)/100,X=W,k=Math.round((j-X-R)*100)/100,O=j>0?k/j:0}else y==="precio-lista-total"?(A=Math.round(d*n*100)/100,j=n>0?Math.round((x+A)*100)/100:x,k=A,O=n,X=W,R=Math.round((x-X-k)*100)/100):(A=Math.round(e*n*100)/100,j=n>0?Math.round((x+A)*100)/100:x,k=A,O=n,X=W,R=Math.round((x-X-k)*100)/100);const te=R*p,Oe=j*p,ee=Math.pow(1+(F||Ut.PLUSVALIA_DEFAULT),5)-1,Ve=h*(1+ee)*Ut.HAIRCUT_VENTA,Ne=Pt*p,He=v.map((ct,zt)=>{const Mt=(P||[0,0,0])[zt]||0,Ge=l*12,Rt=Do(ct/12,Ge,te),qe=Rt/p,oe=Mt-Rt,Je=oe*Ut.MESES_ARRIENDO_ANIO*5,Ke=j>0?Mt*Ut.MESES_ARRIENDO_ANIO/p/j:0,We=Mt*.9,ne=h>0?Math.round(We*12/h*1e4)/1e4:0,Ze=Math.round(ne*5*1e4)/1e4;return{cae:ct,arriendoMensualCLP:Mt,cuotaMensualCLP:Math.round(Rt),cuotaMensualUF:Math.round(qe*100)/100,flujoMensualCLP:Math.round(oe),flujoAcumuladoCLP:Math.round(Je),capRate:Math.round(Ke*1e4)/1e4,roi5Anios:Ze,roiAnual:ne}});return{valorUF:p,precioListaDepto:e,precioListaOtros:m,precioListaTotal:d,precioDescDepto:Math.round(E*100)/100,precioDescOtros:_,valorVentaUF:Math.round(x*100)/100,valorVentaCLP:Math.round(h),piePct:a,upfrontPct:c||0,pieTotalDeptoUF:Math.round(w*100)/100,pieTotalConjuntosUF:Math.round(q*100)/100,pieTotalUF:Math.round(W*100)/100,reservaUF:Math.round(Bt*100)/100,upfrontUF:ot,saldoPieUF:Math.round(z*100)/100,saldoPieCLP:Math.round(pt),cuotasPieN:b,valorCuotaPieUF:Math.round(St*100)/100,valorCuotaPieCLP:Math.round(T),cuotonUF:it,cuotonCLP:Ct,piePeriodoConstruccionUF:ut,piePeriodoConstruccionCLP:st,pieCreditoDirectoUF:at,pieCreditoDirectoCLP:Ft,totalPieInmobUF:Math.round(Pt*100)/100,descuentoAdicionalPct:0,bonoPieUF:A,saldoAporteInmobUF:Math.round(k*100)/100,aportePct:Math.round(O*1e4)/1e4,pieCreditoHipUF:Math.round(X*100)/100,tasacionUF:Math.round(j*100)/100,tasacionCLP:Math.round(Oe),creditoHipBaseUF:Math.round(D*100)/100,creditoHipFinalUF:Math.round(R*100)/100,creditoHipFinalCLP:Math.round(te),plusvaliaAcumulada:Math.round(ee*1e4)/1e4,precioVentaAnio5CLP:Math.round(Ve),piePagadoCLP:Math.round(Ne),escenarios:He}}let U=null,jt=!1;function Me(t){try{const{project:e,depto:o,secundarios:n=[]}=t;console.log("[Cotizador] cotizFromProp",{project:e,depto:o,secundarios:n});const s=C.CC_DATA[e.id]||null,i=Uo(s,e.inmobiliaria),a=Se(e.inmobiliaria),c=i.reservaUF>0?Math.round(i.reservaUF*C.UF):i.reservaCLP;U={project:e,depto:o,secundarios:n,parsedCC:i,regla:a,reservaCLP:c,cliente:null},Te(),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(e){console.error("[Cotizador] Error en cotizFromProp:",e),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}

${r(e.stack||"")}</div>`}}function Ue(){if(U)try{const t=Vo(),e=No(t),o=_o(e);console.log("[Cotizador] Input:",e),console.log("[Cotizador] Resultado:",o),Ho(o,t)}catch(t){console.error("[Cotizador] Error en recalcCotizPanel:",t),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(t))}

${r(t.stack||"")}</div>`}}function Ao(){var e,o;const t=U?{pid:(e=U.project)==null?void 0:e.id,dp:(o=U.depto)==null?void 0:o.dp,extraDps:(U.secundarios??[]).map(n=>n.dp)}:null;U=null,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.openModule("pri"),t!=null&&t.pid&&window.reopenWithUnit(t.pid,t.dp,t.extraDps)}function lt(t){return+((t??0)*100).toFixed(2)}function Te(){const{project:t,depto:e,secundarios:o}=U,n=[`${t.nombre} · DP ${e.dp}${e.tipologia?" "+e.tipologia:""}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp}`)];document.getElementById("ccf-header-title").textContent=n.join(" + ");const s=e.precio_uf+o.reduce((c,l)=>c+l.precio_uf,0),i=[`DP ${e.dp}${e.tipologia?" — "+e.tipologia:""} · ${u.uf2(e.precio_uf)}`,...o.map(c=>`${c.tipologia?c.tipologia+" ":""}DP ${c.dp} · ${u.uf2(c.precio_uf)}`)];document.getElementById("ccf-prop-summary").innerHTML=`<div class="ccf-prop-lines">${i.map(c=>`<div class="ccf-prop-line">${r(c)}</div>`).join("")}</div><div class="ccf-prop-total">Total precio lista: <strong>${u.uf2(s)}</strong></div>`,["ccf-nombre","ccf-rut","ccf-email","ccf-tel"].forEach(c=>{const l=document.getElementById(c);l&&(l.value="",l.classList.remove("cp-input--err"))});const a=document.getElementById("ccf-objetivo");a&&(a.value="",a.classList.remove("cp-input--err")),document.querySelectorAll(".ccf-err").forEach(c=>{c.textContent=""});try{const c=JSON.parse(localStorage.getItem("_corredor")||"{}");c.nombre&&(document.getElementById("ccf-cor-nombre").value=c.nombre),c.email&&(document.getElementById("ccf-cor-email").value=c.email),c.tel&&(document.getElementById("ccf-cor-tel").value=c.tel)}catch{}if(jt){try{const c=JSON.parse(localStorage.getItem("_ultimo_cliente")||"{}");if(c.nombre){const l=document.getElementById("ccf-nombre");l&&(l.value=c.nombre)}if(c.rut){const l=document.getElementById("ccf-rut");l&&(l.value=c.rut)}if(c.email){const l=document.getElementById("ccf-email");l&&(l.value=c.email)}if(c.tel){const l=document.getElementById("ccf-tel");l&&(l.value=c.tel)}if(c.objetivo){const l=document.getElementById("ccf-objetivo");l&&(l.value=c.objetivo)}}catch{}jt=!1}}function jo(t){const e=t.replace(/[.\s]/g,"").toUpperCase();if(!/^\d{7,8}-?[0-9K]$/.test(e))return!1;const o=e.replace("-",""),n=o.slice(0,-1),s=o.slice(-1);let i=0,a=2;for(let v=n.length-1;v>=0;v--)i+=parseInt(n[v])*a,a=a===7?2:a+1;const c=11-i%11,l=c===11?"0":c===10?"K":String(c);return s===l}function ae(t){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim())}function ce(t){const e=t.replace(/[\s\-\(\)\.]/g,"");return/^(\+?56)?9\d{8}$/.test(e)||/^\+?56[2-9]\d{7}$/.test(e)}function H(t,e){const o=document.getElementById(t),n=document.getElementById(t+"-err");o&&o.classList.toggle("cp-input--err",!!e),n&&(n.textContent=e||"")}function ko(t){H(t,"")}function zo(t){const e=document.getElementById(t);if(!e)return;const o=e.value.replace(/[^\dkK]/g,"").toUpperCase();if(o.length>1){const n=o.slice(0,-1),s=o.slice(-1);e.value=n.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+s}H(t,"")}function Ro(){if(!U)return;let t=!0;const e=p=>{var g;return(((g=document.getElementById(p))==null?void 0:g.value)||"").trim()},o=e("ccf-nombre");o.length<2&&(H("ccf-nombre","Ingresa el nombre completo"),t=!1);const n=e("ccf-rut");n?jo(n)||(H("ccf-rut","RUT inválido — verifica el dígito verificador"),t=!1):(H("ccf-rut","Ingresa el RUT"),t=!1);const s=e("ccf-email");s?ae(s)||(H("ccf-email","Formato de email inválido"),t=!1):(H("ccf-email","Ingresa el email"),t=!1);const i=e("ccf-tel");i?ce(i)||(H("ccf-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-tel","Ingresa el teléfono"),t=!1);const a=e("ccf-objetivo");a||(H("ccf-objetivo","Selecciona un objetivo"),t=!1);const c=e("ccf-cor-nombre");c.length<2&&(H("ccf-cor-nombre","Ingresa el nombre del corredor"),t=!1);const l=e("ccf-cor-email");l?ae(l)||(H("ccf-cor-email","Formato de email inválido"),t=!1):(H("ccf-cor-email","Ingresa el email del corredor"),t=!1);const v=e("ccf-cor-tel");if(v?ce(v)||(H("ccf-cor-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(H("ccf-cor-tel","Ingresa el teléfono del corredor"),t=!1),!!t){try{localStorage.setItem("_corredor",JSON.stringify({nombre:c,email:l,tel:v}))}catch{}try{localStorage.setItem("_ultimo_cliente",JSON.stringify({nombre:o,rut:n,email:s,tel:i,objetivo:a}))}catch{}U.cliente={nombre:o,rut:n,email:s,tel:i,objetivo:a,corNombre:c,corEmail:l,corTel:v},U.cotizId=Wo(),Oo(U.parsedCC),document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",Ue()}}function Oo(t){const e=Math.round((t.piePctDefault??Be)*100),o=lt((t.descuentoDepto??0)+(t.descuentoAdicional??0)),n=lt(t.aporteInmobiliario),s=t.cuotasPieN??0,i=lt(t.pieConstPct),a=lt(t.cuotonPct),c=lt(t.upfrontPct),l=lt(t.creditoDirectoPct),[v,p,g]=To.map(P=>lt(P)),f=`Cuotas pie${s>0?` <span class="cp-fg-base">base ${s}</span>`:""}`,$=`Cuotón %${a===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,b=(P,F,y,I,m,d)=>`<div class="cp-fg"><label class="cp-fg-lbl">${P}</label><input id="${F}" class="cp-input" type="number" min="${I}" max="${m}" step="${d}" value="${y}" onchange="recalcCotizPanel()"></div>`;document.getElementById("cp-params-grid").innerHTML=`
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${b("Pie %","cpg-pie",e,0,100,1)}
        ${b("Plazo (años)","cpg-plazo",Le,5,30,1)}
        ${b("Dcto. depto %","cpg-dcto",o,0,100,.1)}
        ${b("Aporte inmob %","cpg-aporte",n,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${b(f,"cpg-cuotas",s,0,48,1)}
        ${b("Pie const %","cpg-piecst",i,0,100,.1)}
        ${b($,"cpg-cuoton",a,0,100,.1)}
        ${b("Upfront %","cpg-upfront",c,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("Crédito directo %","cpg-cdir",l,0,100,.1)}
        ${b("Plusvalía anual %","cpg-plusvalia",2,0,20,.1)}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("CAE escenario 1","cpg-cae1",v,0,20,.1)}
        ${b("CAE escenario 2","cpg-cae2",p,0,20,.1)}
        ${b("CAE escenario 3","cpg-cae3",g,0,20,.1)}
      </div>
    </div>`}function Vo(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:t("cpg-pie")||Be*100,plazo:t("cpg-plazo")||Le,dcto:t("cpg-dcto"),aporte:t("cpg-aporte"),cuotas:t("cpg-cuotas"),piecst:t("cpg-piecst"),cuoton:t("cpg-cuoton"),upfront:t("cpg-upfront"),cdir:t("cpg-cdir"),plusvalia:t("cpg-plusvalia")||2,cae1:t("cpg-cae1")||4,cae2:t("cpg-cae2")||4.5,cae3:t("cpg-cae3")||5}}function No(t){const{reservaCLP:e,regla:o,depto:n,secundarios:s}=U;return{precioListaDepto:n.precio_uf,descuentoPct:t.dcto/100,descuentoAdicionalPct:0,bonoPiePct:t.aporte/100,reservaCLP:e,preciosConjuntos:s.map(i=>i.precio_uf),piePct:t.pie/100,upfrontPct:t.upfront/100,cuotasPieN:t.cuotas,cuotonPct:t.cuoton/100,piePeriodoConstruccionPct:t.piecst/100,pieCreditoDirectoPct:t.cdir/100,plazoAnios:t.plazo,tasasCAE:[t.cae1/100,t.cae2/100,t.cae3/100],valorUF:C.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:t.plusvalia/100}}function N(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function Ho(t,e){const{project:o,depto:n,secundarios:s}=U,i=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...s.map(a=>`${a.tipologia?a.tipologia+" ":""}DP ${a.dp}`)];document.getElementById("cp-header-title").textContent=i.join(" + "),document.getElementById("cp-results").innerHTML=Go(t,n,s)+qo(t)+(t.pieCreditoDirectoUF>0?Jo(t):"")+Ko(t,e.plazo),Zo(t,e)}function Go(t,e,o){const n=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,s=`
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
  </div>`}function qo(t){let e="";if(e+=`
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
  </div>`}function Jo(t){const e=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${N(e)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${u.uf2(t.pieCreditoDirectoUF)}<small>${u.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function Ko(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,n=t.escenarios.map((s,i)=>{const a=s.cuotaMensualCLP/.25;return`
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
  </div>`}function Wo(){const t=new Date().getFullYear(),e=`_cotiz_counter_${t}`,o=parseInt(localStorage.getItem(e)||"0")+1;try{localStorage.setItem(e,String(o))}catch{}return`COT-${t}-${String(o).padStart(4,"0")}`}function Zo(t,e){const o=document.getElementById("cotiz-print-doc");if(!o||!(U!=null&&U.cliente))return;const{project:n,depto:s,secundarios:i,cliente:a,cotizId:c}=U,v=new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"}),p={vivienda:"Vivienda propia",inversion:"Inversión / arriendo",segunda:"Segunda vivienda",subsidio:"Subsidio habitacional"},g=[`${s.tipologia?s.tipologia+" ":""}DP ${s.dp} · ${u.uf2(s.precio_uf)}`,...i.map(d=>`${d.tipologia?d.tipologia+" ":""}DP ${d.dp} · ${u.uf2(d.precio_uf)}`)].map(d=>`<div class="prd-unit-line">${r(d)}</div>`).join(""),f=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,$=`<tr>
    <td>${r(String(s.dp))}${s.tipologia?" — "+r(s.tipologia):""}</td>
    <td>${u.uf2(t.precioListaDepto)}</td>
    <td>${f>1e-4?"−"+N(f):"—"}</td>
    <td>${u.uf2(t.precioDescDepto)}</td>
  </tr>`,b=i.map(d=>`<tr>
    <td>${d.tipologia?r(d.tipologia)+" ":""}DP ${r(String(d.dp))}</td>
    <td>${u.uf2(d.precio_uf)}</td><td>—</td>
    <td>${u.uf2(d.precio_uf)}</td>
  </tr>`).join("");let P="";if(P+=`<tr><td><strong>Pie total</strong> ${N(t.piePct)}</td><td>${u.uf2(t.pieTotalUF)}</td><td>${u.pesos(t.pieTotalUF*t.valorUF)}</td></tr>`,P+=`<tr class="prd-tbl-sub"><td>Reserva</td><td>${u.uf2(t.reservaUF)}</td><td>${u.pesos(t.reservaUF*t.valorUF)}</td></tr>`,t.upfrontUF>0&&(P+=`<tr class="prd-tbl-sub"><td>Upfront ${N(t.upfrontPct)}</td><td>${u.uf2(t.upfrontUF)}</td><td>${u.pesos(t.upfrontUF*t.valorUF)}</td></tr>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(P+=`<tr class="prd-tbl-sub"><td>Saldo pie — ${t.cuotasPieN} cuotas × ${u.uf2(t.valorCuotaPieUF)}/mes</td><td>${u.uf2(t.saldoPieUF)}</td><td>${u.pesos(t.saldoPieCLP)}</td></tr>`),t.piePeriodoConstruccionUF>0){const d=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;P+=`<tr><td>Pie período construcción ${N(d)}</td><td>${u.uf2(t.piePeriodoConstruccionUF)}</td><td>${u.pesos(t.piePeriodoConstruccionCLP)}</td></tr>`}t.cuotonUF>0&&(P+=`<tr><td>Cuotón</td><td>${u.uf2(t.cuotonUF)}</td><td>${u.pesos(t.cuotonCLP)}</td></tr>`);const F=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;P+=`<tr class="prd-tbl-total"><td><strong>Total pie a inmobiliaria</strong> ${N(F)}</td><td>${u.uf2(t.totalPieInmobUF)}</td><td>${u.pesos(t.totalPieInmobUF*t.valorUF)}</td></tr>`,t.bonoPieUF>0&&(P+=`<tr class="prd-tbl-aporte"><td>Aporte inmobiliaria ${N(t.aportePct)}</td><td>${u.uf2(t.bonoPieUF)}</td><td>${u.pesos(t.bonoPieUF*t.valorUF)}</td></tr>`);let y="";if(t.pieCreditoDirectoUF>0){const d=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;y=`<div class="prd-section">
      <div class="prd-section-title">Crédito Directo Inmobiliaria</div>
      <table class="prd-tbl"><tbody>
        <tr><td>Financiamiento directo ${N(d)} × valor venta</td><td>${u.uf2(t.pieCreditoDirectoUF)}</td><td>${u.pesos(t.pieCreditoDirectoCLP)}</td></tr>
      </tbody></table>
    </div>`}const I=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,m=t.escenarios.map((d,B)=>{const E=d.cuotaMensualCLP/.25;return`<tr${B===1?' class="prd-esc-hl"':""}>
      <td>CAE ${(d.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
      <td>${u.pesos(d.cuotaMensualCLP)}</td>
      <td>${u.uf2(d.cuotaMensualUF)}</td>
      <td>${u.pesos(E)}</td>
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
          ${$}${b}
          <tr class="prd-tbl-total"><td>Total</td><td>${u.uf2(t.precioListaTotal)}</td><td></td><td>${u.uf2(t.valorVentaUF)} <small>(${u.pesos(t.valorVentaCLP)})</small></td></tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Plan de Pago</div>
      <table class="prd-tbl">
        <thead><tr><th>Concepto</th><th>UF</th><th>$</th></tr></thead>
        <tbody>${P}</tbody>
      </table>
    </div>

    ${y}

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
          <span class="prd-hip-val">${N(I)}</span>
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
        <tbody>${m}</tbody>
      </table>
    </div>

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${r(a.corNombre)} · ${r(a.corEmail)} · ${r(a.corTel)}
      </div>
      <div class="prd-disclaimer">
        Cotización referencial — no constituye oferta formal de venta. Valores UF calculados al ${v} (1 UF = ${u.pesos(t.valorUF)}). Los dividendos son estimaciones según escenarios de tasa CAE indicados y pueden variar según condiciones del banco y perfil del solicitante.
      </div>
    </div>
  </div>`}function Yo(){U!=null&&U.cliente&&window.print()}function Qo(t){try{const e=C.STOCK.find(c=>c.id===t);if(!e)return;const o=parseFloat((e.precioSinBono||"0").replace(/\./g,"").replace(",","."))||0,n={id:`sec-${t}`,nombre:e.condominio||e.direccion||"—",inmobiliaria:"",comuna:e.comuna||""},s={dp:e.dp||"—",precio_uf:o,tipologia:e.tipologia||"",disponible:!0},i={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:0,reservaUF:0,cuotasPieN:0,upfrontPct:0,piePctDefault:.2,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Usada",nota:""},a=Se("");U={project:n,depto:s,secundarios:[],parsedCC:i,regla:a,reservaCLP:0,cliente:null},Te(),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(e){console.error("[Cotizador] Error en cotizSecProp:",e),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}</div>`}}function Xo(){U=null,jt=!1,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.cascReset(),window.openModule("cotiz")}function tn(){U=null,jt=!0,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.cascReset(),window.openModule("cotiz")}const Dt=It,en=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let yt=[],Nt=null,Q=1,De="lista",$t=null,nt=null,rt=[],et=0;function _e(t){return t?en.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function on(){if(!C.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set(C.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();pe("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),kt()}function kt(){var v,p,g,f,$,b,P;if(!C.PROJECTS.length)return;const t=(((v=document.getElementById("pri-search"))==null?void 0:v.value)||((p=document.getElementById("pri-search-top"))==null?void 0:p.value)||"").toLowerCase(),e=ue("pri"),o=((g=document.getElementById("pri-entrega"))==null?void 0:g.value)||"",n=parseFloat((f=document.getElementById("pri-precio-min"))==null?void 0:f.value)||0,s=parseFloat(($=document.getElementById("pri-precio-max"))==null?void 0:$.value)||0,i=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(F=>parseInt(F.dataset.val)),a=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(F=>parseInt(F.dataset.val)),c=((b=document.getElementById("pri-est"))==null?void 0:b.checked)||!1,l=((P=document.getElementById("pri-bod"))==null?void 0:P.checked)||!1;Nt=window._priMaxUF||null,yt=C.PROJECTS.filter(F=>{var m;let y=(F.unidades||[]).filter(d=>d.disponible&&!dt(d.tipologia));if(!y.length||t&&!`${F.nombre||""} ${F.inmobiliaria||""} ${F.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(F.comuna)||o&&!((m=F.entrega)!=null&&m.toLowerCase().includes(o.toLowerCase()))||c&&!(F.unidades||[]).some(d=>d.disponible&&/estac|parking|reja/i.test(d.tipologia||""))||l&&!(F.unidades||[]).some(d=>d.disponible&&/bode/i.test(d.tipologia||""))||i.length&&(y=y.filter(d=>{const B=parseInt(d.dormitorios)||0;return i.some(E=>E===4?B>=4:B===E)}),!y.length)||a.length&&(y=y.filter(d=>{const B=parseInt(d.banos)||0;return a.some(E=>E===3?B>=3:B===E)}),!y.length))return!1;const I=Math.min(...y.map(d=>d.precio_uf).filter(d=>d>0));return!(n&&I<n||s&&I>s||Nt&&!y.some(d=>d.precio_uf<=Nt))}),Q=1,Ae(),De==="mapa"&&Ce(yt)}function nn(t){const e=Math.max(1,Math.ceil(yt.length/Dt));Q=Math.min(Math.max(1,Q+t),e),Ae(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Ae(){const t=document.getElementById("pri-grid"),e=yt.length,o=Math.max(1,Math.ceil(e/Dt));Q>o&&(Q=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${Q} / ${o}`,document.getElementById("pri-prev").disabled=Q<=1,document.getElementById("pri-next").disabled=Q>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${e.toLocaleString("es-CL")} proyectos · ${C.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const s=yt.slice((Q-1)*Dt,Q*Dt);t.innerHTML=s.map(i=>{const a=(i.unidades||[]).filter(F=>F.disponible&&!dt(F.tipologia)),c=a.map(F=>F.precio_uf).filter(F=>F>0),l=c.length?Math.min(...c):0,v=c.length?Math.max(...c):0,p=i.foto_portada||"",g=p&&(()=>{try{return decodeURI(p),p}catch{return""}})(),f=[...new Set(a.map(F=>{const y=parseInt(F.dormitorios)||0;return y===0?"Estudio":y+"D"}))].sort().slice(0,3).join(", "),$=a.reduce((F,y)=>y.m2_interior&&y.m2_interior<F?y.m2_interior:F,9999),b=$<9999?$.toFixed(0)+" m²":"—",P=C.CC_DATA[i.id]||_e(i.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(i.id)}')">
      <div class="prj-img" style="${g?`background-image:url('${g}');background-size:cover;background-position:center`:""}">
        ${g?"":'<div class="prj-img-icon">🏗️</div>'}
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
          <div class="prj-stat"><div class="prj-stat-v">${f||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${b}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${a.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${l?"UF "+l.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${v>l?`<span class="prj-hasta">— ${v.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(i.id)}')">Ver proyecto →</button>
          ${P?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function sn(t){De=t,go(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"){uo();const s=mo();setTimeout(()=>s&&s.invalidateSize(),120),Ce(yt)}}function Zt(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),n=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),n&&(n.style.display=e===t?"flex":"none")}),t==="map"&&vo($t)}function an(t){const e=t.unidades||[],o=e.filter(h=>h.disponible&&!dt(h.tipologia)),n=o.map(h=>h.precio_uf).filter(h=>h>0),s=n.length?Math.min(...n):0,i=n.length?Math.max(...n):0,a=o.map(h=>h.m2_interior).filter(h=>h>0),c=a.length?Math.min(...a):0,l=a.length?Math.max(...a):0,v=[...new Set(o.map(h=>{const S=parseInt(h.dormitorios)||0;return S===0?"Estudio":S+"D"}))].sort(),p=h=>h.toLocaleString("es-CL",{maximumFractionDigits:0}),g=s?i>s?`UF ${p(s)} – ${p(i)}`:`UF ${p(s)}`:" — ",f=c?l>c?`${c.toFixed(0)} – ${l.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",$=[t.direccion,t.comuna].filter(Boolean).join(", ");let b="";$&&(b+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r($)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
    </div>`),b+=`<div class="pm-stats-grid">
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
      <span class="pm-stat-card-val" style="font-size:${l>c?"11px":"15px"}">${f}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${i>s?"11px":"15px"}">${g}</span>
      <span class="pm-stat-card-sub">${s?"en UF":""}</span>
    </div>
  </div>`;const P=[...new Set(o.map(h=>parseInt(h.piso)).filter(h=>h>0))].sort((h,S)=>h-S),F=[...new Set(o.map(h=>(h.orientacion||"").trim()).filter(Boolean))],y=o.map(h=>h.m2_terraza).filter(h=>h>0),I=[];if(P.length>0){const h=P.length===1?`Piso ${P[0]}`:`Pisos ${P[0]} – ${P[P.length-1]}`;I.push(`<div class="pm-detail-pill"><strong>${h}</strong></div>`)}if(F.length>0&&I.push(`<div class="pm-detail-pill">🧭 <strong>${F.slice(0,3).join(" · ")}</strong></div>`),y.length>0){const h=Math.min(...y).toFixed(0);I.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${h} m²</strong></div>`)}I.length&&(b+=`<div class="pm-detail-row">${I.join("")}</div>`);const m=e.filter(h=>dt(h.tipologia)&&/estac|parking/i.test(h.tipologia||"")),d=e.filter(h=>dt(h.tipologia)&&/bode/i.test(h.tipologia||"")),B=m.filter(h=>h.disponible),E=d.filter(h=>h.disponible),_=[];if(m.length>0){const h=B.map(w=>w.precio_uf).filter(w=>w>0),S=h.length?Math.min(...h):0;_.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${B.length} disp.</span>
        <span class="pm-extra-sub">${S?`Desde UF ${p(S)}`:`${m.length} en total`}</span>
      </div>
    </div>`)}if(d.length>0){const h=E.map(w=>w.precio_uf).filter(w=>w>0),S=h.length?Math.min(...h):0;_.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${E.length} disp.</span>
        <span class="pm-extra-sub">${S?`Desde UF ${p(S)}`:`${d.length} en total`}</span>
      </div>
    </div>`)}_.length&&(b+=`<div class="pm-extras-row">${_.join("")}</div>`);const x=C.CC_DATA[t.id];if(x&&x.campos&&x.campos.length){const h=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],S=[];for(const w of h){const q=x.campos.find(([W])=>W===w);if(q&&S.push(q),S.length===6)break}S.length<6&&x.campos.filter(([w])=>!S.find(([q])=>q===w)).slice(0,6-S.length).forEach(w=>S.push(w)),b+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${S.map(([w,q])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(w)}</span>
          <span class="pm-cc-prev-val">${r(q)}</span>
        </div>`).join("")}
      </div>
      ${x.nota?`<div class="pm-cc-nota">${r(x.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=b}function je(t){const e=document.getElementById("pm-cc-inner"),o=C.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const s=o.campos.filter(([,a])=>a.length<=60),i=o.campos.filter(([,a])=>a.length>60);s.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',s.forEach(([a,c])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(a)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),n+="</div>"),i.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',i.forEach(([a,c])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(a)}</div>`,n+=`<div class="pm-cc-val-long">${r(c)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(s=>{n+=`<th>${r(s)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(s=>{n+="<tr>",s.forEach(i=>{n+=`<td>${r(i||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=n}function ke(t){const e=C.PROJECTS.find(f=>f.id===t);if(!e)return;$t=e,nt=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),Zt("gal"),an(e),rt=e.fotos||[],et=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),s=document.getElementById("pm-gal-nophoto"),i=document.getElementById("pm-gal-thumbs"),a=document.getElementById("pm-gal-counter");n.style.display="none",rt.length?(s.style.display="none",Yt(0),i.innerHTML=rt.map((f,$)=>`<img src="${f}" onclick="pmShowGalPhoto(${$})" ${$===0?'class="active"':""}>`).join("")):(o.style.display="none",s.style.display="flex",i.innerHTML="",a.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(f=>`<a class="pm-pdf-item" href="${f.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(f.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const l=document.getElementById("pm-tab-cc"),v=C.CC_DATA[e.id],p=_e(e.inmobiliaria).length>0;v||p?(l.style.display="",je(e.id)):l.style.display="none";const g=(e.unidades||[]).filter(f=>f.disponible&&!dt(f.tipologia));document.getElementById("pm-units-body").innerHTML=g.map(f=>`
    <tr>
      <td>${r(f.dp)}</td>
      <td>${r(f.tipologia)}</td>
      <td>${r(f.piso||"—")}</td>
      <td>${f.m2_interior?f.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${f.m2_terraza?f.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(f.orientacion||"—")}</td>
      <td class="td-precio">${u.uf(f.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(f.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Yt(t){var n;et=Math.max(0,Math.min(t,rt.length-1));const e=document.getElementById("pm-gal-img");e.src=rt[et],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${et+1} / ${rt.length}`,document.getElementById("pm-gal-prev").disabled=et===0,document.getElementById("pm-gal-next").disabled=et===rt.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((s,i)=>s.classList.toggle("active",i===et)),(n=document.getElementById("pm-gal-thumbs").children[et])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function cn(t){Yt(et+t)}function Qt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",$t=null,nt=null}function ze(t){const e=$t,o=(e.unidades||[]).find(a=>a.dp===t);if(!o)return;nt=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(e.unidades||[]).filter(a=>a.disponible&&dt(a.tipologia)),s=document.getElementById("pm-extras-wrap"),i=document.getElementById("pm-extras-list");n.length?(s.style.display="",i.innerHTML=n.map(a=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${a.precio_uf}" data-dp="${r(a.dp)}" data-label="${r(a.tipologia)} DP ${r(a.dp)}">
        <span class="extra-label">${r(a.tipologia)} — DP ${r(a.dp)}</span>
        <span class="extra-price">${u.uf(a.precio_uf)}</span>
      </label>`).join("")):(s.style.display="none",i.innerHTML=""),Xt(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function Xt(){if(!nt)return;let t=nt.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=u.uf(t)}function ln(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),nt=null}function rn(){if(!nt||!$t)return;const t=$t,e=nt,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const s=(t.unidades||[]).find(i=>i.dp===n.dataset.dp);s&&o.push(s)}),Qt(),Me({project:t,depto:e,secundarios:o})}function dn(t){t.classList.toggle("active"),kt()}function pn(t,e,o=[]){ke(t),Zt("units"),e&&(ze(e),o.length&&(o.forEach(n=>{const s=document.querySelector(`#pm-extras-list input[data-dp="${n}"]`);s&&(s.checked=!0)}),Xt()))}let ht=null;function un(t){const{rentaLiquida:e=0,ingresosVariables:o=0,otrosIngresos:n=0,cuotasCreditos:s=0,pagoTarjetas:i=0,otrasDeudas:a=0,pieDisponible:c=0,plazo:l=25,tasa:v=4.5,morosidad:p=!1}=t,g=e+o*.5+n,f=s+i+a,$=[];let b="apto";if(p&&(b="no_apto",$.push("Presenta morosidades o protestos vigentes")),!g)return{resultado:"no_apto",razones:["Sin ingresos registrados"],ingresoEvaluable:0,cargaSinHip:0,rciActual:0,dividendoMax:0,creditoMax:0,propMaxCLP:0,propMaxUF:0};const P=f/g;P>.5&&(b="no_apto",$.push(`Carga mensual actual (${(P*100).toFixed(0)}%) supera el 50% del ingreso evaluable`));const F=g*.3,y=g*.5-f,I=Math.max(0,Math.min(F,y));I<=0&&b==="apto"&&(b="no_apto",$.push("Sin capacidad de pago disponible para un dividendo")),!c&&b==="apto"&&(b="no_apto",$.push("Sin pie disponible registrado"));const m=g>0?I/g:0,d=g>0?(f+I)/g:0;b==="apto"&&(m>.25||d>.45)&&(b="apto_con_condiciones",$.push("Relación dividendo/ingreso en zona de tolerancia (25–30%)")),b==="apto"&&$.push("Cumple todos los criterios de evaluación");const B=v/100/12,E=l*12,_=B>0?(1-Math.pow(1+B,-E))/B:E,x=I*_,h=c>0?c/.2:0,S=x/.8,w=h>0?Math.min(h,S):S,q=C.UF>0?w/C.UF:0;return{resultado:b,razones:$,ingresoEvaluable:g,cargaSinHip:f,rciActual:P,dividendoMax:I,creditoMax:x,propMaxCLP:w,propMaxUF:q}}function mn(){const t=p=>{var g;return parseFloat(((g=document.getElementById(p))==null?void 0:g.value)||"")||0},e=p=>{var g;return((g=document.getElementById(p))==null?void 0:g.checked)||!1},o={rentaLiquida:t("p-renta"),ingresosVariables:t("p-variables"),otrosIngresos:t("p-otros-ing"),cuotasCreditos:t("p-cuotas"),pagoTarjetas:t("p-tarjetas"),otrasDeudas:t("p-otras-deudas"),pieDisponible:t("p-ahorro"),plazo:t("p-plazo")||25,tasa:t("p-tasa")||4.5,morosidad:e("p-morosidad")},n=document.getElementById("p-results"),s=document.getElementById("p-btns");if(s.style.display="none",!o.rentaLiquida){n.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente para evaluar su capacidad</p></div>';return}const i=un(o);ht=i.resultado!=="no_apto"&&i.propMaxUF>0?i.propMaxUF:null;const a={apto:{cls:"pf-badge--apto",label:"✓ Apto"},apto_con_condiciones:{cls:"pf-badge--cond",label:"⚠ Apto con condiciones"},no_apto:{cls:"pf-badge--noapto",label:"✗ No apto"}},c=a[i.resultado]||a.no_apto,l=p=>(p*100).toFixed(1).replace(/\.0$/,"")+"%",v=C.UF||1;n.innerHTML=`
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
        <span class="rcp">${i.ingresoEvaluable>0?l(i.dividendoMax/i.ingresoEvaluable):"—"} del ingreso</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${u.uf(i.creditoMax/v)}</span>
        <span class="rcl">Crédito hipotecario máx.</span>
        <span class="rcp">${u.pesos(i.creditoMax)}</span>
      </div>
      <div class="rc-cell${i.rciActual>.4?" warn":""}">
        <span class="rcv">${l(i.rciActual)}</span>
        <span class="rcl">Carga actual sin hipoteca</span>
        <span class="rcp">Límite: 50%</span>
      </div>
    </div>
  </div>`,ht&&(s.style.display="flex")}function gn(t){ht&&(t==="sec"?(window._secMaxUF=ht,window.secFilter(),window.openModule("sec"),qt("sec")):(window._priMaxUF=ht,window.priFilter(),window.openModule("pri"),qt("pri")))}function qt(t){var n;(n=document.getElementById("bb-"+t))==null||n.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Presupuesto máximo: <strong>${u.uf(ht)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function fn(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}function vn(){const t=document.getElementById("casc-comuna");if(!t||!C.PROJECTS.length)return;const e=[...new Set(C.PROJECTS.map(o=>o.comuna).filter(Boolean))].sort();t.innerHTML='<option value="">Selecciona comuna</option>'+e.map(o=>`<option value="${o}">${o}</option>`).join("")}function hn(t){const e=c=>{var l;return((l=document.getElementById(c))==null?void 0:l.value)||""},o=(c,l,v)=>{const p=document.getElementById(c);p&&(p.innerHTML=l,p.disabled=v)},n=e("casc-comuna"),s=e("casc-entrega"),i=e("casc-inmob");if(t==="comuna"){if(n){const c=[...new Set(C.PROJECTS.filter(l=>l.comuna===n).map(l=>l.entrega).filter(Boolean))].sort();o("casc-entrega",'<option value="">Selecciona entrega</option>'+c.map(l=>`<option value="${l}">${l}</option>`).join(""),!1)}else o("casc-entrega",'<option value="">Selecciona entrega</option>',!0);o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0),o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="entrega"){if(s){const c=[...new Set(C.PROJECTS.filter(l=>l.comuna===n&&l.entrega===s).map(l=>l.inmobiliaria).filter(Boolean))].sort();o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>'+c.map(l=>`<option value="${l}">${l}</option>`).join(""),!1)}else o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0);o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="inmob")if(i){const c=C.PROJECTS.filter(l=>l.comuna===n&&l.entrega===s&&l.inmobiliaria===i);o("casc-proyecto",'<option value="">Selecciona proyecto</option>'+c.map(l=>`<option value="${l.id}">${l.nombre}</option>`).join(""),!1)}else o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0);const a=document.getElementById("casc-continuar");a&&(a.disabled=!e("casc-proyecto"))}function bn(){var e;const t=(e=document.getElementById("casc-proyecto"))==null?void 0:e.value;t&&(window.openProject(t),window.pmTab("units"))}function yn(){const t=document.getElementById("casc-comuna");t&&(t.value="");const e=(n,s,i)=>{const a=document.getElementById(n);a&&(a.innerHTML=s,a.disabled=i)};e("casc-entrega",'<option value="">Selecciona entrega</option>',!0),e("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0),e("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0);const o=document.getElementById("casc-continuar");o&&(o.disabled=!0)}const $n={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:Re,mcFilter:me,mcOpen:Ye,mcClose:Qe,mcSelect:Xe,mcRemove:to,secFilter:Tt,secPage:$o,setSecView:Co,openDetail:Ie,openSecDetail:Fo,showDpPhoto:Kt,navDp:Gt,closeDetail:Wt,shareProperty:xo,downloadPhotos:Io,printFicha:wo,openVideo:Lo,copyVideoLink:Bo,closeVideo:we,toggleSecPill:t=>{t.classList.toggle("active"),Tt()},togglePriPill:t=>{t.classList.toggle("active"),kt()},toggleTipPill:t=>{t.classList.toggle("active"),Tt()},toggleDormPill:dn,priFilter:kt,priPage:nn,setPriView:sn,openProject:ke,closeProjModal:Qt,pmTab:Zt,renderCC:je,pmShowGalPhoto:Yt,pmGalNav:cn,selectProjUnit:ze,pmUpdateTotal:Xt,pmBack:ln,pmCotizar:rn,reopenWithUnit:pn,calcPerfil:mn,searchFromPerfil:gn,showBudgetBanner:qt,clearBudget:fn,cotizFromProp:Me,cotizSecProp:Qo,recalcCotizPanel:Ue,volverDesdeCotiz:Ao,submitClientForm:Ro,formatRutInput:zo,clearCCFError:ko,printCotiz:Yo,nuevaCotizacion:Xo,recotizar:tn,cascUpdate:hn,cascContinuar:bn,cascReset:yn});function Re(t){document.querySelectorAll(".module").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(n=>n.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=$n[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Wt(),t.key==="ArrowLeft"&&Gt(-1),t.key==="ArrowRight"&&Gt(1);return}t.key==="Escape"&&we()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Wt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Qt()});async function Cn(){try{const[t,e,o,n,s,i]=await Promise.all([gt.uf(),gt.stock(),gt.projects(),gt.cc(),gt.geocodes(),gt.priGeo()]);C.UF=t.valor??C.UF,C.STOCK=e??[],C.PROJECTS=o??[],C.CC_DATA=n??{};const a=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(a&&(a.textContent=C.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&t.fecha){const l=new Date(t.fecha);c.textContent=l.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}s&&Object.assign(C._GC,s),i&&Object.assign(C._GC,i);try{const l=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign(C._GC,l)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}bo(),on(),vn(),Re("sec")}Cn();
