(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function o(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=o(i);fetch(i.href,s)}})();const P={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},Bt=24,re="/api";async function ft(t){const e=await fetch(re+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const vt={stock:()=>ft("/stock"),projects:()=>ft("/projects"),cc:()=>ft("/cc"),uf:()=>ft("/uf"),geocodes:()=>ft("/geocodes"),priGeo:()=>ft("/pri-geocodes"),reloadData:()=>fetch(re+"/data/reload",{method:"POST"}).then(t=>t.json())},St={sec:new Set,pri:new Set};let de=[],pe=[];function ue(t,e){t==="sec"?de=e:pe=e}function me(t){return St[t]}function ge(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?de:pe,n=St[t],i=document.getElementById(t+"-mc-dropdown"),s=o.filter(c=>(!e||c.toLowerCase().includes(e))&&!n.has(c));if(!s.length){i.style.display="none";return}i.innerHTML=s.slice(0,14).map(c=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${c.replace(/'/g,"\\'")}');return false">${c}</div>`).join(""),i.style.display="block"}function to(t){ge(t)}function eo(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function oo(t,e){St[t].add(e),fe(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function no(t,e){St[t].delete(e),fe(t),t==="sec"?window.secFilter():window.priFilter()}function fe(t){document.getElementById(t+"-mc-tags").innerHTML=[...St[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function T(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const p={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function ve(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function io(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function so(t){var i,s;const e=(t||"").toLowerCase(),o=parseInt((i=e.match(/(\d+)d/))==null?void 0:i[1])||0,n=parseInt((s=e.match(/(\d+)b/))==null?void 0:s[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:n}}function pt(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function ao(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const co={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let ht=null,At=null,yt=null,jt=null,ot=null,Lt=null;function Kt(t){const e=`${t.direccion}|${t.comuna}`;if(P._GC[e]!==void 0)return P._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function lo(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function he(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function ro(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function po(){ht||(ht=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ht),At=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),ht.addLayer(At))}function uo(){return ht}function ye(t){if(!ht)return;At.clearLayers();const e=[];t.forEach(o=>{const n=Kt(o);n?$e(o,n):n===void 0&&e.push(o)}),e.length&&go(e)}let be="lista";function mo(t){be=t}function $e(t,e){const o=T(t.precioSinBono),n=T(t.m2total)||T(t.m2interior),i=co[t.estado]||"#94A3B8",s=ve(t.estado),c=`<div class="map-popup">
    <div class="mp-photo" id="mpp-${r(t.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${i}22;color:${i}">${s}</span>
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
  </div>`,a=L.marker(e,{icon:lo(i)});a.bindPopup(c,{className:"lf-popup",maxWidth:270,closeButton:!1}),a.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(f=>f.json()).then(f=>{var h,$;const u=(h=f.data)==null?void 0:h[0],g=(($=u==null?void 0:u.fotos_originales)!=null&&$.length?u.fotos_originales:u==null?void 0:u.fotos)||[];if(g.length){const E=document.getElementById("mpp-"+t.id);if(E){const x=ro(t.id,g[0]);E.style.backgroundImage=`url('${x}')`,E.textContent=""}}}).catch(()=>{})}),At.addLayer(a)}async function go(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");e.style.display="flex";let i={};try{i=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let s=0;s<t.length&&be==="mapa";s++){const c=t[s],a=`${c.direccion}|${c.comuna}`;n.textContent=`Ubicando ${s+1} de ${t.length}`,o.style.width=`${Math.round((s+1)/t.length*100)}%`;const l=encodeURIComponent(`${c.direccion}, ${c.comuna}, Santiago, Chile`);try{const u=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${l}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(u[0]){const g=[parseFloat(u[0].lat),parseFloat(u[0].lon)];i[a]=g,P._GC[a]=g,$e(c,g)}else i[a]=null}catch{i[a]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(i))}catch{}await new Promise(f=>setTimeout(f,1200))}e.style.display="none"}function fo(){yt||(yt=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(yt),jt=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),yt.addLayer(jt))}function vo(){return yt}let Ce="lista";function ho(t){Ce=t}function Ee(t){if(!yt)return;jt.clearLayers();const e=[];t.forEach(o=>{const n=Kt({direccion:o.direccion,comuna:o.comuna});n?Fe(o,n):n===void 0&&e.push(o)}),e.length&&yo(e)}function Fe(t,e){const{isExtra:o}=window._mapUtils||{},n=(t.unidades||[]).filter($=>$.disponible&&!/estac|bode|parking|reja|local\s/i.test($.tipologia||"")),i=n.map($=>$.precio_uf).filter($=>$>0),s=i.length?Math.min(...i):0,c=i.length?Math.max(...i):0,a=[...new Set(n.map($=>{const E=parseInt($.dormitorios)||0;return E===0?"Estudio":E+"D"}))].sort().slice(0,3).join(", "),l=t.foto_portada||"",f=l&&(()=>{try{return decodeURI(l),l}catch{return""}})(),u=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),g=L.marker(e,{icon:u}),h=`<div class="map-popup">
    <div class="mp-photo" ${f?`style="background-image:url('${f}')"`:""}>${f?"":"🏗️"}</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:#FEE2E2;color:#B91C1C">Nuevo</span>
        ${t.entrega?`<span class="mp-badge" style="background:#F3F4F6;color:#374151">${r(t.entrega)}</span>`:""}
      </div>
      <div class="mp-title">${r(t.nombre)}</div>
      <div class="mp-inmob">${r(t.inmobiliaria||"")}</div>
      <div class="mp-addr">📍 ${r(t.direccion||"")}${t.comuna?" · "+r(t.comuna):""}</div>
      <div class="mp-specs">
        ${a?`<span class="mp-spec">${a}</span>`:""}
        <span class="mp-spec">${n.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${s?"UF "+s.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${c>s?`<span style="font-size:11px;color:var(--g400)">— ${c.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(t.id)}')">Ver proyecto →</button>
    </div>
  </div>`;g.bindPopup(h,{className:"lf-popup",maxWidth:270,closeButton:!1}),jt.addLayer(g)}async function yo(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");e.style.display="flex";let i={};try{i=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let s=0;s<t.length&&Ce==="mapa";s++){const c=t[s],a=`${c.direccion}|${c.comuna}`;n.textContent=`Ubicando ${s+1} de ${t.length}`,o.style.width=`${Math.round((s+1)/t.length*100)}%`;const l=encodeURIComponent(`${c.direccion||c.nombre}, ${c.comuna||""}, Chile`);try{const u=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${l}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(u[0]){const g=[parseFloat(u[0].lat),parseFloat(u[0].lon)];i[a]=g,P._GC[a]=g,Fe(c,g)}else i[a]=null}catch{i[a]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(i))}catch{}await new Promise(f=>setTimeout(f,1200))}e.style.display="none"}function bo(t){if(!t)return;ot?ot.invalidateSize():(ot=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(ot)),Lt&&(ot.removeLayer(Lt),Lt=null);const e=Kt({direccion:t.direccion,comuna:t.comuna});e?Pe(t,e):$o(t),setTimeout(()=>{ot&&ot.invalidateSize()},200)}function Pe(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});Lt=L.marker(e,{icon:o}).addTo(ot),Lt.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),ot.setView(e,15)}async function $o(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const i=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}s[`${t.direccion}|${t.comuna}`]=i;try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}P._GC[`${t.direccion}|${t.comuna}`]=i,Pe(t,i)}}catch{}}let $t=[],Y=1,xe="lista",Ot={},It=null,q=[],Q=0,J=null,Z=null,Gt="";function Co(){if(!P.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set(P.STOCK.map(e=>e.comuna).filter(Boolean))].sort();ue("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Dt()}function Dt(){var $,E,x,C,y,B,m;if(!P.STOCK.length)return;const t=((($=document.getElementById("sec-search"))==null?void 0:$.value)||((E=document.getElementById("sec-search-top"))==null?void 0:E.value)||"").toLowerCase(),e=me("sec"),o=parseFloat((x=document.getElementById("sec-precio-min"))==null?void 0:x.value)||0,n=parseFloat((C=document.getElementById("sec-precio-max"))==null?void 0:C.value)||0,i=((y=document.getElementById("sec-op"))==null?void 0:y.checked)||!1,s=((B=document.getElementById("sec-est"))==null?void 0:B.checked)||!1,c=((m=document.getElementById("sec-bod"))==null?void 0:m.checked)||!1,a=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(d=>parseInt(d.dataset.val)),l=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(d=>parseInt(d.dataset.val)),f=[...document.querySelectorAll(".sec-estado-cb")],u=f.filter(d=>d.checked).map(d=>d.value),g=u.length===f.length,h=window._secMaxUF||null;$t=P.STOCK.filter(d=>{if(t&&!`${d.condominio||""} ${d.direccion||""} ${d.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(d.comuna)||i&&!d.oportunidad||s&&(!d.est||d.est==="0")||c&&(!d.bod||d.bod==="0")||!g&&!u.some(I=>ao(d.estado,I)))return!1;const{dorm:U,banos:F}=so(d.tipologia);if(a.length&&!a.some(I=>I===4?U>=4:U===I)||l.length&&!l.some(I=>I===3?F>=3:F===I))return!1;const _=parseFloat((d.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&_<o||n&&_>n||h&&_>h)}),Y=1,xe==="mapa"?ye($t):Ie()}function Ie(){const t=document.getElementById("sec-grid"),e=$t.length,o=Math.max(1,Math.ceil(e/Bt));Y>o&&(Y=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${Y} / ${o}`,document.getElementById("sec-prev").disabled=Y<=1,document.getElementById("sec-next").disabled=Y>=o;const n=P.STOCK.length,i=P.STOCK.filter(a=>(a.estado||"").toLowerCase().includes("lista para arrendar")).length,s=document.getElementById("tb-stats");s&&(s.textContent=`${i.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const c=$t.slice((Y-1)*Bt,Y*Bt);if(!c.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=c.map(a=>{const l=parseFloat((a.precioSinBono||"0").replace(/\./g,"").replace(",",".")),f=a.bonoPct>0,u=a.m2interior||a.m2total||"—",g=a.orientacion&&a.orientacion!=="-"?a.orientacion:"—",h=ve(a.estado),$=io(a.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${a.id}">
        <div class="pc-img-icon">🏢</div>
        ${a.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${a.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(a.condominio)}</div>
          <div class="pc-estado-badge" style="${$}">${h}</div>
        </div>
        <div class="pc-sub">DP ${r(a.dp||"—")} · ${r(a.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(a.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(a.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(u)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(g)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${l?"UF "+l.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${f?`<span class="pc-bono-badge">✅ Bono ${a.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(a.id)}')">Ver ficha →</button>
          ${a.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(a.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),It&&It.disconnect(),It=new IntersectionObserver(a=>{a.forEach(l=>{if(!l.isIntersecting)return;const f=l.target.id.replace("pcimg-","");Eo(f),It.unobserve(l.target)})},{rootMargin:"150px"}),c.forEach(a=>{const l=document.getElementById("pcimg-"+a.id);l&&It.observe(l)})}async function Eo(t){var o,n;const e=document.getElementById("pcimg-"+t);if(e){if(Ot[t]){se(e,Ot[t]);return}try{const s=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],c=((n=s==null?void 0:s.fotos_originales)!=null&&n.length?s.fotos_originales:s==null?void 0:s.fotos)||[];if(c.length){Ot[t]=c[0];const a=document.getElementById("pcimg-"+t);a&&se(a,c[0],c.length)}}catch{}}}function se(t,e,o){const n=e.replace(/^https?:\/\//,""),i=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${i}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const s=t.querySelector(".pc-img-icon");if(s&&(s.style.display="none"),o>1){const c=t.id.match(/pcimg-(.+)/);if(c){const a=document.getElementById("pcfc-"+c[1]);a&&(a.textContent="📷 "+o,a.style.display="")}}}function Fo(t){const e=Math.max(1,Math.ceil($t.length/Bt));Y=Math.min(Math.max(1,Y+t),e),Ie(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function Po(t){xe=t,mo(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(po(),setTimeout(()=>uo().invalidateSize(),120),ye($t))}async function we(t){var n,i,s;if(J=P.STOCK.find(c=>c.id===t)||null,!J)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",q=[],Q=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=J;try{Z=((i=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:i[0])||null}catch{Z=null}const o=((s=Z==null?void 0:Z.fotos_originales)!=null&&s.length?Z.fotos_originales:Z==null?void 0:Z.fotos)||[];if(o.length)q=o,document.getElementById("dp-spin").style.display="none",Wt(0),document.getElementById("dp-thumbs").innerHTML=o.map((c,a)=>{const l=c.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(l)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${a})" ${a===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const c=document.querySelector(".detail-photos"),a=document.createElement("div");a.id="dp-nophoto",a.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",a.textContent="Sin fotos disponibles",c.appendChild(a)}Io(e,Z)}function xo(t){we(t)}function Wt(t){var n;Q=Math.max(0,Math.min(t,q.length-1));const e=document.getElementById("dp-img"),o=q[Q].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${Q+1} / ${q.length}`,document.getElementById("dp-prev").disabled=Q===0,document.getElementById("dp-next").disabled=Q===q.length-1,document.querySelectorAll(".dp-thumbs img").forEach((i,s)=>i.classList.toggle("active",s===Q)),(n=document.getElementById("dp-thumbs").children[Q])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function qt(t){Wt(Q+t)}function Io(t,e){var x;const o=T(t.precioSinBono),n=T(t.m2total)||T(e==null?void 0:e.superficie),i=T(t.m2interior)||T(e==null?void 0:e.m2_utiles),s=T(t.m2terraza)||T(e==null?void 0:e.m2_terraza),c=(e==null?void 0:e.dormitorios)??"",a=(e==null?void 0:e.banios)??"",l=(e==null?void 0:e.piso)??"",f=((x=e==null?void 0:e.unitggcc)==null?void 0:x.monto)||(e==null?void 0:e.ggcc)||"",u=(e==null?void 0:e.youtube_video_id)||"",g=(e==null?void 0:e.espacios)||"",h=(e==null?void 0:e.building_finishes)||[],$=(t.oportunidad||"").toLowerCase().includes("oportunidad"),E=g?g.split(",").map(C=>C.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
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
      ${i&&i!==n?`<div class="spec-card"><div class="sv">${i.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>`:""}
      ${s?`<div class="spec-card"><div class="sv">${s.toFixed(1)} m²</div><div class="sl">Terraza</div></div>`:""}
      ${c!==""?`<div class="spec-card"><div class="sv">${c} 🛏</div><div class="sl">Dormitorios</div></div>`:""}
      ${a!==""?`<div class="spec-card"><div class="sv">${a} 🚿</div><div class="sl">Baños</div></div>`:""}
      ${l!==""?`<div class="spec-card"><div class="sv">Piso ${l}</div><div class="sl">Nivel</div></div>`:""}
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
        ${o?`<div class="pc-sub">$${Math.round(o*P.UF).toLocaleString("es-CL")}</div>`:""}
      </div>
      ${t.bonoPct>0?`
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${t.bonoPct}%</div>
        ${T(t.bonoUF)?`<div class="bc-sub">${T(t.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${E.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${E.map(C=>`<span class="dt-amenity">${r(C)}</span>`).join("")}</div>`:""}
    ${h.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${h.map(C=>{var d;const y=String(C).split(":"),B=((d=y[0])==null?void 0:d.trim())||"",m=y.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(B)}</div><div class="dt-finish-v">${r(m)}</div></div>`}).join("")}</div>`:""}
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
    ${wo(t)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizSecProp('${r(t.id)}')">📊 Cotizar</button>
      ${t.video?`<button class="btn-fotos" onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(t.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${q.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${q.length})</button>`:""}
    </div>`}function wo(t){const e=t.condominio||t.direccion;if(!e||!P.STOCK.length)return"";const o=P.STOCK.filter(i=>i.id!==t.id&&(i.condominio||i.direccion)===e);if(!o.length)return"";const n=o.map(i=>{const s=T(i.precioSinBono),c=T(i.m2total)||T(i.m2interior),a=[];return i.dp&&a.push("DP "+i.dp),c&&a.push(c.toFixed(0)+" m²"),i.orientacion&&i.orientacion!=="-"&&a.push(i.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(i.id)}')">
      <div class="ur-tipo">${r(i.tipologia||"—")}</div>
      <div class="ur-info">${a.join(" · ")}</div>
      <div class="ur-price">${s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function Zt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",q=[],Q=0,J=null,Z=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function Bo(t){const e=J;if(!e)return;const o=T(e.precioSinBono),n=T(e.m2total)||T(e.m2interior),i=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),s=`https://wa.me/?text=${encodeURIComponent(i)}`,c=document.createElement("div");c.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",c.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${i}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${s}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(c),c.addEventListener("click",a=>{a.target===c&&c.remove()})}async function Lo(){if(!q.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),n.style.width="0%";const i=new JSZip,s=i.folder("fotos-propiedad"),c=q.length;async function a(g){try{const h=await fetch(he(g));if(h.ok)return await h.blob()}catch{}try{const h=await fetch(g,{mode:"cors"});if(h.ok)return await h.blob()}catch{}return null}let l=0;for(let g=0;g<c;g++){o.textContent=`Descargando foto ${g+1} de ${c}…`,n.style.width=`${Math.round(g/c*90)}%`;const h=await a(q[g]);if(h){const $=h.type.includes("png")?"png":"jpg";s.file(`foto-${String(g+1).padStart(2,"0")}.${$}`,h),l++}}o.textContent="Generando ZIP…",n.style.width="95%";const f=await i.generateAsync({type:"blob"});if(n.style.width="100%",l===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${q.length})`;return}const u=document.createElement("a");u.href=URL.createObjectURL(f),u.download=`fotos-${((J==null?void 0:J.condominio)||(J==null?void 0:J.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,u.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${q.length})`},800)}async function So(){var xt;if(!J)return;const t=J,e=Z,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const i=T(t.precioSinBono),s=T(t.m2total)||T(e==null?void 0:e.superficie),c=T(t.m2interior)||T(e==null?void 0:e.m2_utiles),a=T(t.m2terraza)||T(e==null?void 0:e.m2_terraza),l=(e==null?void 0:e.dormitorios)??"",f=(e==null?void 0:e.banios)??"",u=(e==null?void 0:e.piso)??"",g=((xt=e==null?void 0:e.unitggcc)==null?void 0:xt.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(D=>D.trim()).filter(Boolean),e!=null&&e.building_finishes;const h=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),$=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function E(D){for(const z of[he(D),D])try{const k=await fetch(z);if(!k.ok)continue;const V=await k.blob();return await new Promise(R=>{const N=new FileReader;N.onload=et=>R(et.target.result),N.readAsDataURL(V)})}catch{}return null}o.textContent="⏳ Cargando logo…";const x=await E("images/logo.png");o.textContent="⏳ Cargando fotos…";const y=(await Promise.all(q.slice(0,5).map(E))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:B}=window.jspdf,m=new B({unit:"mm",format:"a4",orientation:"portrait"}),d=210,U=297,F=10,_=190,I=[67,56,202],v=[107,114,128],b=[249,250,251],w=[255,255,255],A=[17,24,39],K=[5,150,105],ut=[209,250,229],W=D=>m.setFillColor(D[0],D[1],D[2]),O=D=>m.setTextColor(D[0],D[1],D[2]),st=(D,z,k,V,R,N)=>{W(N),m.roundedRect(D,z,k,V,R,R,"F")},mt=(D,z)=>(W([229,231,235]),m.rect(F,z,_,.3,"F"),m.setFontSize(7.5),m.setFont("helvetica","bold"),O(v),m.text(D.toUpperCase(),F,z+4.5),z+8);let S=0;W(I),m.rect(0,0,d,22,"F"),x?(st(F-1,3,44,15,2.5,w),m.addImage(x,"PNG",F+1,5,40,7.4,void 0,"FAST")):(m.setFont("helvetica","bold"),m.setFontSize(16),O(w),m.text("ViveProp",F,14)),m.setFont("helvetica","normal"),m.setFontSize(8.5),O([200,200,230]),m.text("Ficha de Propiedad",d-F,10,{align:"right"}),m.text($,d-F,16,{align:"right"}),S=22,W([238,242,255]),m.rect(0,S,d,32,"F"),m.setFont("helvetica","bold"),m.setFontSize(15),O(A);const tt=t.condominio||t.direccion||"—";m.text(tt.length>38?tt.slice(0,36)+"…":tt,F,S+11),m.setFont("helvetica","normal"),m.setFontSize(9),O(v);const Ft=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(m.text(Ft.length>55?Ft.slice(0,53)+"…":Ft,F,S+18),m.setFont("helvetica","bold"),m.setFontSize(20),O(I),m.text(i?i.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",d-F,S+13,{align:"right"}),m.setFontSize(8),O(v),m.setFont("helvetica","normal"),m.text("Precio sin bono pie",d-F,S+8,{align:"right"}),t.bonoPct>0&&(st(d-F-42,S+18,42,9,2,ut),m.setFont("helvetica","bold"),m.setFontSize(8),O(K),m.text(`Acepta Bono Pie ${t.bonoPct}%`,d-F-21,S+23.5,{align:"center"})),S+=34,y.length){const V=y.length>1?118:_,R=_-V-2;try{m.addImage(y[0],"JPEG",F,S,V,52,void 0,"FAST")}catch{}if(y[1])try{m.addImage(y[1],"JPEG",F+V+2,S,R,25,void 0,"FAST")}catch{}if(y[2])try{m.addImage(y[2],"JPEG",F+V+2,S+25+2,R,25,void 0,"FAST")}catch{}if(S+=54,y[3]||y[4]){const N=y[4]?(_-2)/2:_;if(y[3])try{m.addImage(y[3],"JPEG",F,S,N,32,void 0,"FAST")}catch{}if(y[4])try{m.addImage(y[4],"JPEG",F+N+2,S,N,32,void 0,"FAST")}catch{}S+=34}}S+=4,S=mt("Características",S);const gt=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,s?{v:s.toFixed(0)+" m²",l:"Superficie"}:null,c?{v:c.toFixed(0)+" m²",l:"Sup. interior"}:null,a?{v:a.toFixed(0)+" m²",l:"Terraza"}:null,l!==""?{v:l+" dorm.",l:"Dormitorios"}:null,f!==""?{v:f+" baños",l:"Baños"}:null,u!==""?{v:"Piso "+u,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,g?{v:"$"+Number(g).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),at=4,ct=(_-(at-1)*3)/at,Pt=14;gt.forEach((D,z)=>{const k=z%at,V=Math.floor(z/at),R=F+k*(ct+3),N=S+V*(Pt+3);st(R,N,ct,Pt,2,b),m.setFont("helvetica","bold"),m.setFontSize(9),O(A),m.text(String(D.v).slice(0,18),R+ct/2,N+6.5,{align:"center"}),m.setFont("helvetica","normal"),m.setFontSize(7),O(v),m.text(D.l,R+ct/2,N+11,{align:"center"})}),S+=Math.ceil(gt.length/at)*(Pt+3)+4,W(I),m.rect(0,U-16,d,16,"F"),x?(st(F-1,U-14,33,11,2,w),m.addImage(x,"PNG",F+1,U-12.5,29,5.4,void 0,"FAST")):(m.setFont("helvetica","bold"),m.setFontSize(11),O(w),m.text("ViveProp",F,U-7)),m.setFont("helvetica","normal"),m.setFontSize(8),O([200,200,230]),m.text("www.viveprop.cl · Stock de propiedades en gestión",d-F,U-7,{align:"right"}),m.save(`ficha-${h}.pdf`),o.textContent=n,o.disabled=!1}function Mo(t){Gt=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function Uo(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Gt).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Gt)})}function Be(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function H(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Vt(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function To(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function wt(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function Do(t){const e={};for(const[o,n]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(n??"").trim());return e}function _o(t,e){const o=Do(t),n=(e||"").toUpperCase(),i={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(n.includes("INGEVEC")){const s=wt(o["Cuotas pie"]);return{...i,descuentoDepto:H(o["Dcto. depto."]),aporteInmobiliario:H(o["Aporte inmobiliario"]),reservaCLP:Vt(o.Reserva),cuotasPieN:Math.max(s-1,0),pieConstPct:H(o["Pie período const."]),creditoDirectoPct:H(o["Pie crédito s/int."]),cuotonPct:H(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("MAESTRA")){const s=H(o.Upfront),c=H(o["Pie en cuotas"]);return{...i,descuentoDepto:H(o["Descuento Base"])+H(o["Dcto Adicional"]),aporteInmobiliario:H(o["Certificado Pago"]),upfrontPct:s,piePctDefault:s+c||null,cuotasPieN:wt(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("RVC")){const s=H(o["Pie mínimo"]);return{...i,descuentoDepto:H(o["Descuento RVC"]),piePctDefault:s||null,cuotasPieN:wt(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const s=o["Monto Reserva"]||"",c=/uf/i.test(s),a=H(o["Pie minimo %"]);return{...i,descuentoDepto:H(o["Descuento autorizado"]),reservaCLP:c?0:Vt(s),reservaUF:c?To(s):0,piePctDefault:a||null,cuotasPieN:wt(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("URMENETA")){const s=(t==null?void 0:t.nota)||"",c=s.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||s.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||s.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),a=c?parseFloat(c[1].replace(",","."))/100:0;return{...i,descuentoDepto:H(o["Descuento máximo"]),aporteInmobiliario:a,reservaCLP:Vt(o["Valor reserva"]),pieConstPct:H(o["% cuotas const."]),cuotasPieN:wt(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:s}}return i}const Tt={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},ae={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},Ao=[.04,.045,.05],Le=30,Se=.12;function jo(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function Me(t){const e=(t||"").toUpperCase();return ae[e]||ae.DEFAULT}function zo(t){const{precioListaDepto:e,descuentoPct:o,bonoPiePct:n,reservaCLP:i,preciosConjuntos:s,piePct:c,upfrontPct:a,plazoAnios:l,tasasCAE:f,valorUF:u,cuotonPct:g,piePeriodoConstruccionPct:h,pieCreditoDirectoPct:$,cuotasPieN:E,arriendosMensualesCLP:x,plusvaliaAnual:C,tipoCalculoBono:y}=t,B=t.pieConjuntosPct??.2,m=(s||[]).reduce((lt,kt)=>lt+kt,0),d=e+m,U=Math.min(o+0,1),F=e*(1-U),_=m,I=F+_,v=I*u,b=y==="maestra"?c:B,w=Math.round(F*c*100)/100,A=Math.round(m*b*100)/100,K=w+A,ut=i/u,W=Math.round(I*(a||0)*100)/100,O=K-ut-W,st=O*u,mt=E>0?O/E:O,S=mt*u,tt=Math.round(I*(g||0)*100)/100,Ft=Math.round(tt*u),gt=Math.round(I*(h||0)*100)/100,at=Math.round(gt*u),ct=Math.round(I*($||0)*100)/100,Pt=Math.round(ct*u),xt=K+tt+gt,D=I*(1-c);let z,k,V,R,N,et;if(y==="maestra"){const lt=1-c-n;k=n>0?Math.round(D/lt*100)/100:I,z=Math.round(k*n*100)/100,V=Math.round(k*lt*100)/100,et=K,R=Math.round((k-et-V)*100)/100,N=k>0?R/k:0}else y==="precio-lista-total"?(z=Math.round(d*n*100)/100,k=n>0?Math.round((I+z)*100)/100:I,R=z,N=n,et=K,V=Math.round((I-et-R)*100)/100):(z=Math.round(e*n*100)/100,k=n>0?Math.round((I+z)*100)/100:I,R=z,N=n,et=K,V=Math.round((I-et-R)*100)/100);const ee=V*u,He=k*u,oe=Math.pow(1+(C||Tt.PLUSVALIA_DEFAULT),5)-1,Ge=v*(1+oe)*Tt.HAIRCUT_VENTA,qe=xt*u,Je=f.map((lt,kt)=>{const Ut=(x||[0,0,0])[kt]||0,Ke=l*12,Rt=jo(lt/12,Ke,ee),We=Rt/u,ne=Ut-Rt,Ze=ne*Tt.MESES_ARRIENDO_ANIO*5,Ye=k>0?Ut*Tt.MESES_ARRIENDO_ANIO/u/k:0,Qe=Ut*.9,ie=v>0?Math.round(Qe*12/v*1e4)/1e4:0,Xe=Math.round(ie*5*1e4)/1e4;return{cae:lt,arriendoMensualCLP:Ut,cuotaMensualCLP:Math.round(Rt),cuotaMensualUF:Math.round(We*100)/100,flujoMensualCLP:Math.round(ne),flujoAcumuladoCLP:Math.round(Ze),capRate:Math.round(Ye*1e4)/1e4,roi5Anios:Xe,roiAnual:ie}});return{valorUF:u,precioListaDepto:e,precioListaOtros:m,precioListaTotal:d,precioDescDepto:Math.round(F*100)/100,precioDescOtros:_,valorVentaUF:Math.round(I*100)/100,valorVentaCLP:Math.round(v),piePct:c,upfrontPct:a||0,pieTotalDeptoUF:Math.round(w*100)/100,pieTotalConjuntosUF:Math.round(A*100)/100,pieTotalUF:Math.round(K*100)/100,reservaUF:Math.round(ut*100)/100,upfrontUF:W,saldoPieUF:Math.round(O*100)/100,saldoPieCLP:Math.round(st),cuotasPieN:E,valorCuotaPieUF:Math.round(mt*100)/100,valorCuotaPieCLP:Math.round(S),cuotonUF:tt,cuotonCLP:Ft,piePeriodoConstruccionUF:gt,piePeriodoConstruccionCLP:at,pieCreditoDirectoUF:ct,pieCreditoDirectoCLP:Pt,totalPieInmobUF:Math.round(xt*100)/100,descuentoAdicionalPct:0,bonoPieUF:z,saldoAporteInmobUF:Math.round(R*100)/100,aportePct:Math.round(N*1e4)/1e4,pieCreditoHipUF:Math.round(et*100)/100,tasacionUF:Math.round(k*100)/100,tasacionCLP:Math.round(He),creditoHipBaseUF:Math.round(D*100)/100,creditoHipFinalUF:Math.round(V*100)/100,creditoHipFinalCLP:Math.round(ee),plusvaliaAcumulada:Math.round(oe*1e4)/1e4,precioVentaAnio5CLP:Math.round(Ge),piePagadoCLP:Math.round(qe),escenarios:Je}}let M=null,Mt=!1;function Ue(t){try{const{project:e,depto:o,secundarios:n=[]}=t;console.log("[Cotizador] cotizFromProp",{project:e,depto:o,secundarios:n});const i=P.CC_DATA[e.id]||null,s=_o(i,e.inmobiliaria),c=Me(e.inmobiliaria),a=s.reservaUF>0?Math.round(s.reservaUF*P.UF):s.reservaCLP;M={project:e,depto:o,secundarios:n,parsedCC:s,regla:c,reservaCLP:a,cliente:null},De(),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(e){console.error("[Cotizador] Error en cotizFromProp:",e),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}

${r(e.stack||"")}</div>`}}function Te(){if(M)try{const t=Ko(),e=Wo(t),o=zo(e);console.log("[Cotizador] Input:",e),console.log("[Cotizador] Resultado:",o),Zo(o,t)}catch(t){console.error("[Cotizador] Error en recalcCotizPanel:",t),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(t))}

${r(t.stack||"")}</div>`}}function ko(){var o,n,i,s;const t=(n=(o=M==null?void 0:M.project)==null?void 0:o.id)==null?void 0:n.startsWith("sec-"),e=!t&&M?{pid:(i=M.project)==null?void 0:i.id,dp:(s=M.depto)==null?void 0:s.dp,extraDps:(M.secundarios??[]).map(c=>c.dp)}:null;M=null,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.openModule(t?"sec":"pri"),e!=null&&e.pid&&window.reopenWithUnit(e.pid,e.dp,e.extraDps)}function rt(t){return+((t??0)*100).toFixed(2)}function De(){const{project:t,depto:e,secundarios:o}=M,n=[`${t.nombre} · DP ${e.dp}${e.tipologia?" "+e.tipologia:""}`,...o.map(a=>`${a.tipologia?a.tipologia+" ":""}DP ${a.dp}`)];document.getElementById("ccf-header-title").textContent=n.join(" + ");const i=e.precio_uf+o.reduce((a,l)=>a+l.precio_uf,0),s=[`DP ${e.dp}${e.tipologia?" — "+e.tipologia:""} · ${p.uf2(e.precio_uf)}`,...o.map(a=>`${a.tipologia?a.tipologia+" ":""}DP ${a.dp} · ${p.uf2(a.precio_uf)}`)];document.getElementById("ccf-prop-summary").innerHTML=`<div class="ccf-prop-lines">${s.map(a=>`<div class="ccf-prop-line">${r(a)}</div>`).join("")}</div><div class="ccf-prop-total">Total precio lista: <strong>${p.uf2(i)}</strong></div>`,["ccf-nombre","ccf-rut","ccf-email","ccf-tel"].forEach(a=>{const l=document.getElementById(a);l&&(l.value="",l.classList.remove("cp-input--err"))});const c=document.getElementById("ccf-objetivo");if(c&&(c.value="",c.classList.remove("cp-input--err")),document.querySelectorAll(".ccf-err").forEach(a=>{a.textContent=""}),["ccf-cor-nombre","ccf-cor-email","ccf-cor-tel"].forEach(a=>{const l=document.getElementById(a);l&&(l.value="",l.classList.remove("cp-input--err"))}),Mt){try{const a=JSON.parse(localStorage.getItem("_corredor")||"{}");a.nombre&&(document.getElementById("ccf-cor-nombre").value=a.nombre),a.email&&(document.getElementById("ccf-cor-email").value=a.email),a.tel&&(document.getElementById("ccf-cor-tel").value=a.tel)}catch{}try{const a=JSON.parse(localStorage.getItem("_ultimo_cliente")||"{}");if(a.nombre){const l=document.getElementById("ccf-nombre");l&&(l.value=a.nombre)}if(a.rut){const l=document.getElementById("ccf-rut");l&&(l.value=a.rut)}if(a.email){const l=document.getElementById("ccf-email");l&&(l.value=a.email)}if(a.tel){const l=document.getElementById("ccf-tel");l&&(l.value=a.tel)}if(a.objetivo){const l=document.getElementById("ccf-objetivo");l&&(l.value=a.objetivo)}}catch{}}}function Ro(t){const e=t.replace(/[.\s]/g,"").toUpperCase();if(!/^\d{7,8}-?[0-9K]$/.test(e))return!1;const o=e.replace("-",""),n=o.slice(0,-1),i=o.slice(-1);let s=0,c=2;for(let f=n.length-1;f>=0;f--)s+=parseInt(n[f])*c,c=c===7?2:c+1;const a=11-s%11,l=a===11?"0":a===10?"K":String(a);return i===l}function ce(t){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim())}function le(t){const e=t.replace(/[\s\-\(\)\.]/g,"");return/^(\+?56)?9\d{8}$/.test(e)||/^\+?56[2-9]\d{7}$/.test(e)}function G(t,e){const o=document.getElementById(t),n=document.getElementById(t+"-err");o&&o.classList.toggle("cp-input--err",!!e),n&&(n.textContent=e||"")}function Oo(t){G(t,"")}function Vo(t){const e=document.getElementById(t);if(!e)return;const o=e.value.replace(/[^\dkK]/g,"").toUpperCase();if(o.length>1){const n=o.slice(0,-1),i=o.slice(-1);e.value=n.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+i}G(t,"")}function No(){if(!M)return;let t=!0;const e=u=>{var g;return(((g=document.getElementById(u))==null?void 0:g.value)||"").trim()},o=e("ccf-nombre");o.length<2&&(G("ccf-nombre","Ingresa el nombre completo"),t=!1);const n=e("ccf-rut");n?Ro(n)||(G("ccf-rut","RUT inválido — verifica el dígito verificador"),t=!1):(G("ccf-rut","Ingresa el RUT"),t=!1);const i=e("ccf-email");i?ce(i)||(G("ccf-email","Formato de email inválido"),t=!1):(G("ccf-email","Ingresa el email"),t=!1);const s=e("ccf-tel");s?le(s)||(G("ccf-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(G("ccf-tel","Ingresa el teléfono"),t=!1);const c=e("ccf-objetivo");c||(G("ccf-objetivo","Selecciona un objetivo"),t=!1);const a=e("ccf-cor-nombre");a.length<2&&(G("ccf-cor-nombre","Ingresa el nombre del corredor"),t=!1);const l=e("ccf-cor-email");l?ce(l)||(G("ccf-cor-email","Formato de email inválido"),t=!1):(G("ccf-cor-email","Ingresa el email del corredor"),t=!1);const f=e("ccf-cor-tel");if(f?le(f)||(G("ccf-cor-tel","Formato inválido — ej: +56 9 1234 5678"),t=!1):(G("ccf-cor-tel","Ingresa el teléfono del corredor"),t=!1),!!t){try{localStorage.setItem("_corredor",JSON.stringify({nombre:a,email:l,tel:f}))}catch{}try{localStorage.setItem("_ultimo_cliente",JSON.stringify({nombre:o,rut:n,email:i,tel:s,objetivo:c}))}catch{}M.cliente={nombre:o,rut:n,email:i,tel:s,objetivo:c,corNombre:a,corEmail:l,corTel:f},M.cotizId=on(),document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="flex",Jo(M.parsedCC),Mt=!1}}function Ho(){document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-client-form").style.display="flex"}function Go(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};try{localStorage.setItem("_arriendos",JSON.stringify({arr1:t("cpg-arriendo1"),arr2:t("cpg-arriendo2"),arr3:t("cpg-arriendo3")}))}catch{}document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="flex",Te()}function qo(){document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-params-step").style.display="flex"}function Jo(t){const e=Math.round((t.piePctDefault??Se)*100),o=rt((t.descuentoDepto??0)+(t.descuentoAdicional??0)),n=rt(t.aporteInmobiliario),i=t.cuotasPieN??0,s=rt(t.pieConstPct),c=rt(t.cuotonPct),a=rt(t.upfrontPct),l=rt(t.creditoDirectoPct),[f,u,g]=Ao.map(b=>rt(b)),{project:h,depto:$,secundarios:E}=M,x=[`${h.nombre} · DP ${$.dp}${$.tipologia?" "+$.tipologia:""}`,...E.map(b=>`${b.tipologia?b.tipologia+" ":""}DP ${b.dp}`)];document.getElementById("cps-header-title").textContent=x.join(" + ");const C=(b,w,A)=>`<div class="cp-fg"><label class="cp-fg-lbl">${b}</label><input id="${w}" class="cp-input cp-input--locked" type="text" value="${A}%" disabled></div>`,y=(b,w,A,K,ut)=>{const W=parseFloat(K),mt=(A.some(S=>parseFloat(S)===W)?A:[...A,W].sort((S,tt)=>S-tt)).map(S=>`<option value="${S}"${parseFloat(S)===W?" selected":""}>${ut(S)}</option>`).join("");return`<div class="cp-fg"><label class="cp-fg-lbl">${b}</label><select id="${w}" class="cp-input cp-select">${mt}</select></div>`},B=(b,w,A)=>`<div class="cp-fg"><label class="cp-fg-lbl">${b}</label><input id="${w}" class="cp-input" type="number" min="0" step="any" value="${A}"></div>`,m=`Cuotas Pie${i>0?` <span class="cp-fg-base">base ${i}</span>`:""}`,d=`Cuotón %${c===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,U=[0,5,10,15,20,25,30,35,40],F=[0,6,12,18,24,30,36,48,60],_=[0,1,2,3,4,5,6,7,8,9,10],I=[5,10,15,20,25,30],v=[3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8];document.getElementById("cps-params-grid").innerHTML=`
    <div class="cp-section-title">Configuración de cotización</div>
    <p class="cps-nota">Los campos en gris se leen desde condiciones comerciales y no son editables.</p>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${C("Descuento (%)","cpg-dcto",o)}
        ${C("Aporte Inmobiliaria (%)","cpg-aporte",n)}
        ${y("% de Pie","cpg-pie",U,e,b=>b+"%")}
        ${y(m,"cpg-cuotas",F,i,b=>b===0?"Sin cuotas":b+" cuotas")}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${C("Pie Construcción (%)","cpg-piecst",s)}
        ${y(d,"cpg-cuoton",_,c,b=>b+"%")}
        ${C("Crédito Directo (%)","cpg-cdir",l)}
        ${B("Upfront Promesa (%)","cpg-upfront",a)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${B("Plusvalía anual (%)","cpg-plusvalia",2)}
        ${y("Plazo","cpg-plazo",I,Le,b=>b+" años")}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${y("Escenario 1 CAE","cpg-cae1",v,f,b=>b.toFixed(1)+"%")}
        ${y("Escenario 2 CAE","cpg-cae2",v,u,b=>b.toFixed(1)+"%")}
        ${y("Escenario 3 CAE","cpg-cae3",v,g,b=>b.toFixed(1)+"%")}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${B("Arriendo est. Esc. 1 ($/mes)","cpg-arriendo1",Nt().arr1)}
        ${B("Arriendo est. Esc. 2 ($/mes)","cpg-arriendo2",Nt().arr2)}
        ${B("Arriendo est. Esc. 3 ($/mes)","cpg-arriendo3",Nt().arr3)}
      </div>
    </div>`}function Nt(){if(!Mt)return{arr1:"",arr2:"",arr3:""};try{const t=JSON.parse(localStorage.getItem("_arriendos")||"{}");return{arr1:t.arr1??"",arr2:t.arr2??"",arr3:t.arr3??""}}catch{return{arr1:"",arr2:"",arr3:""}}}function Ko(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:t("cpg-pie")||Se*100,plazo:t("cpg-plazo")||Le,dcto:t("cpg-dcto"),aporte:t("cpg-aporte"),cuotas:t("cpg-cuotas"),piecst:t("cpg-piecst"),cuoton:t("cpg-cuoton"),upfront:t("cpg-upfront"),cdir:t("cpg-cdir"),plusvalia:t("cpg-plusvalia")||2,cae1:t("cpg-cae1")||4,cae2:t("cpg-cae2")||4.5,cae3:t("cpg-cae3")||5,arriendo1:t("cpg-arriendo1"),arriendo2:t("cpg-arriendo2"),arriendo3:t("cpg-arriendo3")}}function Wo(t){const{reservaCLP:e,regla:o,depto:n,secundarios:i}=M;return{precioListaDepto:n.precio_uf,descuentoPct:t.dcto/100,descuentoAdicionalPct:0,bonoPiePct:t.aporte/100,reservaCLP:e,preciosConjuntos:i.map(s=>s.precio_uf),piePct:t.pie/100,upfrontPct:t.upfront/100,cuotasPieN:t.cuotas,cuotonPct:t.cuoton/100,piePeriodoConstruccionPct:t.piecst/100,pieCreditoDirectoPct:t.cdir/100,plazoAnios:t.plazo,tasasCAE:[t.cae1/100,t.cae2/100,t.cae3/100],valorUF:P.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[t.arriendo1,t.arriendo2,t.arriendo3],plusvaliaAnual:t.plusvalia/100}}function j(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function Zo(t,e){var c;const{project:o,depto:n,secundarios:i}=M,s=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...i.map(a=>`${a.tipologia?a.tipologia+" ":""}DP ${a.dp}`)];document.getElementById("cp-header-title").textContent=s.join(" + "),document.getElementById("cp-results").innerHTML=Yo(t,n,i)+Qo(t)+(t.pieCreditoDirectoUF>0?Xo(t):"")+tn(t,e.plazo)+(((c=M.cliente)==null?void 0:c.objetivo)==="inversion"?en(t):""),nn(t,e)}function Yo(t,e,o){const n=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,i=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(e.dp))}${e.tipologia?" &mdash; "+r(e.tipologia):""}</td>
      <td>${p.uf2(t.precioListaDepto)}</td>
      <td>${n>1e-4?`<span class="cp-val-dcto">&minus;${j(n)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${p.uf2(t.precioDescDepto)}</td>
    </tr>`,s=o.map(c=>`
    <tr>
      <td class="cp-val-unit">${c.tipologia?r(c.tipologia)+" ":""}DP ${r(String(c.dp))}</td>
      <td>${p.uf2(c.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${p.uf2(c.precio_uf)}</td>
    </tr>`).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Valores</div>
    <div class="cp-section-body">
      <table class="cp-val-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Dcto.</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${i}${s}
          <tr class="cp-val-total">
            <td>Total</td>
            <td>${p.uf2(t.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${p.uf2(t.valorVentaUF)}<br>
              <small class="cp-val-clp">${p.pesos(t.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function Qo(t){let e="";if(e+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${j(t.piePct)}</span></span>
      <span class="cp-plan-val">${p.uf2(t.pieTotalUF)}<small>${p.pesos(t.pieTotalUF*t.valorUF)}</small></span>
    </div>`,t.reservaUF>.001&&(e+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${p.uf2(t.reservaUF)}<small>${p.pesos(t.reservaUF*t.valorUF)}</small></span>
    </div>`),t.upfrontUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${j(t.upfrontPct)}</span></span>
        <span class="cp-plan-val">${p.uf2(t.upfrontUF)}<small>${p.pesos(t.upfrontUF*t.valorUF)}</small></span>
      </div>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${t.cuotasPieN} cuotas &times; ${p.uf2(t.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${p.uf2(t.saldoPieUF)}<small>${p.pesos(t.saldoPieCLP)}</small></span>
      </div>`),t.piePeriodoConstruccionUF>0){const n=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${j(n)}</span></span>
        <span class="cp-plan-val">${p.uf2(t.piePeriodoConstruccionUF)}<small>${p.pesos(t.piePeriodoConstruccionCLP)}</small></span>
      </div>`}t.cuotonUF>0&&(e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${p.uf2(t.cuotonUF)}<small>${p.pesos(t.cuotonCLP)}</small></span>
      </div>`);const o=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;return e+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${j(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${p.uf2(t.totalPieInmobUF)}<small>${p.pesos(t.totalPieInmobUF*t.valorUF)}</small></span>
    </div>`,t.bonoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${j(t.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${p.uf2(t.bonoPieUF)}<small>${p.pesos(t.bonoPieUF*t.valorUF)}</small></span>
      </div>`),`
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${e}</div>
    </div>
  </div>`}function Xo(t){const e=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${j(e)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${p.uf2(t.pieCreditoDirectoUF)}<small>${p.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function tn(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,n=t.escenarios.map((i,s)=>{const c=i.cuotaMensualCLP/.25;return`
      <tr${s===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(i.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${p.pesos(i.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${p.uf2(i.cuotaMensualUF)}</td>
        <td>${p.pesos(c)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${e} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${p.uf2(t.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${p.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${j(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${p.uf2(t.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${p.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${n}</tbody>
      </table>
    </div>
  </div>`}function en(t){const o=t.escenarios.map(i=>`CAE ${(i.cae*100).toFixed(1).replace(/\.0$/,"")}%`).map(i=>`<th>${i}</th>`).join(""),n=(i,s)=>`<tr><td>${i}</td>${s.map(c=>`<td>${c}</td>`).join("")}</tr>`;return`
  <div class="cp-section">
    <div class="cp-section-title">Análisis de Inversión &middot; 5 años</div>
    <div class="cp-section-body">
      <table class="cp-inv-tbl">
        <thead><tr><th>Concepto</th>${o}</tr></thead>
        <tbody>
          ${n("Precio de venta año 5 ($)",t.escenarios.map(()=>p.pesos(t.precioVentaAnio5CLP)))}
          ${n("Pie pagado ($)",t.escenarios.map(()=>p.pesos(t.piePagadoCLP)))}
          ${n("Flujo acumulado ($)",t.escenarios.map(i=>p.pesos(i.flujoAcumuladoCLP)))}
          ${n("Cap Rate anual",t.escenarios.map(i=>j(i.capRate)))}
          ${n("ROI s/pie 5 años",t.escenarios.map(i=>j(i.roi5Anios)))}
          ${n("ROI anual compuesto",t.escenarios.map(i=>j(i.roiAnual)))}
        </tbody>
      </table>
    </div>
  </div>`}function on(){const t=new Date().getFullYear(),e=`_cotiz_counter_${t}`,o=parseInt(localStorage.getItem(e)||"0")+1;try{localStorage.setItem(e,String(o))}catch{}return`COT-${t}-${String(o).padStart(4,"0")}`}function nn(t,e){const o=document.getElementById("cotiz-print-doc");if(!o||!(M!=null&&M.cliente))return;const{project:n,depto:i,secundarios:s,cliente:c,cotizId:a}=M,f=new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"}),u={vivienda:"Vivienda propia",inversion:"Inversión / arriendo",segunda:"Segunda vivienda",subsidio:"Subsidio habitacional"},g=[`${i.tipologia?i.tipologia+" ":""}DP ${i.dp} · ${p.uf2(i.precio_uf)}`,...s.map(d=>`${d.tipologia?d.tipologia+" ":""}DP ${d.dp} · ${p.uf2(d.precio_uf)}`)].map(d=>`<div class="prd-unit-line">${r(d)}</div>`).join(""),h=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,$=`<tr>
    <td>${r(String(i.dp))}${i.tipologia?" — "+r(i.tipologia):""}</td>
    <td>${p.uf2(t.precioListaDepto)}</td>
    <td>${h>1e-4?"−"+j(h):"—"}</td>
    <td>${p.uf2(t.precioDescDepto)}</td>
  </tr>`,E=s.map(d=>`<tr>
    <td>${d.tipologia?r(d.tipologia)+" ":""}DP ${r(String(d.dp))}</td>
    <td>${p.uf2(d.precio_uf)}</td><td>—</td>
    <td>${p.uf2(d.precio_uf)}</td>
  </tr>`).join("");let x="";if(x+=`<tr><td><strong>Pie total</strong> ${j(t.piePct)}</td><td>${p.uf2(t.pieTotalUF)}</td><td>${p.pesos(t.pieTotalUF*t.valorUF)}</td></tr>`,t.reservaUF>.001&&(x+=`<tr class="prd-tbl-sub"><td>Reserva</td><td>${p.uf2(t.reservaUF)}</td><td>${p.pesos(t.reservaUF*t.valorUF)}</td></tr>`),t.upfrontUF>0&&(x+=`<tr class="prd-tbl-sub"><td>Upfront ${j(t.upfrontPct)}</td><td>${p.uf2(t.upfrontUF)}</td><td>${p.pesos(t.upfrontUF*t.valorUF)}</td></tr>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(x+=`<tr class="prd-tbl-sub"><td>Saldo pie — ${t.cuotasPieN} cuotas × ${p.uf2(t.valorCuotaPieUF)}/mes</td><td>${p.uf2(t.saldoPieUF)}</td><td>${p.pesos(t.saldoPieCLP)}</td></tr>`),t.piePeriodoConstruccionUF>0){const d=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;x+=`<tr><td>Pie período construcción ${j(d)}</td><td>${p.uf2(t.piePeriodoConstruccionUF)}</td><td>${p.pesos(t.piePeriodoConstruccionCLP)}</td></tr>`}t.cuotonUF>0&&(x+=`<tr><td>Cuotón</td><td>${p.uf2(t.cuotonUF)}</td><td>${p.pesos(t.cuotonCLP)}</td></tr>`);const C=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;x+=`<tr class="prd-tbl-total"><td><strong>Total pie a inmobiliaria</strong> ${j(C)}</td><td>${p.uf2(t.totalPieInmobUF)}</td><td>${p.pesos(t.totalPieInmobUF*t.valorUF)}</td></tr>`,t.bonoPieUF>0&&(x+=`<tr class="prd-tbl-aporte"><td>Aporte inmobiliaria ${j(t.aportePct)}</td><td>${p.uf2(t.bonoPieUF)}</td><td>${p.pesos(t.bonoPieUF*t.valorUF)}</td></tr>`);let y="";if(t.pieCreditoDirectoUF>0){const d=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;y=`<div class="prd-section">
      <div class="prd-section-title">Crédito Directo Inmobiliaria</div>
      <table class="prd-tbl"><tbody>
        <tr><td>Financiamiento directo ${j(d)} × valor venta</td><td>${p.uf2(t.pieCreditoDirectoUF)}</td><td>${p.pesos(t.pieCreditoDirectoCLP)}</td></tr>
      </tbody></table>
    </div>`}const B=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,m=t.escenarios.map((d,U)=>{const F=d.cuotaMensualCLP/.25;return`<tr${U===1?' class="prd-esc-hl"':""}>
      <td>CAE ${(d.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
      <td>${p.pesos(d.cuotaMensualCLP)}</td>
      <td>${p.uf2(d.cuotaMensualUF)}</td>
      <td>${p.pesos(F)}</td>
    </tr>`}).join("");o.innerHTML=`
  <div class="prd-wrap">
    <div class="prd-header">
      <img src="/images/logo.png" alt="ViveProp" class="prd-logo">
      <div class="prd-header-mid">COTIZACIÓN</div>
      <div class="prd-header-right">
        <div class="prd-cot-num">${r(a)}</div>
        <div class="prd-cot-date">${f}</div>
      </div>
    </div>

    <div class="prd-meta-row">
      <div class="prd-meta-block">
        <div class="prd-meta-title">Proyecto</div>
        <div class="prd-meta-main">${r(n.nombre)}</div>
        <div class="prd-meta-sub">${[n.inmobiliaria&&r(n.inmobiliaria),n.comuna&&r(n.comuna)].filter(Boolean).join(" · ")}</div>
        <div class="prd-units-list">${g}</div>
      </div>
      <div class="prd-meta-block">
        <div class="prd-meta-title">Cliente</div>
        <div class="prd-meta-main">${r(c.nombre)}</div>
        <div class="prd-meta-sub">RUT ${r(c.rut)}</div>
        <div class="prd-meta-sub">${r(c.email)}</div>
        <div class="prd-meta-sub">${r(c.tel)}</div>
        <div class="prd-meta-obj">${u[c.objetivo]||r(c.objetivo)}</div>
      </div>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Valores</div>
      <table class="prd-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Descuento</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${$}${E}
          <tr class="prd-tbl-total"><td>Total</td><td>${p.uf2(t.precioListaTotal)}</td><td></td><td>${p.uf2(t.valorVentaUF)} <small>(${p.pesos(t.valorVentaCLP)})</small></td></tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Plan de Pago</div>
      <table class="prd-tbl">
        <thead><tr><th>Concepto</th><th>UF</th><th>$</th></tr></thead>
        <tbody>${x}</tbody>
      </table>
    </div>

    ${y}

    <div class="prd-section">
      <div class="prd-section-title">Crédito Hipotecario · ${e.plazo} años</div>
      <div class="prd-hip-summary">
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Tasación banco</span>
          <span class="prd-hip-val">${p.uf2(t.tasacionUF)}</span>
          <span class="prd-hip-sub">${p.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">LTV</span>
          <span class="prd-hip-val">${j(B)}</span>
          <span class="prd-hip-sub">× tasación</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Crédito hipotecario</span>
          <span class="prd-hip-val">${p.uf2(t.creditoHipFinalUF)}</span>
          <span class="prd-hip-sub">${p.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="prd-tbl">
        <thead><tr><th>CAE</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr></thead>
        <tbody>${m}</tbody>
      </table>
    </div>

    ${c.objetivo==="inversion"?`
    <div class="prd-section">
      <div class="prd-section-title">Análisis de Inversión · 5 años</div>
      <table class="prd-inv-tbl">
        <thead>
          <tr>
            <th>Concepto</th>
            ${t.escenarios.map(d=>`<th>CAE ${(d.cae*100).toFixed(1).replace(/\.0$/,"")}%</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr><td>Precio de venta año 5 ($)</td>${t.escenarios.map(()=>`<td>${p.pesos(t.precioVentaAnio5CLP)}</td>`).join("")}</tr>
          <tr><td>Pie pagado ($)</td>${t.escenarios.map(()=>`<td>${p.pesos(t.piePagadoCLP)}</td>`).join("")}</tr>
          <tr><td>Flujo acumulado ($)</td>${t.escenarios.map(d=>`<td>${p.pesos(d.flujoAcumuladoCLP)}</td>`).join("")}</tr>
          <tr><td>Cap Rate anual</td>${t.escenarios.map(d=>`<td>${j(d.capRate)}</td>`).join("")}</tr>
          <tr><td>ROI s/pie 5 años</td>${t.escenarios.map(d=>`<td>${j(d.roi5Anios)}</td>`).join("")}</tr>
          <tr><td>ROI anual compuesto</td>${t.escenarios.map(d=>`<td>${j(d.roiAnual)}</td>`).join("")}</tr>
        </tbody>
      </table>
    </div>`:""}

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${r(c.corNombre)} · ${r(c.corEmail)} · ${r(c.corTel)}
      </div>
      <div class="prd-disclaimer">
        Cotización referencial — no constituye oferta formal de venta. Valores UF calculados al ${f} (1 UF = ${p.pesos(t.valorUF)}). Los dividendos son estimaciones según escenarios de tasa CAE indicados y pueden variar según condiciones del banco y perfil del solicitante.
      </div>
    </div>
  </div>`}function sn(){M!=null&&M.cliente&&window.print()}function an(t){try{const e=P.STOCK.find(a=>a.id===t);if(!e)return;const o=parseFloat((e.precioSinBono||"0").replace(/\./g,"").replace(",","."))||0,n={id:`sec-${t}`,nombre:e.condominio||e.direccion||"—",inmobiliaria:"",comuna:e.comuna||""},i={dp:e.dp||"—",precio_uf:o,tipologia:e.tipologia||"",disponible:!0},s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:0,reservaUF:0,cuotasPieN:0,upfrontPct:0,piePctDefault:.2,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Usada",nota:""},c=Me("");M={project:n,depto:i,secundarios:[],parsedCC:s,regla:c,reservaCLP:0,cliente:null},De(),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="flex",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="none",window.openModule("cotiz")}catch(e){console.error("[Cotizador] Error en cotizSecProp:",e),document.getElementById("cotiz-cascade").style.display="none",document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(e))}</div>`}}function cn(){M=null,Mt=!1,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.cascReset(),window.openModule("cotiz")}function ln(){M=null,Mt=!0,document.getElementById("cotiz-client-form").style.display="none",document.getElementById("cotiz-params-step").style.display="none",document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-cascade").style.display="",window.cascReset(),window.openModule("cotiz")}const _t=Bt,rn=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let Ct=[],Ht=null,X=1,_e="lista",Et=null,it=null,Ae=[],dt=[],nt=0;function je(t){return t?rn.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function dn(){if(!P.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set(P.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();ue("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),zt()}function zt(){var f,u,g,h,$,E,x;if(!P.PROJECTS.length)return;const t=(((f=document.getElementById("pri-search"))==null?void 0:f.value)||((u=document.getElementById("pri-search-top"))==null?void 0:u.value)||"").toLowerCase(),e=me("pri"),o=((g=document.getElementById("pri-entrega"))==null?void 0:g.value)||"",n=parseFloat((h=document.getElementById("pri-precio-min"))==null?void 0:h.value)||0,i=parseFloat(($=document.getElementById("pri-precio-max"))==null?void 0:$.value)||0,s=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(C=>parseInt(C.dataset.val)),c=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(C=>parseInt(C.dataset.val)),a=((E=document.getElementById("pri-est"))==null?void 0:E.checked)||!1,l=((x=document.getElementById("pri-bod"))==null?void 0:x.checked)||!1;Ht=window._priMaxUF||null,Ct=P.PROJECTS.filter(C=>{var m;let y=(C.unidades||[]).filter(d=>d.disponible&&!pt(d.tipologia));if(!y.length||t&&!`${C.nombre||""} ${C.inmobiliaria||""} ${C.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(C.comuna)||o&&!((m=C.entrega)!=null&&m.toLowerCase().includes(o.toLowerCase()))||a&&!(C.unidades||[]).some(d=>d.disponible&&/estac|parking|reja/i.test(d.tipologia||""))||l&&!(C.unidades||[]).some(d=>d.disponible&&/bode/i.test(d.tipologia||""))||s.length&&(y=y.filter(d=>{const U=parseInt(d.dormitorios)||0;return s.some(F=>F===4?U>=4:U===F)}),!y.length)||c.length&&(y=y.filter(d=>{const U=parseInt(d.banos)||0;return c.some(F=>F===3?U>=3:U===F)}),!y.length))return!1;const B=Math.min(...y.map(d=>d.precio_uf).filter(d=>d>0));return!(n&&B<n||i&&B>i||Ht&&!y.some(d=>d.precio_uf<=Ht))}),X=1,ze(),_e==="mapa"&&Ee(Ct)}function pn(t){const e=Math.max(1,Math.ceil(Ct.length/_t));X=Math.min(Math.max(1,X+t),e),ze(),document.getElementById("pri-gondola-wrap").scrollTop=0}function ze(){const t=document.getElementById("pri-grid"),e=Ct.length,o=Math.max(1,Math.ceil(e/_t));X>o&&(X=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${X} / ${o}`,document.getElementById("pri-prev").disabled=X<=1,document.getElementById("pri-next").disabled=X>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${e.toLocaleString("es-CL")} proyectos · ${P.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const i=Ct.slice((X-1)*_t,X*_t);t.innerHTML=i.map(s=>{const c=(s.unidades||[]).filter(C=>C.disponible&&!pt(C.tipologia)),a=c.map(C=>C.precio_uf).filter(C=>C>0),l=a.length?Math.min(...a):0,f=a.length?Math.max(...a):0,u=s.foto_portada||"",g=u&&(()=>{try{return decodeURI(u),u}catch{return""}})(),h=[...new Set(c.map(C=>{const y=parseInt(C.dormitorios)||0;return y===0?"Estudio":y+"D"}))].sort().slice(0,3).join(", "),$=c.reduce((C,y)=>y.m2_interior&&y.m2_interior<C?y.m2_interior:C,9999),E=$<9999?$.toFixed(0)+" m²":"—",x=P.CC_DATA[s.id]||je(s.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(s.id)}')">
      <div class="prj-img" style="${g?`background-image:url('${g}');background-size:cover;background-position:center`:""}">
        ${g?"":'<div class="prj-img-icon">🏗️</div>'}
        <span class="prj-badge">Nuevo</span>
        ${s.entrega?`<span class="prj-entrega">${r(s.entrega)}</span>`:""}
      </div>
      <div class="prj-body">
        <div class="prj-row1">
          <div class="prj-name">${r(s.nombre)}</div>
          <span class="prj-new-badge">${c.length} uds</span>
        </div>
        <div class="prj-sub">${r(s.inmobiliaria||"—")}${s.comuna?" · "+r(s.comuna):""}</div>
        ${s.direccion?`<div class="prj-addr">📍 ${r(s.direccion)}</div>`:'<div style="margin-bottom:9px"></div>'}
        <div class="prj-stats">
          <div class="prj-stat"><div class="prj-stat-v">${h||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${E}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${c.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${l?"UF "+l.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${f>l?`<span class="prj-hasta">— ${f.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(s.id)}')">Ver proyecto →</button>
          ${x?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function un(t){_e=t,ho(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"){fo();const i=vo();setTimeout(()=>i&&i.invalidateSize(),120),Ee(Ct)}}function Yt(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),n=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),n&&(n.style.display=e===t?"flex":"none")}),t==="map"&&bo(Et)}function mn(t){const e=t.unidades||[],o=e.filter(v=>v.disponible&&!pt(v.tipologia)),n=o.map(v=>v.precio_uf).filter(v=>v>0),i=n.length?Math.min(...n):0,s=n.length?Math.max(...n):0,c=o.map(v=>v.m2_interior).filter(v=>v>0),a=c.length?Math.min(...c):0,l=c.length?Math.max(...c):0,f=[...new Set(o.map(v=>{const b=parseInt(v.dormitorios)||0;return b===0?"Estudio":b+"D"}))].sort(),u=v=>v.toLocaleString("es-CL",{maximumFractionDigits:0}),g=i?s>i?`UF ${u(i)} – ${u(s)}`:`UF ${u(i)}`:" — ",h=a?l>a?`${a.toFixed(0)} – ${l.toFixed(0)} m²`:`${a.toFixed(0)} m²`:" — ",$=[t.direccion,t.comuna].filter(Boolean).join(", ");let E="";$&&(E+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r($)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
    </div>`),E+=`<div class="pm-stats-grid">
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
      <span class="pm-stat-card-val" style="font-size:${l>a?"11px":"15px"}">${h}</span>
      <span class="pm-stat-card-sub">${a?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${s>i?"11px":"15px"}">${g}</span>
      <span class="pm-stat-card-sub">${i?"en UF":""}</span>
    </div>
  </div>`;const x=[...new Set(o.map(v=>parseInt(v.piso)).filter(v=>v>0))].sort((v,b)=>v-b),C=[...new Set(o.map(v=>(v.orientacion||"").trim()).filter(Boolean))],y=o.map(v=>v.m2_terraza).filter(v=>v>0),B=[];if(x.length>0){const v=x.length===1?`Piso ${x[0]}`:`Pisos ${x[0]} – ${x[x.length-1]}`;B.push(`<div class="pm-detail-pill"><strong>${v}</strong></div>`)}if(C.length>0&&B.push(`<div class="pm-detail-pill">🧭 <strong>${C.slice(0,3).join(" · ")}</strong></div>`),y.length>0){const v=Math.min(...y).toFixed(0);B.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${v} m²</strong></div>`)}B.length&&(E+=`<div class="pm-detail-row">${B.join("")}</div>`);const m=e.filter(v=>pt(v.tipologia)&&/estac|parking/i.test(v.tipologia||"")),d=e.filter(v=>pt(v.tipologia)&&/bode/i.test(v.tipologia||"")),U=m.filter(v=>v.disponible),F=d.filter(v=>v.disponible),_=[];if(m.length>0){const v=U.map(w=>w.precio_uf).filter(w=>w>0),b=v.length?Math.min(...v):0;_.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${U.length} disp.</span>
        <span class="pm-extra-sub">${b?`Desde UF ${u(b)}`:`${m.length} en total`}</span>
      </div>
    </div>`)}if(d.length>0){const v=F.map(w=>w.precio_uf).filter(w=>w>0),b=v.length?Math.min(...v):0;_.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${F.length} disp.</span>
        <span class="pm-extra-sub">${b?`Desde UF ${u(b)}`:`${d.length} en total`}</span>
      </div>
    </div>`)}_.length&&(E+=`<div class="pm-extras-row">${_.join("")}</div>`);const I=P.CC_DATA[t.id];if(I&&I.campos&&I.campos.length){const v=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],b=[];for(const w of v){const A=I.campos.find(([K])=>K===w);if(A&&b.push(A),b.length===6)break}b.length<6&&I.campos.filter(([w])=>!b.find(([A])=>A===w)).slice(0,6-b.length).forEach(w=>b.push(w)),E+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${b.map(([w,A])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(w)}</span>
          <span class="pm-cc-prev-val">${r(A)}</span>
        </div>`).join("")}
      </div>
      ${I.nota?`<div class="pm-cc-nota">${r(I.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=E}function ke(t){const e=document.getElementById("pm-cc-inner"),o=P.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const i=o.campos.filter(([,c])=>c.length<=60),s=o.campos.filter(([,c])=>c.length>60);i.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',i.forEach(([c,a])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(c)}</span><span class="pm-cc-val">${r(a)}</span></div>`}),n+="</div>"),s.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',s.forEach(([c,a])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(c)}</div>`,n+=`<div class="pm-cc-val-long">${r(a)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(i=>{n+=`<th>${r(i)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(i=>{n+="<tr>",i.forEach(s=>{n+=`<td>${r(s||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=n}function Re(t){const e=P.PROJECTS.find(h=>h.id===t);if(!e)return;Et=e,it=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),Yt("gal"),mn(e),dt=e.fotos||[],nt=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),i=document.getElementById("pm-gal-nophoto"),s=document.getElementById("pm-gal-thumbs"),c=document.getElementById("pm-gal-counter");n.style.display="none",dt.length?(i.style.display="none",Qt(0),s.innerHTML=dt.map((h,$)=>`<img src="${h}" onclick="pmShowGalPhoto(${$})" ${$===0?'class="active"':""}>`).join("")):(o.style.display="none",i.style.display="flex",s.innerHTML="",c.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const a=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=a.length?a.map(h=>`<a class="pm-pdf-item" href="${h.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(h.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const l=document.getElementById("pm-tab-cc"),f=P.CC_DATA[e.id],u=je(e.inmobiliaria).length>0;f||u?(l.style.display="",ke(e.id)):l.style.display="none";const g=(e.unidades||[]).filter(h=>h.disponible&&!pt(h.tipologia));document.getElementById("pm-units-body").innerHTML=g.map(h=>`
    <tr>
      <td>${r(h.dp)}</td>
      <td>${r(h.tipologia)}</td>
      <td>${r(h.piso||"—")}</td>
      <td>${h.m2_interior?h.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${h.m2_terraza?h.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(h.orientacion||"—")}</td>
      <td class="td-precio">${p.uf(h.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(h.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Qt(t){var n;nt=Math.max(0,Math.min(t,dt.length-1));const e=document.getElementById("pm-gal-img");e.src=dt[nt],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${nt+1} / ${dt.length}`,document.getElementById("pm-gal-prev").disabled=nt===0,document.getElementById("pm-gal-next").disabled=nt===dt.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((i,s)=>i.classList.toggle("active",s===nt)),(n=document.getElementById("pm-gal-thumbs").children[nt])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function gn(t){Qt(nt+t)}function Xt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",Et=null,it=null}function Oe(t){const e=Et,o=(e.unidades||[]).find(c=>c.dp===t);if(!o)return;it=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(e.unidades||[]).filter(c=>c.disponible&&pt(c.tipologia));Ae=n;const i=document.getElementById("pm-extras-wrap"),s=document.getElementById("pm-extras-list");n.length?(i.style.display="",s.innerHTML=n.map((c,a)=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${c.precio_uf}" data-idx="${a}" data-dp="${r(c.dp)}" data-label="${r(c.tipologia)} DP ${r(c.dp)}">
        <span class="extra-label">${r(c.tipologia)} — DP ${r(c.dp)}</span>
        <span class="extra-price">${p.uf(c.precio_uf)}</span>
      </label>`).join("")):(i.style.display="none",s.innerHTML=""),te(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function te(){if(!it)return;let t=it.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=p.uf(t)}function fn(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),it=null}function vn(){if(!it||!Et)return;const t=Et,e=it,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const i=parseInt(n.dataset.idx),s=isNaN(i)?(t.unidades||[]).find(c=>c.dp===n.dataset.dp):Ae[i];s&&o.push(s)}),Xt(),Ue({project:t,depto:e,secundarios:o})}function hn(t){t.classList.toggle("active"),zt()}function yn(t,e,o=[]){Re(t),Yt("units"),e&&(Oe(e),o.length&&(o.forEach(n=>{const i=document.querySelector(`#pm-extras-list input[data-dp="${n}"]`);i&&(i.checked=!0)}),te()))}let bt=null;function bn(t){const{rentaLiquida:e=0,ingresosVariables:o=0,otrosIngresos:n=0,cuotasCreditos:i=0,pagoTarjetas:s=0,otrasDeudas:c=0,pieDisponible:a=0,plazo:l=25,tasa:f=4.5,morosidad:u=!1}=t,g=e+o*.5+n,h=i+s+c,$=[];let E="apto";if(u&&(E="no_apto",$.push("Presenta morosidades o protestos vigentes")),!g)return{resultado:"no_apto",razones:["Sin ingresos registrados"],ingresoEvaluable:0,cargaSinHip:0,rciActual:0,dividendoMax:0,creditoMax:0,propMaxCLP:0,propMaxUF:0};const x=h/g;x>.5&&(E="no_apto",$.push(`Carga mensual actual (${(x*100).toFixed(0)}%) supera el 50% del ingreso evaluable`));const C=g*.3,y=g*.5-h,B=Math.max(0,Math.min(C,y));B<=0&&E==="apto"&&(E="no_apto",$.push("Sin capacidad de pago disponible para un dividendo")),!a&&E==="apto"&&(E="no_apto",$.push("Sin pie disponible registrado"));const m=g>0?B/g:0,d=g>0?(h+B)/g:0;E==="apto"&&(m>.25||d>.45)&&(E="apto_con_condiciones",$.push("Relación dividendo/ingreso en zona de tolerancia (25–30%)")),E==="apto"&&$.push("Cumple todos los criterios de evaluación");const U=f/100/12,F=l*12,_=U>0?(1-Math.pow(1+U,-F))/U:F,I=B*_,v=a>0?a/.2:0,b=I/.8,w=v>0?Math.min(v,b):b,A=P.UF>0?w/P.UF:0;return{resultado:E,razones:$,ingresoEvaluable:g,cargaSinHip:h,rciActual:x,dividendoMax:B,creditoMax:I,propMaxCLP:w,propMaxUF:A}}function $n(){const t=u=>{var g;return parseFloat(((g=document.getElementById(u))==null?void 0:g.value)||"")||0},e=u=>{var g;return((g=document.getElementById(u))==null?void 0:g.checked)||!1},o={rentaLiquida:t("p-renta"),ingresosVariables:t("p-variables"),otrosIngresos:t("p-otros-ing"),cuotasCreditos:t("p-cuotas"),pagoTarjetas:t("p-tarjetas"),otrasDeudas:t("p-otras-deudas"),pieDisponible:t("p-ahorro"),plazo:t("p-plazo")||25,tasa:t("p-tasa")||4.5,morosidad:e("p-morosidad")},n=document.getElementById("p-results"),i=document.getElementById("p-btns");if(i.style.display="none",!o.rentaLiquida){n.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente para evaluar su capacidad</p></div>';return}const s=bn(o);bt=s.resultado!=="no_apto"&&s.propMaxUF>0?s.propMaxUF:null;const c={apto:{cls:"pf-badge--apto",label:"✓ Apto"},apto_con_condiciones:{cls:"pf-badge--cond",label:"⚠ Apto con condiciones"},no_apto:{cls:"pf-badge--noapto",label:"✗ No apto"}},a=c[s.resultado]||c.no_apto,l=u=>(u*100).toFixed(1).replace(/\.0$/,"")+"%",f=P.UF||1;n.innerHTML=`
  <div class="perfil-card">
    <div class="pf-status-row">
      <span class="pf-badge ${a.cls}">${a.label}</span>
      <ul class="pf-razones">${s.razones.map(u=>`<li>${u}</li>`).join("")}</ul>
    </div>
    <div class="rc-hero">
      <div class="rc-big">${s.propMaxUF>0?p.uf(s.propMaxUF):"—"}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${s.propMaxCLP>0?p.pesos(s.propMaxCLP):"—"}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell">
        <span class="rcv">${p.pesos(s.ingresoEvaluable)}</span>
        <span class="rcl">Ingreso evaluable / mes</span>
        <span class="rcp">Renta + 50% variables + otros</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${p.pesos(s.dividendoMax)}</span>
        <span class="rcl">Dividendo máximo / mes</span>
        <span class="rcp">${s.ingresoEvaluable>0?l(s.dividendoMax/s.ingresoEvaluable):"—"} del ingreso</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${p.uf(s.creditoMax/f)}</span>
        <span class="rcl">Crédito hipotecario máx.</span>
        <span class="rcp">${p.pesos(s.creditoMax)}</span>
      </div>
      <div class="rc-cell${s.rciActual>.4?" warn":""}">
        <span class="rcv">${l(s.rciActual)}</span>
        <span class="rcl">Carga actual sin hipoteca</span>
        <span class="rcp">Límite: 50%</span>
      </div>
    </div>
  </div>`,bt&&(i.style.display="flex")}function Cn(t){bt&&(t==="sec"?(window._secMaxUF=bt,window.secFilter(),window.openModule("sec"),Jt("sec")):(window._priMaxUF=bt,window.priFilter(),window.openModule("pri"),Jt("pri")))}function Jt(t){var n;(n=document.getElementById("bb-"+t))==null||n.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Presupuesto máximo: <strong>${p.uf(bt)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function En(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}function Fn(){const t=document.getElementById("casc-comuna");if(!t||!P.PROJECTS.length)return;const e=[...new Set(P.PROJECTS.map(o=>o.comuna).filter(Boolean))].sort();t.innerHTML='<option value="">Selecciona comuna</option>'+e.map(o=>`<option value="${o}">${o}</option>`).join("")}function Pn(t){const e=a=>{var l;return((l=document.getElementById(a))==null?void 0:l.value)||""},o=(a,l,f)=>{const u=document.getElementById(a);u&&(u.innerHTML=l,u.disabled=f)},n=e("casc-comuna"),i=e("casc-entrega"),s=e("casc-inmob");if(t==="comuna"){if(n){const a=[...new Set(P.PROJECTS.filter(l=>l.comuna===n).map(l=>l.entrega).filter(Boolean))].sort();o("casc-entrega",'<option value="">Selecciona entrega</option>'+a.map(l=>`<option value="${l}">${l}</option>`).join(""),!1)}else o("casc-entrega",'<option value="">Selecciona entrega</option>',!0);o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0),o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="entrega"){if(i){const a=[...new Set(P.PROJECTS.filter(l=>l.comuna===n&&l.entrega===i).map(l=>l.inmobiliaria).filter(Boolean))].sort();o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>'+a.map(l=>`<option value="${l}">${l}</option>`).join(""),!1)}else o("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0);o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0)}if(t==="inmob")if(s){const a=P.PROJECTS.filter(l=>l.comuna===n&&l.entrega===i&&l.inmobiliaria===s);o("casc-proyecto",'<option value="">Selecciona proyecto</option>'+a.map(l=>`<option value="${l.id}">${l.nombre}</option>`).join(""),!1)}else o("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0);const c=document.getElementById("casc-continuar");c&&(c.disabled=!e("casc-proyecto"))}function xn(){var e;const t=(e=document.getElementById("casc-proyecto"))==null?void 0:e.value;t&&(window.openProject(t),window.pmTab("units"))}function In(){const t=document.getElementById("casc-comuna");t&&(t.value="");const e=(n,i,s)=>{const c=document.getElementById(n);c&&(c.innerHTML=i,c.disabled=s)};e("casc-entrega",'<option value="">Selecciona entrega</option>',!0),e("casc-inmob",'<option value="">Selecciona inmobiliaria</option>',!0),e("casc-proyecto",'<option value="">Selecciona proyecto</option>',!0);const o=document.getElementById("casc-continuar");o&&(o.disabled=!0)}const wn={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:Ve,mcFilter:ge,mcOpen:to,mcClose:eo,mcSelect:oo,mcRemove:no,secFilter:Dt,secPage:Fo,setSecView:Po,openDetail:we,openSecDetail:xo,showDpPhoto:Wt,navDp:qt,closeDetail:Zt,shareProperty:Bo,downloadPhotos:Lo,printFicha:So,openVideo:Mo,copyVideoLink:Uo,closeVideo:Be,toggleSecPill:t=>{t.classList.toggle("active"),Dt()},togglePriPill:t=>{t.classList.toggle("active"),zt()},toggleTipPill:t=>{t.classList.toggle("active"),Dt()},toggleDormPill:hn,priFilter:zt,priPage:pn,setPriView:un,openProject:Re,closeProjModal:Xt,pmTab:Yt,renderCC:ke,pmShowGalPhoto:Qt,pmGalNav:gn,selectProjUnit:Oe,pmUpdateTotal:te,pmBack:fn,pmCotizar:vn,reopenWithUnit:yn,calcPerfil:$n,searchFromPerfil:Cn,showBudgetBanner:Jt,clearBudget:En,cotizFromProp:Ue,cotizSecProp:an,recalcCotizPanel:Te,volverDesdeCotiz:ko,volverDesdeParams:Ho,submitParamsStep:Go,volverAParams:qo,submitClientForm:No,formatRutInput:Vo,clearCCFError:Oo,printCotiz:sn,nuevaCotizacion:cn,recotizar:ln,cascUpdate:Pn,cascContinuar:xn,cascReset:In});function Ve(t){Ne(),document.querySelectorAll(".module").forEach(i=>i.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(i=>i.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=wn[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none");const n=document.getElementById("mob-filter-btn");n&&(n.style.display=t==="sec"||t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Zt(),t.key==="ArrowLeft"&&qt(-1),t.key==="ArrowRight"&&qt(1);return}t.key==="Escape"&&Be()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Zt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Xt()});function Bn(){document.querySelectorAll(".sbf-wrap").forEach(t=>{t.style.display==="none"||t.classList.add("mob-open")}),document.getElementById("mob-filter-overlay").classList.add("open"),document.body.classList.add("mob-filter-active")}function Ne(){document.querySelectorAll(".sbf-wrap").forEach(t=>t.classList.remove("mob-open")),document.getElementById("mob-filter-overlay").classList.remove("open"),document.body.classList.remove("mob-filter-active")}Object.assign(window,{mobFilterOpen:Bn,mobFilterClose:Ne});async function Ln(){try{const[t,e,o,n,i,s]=await Promise.all([vt.uf(),vt.stock(),vt.projects(),vt.cc(),vt.geocodes(),vt.priGeo()]);P.UF=t.valor??P.UF,P.STOCK=e??[],P.PROJECTS=o??[],P.CC_DATA=n??{};const c=document.getElementById("uf-val"),a=document.getElementById("uf-date"),l=P.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2});c&&(c.textContent=l);const f=document.getElementById("mob-uf-chip");if(f&&(f.textContent=`UF $${l}`),a&&t.fecha){const u=new Date(t.fecha);a.textContent=u.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}i&&Object.assign(P._GC,i),s&&Object.assign(P._GC,s);try{const u=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign(P._GC,u)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}Co(),dn(),Fn(),Ve("sec")}Ln();
