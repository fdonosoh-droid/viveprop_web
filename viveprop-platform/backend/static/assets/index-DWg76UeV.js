(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const h={UF:39908,STOCK:[],PROJECTS:[],CC_DATA:{},_GC:{}},Pt=24,se="/api";async function pt(t){const e=await fetch(se+t);if(!e.ok)throw new Error(`API ${t}: ${e.status}`);return e.json()}const ut={stock:()=>pt("/stock"),projects:()=>pt("/projects"),cc:()=>pt("/cc"),uf:()=>pt("/uf"),geocodes:()=>pt("/geocodes"),priGeo:()=>pt("/pri-geocodes"),reloadData:()=>fetch(se+"/data/reload",{method:"POST"}).then(t=>t.json())},wt={sec:new Set,pri:new Set};let ie=[],ae=[];function ce(t,e){t==="sec"?ie=e:ae=e}function le(t){return wt[t]}function re(t){const e=(document.getElementById(t+"-mc-input").value||"").toLowerCase(),o=t==="sec"?ie:ae,n=wt[t],s=document.getElementById(t+"-mc-dropdown"),a=o.filter(i=>(!e||i.toLowerCase().includes(e))&&!n.has(i));if(!a.length){s.style.display="none";return}s.innerHTML=a.slice(0,14).map(i=>`<div class="mc-opt" onmousedown="mcSelect('${t}','${i.replace(/'/g,"\\'")}');return false">${i}</div>`).join(""),s.style.display="block"}function Ge(t){re(t)}function qe(t){setTimeout(()=>{const e=document.getElementById(t+"-mc-dropdown");e&&(e.style.display="none")},150)}function Je(t,e){wt[t].add(e),de(t),document.getElementById(t+"-mc-input").value="",document.getElementById(t+"-mc-dropdown").style.display="none",t==="sec"?window.secFilter():window.priFilter()}function Ke(t,e){wt[t].delete(e),de(t),t==="sec"?window.secFilter():window.priFilter()}function de(t){document.getElementById(t+"-mc-tags").innerHTML=[...wt[t]].map(e=>`<span class="mc-tag">${e} <span onclick="mcRemove('${t}','${e.replace(/'/g,"\\'")}')">×</span></span>`).join("")}const r=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function w(t){if(!t)return null;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isNaN(e)?null:e}const m={uf:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:0,maximumFractionDigits:0})}`,uf1:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})}`,uf2:t=>`UF ${(+t).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}`,pesos:t=>`$${Math.round(+t).toLocaleString("es-CL")}`};function pe(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"Disponible":e.includes("re-acondicionamiento")?"Reacondicionando":e.includes("por desocuparse")?"Por desocuparse":e.includes("aviso")?"Aviso salida":e.includes("check-in")?"Prox. check-in":e.includes("arrendado")?"Arrendado":t||"—"}function We(t){const e=(t||"").toLowerCase();return e.includes("lista para arrendar")?"background:#D1FAE5;color:#065F46":e.includes("desocuparse")?"background:#DBEAFE;color:#1D4ED8":e.includes("re-acondicionamiento")||e.includes("reacondicionando")?"background:#FEF3C7;color:#92400E":e.includes("aviso")?"background:#FEE2E2;color:#991B1B":e.includes("check-in")||e.includes("esperando")?"background:#EDE9FE;color:#5B21B6":e.includes("arrendado")?"background:#F1F5F9;color:#475569":"background:#F3F4F6;color:#374151"}function Ze(t){var s,a;const e=(t||"").toLowerCase(),o=parseInt((s=e.match(/(\d+)d/))==null?void 0:s[1])||0,n=parseInt((a=e.match(/(\d+)b/))==null?void 0:a[1])||(e.includes("estudio")?1:0);return{dorm:o,banos:n}}function lt(t){return/estac|bode|parking|reja|local\s/i.test(t||"")}function Qe(t,e){const o=(t||"").toLowerCase();return e==="lista"?o.includes("lista para arrendar"):e==="desocupar"?o.includes("desocuparse"):e==="reacond"?o.includes("re-acondicionamiento")||o.includes("reacondicionando"):e==="aviso"?o.includes("aviso"):e==="proximo"?o.includes("check-in")||o.includes("esperando"):e==="arrendado"?o.includes("arrendado"):!1}const Xe={"Lista para arrendar":"#10B981","Por desocuparse":"#2563EB","Re-acondicionamiento":"#D97706","Aviso salida":"#DC2626","Esperando check-in":"#7C3AED",Arrendado:"#94A3B8"};let mt=null,Dt=null,gt=null,At=null,Q=null,Et=null;function qt(t){const e=`${t.direccion}|${t.comuna}`;if(h._GC[e]!==void 0)return h._GC[e];try{const o=JSON.parse(localStorage.getItem("_geo_cache")||"{}");if(o[e]!==void 0)return o[e]}catch{}}function Ye(t){const e=`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${t}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;return L.divIcon({html:e,className:"",iconSize:[28,36],iconAnchor:[14,36],popupAnchor:[0,-36]})}function ue(t){if(!t)return"";const e=t.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(e)}&output=jpg&q=88`}function to(t,e){const o=e.replace(/^https?:\/\//,"");return`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=80&w=540&h=296&fit=cover`}function eo(){mt||(mt=L.map("sec-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(mt),Dt=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),mt.addLayer(Dt))}function oo(){return mt}function me(t){if(!mt)return;Dt.clearLayers();const e=[];t.forEach(o=>{const n=qt(o);n?ve(o,n):n===void 0&&e.push(o)}),e.length&&so(e)}let ge="lista";function no(t){ge=t}function ve(t,e){const o=w(t.precioSinBono),n=w(t.m2total)||w(t.m2interior),s=Xe[t.estado]||"#94A3B8",a=pe(t.estado),i=`<div class="map-popup">
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
  </div>`,c=L.marker(e,{icon:Ye(s)});c.bindPopup(i,{className:"lf-popup",maxWidth:270,closeButton:!1}),c.on("popupopen",()=>{document.getElementById("mpp-"+t.id)&&fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t.id}?list=1`).then(y=>y.json()).then(y=>{var p,F;const d=(p=y.data)==null?void 0:p[0],f=((F=d==null?void 0:d.fotos_originales)!=null&&F.length?d.fotos_originales:d==null?void 0:d.fotos)||[];if(f.length){const b=document.getElementById("mpp-"+t.id);if(b){const v=to(t.id,f[0]);b.style.backgroundImage=`url('${v}')`,b.textContent=""}}}).catch(()=>{})}),Dt.addLayer(c)}async function so(t){const e=document.getElementById("geo-progress"),o=document.getElementById("geo-bar"),n=document.getElementById("geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<t.length&&ge==="mapa";a++){const i=t[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${t.length}`,o.style.width=`${Math.round((a+1)/t.length*100)}%`;const u=encodeURIComponent(`${i.direccion}, ${i.comuna}, Santiago, Chile`);try{const d=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${u}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(d[0]){const f=[parseFloat(d[0].lat),parseFloat(d[0].lon)];s[c]=f,h._GC[c]=f,ve(i,f)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(y=>setTimeout(y,1200))}e.style.display="none"}function io(){gt||(gt=L.map("pri-map",{zoomControl:!0}).setView([-33.45,-70.65],11),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(gt),At=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1}),gt.addLayer(At))}function ao(){return gt}let fe="lista";function co(t){fe=t}function he(t){if(!gt)return;At.clearLayers();const e=[];t.forEach(o=>{const n=qt({direccion:o.direccion,comuna:o.comuna});n?ye(o,n):n===void 0&&e.push(o)}),e.length&&lo(e)}function ye(t,e){const{isExtra:o}=window._mapUtils||{},n=(t.unidades||[]).filter(p=>p.disponible&&!/estac|bode|parking|reja|local\s/i.test(p.tipologia||"")),s=n.map(p=>p.precio_uf).filter(p=>p>0),a=s.length?Math.min(...s):0,i=s.length?Math.max(...s):0,c=[...new Set(n.map(p=>{const F=parseInt(p.dormitorios)||0;return F===0?"Estudio":F+"D"}))].sort().slice(0,3).join(", "),u=t.foto_portada||"",y=L.divIcon({className:"",html:'<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[13,13],iconAnchor:[6,6]}),d=L.marker(e,{icon:y}),f=`<div class="map-popup">
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
        <span class="mp-spec">${n.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${a?"UF "+a.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
        ${i>a?`<span style="font-size:11px;color:var(--g400)">— ${i.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
      </div>
      <button class="mp-btn" onclick="openProject('${r(t.id)}')">Ver proyecto →</button>
    </div>
  </div>`;d.bindPopup(f,{className:"lf-popup",maxWidth:270,closeButton:!1}),At.addLayer(d)}async function lo(t){const e=document.getElementById("pri-geo-progress"),o=document.getElementById("pri-geo-bar"),n=document.getElementById("pri-geo-msg");e.style.display="flex";let s={};try{s=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}for(let a=0;a<t.length&&fe==="mapa";a++){const i=t[a],c=`${i.direccion}|${i.comuna}`;n.textContent=`Ubicando ${a+1} de ${t.length}`,o.style.width=`${Math.round((a+1)/t.length*100)}%`;const u=encodeURIComponent(`${i.direccion||i.nombre}, ${i.comuna||""}, Chile`);try{const d=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${u}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(d[0]){const f=[parseFloat(d[0].lat),parseFloat(d[0].lon)];s[c]=f,h._GC[c]=f,ye(i,f)}else s[c]=null}catch{s[c]=null}try{localStorage.setItem("_geo_cache",JSON.stringify(s))}catch{}await new Promise(y=>setTimeout(y,1200))}e.style.display="none"}function ro(t){if(!t)return;Q?Q.invalidateSize():(Q=L.map("pm-map",{zoomControl:!0}).setView([-33.45,-70.65],14),L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap © CARTO",maxZoom:19}).addTo(Q)),Et&&(Q.removeLayer(Et),Et=null);const e=qt({direccion:t.direccion,comuna:t.comuna});e?be(t,e):po(t),setTimeout(()=>{Q&&Q.invalidateSize()},200)}function be(t,e){const o=L.divIcon({className:"",html:'<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',iconSize:[14,14],iconAnchor:[7,7]});Et=L.marker(e,{icon:o}).addTo(Q),Et.bindPopup(`<b>${r(t.nombre)}</b><br>${r(t.direccion||"")}${t.comuna?", "+r(t.comuna):""}`).openPopup(),Q.setView(e,15)}async function po(t){const e=encodeURIComponent(`${t.direccion||t.nombre}, ${t.comuna||""}, Chile`);try{const n=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&limit=1`,{headers:{"Accept-Language":"es"}})).json();if(n[0]){const s=[parseFloat(n[0].lat),parseFloat(n[0].lon)];let a={};try{a=JSON.parse(localStorage.getItem("_geo_cache")||"{}")}catch{}a[`${t.direccion}|${t.comuna}`]=s;try{localStorage.setItem("_geo_cache",JSON.stringify(a))}catch{}h._GC[`${t.direccion}|${t.comuna}`]=s,be(t,s)}}catch{}}let vt=[],J=1,$e="lista",Rt={},Ct=null,N=[],K=0,V=null,G=null,Vt="";function uo(){if(!h.STOCK.length){document.getElementById("sec-grid").innerHTML='<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>';return}const t=[...new Set(h.STOCK.map(e=>e.comuna).filter(Boolean))].sort();ce("sec",t),document.getElementById("sec-mc-input").addEventListener("blur",()=>window.mcClose("sec")),Ut()}function Ut(){var F,b,v,$,C,T;if(!h.STOCK.length)return;const t=(((F=document.getElementById("sec-search"))==null?void 0:F.value)||"").toLowerCase(),e=le("sec"),o=parseFloat((b=document.getElementById("sec-precio-min"))==null?void 0:b.value)||0,n=parseFloat((v=document.getElementById("sec-precio-max"))==null?void 0:v.value)||0,s=(($=document.getElementById("sec-op"))==null?void 0:$.checked)||!1,a=((C=document.getElementById("sec-est"))==null?void 0:C.checked)||!1,i=((T=document.getElementById("sec-bod"))==null?void 0:T.checked)||!1,c=[...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(l=>parseInt(l.dataset.val)),u=[...document.querySelectorAll('[data-grp="sec-bano"].active')].map(l=>parseInt(l.dataset.val)),y=[...document.querySelectorAll(".sec-estado-cb")],d=y.filter(l=>l.checked).map(l=>l.value),f=d.length===y.length,p=window._secMaxUF||null;vt=h.STOCK.filter(l=>{if(t&&!`${l.condominio||""} ${l.direccion||""} ${l.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(l.comuna)||s&&!l.oportunidad||a&&(!l.est||l.est==="0")||i&&(!l.bod||l.bod==="0")||!f&&!d.some(S=>Qe(l.estado,S)))return!1;const{dorm:E,banos:k}=Ze(l.tipologia);if(c.length&&!c.some(S=>S===4?E>=4:E===S)||u.length&&!u.some(S=>S===3?k>=3:k===S))return!1;const P=parseFloat((l.precioSinBono||"0").replace(/\./g,"").replace(",","."));return!(o&&P<o||n&&P>n||p&&P>p)}),J=1,$e==="mapa"?me(vt):Ce()}function Ce(){const t=document.getElementById("sec-grid"),e=vt.length,o=Math.max(1,Math.ceil(e/Pt));J>o&&(J=o),document.getElementById("sec-count").textContent=`${e.toLocaleString("es-CL")} propiedad${e!==1?"es":""}`,document.getElementById("sec-pager").textContent=`Pág. ${J} / ${o}`,document.getElementById("sec-prev").disabled=J<=1,document.getElementById("sec-next").disabled=J>=o;const n=h.STOCK.length,s=h.STOCK.filter(c=>(c.estado||"").toLowerCase().includes("lista para arrendar")).length,a=document.getElementById("tb-stats");a&&(a.textContent=`${s.toLocaleString("es-CL")} disponibles · ${n.toLocaleString("es-CL")} total`);const i=vt.slice((J-1)*Pt,J*Pt);if(!i.length){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>';return}t.innerHTML=i.map(c=>{const u=parseFloat((c.precioSinBono||"0").replace(/\./g,"").replace(",",".")),y=c.bonoPct>0,d=c.m2interior||c.m2total||"—",f=c.orientacion&&c.orientacion!=="-"?c.orientacion:"—",p=pe(c.estado),F=We(c.estado);return`<div class="prop-card">
      <div class="pc-img" id="pcimg-${c.id}">
        <div class="pc-img-icon">🏢</div>
        ${c.video?'<div class="pc-vid-badge">▶ Video</div>':""}
        <div class="pc-foto-count" id="pcfc-${c.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${r(c.condominio)}</div>
          <div class="pc-estado-badge" style="${F}">${p}</div>
        </div>
        <div class="pc-sub">DP ${r(c.dp||"—")} · ${r(c.comuna||"—")}</div>
        <div class="pc-addr">📍 ${r(c.direccion||"—")}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${r(c.tipologia||"—")}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(d)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${r(f)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${u?"UF "+u.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${y?`<span class="pc-bono-badge">✅ Bono ${c.bonoPct}%</span>`:""}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${r(c.id)}')">Ver ficha →</button>
          ${c.video?`<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${r(c.video)}')">▶ Video</button>`:""}
        </div>
      </div>
    </div>`}).join(""),Ct&&Ct.disconnect(),Ct=new IntersectionObserver(c=>{c.forEach(u=>{if(!u.isIntersecting)return;const y=u.target.id.replace("pcimg-","");mo(y),Ct.unobserve(u.target)})},{rootMargin:"150px"}),i.forEach(c=>{const u=document.getElementById("pcimg-"+c.id);u&&Ct.observe(u)})}async function mo(t){var o,n;const e=document.getElementById("pcimg-"+t);if(e){if(Rt[t]){oe(e,Rt[t]);return}try{const a=(o=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${t}?list=1`)).json()).data)==null?void 0:o[0],i=((n=a==null?void 0:a.fotos_originales)!=null&&n.length?a.fotos_originales:a==null?void 0:a.fotos)||[];if(i.length){Rt[t]=i[0];const c=document.getElementById("pcimg-"+t);c&&oe(c,i[0],i.length)}}catch{}}}function oe(t,e,o){const n=e.replace(/^https?:\/\//,""),s=`https://images.weserv.nl/?url=${encodeURIComponent(n)}&output=jpg&q=75&w=400&h=200&fit=cover`;t.style.backgroundImage=`url('${s}')`,t.style.backgroundSize="cover",t.style.backgroundPosition="center";const a=t.querySelector(".pc-img-icon");if(a&&(a.style.display="none"),o>1){const i=t.id.match(/pcimg-(.+)/);if(i){const c=document.getElementById("pcfc-"+i[1]);c&&(c.textContent="📷 "+o,c.style.display="")}}}function go(t){const e=Math.max(1,Math.ceil(vt.length/Pt));J=Math.min(Math.max(1,J+t),e),Ce(),document.getElementById("mod-sec").querySelector(".gondola-wrap").scrollTop=0}function vo(t){$e=t,no(t),document.getElementById("btn-lista").classList.toggle("active",t==="lista"),document.getElementById("btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("sec-gondola-wrap"),o=document.getElementById("sec-map-wrap"),n=document.querySelector("#mod-sec .pager");e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"&&(eo(),setTimeout(()=>oo().invalidateSize(),120),me(vt))}async function Fe(t){var n,s,a;if(V=h.STOCK.find(i=>i.id===t)||null,!V)return;document.getElementById("detail-modal").classList.add("open"),document.body.style.overflow="hidden",N=[],K=0,(n=document.getElementById("dp-nophoto"))==null||n.remove(),document.getElementById("dp-img").style.display="none",document.getElementById("dp-spin").style.display="flex",document.getElementById("dp-counter").style.display="none",document.getElementById("dp-thumbs").innerHTML="",document.getElementById("dp-prev").disabled=!0,document.getElementById("dp-next").disabled=!0,document.getElementById("detail-content").innerHTML='<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';const e=V;try{G=((s=(await(await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${e.id}?list=1`)).json()).data)==null?void 0:s[0])||null}catch{G=null}const o=((a=G==null?void 0:G.fotos_originales)!=null&&a.length?G.fotos_originales:G==null?void 0:G.fotos)||[];if(o.length)N=o,document.getElementById("dp-spin").style.display="none",Jt(0),document.getElementById("dp-thumbs").innerHTML=o.map((i,c)=>{const u=i.replace(/^https?:\/\//,"");return`<img src="https://images.weserv.nl/?url=${encodeURIComponent(u)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${c})" ${c===0?'class="active"':""}>`}).join("");else{document.getElementById("dp-spin").style.display="none";const i=document.querySelector(".detail-photos"),c=document.createElement("div");c.id="dp-nophoto",c.style.cssText="color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none",c.textContent="Sin fotos disponibles",i.appendChild(c)}ho(e,G)}function fo(t){Fe(t)}function Jt(t){var n;K=Math.max(0,Math.min(t,N.length-1));const e=document.getElementById("dp-img"),o=N[K].replace(/^https?:\/\//,"");e.src=`https://images.weserv.nl/?url=${encodeURIComponent(o)}&output=jpg&q=88&w=900`,e.style.display="block",document.getElementById("dp-counter").style.display="block",document.getElementById("dp-counter").textContent=`${K+1} / ${N.length}`,document.getElementById("dp-prev").disabled=K===0,document.getElementById("dp-next").disabled=K===N.length-1,document.querySelectorAll(".dp-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===K)),(n=document.getElementById("dp-thumbs").children[K])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Ht(t){Jt(K+t)}function ho(t,e){var v;const o=w(t.precioSinBono),n=w(t.m2total)||w(e==null?void 0:e.superficie),s=w(t.m2interior)||w(e==null?void 0:e.m2_utiles),a=w(t.m2terraza)||w(e==null?void 0:e.m2_terraza),i=(e==null?void 0:e.dormitorios)??"",c=(e==null?void 0:e.banios)??"",u=(e==null?void 0:e.piso)??"",y=((v=e==null?void 0:e.unitggcc)==null?void 0:v.monto)||(e==null?void 0:e.ggcc)||"",d=(e==null?void 0:e.youtube_video_id)||"",f=(e==null?void 0:e.espacios)||"",p=(e==null?void 0:e.building_finishes)||[],F=(t.oportunidad||"").toLowerCase().includes("oportunidad"),b=f?f.split(",").map($=>$.trim()).filter(Boolean):[];document.getElementById("detail-content").innerHTML=`
    <div class="detail-top">
      <div>
        <div class="detail-title">${r(t.condominio||t.direccion||"—")}</div>
        <div class="detail-addr">📍 ${r(t.direccion||"—")} · ${r(t.comuna||"")}${t.dp?" · DP "+r(t.dp):""}</div>
      </div>
      <div class="detail-badges">
        ${F?'<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>':""}
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
      ${u!==""?`<div class="spec-card"><div class="sv">Piso ${u}</div><div class="sl">Nivel</div></div>`:""}
      ${t.orientacion&&t.orientacion!=="-"?`<div class="spec-card"><div class="sv">${r(t.orientacion)}</div><div class="sl">Orientación</div></div>`:""}
      ${t.est&&t.est!=="0"?'<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>':""}
      ${t.bod&&t.bod!=="0"?'<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>':""}
      ${t.anio?`<div class="spec-card"><div class="sv">${r(t.anio)}</div><div class="sl">Año</div></div>`:""}
      ${y?`<div class="spec-card"><div class="sv">$${Number(y).toLocaleString("es-CL")}</div><div class="sl">Gastos comunes</div></div>`:""}
    </div>
    <div class="dt-section">Precio y condición comercial</div>
    <div class="price-block">
      <div class="dp-price-card">
        <div class="pc-label">Precio sin bono pie</div>
        <div class="pc-value">${o?o.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
        ${o?`<div class="pc-sub">$${Math.round(o*h.UF).toLocaleString("es-CL")}</div>`:""}
      </div>
      ${t.bonoPct>0?`
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${t.bonoPct}%</div>
        ${w(t.bonoUF)?`<div class="bc-sub">${w(t.bonoUF).toLocaleString("es-CL",{maximumFractionDigits:0})} UF de financiamiento</div>`:""}
      </div>`:""}
    </div>
    ${b.length?`
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${b.map($=>`<span class="dt-amenity">${r($)}</span>`).join("")}</div>`:""}
    ${p.length?`
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${p.map($=>{var E;const C=String($).split(":"),T=((E=C[0])==null?void 0:E.trim())||"",l=C.slice(1).join(":").trim()||"";return`<div class="dt-finish-row"><div class="dt-finish-k">${r(T)}</div><div class="dt-finish-v">${r(l)}</div></div>`}).join("")}</div>`:""}
    ${d?`
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${r(d)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>`:""}
    ${t.video&&!d?`
    <div class="dt-section">Video de la propiedad</div>
    <div style="margin:4px 0 12px">
      <button onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer">▶ Ver video</button>
    </div>`:""}
    ${yo(t)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizFromProp(${o||0},'${r(t.condominio||"")} DP${r(t.dp||"")}')">📊 Cotizar</button>
      ${t.video?`<button class="btn-fotos" onclick="openVideo('${r(t.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>`:""}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${r(t.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${N.length?`<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${N.length})</button>`:""}
    </div>`}function yo(t){const e=t.condominio||t.direccion;if(!e||!h.STOCK.length)return"";const o=h.STOCK.filter(s=>s.id!==t.id&&(s.condominio||s.direccion)===e);if(!o.length)return"";const n=o.map(s=>{const a=w(s.precioSinBono),i=w(s.m2total)||w(s.m2interior),c=[];return s.dp&&c.push("DP "+s.dp),i&&c.push(i.toFixed(0)+" m²"),s.orientacion&&s.orientacion!=="-"&&c.push(s.orientacion),`<div class="unit-row" onclick="closeDetail();openDetail('${r(s.id)}')">
      <div class="ur-tipo">${r(s.tipologia||"—")}</div>
      <div class="ur-info">${c.join(" · ")}</div>
      <div class="ur-price">${a?a.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—"}</div>
    </div>`}).join("");return`<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${o.length}</span></div>
    ${n}
  </div>`}function Kt(){var t;document.getElementById("detail-modal").classList.remove("open"),document.body.style.overflow="",N=[],K=0,V=null,G=null,(t=document.getElementById("dp-nophoto"))==null||t.remove()}function bo(t){const e=V;if(!e)return;const o=w(e.precioSinBono),n=w(e.m2total)||w(e.m2interior),s=[`🏢 *${e.condominio||e.direccion}*`,`📍 ${e.direccion}${e.dp?" · DP "+e.dp:""} · ${e.comuna}`,`📐 ${n?n.toFixed(0)+" m²":""} · ${e.tipologia||""}`,e.est&&e.est!=="0"?"🚗 Estacionamiento incluido":"",e.bod&&e.bod!=="0"?"📦 Bodega incluida":"",o?`💰 ${o.toLocaleString("es-CL",{maximumFractionDigits:0})} UF`:"",e.bonoPct>0?`✅ Acepta Bono Pie ${e.bonoPct}%`:"",e.video?`
▶ Video: ${e.video}`:""].filter(Boolean).join(`
`),a=`https://wa.me/?text=${encodeURIComponent(s)}`,i=document.createElement("div");i.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px",i.innerHTML=`<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${s}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${a}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`,document.body.appendChild(i),i.addEventListener("click",c=>{c.target===i&&i.remove()})}async function $o(){if(!N.length)return;const t=document.getElementById("btn-dl-fotos"),e=document.getElementById("loading-overlay"),o=document.getElementById("loading-msg"),n=document.getElementById("loading-bar");t.classList.add("loading"),t.textContent="⏳ Descargando…",e.classList.add("show"),n.style.width="0%";const s=new JSZip,a=s.folder("fotos-propiedad"),i=N.length;async function c(f){try{const p=await fetch(ue(f));if(p.ok)return await p.blob()}catch{}try{const p=await fetch(f,{mode:"cors"});if(p.ok)return await p.blob()}catch{}return null}let u=0;for(let f=0;f<i;f++){o.textContent=`Descargando foto ${f+1} de ${i}…`,n.style.width=`${Math.round(f/i*90)}%`;const p=await c(N[f]);if(p){const F=p.type.includes("png")?"png":"jpg";a.file(`foto-${String(f+1).padStart(2,"0")}.${F}`,p),u++}}o.textContent="Generando ZIP…",n.style.width="95%";const y=await s.generateAsync({type:"blob"});if(n.style.width="100%",u===0){alert("No se pudieron descargar las fotos."),e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${N.length})`;return}const d=document.createElement("a");d.href=URL.createObjectURL(y),d.download=`fotos-${((V==null?void 0:V.condominio)||(V==null?void 0:V.direccion)||"propiedad").replace(/[^a-zA-Z0-9]/g,"-")}.zip`,d.click(),setTimeout(()=>{e.classList.remove("show"),t.classList.remove("loading"),t.textContent=`📥 Descargar Fotos (${N.length})`},800)}async function Co(){var $t;if(!V)return;const t=V,e=G,o=document.querySelector(".btn-ficha"),n=o.textContent;o.textContent="⏳ Generando PDF…",o.disabled=!0;const s=w(t.precioSinBono),a=w(t.m2total)||w(e==null?void 0:e.superficie),i=w(t.m2interior)||w(e==null?void 0:e.m2_utiles),c=w(t.m2terraza)||w(e==null?void 0:e.m2_terraza),u=(e==null?void 0:e.dormitorios)??"",y=(e==null?void 0:e.banios)??"",d=(e==null?void 0:e.piso)??"",f=(($t=e==null?void 0:e.unitggcc)==null?void 0:$t.monto)||(e==null?void 0:e.ggcc)||"";((e==null?void 0:e.espacios)||"").split(",").map(M=>M.trim()).filter(Boolean),e!=null&&e.building_finishes;const p=(t.condominio||t.direccion||"propiedad").replace(/[^a-zA-Z0-9]/g,"-"),F=new Date().toLocaleDateString("es-CL",{day:"2-digit",month:"long",year:"numeric"});async function b(M){for(const D of[ue(M),M])try{const A=await fetch(D);if(!A.ok)continue;const z=await A.blob();return await new Promise(_=>{const R=new FileReader;R.onload=Z=>_(Z.target.result),R.readAsDataURL(z)})}catch{}return null}o.textContent="⏳ Cargando logo…";const v=await b("images/logo.png");o.textContent="⏳ Cargando fotos…";const C=(await Promise.all(N.slice(0,5).map(b))).filter(Boolean);if(o.textContent="⏳ Generando PDF…",!window.jspdf){alert("jsPDF no disponible."),o.textContent=n,o.disabled=!1;return}const{jsPDF:T}=window.jspdf,l=new T({unit:"mm",format:"a4",orientation:"portrait"}),E=210,k=297,P=10,S=190,x=[67,56,202],g=[107,114,128],U=[249,250,251],I=[255,255,255],H=[17,24,39],q=[5,150,105],Lt=[209,250,229],Y=M=>l.setFillColor(M[0],M[1],M[2]),j=M=>l.setTextColor(M[0],M[1],M[2]),rt=(M,D,A,z,_,R)=>{Y(R),l.roundedRect(M,D,A,z,_,_,"F")},Bt=(M,D)=>(Y([229,231,235]),l.rect(P,D,S,.3,"F"),l.setFontSize(7.5),l.setFont("helvetica","bold"),j(g),l.text(M.toUpperCase(),P,D+4.5),D+8);let B=0;Y(x),l.rect(0,0,E,22,"F"),v?(rt(P-1,3,44,15,2.5,I),l.addImage(v,"PNG",P+1,5,40,7.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(16),j(I),l.text("ViveProp",P,14)),l.setFont("helvetica","normal"),l.setFontSize(8.5),j([200,200,230]),l.text("Ficha de Propiedad",E-P,10,{align:"right"}),l.text(F,E-P,16,{align:"right"}),B=22,Y([238,242,255]),l.rect(0,B,E,32,"F"),l.setFont("helvetica","bold"),l.setFontSize(15),j(H);const ot=t.condominio||t.direccion||"—";l.text(ot.length>38?ot.slice(0,36)+"…":ot,P,B+11),l.setFont("helvetica","normal"),l.setFontSize(9),j(g);const yt=`${t.direccion||"—"} · ${t.comuna||""}${t.dp?" · DP "+t.dp:""}`;if(l.text(yt.length>55?yt.slice(0,53)+"…":yt,P,B+18),l.setFont("helvetica","bold"),l.setFontSize(20),j(x),l.text(s?s.toLocaleString("es-CL",{maximumFractionDigits:0})+" UF":"—",E-P,B+13,{align:"right"}),l.setFontSize(8),j(g),l.setFont("helvetica","normal"),l.text("Precio sin bono pie",E-P,B+8,{align:"right"}),t.bonoPct>0&&(rt(E-P-42,B+18,42,9,2,Lt),l.setFont("helvetica","bold"),l.setFontSize(8),j(q),l.text(`Acepta Bono Pie ${t.bonoPct}%`,E-P-21,B+23.5,{align:"center"})),B+=34,C.length){const z=C.length>1?118:S,_=S-z-2;try{l.addImage(C[0],"JPEG",P,B,z,52,void 0,"FAST")}catch{}if(C[1])try{l.addImage(C[1],"JPEG",P+z+2,B,_,25,void 0,"FAST")}catch{}if(C[2])try{l.addImage(C[2],"JPEG",P+z+2,B+25+2,_,25,void 0,"FAST")}catch{}if(B+=54,C[3]||C[4]){const R=C[4]?(S-2)/2:S;if(C[3])try{l.addImage(C[3],"JPEG",P,B,R,32,void 0,"FAST")}catch{}if(C[4])try{l.addImage(C[4],"JPEG",P+R+2,B,R,32,void 0,"FAST")}catch{}B+=34}}B+=4,B=Bt("Características",B);const dt=[t.tipologia?{v:t.tipologia,l:"Tipología"}:null,a?{v:a.toFixed(0)+" m²",l:"Superficie"}:null,i?{v:i.toFixed(0)+" m²",l:"Sup. interior"}:null,c?{v:c.toFixed(0)+" m²",l:"Terraza"}:null,u!==""?{v:u+" dorm.",l:"Dormitorios"}:null,y!==""?{v:y+" baños",l:"Baños"}:null,d!==""?{v:"Piso "+d,l:"Nivel"}:null,t.orientacion&&t.orientacion!=="-"?{v:t.orientacion,l:"Orientación"}:null,t.est&&t.est!=="0"?{v:"Incluido",l:"Estacionamiento"}:null,t.bod&&t.bod!=="0"?{v:"Incluida",l:"Bodega"}:null,t.anio?{v:t.anio,l:"Año"}:null,f?{v:"$"+Number(f).toLocaleString("es-CL"),l:"GC/mes"}:null].filter(Boolean),nt=4,st=(S-(nt-1)*3)/nt,bt=14;dt.forEach((M,D)=>{const A=D%nt,z=Math.floor(D/nt),_=P+A*(st+3),R=B+z*(bt+3);rt(_,R,st,bt,2,U),l.setFont("helvetica","bold"),l.setFontSize(9),j(H),l.text(String(M.v).slice(0,18),_+st/2,R+6.5,{align:"center"}),l.setFont("helvetica","normal"),l.setFontSize(7),j(g),l.text(M.l,_+st/2,R+11,{align:"center"})}),B+=Math.ceil(dt.length/nt)*(bt+3)+4,Y(x),l.rect(0,k-16,E,16,"F"),v?(rt(P-1,k-14,33,11,2,I),l.addImage(v,"PNG",P+1,k-12.5,29,5.4,void 0,"FAST")):(l.setFont("helvetica","bold"),l.setFontSize(11),j(I),l.text("ViveProp",P,k-7)),l.setFont("helvetica","normal"),l.setFontSize(8),j([200,200,230]),l.text("www.viveprop.cl · Stock de propiedades en gestión",E-P,k-7,{align:"right"}),l.save(`ficha-${p}.pdf`),o.textContent=n,o.disabled=!1}function Fo(t){Vt=t;const e=document.getElementById("video-player-wrap"),o=t.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);o?(e.style.paddingTop="56.25%",e.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${o[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`):(e.style.paddingTop="0",e.innerHTML=`<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${r(t)}">Tu navegador no soporta reproducción de video.</video>`),document.getElementById("video-copy-btn").textContent="🔗 Copiar enlace para cliente",document.getElementById("video-modal").style.display="flex",document.body.style.overflow="hidden"}function Po(){const t=document.getElementById("video-copy-btn");navigator.clipboard.writeText(Vt).then(()=>{t.textContent="✅ Enlace copiado",setTimeout(()=>{t.textContent="🔗 Copiar enlace para cliente"},2500)}).catch(()=>{prompt("Copia este enlace:",Vt)})}function Pe(){document.getElementById("video-modal").style.display="none",document.getElementById("video-player-wrap").innerHTML="",document.body.style.overflow=""}function O(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",","."))/100:0}function Ot(t){if(!t)return 0;const e=parseFloat(String(t).replace(/\./g,"").replace(",","."));return isFinite(e)&&e>=1e3?Math.round(e):0}function Eo(t){if(!t)return 0;const e=String(t).match(/(\d+(?:[.,]\d+)?)/);return e?parseFloat(e[1].replace(",",".")):0}function Ft(t){if(!t)return 0;const e=String(t).match(/(\d+)/);return e?parseInt(e[1]):0}function xo(t){const e={};for(const[o,n]of(t==null?void 0:t.campos)||[])o&&(e[String(o).trim()]=String(n??"").trim());return e}function wo(t,e){const o=xo(t),n=(e||"").toUpperCase(),s={descuentoDepto:0,descuentoAdicional:0,aporteInmobiliario:0,reservaCLP:1e5,reservaUF:0,cuotasPieN:1,upfrontPct:0,piePctDefault:null,pieConstPct:0,creditoDirectoPct:0,cuotonPct:0,tipoEntrega:"Futura",nota:(t==null?void 0:t.nota)||""};if(n.includes("INGEVEC")){const a=Ft(o["Cuotas pie"]);return{...s,descuentoDepto:O(o["Dcto. depto."]),aporteInmobiliario:O(o["Aporte inmobiliario"]),reservaCLP:Ot(o.Reserva),cuotasPieN:Math.max(a-1,0),pieConstPct:O(o["Pie período const."]),creditoDirectoPct:O(o["Pie crédito s/int."]),cuotonPct:O(o.Cuotón),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("MAESTRA")){const a=O(o.Upfront),i=O(o["Pie en cuotas"]);return{...s,descuentoDepto:O(o["Descuento Base"])+O(o["Dcto Adicional"]),aporteInmobiliario:O(o["Certificado Pago"]),upfrontPct:a,piePctDefault:a+i||null,cuotasPieN:Ft(o["UPAGO Cuotas"]),tipoEntrega:o.ENTREGA?String(o.ENTREGA).trim():"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("RVC")){const a=O(o["Pie mínimo"]);return{...s,descuentoDepto:O(o["Descuento RVC"]),piePctDefault:a||null,cuotasPieN:Ft(o["Cuotas prog."]),tipoEntrega:o["Tipo entrega"]||o.Financiamiento||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("TOCTOC")||n.includes("TOC TOC")){const a=o["Monto Reserva"]||"",i=/uf/i.test(a),c=O(o["Pie minimo %"]);return{...s,descuentoDepto:O(o["Descuento autorizado"]),reservaCLP:i?0:Ot(a),reservaUF:i?Eo(a):0,piePctDefault:c||null,cuotasPieN:Ft(o.Cuotas),tipoEntrega:o.Estado||"Futura",nota:(t==null?void 0:t.nota)||""}}if(n.includes("URMENETA")){const a=(t==null?void 0:t.nota)||"",i=a.match(/(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie/i)||a.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%/i)||a.match(/(\d+(?:[.,]\d+)?)\s*%\s+\d+D\b/i),c=i?parseFloat(i[1].replace(",","."))/100:0;return{...s,descuentoDepto:O(o["Descuento máximo"]),aporteInmobiliario:c,reservaCLP:Ot(o["Valor reserva"]),pieConstPct:O(o["% cuotas const."]),cuotasPieN:Ft(o["N° cuotas const."]),tipoEntrega:o["Tipo de entrega"]||"Futura",nota:a}}return s}const St={MESES_ARRIENDO_ANIO:11,HAIRCUT_VENTA:.95,PLUSVALIA_DEFAULT:.02},ne={MAESTRA:{tipoCalculoBono:"maestra",ltvMaxPct:.8,pieConjuntosPct:.2},INGEVEC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},URMENETA:{tipoCalculoBono:"precio-lista-total",ltvMaxPct:1,pieConjuntosPct:.2},RVC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},TOCTOC:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2},DEFAULT:{tipoCalculoBono:"precio-lista-depto",ltvMaxPct:1,pieConjuntosPct:.2}},Io=[.04,.045,.05],Ee=30,xe=.12;function Lo(t,e,o){return t===0?o/e:o*t/(1-Math.pow(1+t,-e))}function Bo(t){const e=(t||"").toUpperCase();return ne[e]||ne.DEFAULT}function Mo(t){const{precioListaDepto:e,descuentoPct:o,bonoPiePct:n,reservaCLP:s,preciosConjuntos:a,piePct:i,upfrontPct:c,plazoAnios:u,tasasCAE:y,valorUF:d,cuotonPct:f,piePeriodoConstruccionPct:p,pieCreditoDirectoPct:F,cuotasPieN:b,arriendosMensualesCLP:v,plusvaliaAnual:$,tipoCalculoBono:C}=t,T=t.pieConjuntosPct??.2,l=(a||[]).reduce((it,jt)=>it+jt,0),E=e+l,k=Math.min(o+0,1),P=e*(1-k),S=l,x=P+S,g=x*d,U=C==="maestra"?i:T,I=Math.round(P*i*100)/100,H=Math.round(l*U*100)/100,q=I+H,Lt=s/d,Y=Math.round(x*(c||0)*100)/100,j=q-Lt-Y,rt=j*d,Bt=b>0?j/b:j,B=Bt*d,ot=Math.round(x*(f||0)*100)/100,yt=Math.round(ot*d),dt=Math.round(x*(p||0)*100)/100,nt=Math.round(dt*d),st=Math.round(x*(F||0)*100)/100,bt=Math.round(st*d),$t=q+ot+dt,M=x*(1-i);let D,A,z,_,R,Z;if(C==="maestra"){const it=1-i-n;A=n>0?Math.round(M/it*100)/100:x,D=Math.round(A*n*100)/100,z=Math.round(A*it*100)/100,Z=q,_=Math.round((A-Z-z)*100)/100,R=A>0?_/A:0}else C==="precio-lista-total"?(D=Math.round(E*n*100)/100,A=n>0?Math.round((x+D)*100)/100:x,_=D,R=n,Z=q,z=Math.round((x-Z-_)*100)/100):(D=Math.round(e*n*100)/100,A=n>0?Math.round((x+D)*100)/100:x,_=D,R=n,Z=q,z=Math.round((x-Z-_)*100)/100);const Xt=z*d,Ae=A*d,Yt=Math.pow(1+($||St.PLUSVALIA_DEFAULT),5)-1,ke=g*(1+Yt)*St.HAIRCUT_VENTA,_e=$t*d,je=y.map((it,jt)=>{const Mt=(v||[0,0,0])[jt]||0,ze=u*12,zt=Lo(it/12,ze,Xt),Re=zt/d,te=Mt-zt,Oe=te*St.MESES_ARRIENDO_ANIO*5,Ne=A>0?Mt*St.MESES_ARRIENDO_ANIO/d/A:0,Ve=Mt*.9,ee=g>0?Math.round(Ve*12/g*1e4)/1e4:0,He=Math.round(ee*5*1e4)/1e4;return{cae:it,arriendoMensualCLP:Mt,cuotaMensualCLP:Math.round(zt),cuotaMensualUF:Math.round(Re*100)/100,flujoMensualCLP:Math.round(te),flujoAcumuladoCLP:Math.round(Oe),capRate:Math.round(Ne*1e4)/1e4,roi5Anios:He,roiAnual:ee}});return{valorUF:d,precioListaDepto:e,precioListaOtros:l,precioListaTotal:E,precioDescDepto:Math.round(P*100)/100,precioDescOtros:S,valorVentaUF:Math.round(x*100)/100,valorVentaCLP:Math.round(g),piePct:i,upfrontPct:c||0,pieTotalDeptoUF:Math.round(I*100)/100,pieTotalConjuntosUF:Math.round(H*100)/100,pieTotalUF:Math.round(q*100)/100,reservaUF:Math.round(Lt*100)/100,upfrontUF:Y,saldoPieUF:Math.round(j*100)/100,saldoPieCLP:Math.round(rt),cuotasPieN:b,valorCuotaPieUF:Math.round(Bt*100)/100,valorCuotaPieCLP:Math.round(B),cuotonUF:ot,cuotonCLP:yt,piePeriodoConstruccionUF:dt,piePeriodoConstruccionCLP:nt,pieCreditoDirectoUF:st,pieCreditoDirectoCLP:bt,totalPieInmobUF:Math.round($t*100)/100,descuentoAdicionalPct:0,bonoPieUF:D,saldoAporteInmobUF:Math.round(_*100)/100,aportePct:Math.round(R*1e4)/1e4,pieCreditoHipUF:Math.round(Z*100)/100,tasacionUF:Math.round(A*100)/100,tasacionCLP:Math.round(Ae),creditoHipBaseUF:Math.round(M*100)/100,creditoHipFinalUF:Math.round(z*100)/100,creditoHipFinalCLP:Math.round(Xt),plusvaliaAcumulada:Math.round(Yt*1e4)/1e4,precioVentaAnio5CLP:Math.round(ke),piePagadoCLP:Math.round(_e),escenarios:je}}let It=null,kt="";function we(t,e){if(typeof t=="number"){Ro(t,e);return}try{const{project:o,depto:n,secundarios:s=[]}=t;console.log("[Cotizador] cotizFromProp",{project:o,depto:n,secundarios:s});const a=h.CC_DATA[o.id]||null,i=wo(a,o.inmobiliaria),c=Bo(o.inmobiliaria),u=i.reservaUF>0?Math.round(i.reservaUF*h.UF):i.reservaCLP;It={project:o,depto:n,secundarios:s,parsedCC:i,regla:c,reservaCLP:u},Uo(i),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),Ie()}catch(o){console.error("[Cotizador] Error en cotizFromProp:",o),document.getElementById("cotiz-basic").style.display="none",document.getElementById("cotiz-panel").style.display="flex",window.openModule("cotiz"),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(o))}

${r(o.stack||"")}</div>`}}function Ie(){if(It)try{const t=To(),e=Do(t),o=Mo(e);console.log("[Cotizador] Input:",e),console.log("[Cotizador] Resultado:",o),Ao(o,t)}catch(t){console.error("[Cotizador] Error en recalcCotizPanel:",t),document.getElementById("cp-results").innerHTML=`<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${r(String(t))}

${r(t.stack||"")}</div>`}}function So(){It=null,document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",window.openModule("pri")}function at(t){return+((t??0)*100).toFixed(2)}function Uo(t){const e=Math.round((t.piePctDefault??xe)*100),o=at((t.descuentoDepto??0)+(t.descuentoAdicional??0)),n=at(t.aporteInmobiliario),s=t.cuotasPieN??0,a=at(t.pieConstPct),i=at(t.cuotonPct),c=at(t.upfrontPct),u=at(t.creditoDirectoPct),[y,d,f]=Io.map(v=>at(v)),p=`Cuotas pie${s>0?` <span class="cp-fg-base">base ${s}</span>`:""}`,F=`Cuotón %${i===0?' <span class="cp-fg-noapl">no aplica</span>':""}`,b=(v,$,C,T,l,E)=>`<div class="cp-fg"><label class="cp-fg-lbl">${v}</label><input id="${$}" class="cp-input" type="number" min="${T}" max="${l}" step="${E}" value="${C}" onchange="recalcCotizPanel()"></div>`;document.getElementById("cp-params-grid").innerHTML=`
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${b("Pie %","cpg-pie",e,0,100,1)}
        ${b("Plazo (años)","cpg-plazo",Ee,5,30,1)}
        ${b("Dcto. depto %","cpg-dcto",o,0,100,.1)}
        ${b("Aporte inmob %","cpg-aporte",n,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${b(p,"cpg-cuotas",s,0,48,1)}
        ${b("Pie const %","cpg-piecst",a,0,100,.1)}
        ${b(F,"cpg-cuoton",i,0,100,.1)}
        ${b("Upfront %","cpg-upfront",c,0,100,.1)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("Crédito directo %","cpg-cdir",u,0,100,.1)}
        ${b("Plusvalía anual %","cpg-plusvalia",2,0,20,.1)}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${b("CAE escenario 1","cpg-cae1",y,0,20,.1)}
        ${b("CAE escenario 2","cpg-cae2",d,0,20,.1)}
        ${b("CAE escenario 3","cpg-cae3",f,0,20,.1)}
      </div>
    </div>`}function To(){const t=e=>{var n;const o=parseFloat((n=document.getElementById(e))==null?void 0:n.value);return isNaN(o)?0:o};return{pie:t("cpg-pie")||xe*100,plazo:t("cpg-plazo")||Ee,dcto:t("cpg-dcto"),aporte:t("cpg-aporte"),cuotas:t("cpg-cuotas"),piecst:t("cpg-piecst"),cuoton:t("cpg-cuoton"),upfront:t("cpg-upfront"),cdir:t("cpg-cdir"),plusvalia:t("cpg-plusvalia")||2,cae1:t("cpg-cae1")||4,cae2:t("cpg-cae2")||4.5,cae3:t("cpg-cae3")||5}}function Do(t){const{reservaCLP:e,regla:o,depto:n,secundarios:s}=It;return{precioListaDepto:n.precio_uf,descuentoPct:t.dcto/100,descuentoAdicionalPct:0,bonoPiePct:t.aporte/100,reservaCLP:e,preciosConjuntos:s.map(a=>a.precio_uf),piePct:t.pie/100,upfrontPct:t.upfront/100,cuotasPieN:t.cuotas,cuotonPct:t.cuoton/100,piePeriodoConstruccionPct:t.piecst/100,pieCreditoDirectoPct:t.cdir/100,plazoAnios:t.plazo,tasasCAE:[t.cae1/100,t.cae2/100,t.cae3/100],valorUF:h.UF,tipoCalculoBono:o.tipoCalculoBono,pieConjuntosPct:o.pieConjuntosPct,arriendosMensualesCLP:[0,0,0],plusvaliaAnual:t.plusvalia/100}}function tt(t){return(Math.round(parseFloat(t)*1e3)/10).toFixed(1).replace(/\.0$/,"")+"%"}function Ao(t,e){const{project:o,depto:n,secundarios:s}=It,a=[`${o.nombre} · DP ${n.dp}${n.tipologia?" "+n.tipologia:""}`,...s.map(i=>`${i.tipologia?i.tipologia+" ":""}DP ${i.dp}`)];document.getElementById("cp-header-title").textContent=a.join(" + "),document.getElementById("cp-results").innerHTML=ko(t,n,s)+_o(t)+(t.pieCreditoDirectoUF>0?jo(t):"")+zo(t,e.plazo)}function ko(t,e,o){const n=t.precioListaDepto>0?1-t.precioDescDepto/t.precioListaDepto:0,s=`
    <tr>
      <td class="cp-val-unit">DP ${r(String(e.dp))}${e.tipologia?" &mdash; "+r(e.tipologia):""}</td>
      <td>${m.uf2(t.precioListaDepto)}</td>
      <td>${n>1e-4?`<span class="cp-val-dcto">&minus;${tt(n)}</span>`:'<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${m.uf2(t.precioDescDepto)}</td>
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
            <td>${m.uf2(t.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${m.uf2(t.valorVentaUF)}<br>
              <small class="cp-val-clp">${m.pesos(t.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function _o(t){let e="";if(e+=`
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${tt(t.piePct)}</span></span>
      <span class="cp-plan-val">${m.uf2(t.pieTotalUF)}<small>${m.pesos(t.pieTotalUF*t.valorUF)}</small></span>
    </div>`,e+=`
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${m.uf2(t.reservaUF)}<small>${m.pesos(t.reservaUF*t.valorUF)}</small></span>
    </div>`,t.upfrontUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${tt(t.upfrontPct)}</span></span>
        <span class="cp-plan-val">${m.uf2(t.upfrontUF)}<small>${m.pesos(t.upfrontUF*t.valorUF)}</small></span>
      </div>`),t.cuotasPieN>0&&t.saldoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${t.cuotasPieN} cuotas &times; ${m.uf2(t.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${m.uf2(t.saldoPieUF)}<small>${m.pesos(t.saldoPieCLP)}</small></span>
      </div>`),t.piePeriodoConstruccionUF>0){const n=t.valorVentaUF>0?t.piePeriodoConstruccionUF/t.valorVentaUF:0;e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${tt(n)}</span></span>
        <span class="cp-plan-val">${m.uf2(t.piePeriodoConstruccionUF)}<small>${m.pesos(t.piePeriodoConstruccionCLP)}</small></span>
      </div>`}t.cuotonUF>0&&(e+=`
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${m.uf2(t.cuotonUF)}<small>${m.pesos(t.cuotonCLP)}</small></span>
      </div>`);const o=t.valorVentaUF>0?t.totalPieInmobUF/t.valorVentaUF:0;return e+=`
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${tt(o)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${m.uf2(t.totalPieInmobUF)}<small>${m.pesos(t.totalPieInmobUF*t.valorUF)}</small></span>
    </div>`,t.bonoPieUF>0&&(e+=`
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${tt(t.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${m.uf2(t.bonoPieUF)}<small>${m.pesos(t.bonoPieUF*t.valorUF)}</small></span>
      </div>`),`
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${e}</div>
    </div>
  </div>`}function jo(t){const e=t.valorVentaUF>0?t.pieCreditoDirectoUF/t.valorVentaUF:0;return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${tt(e)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${m.uf2(t.pieCreditoDirectoUF)}<small>${m.pesos(t.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`}function zo(t,e){const o=t.tasacionUF>0?t.creditoHipFinalUF/t.tasacionUF:0,n=t.escenarios.map((s,a)=>{const i=s.cuotaMensualCLP/.25;return`
      <tr${a===1?' class="cp-esc-highlight"':""}>
        <td class="cp-esc-cae">CAE ${(s.cae*100).toFixed(1).replace(/\.0$/,"")}%</td>
        <td class="cp-esc-div">${m.pesos(s.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${m.uf2(s.cuotaMensualUF)}</td>
        <td>${m.pesos(i)}</td>
      </tr>`}).join("");return`
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${e} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${m.uf2(t.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${m.pesos(t.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${tt(o)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${m.uf2(t.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${m.pesos(t.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${n}</tbody>
      </table>
    </div>
  </div>`}function Ro(t,e){document.getElementById("cotiz-panel").style.display="none",document.getElementById("cotiz-basic").style.display="",document.getElementById("c-precio").value=t,kt=e||"";const o=document.getElementById("c-prop-info");o.innerHTML=`📦 ${r(kt)}`,o.style.display="block",window.openModule("cotiz"),Wt()}function Oo(t){const e=document.getElementById("c-pie-r"),o=document.getElementById("c-pie-n");t==="r"?o.value=e.value:e.value=o.value,document.getElementById("pie-lbl").textContent=e.value+"%",Wt()}function Wt(){const t=parseFloat(document.getElementById("c-precio").value)||0,e=parseFloat(document.getElementById("c-pie-n").value)||20,o=parseFloat(document.getElementById("c-plazo").value)||25,n=parseFloat(document.getElementById("c-tasa").value)||5,s=parseFloat(document.getElementById("c-gc").value)||0;document.getElementById("pie-lbl").textContent=e+"%";const a=document.getElementById("c-results");if(!t){a.innerHTML='<div class="empty-tool"><div class="ei">📊</div><p>Ingresa el precio para simular</p></div>';return}const i=t*e/100,c=t-i,u=n/100/12,y=o*12,d=c*u*Math.pow(1+u,y)/(Math.pow(1+u,y)-1),f=s/h.UF,p=d/.25,F=(d+f)/.25,b=[15,20,25,30];a.innerHTML=`<div class="cotiz-card">
    ${kt?`<div style="font-size:12px;font-weight:600;color:var(--brand);margin-bottom:14px">📦 ${r(kt)}</div>`:""}
    <div class="rc-hero">
      <div class="rc-big">${m.pesos(d*h.UF)}</div>
      <div class="rc-lbl">Dividendo mensual estimado</div>
      <div class="rc-pesos">${m.uf1(d)} · ${o} años al ${n}%</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${m.uf(t)}</span><span class="rcl">Precio propiedad</span><span class="rcp">${m.pesos(t*h.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(i)} (${e}%)</span><span class="rcl">Pie inicial</span><span class="rcp">${m.pesos(i*h.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(c)}</span><span class="rcl">Monto crédito</span><span class="rcp">${m.pesos(c*h.UF)}</span></div>
      <div class="rc-cell hi"><span class="rcv">${m.pesos(p*h.UF)}</span><span class="rcl">Renta mínima necesaria</span><span class="rcp">${s?`Con GC: ${m.pesos(F*h.UF)}`:"Regla 25%"}</span></div>
    </div>
    <div class="rc-tbl-title">Comparativa por plazo · Pie ${e}% · Tasa ${n}%</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th><th>Total pagado</th></tr></thead>
      <tbody>${b.map(v=>{const $=v*12,C=c*u*Math.pow(1+u,$)/(Math.pow(1+u,$)-1);return`<tr class="${v==o?"tr-hl":""}"><td>${v} años</td><td><strong>${m.pesos(C*h.UF)}</strong></td><td>${m.uf1(C)}</td><td>${m.pesos(C/.25*h.UF)}</td><td>${m.uf(C*$)}</td></tr>`}).join("")}</tbody>
    </table>
    ${s?`<p style="font-size:11px;color:var(--g400);margin-top:10px;font-style:italic">* GC de ${m.pesos(s)}/mes incluidos en renta necesaria</p>`:""}
  </div>`}const Tt=Pt,No=["INGEVEC","RVC","TOCTOC","URMENETA","MAESTRA"];let ft=[],Nt=null,W=1,Le="lista",ht=null,et=null,ct=[],X=0;function Be(t){return t?No.some(e=>t.toUpperCase().includes(e))?[1]:[]:[]}function Vo(){if(!h.PROJECTS.length){document.getElementById("pri-grid").innerHTML='<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>';return}const t=[...new Set(h.PROJECTS.map(e=>e.comuna).filter(Boolean))].sort();ce("pri",t),document.getElementById("pri-mc-input").addEventListener("blur",()=>window.mcClose("pri")),_t()}function _t(){var y,d,f,p,F,b;if(!h.PROJECTS.length)return;const t=(((y=document.getElementById("pri-search"))==null?void 0:y.value)||"").toLowerCase(),e=le("pri"),o=((d=document.getElementById("pri-entrega"))==null?void 0:d.value)||"",n=parseFloat((f=document.getElementById("pri-precio-min"))==null?void 0:f.value)||0,s=parseFloat((p=document.getElementById("pri-precio-max"))==null?void 0:p.value)||0,a=[...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(v=>parseInt(v.dataset.val)),i=[...document.querySelectorAll('[data-grp="pri-bano"].active')].map(v=>parseInt(v.dataset.val)),c=((F=document.getElementById("pri-est"))==null?void 0:F.checked)||!1,u=((b=document.getElementById("pri-bod"))==null?void 0:b.checked)||!1;Nt=window._priMaxUF||null,ft=h.PROJECTS.filter(v=>{var T;let $=(v.unidades||[]).filter(l=>l.disponible&&!lt(l.tipologia));if(!$.length||t&&!`${v.nombre||""} ${v.inmobiliaria||""} ${v.comuna||""}`.toLowerCase().includes(t)||e.size&&!e.has(v.comuna)||o&&!((T=v.entrega)!=null&&T.toLowerCase().includes(o.toLowerCase()))||c&&!(v.unidades||[]).some(l=>l.disponible&&/estac|parking|reja/i.test(l.tipologia||""))||u&&!(v.unidades||[]).some(l=>l.disponible&&/bode/i.test(l.tipologia||""))||a.length&&($=$.filter(l=>{const E=parseInt(l.dormitorios)||0;return a.some(k=>k===4?E>=4:E===k)}),!$.length)||i.length&&($=$.filter(l=>{const E=parseInt(l.banos)||0;return i.some(k=>k===3?E>=3:E===k)}),!$.length))return!1;const C=Math.min(...$.map(l=>l.precio_uf).filter(l=>l>0));return!(n&&C<n||s&&C>s||Nt&&!$.some(l=>l.precio_uf<=Nt))}),W=1,Me(),Le==="mapa"&&he(ft)}function Ho(t){const e=Math.max(1,Math.ceil(ft.length/Tt));W=Math.min(Math.max(1,W+t),e),Me(),document.getElementById("pri-gondola-wrap").scrollTop=0}function Me(){const t=document.getElementById("pri-grid"),e=ft.length,o=Math.max(1,Math.ceil(e/Tt));W>o&&(W=o),document.getElementById("pri-count").textContent=`${e.toLocaleString("es-CL")} proyecto${e!==1?"s":""}`,document.getElementById("pri-pager").textContent=`Pág. ${W} / ${o}`,document.getElementById("pri-prev").disabled=W<=1,document.getElementById("pri-next").disabled=W>=o;const n=document.getElementById("tb-stats");if(n&&(n.textContent=`${e.toLocaleString("es-CL")} proyectos · ${h.PROJECTS.length.toLocaleString("es-CL")} total`),!e){t.innerHTML='<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>';return}const s=ft.slice((W-1)*Tt,W*Tt);t.innerHTML=s.map(a=>{const i=(a.unidades||[]).filter(v=>v.disponible&&!lt(v.tipologia)),c=i.map(v=>v.precio_uf).filter(v=>v>0),u=c.length?Math.min(...c):0,y=c.length?Math.max(...c):0,d=a.foto_portada||"",f=[...new Set(i.map(v=>{const $=parseInt(v.dormitorios)||0;return $===0?"Estudio":$+"D"}))].sort().slice(0,3).join(", "),p=i.reduce((v,$)=>$.m2_interior&&$.m2_interior<v?$.m2_interior:v,9999),F=p<9999?p.toFixed(0)+" m²":"—",b=h.CC_DATA[a.id]||Be(a.inmobiliaria).length;return`<div class="proj-card" onclick="openProject('${r(a.id)}')">
      <div class="prj-img" style="${d?`background-image:url('${d}');background-size:cover;background-position:center`:""}">
        ${d?"":'<div class="prj-img-icon">🏗️</div>'}
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
          <div class="prj-stat"><div class="prj-stat-v">${f||"—"}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${F}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${i.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${u?"UF "+u.toLocaleString("es-CL",{maximumFractionDigits:0}):"—"}</span>
          ${y>u?`<span class="prj-hasta">— ${y.toLocaleString("es-CL",{maximumFractionDigits:0})}</span>`:""}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${r(a.id)}')">Ver proyecto →</button>
          ${b?'<span class="prj-cc-badge">📋 Cond. Com.</span>':""}
        </div>
      </div>
    </div>`}).join("")}function Go(t){Le=t,co(t),document.getElementById("pri-btn-lista").classList.toggle("active",t==="lista"),document.getElementById("pri-btn-mapa").classList.toggle("active",t==="mapa");const e=document.getElementById("pri-gondola-wrap"),o=document.getElementById("pri-map-wrap"),n=document.getElementById("pri-pager-wrap");if(e.style.display=t==="lista"?"":"none",o.style.display=t==="mapa"?"flex":"none",n&&(n.style.display=t==="lista"?"flex":"none"),t==="mapa"){io();const s=ao();setTimeout(()=>s&&s.invalidateSize(),120),he(ft)}}function Se(t){["gal","map","units","cc"].forEach(e=>{const o=document.getElementById("pm-tab-"+e),n=document.getElementById("pm-pane-"+e);o&&o.classList.toggle("active",e===t),n&&(n.style.display=e===t?"flex":"none")}),t==="map"&&ro(ht)}function qo(t){const e=t.unidades||[],o=e.filter(g=>g.disponible&&!lt(g.tipologia)),n=o.map(g=>g.precio_uf).filter(g=>g>0),s=n.length?Math.min(...n):0,a=n.length?Math.max(...n):0,i=o.map(g=>g.m2_interior).filter(g=>g>0),c=i.length?Math.min(...i):0,u=i.length?Math.max(...i):0,y=[...new Set(o.map(g=>{const U=parseInt(g.dormitorios)||0;return U===0?"Estudio":U+"D"}))].sort(),d=g=>g.toLocaleString("es-CL",{maximumFractionDigits:0}),f=s?a>s?`UF ${d(s)} – ${d(a)}`:`UF ${d(s)}`:" — ",p=c?u>c?`${c.toFixed(0)} – ${u.toFixed(0)} m²`:`${c.toFixed(0)} m²`:" — ",F=[t.direccion,t.comuna].filter(Boolean).join(", ");let b="";F&&(b+=`<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${r(F)}</span>
      ${t.entrega?`<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${r(t.entrega)}</span>`:""}
    </div>`),b+=`<div class="pm-stats-grid">
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Disponibles</span>
      <span class="pm-stat-card-val">${o.length}</span>
      <span class="pm-stat-card-sub">unidades</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Tipologías</span>
      <span class="pm-stat-card-val" style="font-size:${y.length>3?"11px":"15px"}">${y.join(", ")||"—"}</span>
      <span class="pm-stat-card-sub">${y.length} tipo${y.length!==1?"s":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">M² útil</span>
      <span class="pm-stat-card-val" style="font-size:${u>c?"11px":"15px"}">${p}</span>
      <span class="pm-stat-card-sub">${c?"interior":""}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${a>s?"11px":"15px"}">${f}</span>
      <span class="pm-stat-card-sub">${s?"en UF":""}</span>
    </div>
  </div>`;const v=[...new Set(o.map(g=>parseInt(g.piso)).filter(g=>g>0))].sort((g,U)=>g-U),$=[...new Set(o.map(g=>(g.orientacion||"").trim()).filter(Boolean))],C=o.map(g=>g.m2_terraza).filter(g=>g>0),T=[];if(v.length>0){const g=v.length===1?`Piso ${v[0]}`:`Pisos ${v[0]} – ${v[v.length-1]}`;T.push(`<div class="pm-detail-pill"><strong>${g}</strong></div>`)}if($.length>0&&T.push(`<div class="pm-detail-pill">🧭 <strong>${$.slice(0,3).join(" · ")}</strong></div>`),C.length>0){const g=Math.min(...C).toFixed(0);T.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${g} m²</strong></div>`)}T.length&&(b+=`<div class="pm-detail-row">${T.join("")}</div>`);const l=e.filter(g=>lt(g.tipologia)&&/estac|parking/i.test(g.tipologia||"")),E=e.filter(g=>lt(g.tipologia)&&/bode/i.test(g.tipologia||"")),k=l.filter(g=>g.disponible),P=E.filter(g=>g.disponible),S=[];if(l.length>0){const g=k.map(I=>I.precio_uf).filter(I=>I>0),U=g.length?Math.min(...g):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${k.length} disp.</span>
        <span class="pm-extra-sub">${U?`Desde UF ${d(U)}`:`${l.length} en total`}</span>
      </div>
    </div>`)}if(E.length>0){const g=P.map(I=>I.precio_uf).filter(I=>I>0),U=g.length?Math.min(...g):0;S.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${P.length} disp.</span>
        <span class="pm-extra-sub">${U?`Desde UF ${d(U)}`:`${E.length} en total`}</span>
      </div>
    </div>`)}S.length&&(b+=`<div class="pm-extras-row">${S.join("")}</div>`);const x=h.CC_DATA[t.id];if(x&&x.campos&&x.campos.length){const g=["Dcto. depto.","Descuento Base","Reserva","Valor reserva","Tipo de entrega","Pie período const.","% cuotas const.","Cuotas pie","Financiamiento","Descuento RVC","Bono pie","Descuento"],U=[];for(const I of g){const H=x.campos.find(([q])=>q===I);if(H&&U.push(H),U.length===6)break}U.length<6&&x.campos.filter(([I])=>!U.find(([H])=>H===I)).slice(0,6-U.length).forEach(I=>U.push(I)),b+=`<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${U.map(([I,H])=>`<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${r(I)}</span>
          <span class="pm-cc-prev-val">${r(H)}</span>
        </div>`).join("")}
      </div>
      ${x.nota?`<div class="pm-cc-nota">${r(x.nota)}</div>`:""}
    </div>`}document.getElementById("pm-proj-summary").innerHTML=b}function Ue(t){const e=document.getElementById("pm-cc-inner"),o=h.CC_DATA[t]||null;if(!o){e.innerHTML='<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>';return}let n=`<div class="pm-cc-titulo">${r(o.titulo||"Condiciones Comerciales")}</div>`;if(o.campos&&o.campos.length){const s=o.campos.filter(([,i])=>i.length<=60),a=o.campos.filter(([,i])=>i.length>60);s.length&&(n+='<div class="pm-cc-section-lbl">Condiciones de venta</div>',n+='<div class="pm-cc-grid">',s.forEach(([i,c])=>{n+=`<div class="pm-cc-field"><span class="pm-cc-lbl">${r(i)}</span><span class="pm-cc-val">${r(c)}</span></div>`}),n+="</div>"),a.length&&(n+='<div class="pm-cc-section-lbl">Información adicional</div>',a.forEach(([i,c])=>{n+='<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">',n+=`<div class="pm-cc-lbl">${r(i)}</div>`,n+=`<div class="pm-cc-val-long">${r(c)}</div>`,n+="</div>"}))}o.tabla&&(n+=`<div class="pm-cc-section-lbl">${o.tabla.headers[0]==="Tipología"?"Tipologías":"Oportunidades"}</div>`,n+='<table class="pm-cc-tbl"><thead><tr>',o.tabla.headers.forEach(s=>{n+=`<th>${r(s)}</th>`}),n+="</tr></thead><tbody>",o.tabla.rows.forEach(s=>{n+="<tr>",s.forEach(a=>{n+=`<td>${r(a||"—")}</td>`}),n+="</tr>"}),n+="</tbody></table>"),o.nota&&(n+=`<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${r(o.nota)}</div>`),e.innerHTML=n}function Jo(t){const e=h.PROJECTS.find(p=>p.id===t);if(!e)return;ht=e,et=null,document.getElementById("pm-title").textContent=e.nombre,document.getElementById("pm-sub").textContent=[e.inmobiliaria,e.comuna,e.entrega?"Entrega "+e.entrega:""].filter(Boolean).join(" · "),Se("gal"),qo(e),ct=e.fotos||[],X=0;const o=document.getElementById("pm-gal-img"),n=document.getElementById("pm-gal-spin"),s=document.getElementById("pm-gal-nophoto"),a=document.getElementById("pm-gal-thumbs"),i=document.getElementById("pm-gal-counter");n.style.display="none",ct.length?(s.style.display="none",Zt(0),a.innerHTML=ct.map((p,F)=>`<img src="${p}" onclick="pmShowGalPhoto(${F})" ${F===0?'class="active"':""}>`).join("")):(o.style.display="none",s.style.display="flex",a.innerHTML="",i.style.display="none",document.getElementById("pm-gal-prev").disabled=!0,document.getElementById("pm-gal-next").disabled=!0);const c=e.pdfs||[];document.getElementById("pm-pdf-list").innerHTML=c.length?c.map(p=>`<a class="pm-pdf-item" href="${p.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${r(p.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join(""):"";const u=document.getElementById("pm-tab-cc"),y=h.CC_DATA[e.id],d=Be(e.inmobiliaria).length>0;y||d?(u.style.display="",Ue(e.id)):u.style.display="none";const f=(e.unidades||[]).filter(p=>p.disponible&&!lt(p.tipologia));document.getElementById("pm-units-body").innerHTML=f.map(p=>`
    <tr>
      <td>${r(p.dp)}</td>
      <td>${r(p.tipologia)}</td>
      <td>${r(p.piso||"—")}</td>
      <td>${p.m2_interior?p.m2_interior.toFixed(1)+" m²":"—"}</td>
      <td>${p.m2_terraza?p.m2_terraza.toFixed(1)+" m²":"—"}</td>
      <td>${r(p.orientacion||"—")}</td>
      <td class="td-precio">${m.uf(p.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${r(p.dp)}')">Elegir</button></td>
    </tr>`).join("")||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>',document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),document.getElementById("proj-modal").classList.add("open"),document.body.style.overflow="hidden"}function Zt(t){var n;X=Math.max(0,Math.min(t,ct.length-1));const e=document.getElementById("pm-gal-img");e.src=ct[X],e.style.display="block";const o=document.getElementById("pm-gal-counter");o.style.display="block",o.textContent=`${X+1} / ${ct.length}`,document.getElementById("pm-gal-prev").disabled=X===0,document.getElementById("pm-gal-next").disabled=X===ct.length-1,document.querySelectorAll("#pm-gal-thumbs img").forEach((s,a)=>s.classList.toggle("active",a===X)),(n=document.getElementById("pm-gal-thumbs").children[X])==null||n.scrollIntoView({inline:"nearest",block:"nearest"})}function Ko(t){Zt(X+t)}function Qt(){document.getElementById("proj-modal").classList.remove("open"),document.body.style.overflow="",ht=null,et=null}function Wo(t){const e=ht,o=(e.unidades||[]).find(i=>i.dp===t);if(!o)return;et=o,document.getElementById("pm-sel-title").textContent=`DP ${o.dp} · ${o.tipologia}${o.piso?" · Piso "+o.piso:""}`,document.getElementById("pm-sel-detail").textContent=[o.m2_interior?o.m2_interior.toFixed(1)+" m² útil":"",o.m2_terraza?o.m2_terraza.toFixed(1)+" m² terraza":"",o.orientacion||""].filter(Boolean).join(" · ");const n=(e.unidades||[]).filter(i=>i.disponible&&lt(i.tipologia)),s=document.getElementById("pm-extras-wrap"),a=document.getElementById("pm-extras-list");n.length?(s.style.display="",a.innerHTML=n.map(i=>`
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${i.precio_uf}" data-dp="${r(i.dp)}" data-label="${r(i.tipologia)} DP ${r(i.dp)}">
        <span class="extra-label">${r(i.tipologia)} — DP ${r(i.dp)}</span>
        <span class="extra-price">${m.uf(i.precio_uf)}</span>
      </label>`).join("")):(s.style.display="none",a.innerHTML=""),Te(),document.getElementById("pm-step1").style.display="none",document.getElementById("pm-step2").classList.add("visible")}function Te(){if(!et)return;let t=et.precio_uf||0;document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(e=>{t+=parseFloat(e.value)||0}),document.getElementById("pm-total-val").textContent=m.uf(t)}function Zo(){document.getElementById("pm-step1").style.display="",document.getElementById("pm-step2").classList.remove("visible"),et=null}function Qo(){if(!et||!ht)return;const t=ht,e=et,o=[];document.querySelectorAll("#pm-extras-list input[type=checkbox]:checked").forEach(n=>{const s=(t.unidades||[]).find(a=>a.dp===n.dataset.dp);s&&o.push(s)}),Qt(),we({project:t,depto:e,secundarios:o})}function Xo(t){t.classList.toggle("active"),_t()}let xt=null;function Yo(){const t=parseFloat(document.getElementById("p-renta").value)||0,e=parseFloat(document.getElementById("p-ahorro").value)||0,o=parseFloat(document.getElementById("p-deudas").value)||0,n=parseFloat(document.getElementById("p-plazo").value)||25,s=parseFloat(document.getElementById("p-tasa").value)||5,a=document.getElementById("p-results");if(document.getElementById("p-btns").style.display="none",!t){a.innerHTML='<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente</p></div>';return}const i=s/100/12,c=n*12,u=t*.25-o;if(u<=0){a.innerHTML='<div class="warn-card">⚠️ Las deudas mensuales superan la capacidad de pago del 25% de la renta.</div>';return}const y=(Math.pow(1+i,c)-1)/(i*Math.pow(1+i,c)),d=u*y/h.UF,f=e/h.UF,p=Math.min(d/.8,d+f),F=p*.2,b=Math.max(0,F-f);xt=p;const v=[15,20,25,30];a.innerHTML=`<div class="perfil-card">
    <div class="rc-hero">
      <div class="rc-big">${m.uf(p)}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${m.pesos(p*h.UF)}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${m.pesos(u)}</span><span class="rcl">Dividendo máximo / mes</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(d)}</span><span class="rcl">Crédito hipotecario máx.</span></div>
      <div class="rc-cell"><span class="rcv">${m.uf(F)}</span><span class="rcl">Pie requerido (20%)</span></div>
      <div class="rc-cell ${b>0?"warn":"ok"}">
        <span class="rcv">${b>0?"⚠️ Faltan "+m.uf(b):"✅ Ahorro suficiente"}</span>
        <span class="rcl">${m.uf(f)} disponible</span>
      </div>
    </div>
    <div class="rc-tbl-title">Simulación por plazo · Tasa ${s}% anual</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Crédito máx.</th><th>Precio máx.</th></tr></thead>
      <tbody>${v.map($=>{const C=$*12,T=(Math.pow(1+i,C)-1)/(i*Math.pow(1+i,C)),l=u*T/h.UF,E=Math.min(l/.8,l+f);return`<tr class="${$==n?"tr-hl":""}"><td>${$} años</td><td>${m.pesos(u)}</td><td>${m.uf(l)}</td><td><strong>${m.uf(E)}</strong></td></tr>`}).join("")}</tbody>
    </table>
  </div>`,document.getElementById("p-btns").style.display="flex"}function tn(t){xt&&(t==="sec"?(window._secMaxUF=xt,window.secFilter(),window.openModule("sec"),Gt("sec")):(window._priMaxUF=xt,window.priFilter(),window.openModule("pri"),Gt("pri")))}function Gt(t){var n;(n=document.getElementById("bb-"+t))==null||n.remove();const e=document.createElement("div");e.id="bb-"+t,e.className="filter-strip",e.style.cssText="background:#FFFBEB;border-bottom:1px solid #FCD34D;",e.innerHTML=`<span style="font-size:13px;color:#92400E">👤 Filtrando por presupuesto: <strong>${m.uf(xt)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${t}')">✕ Limpiar filtro</button>`;const o=document.getElementById("mod-"+t);o.insertBefore(e,o.querySelector(".filter-strip"))}function en(t){var e;t==="sec"?(window._secMaxUF=null,window.secFilter()):(window._priMaxUF=null,window.priFilter()),(e=document.getElementById("bb-"+t))==null||e.remove()}const on={sec:"Stock Secundario",pri:"Proyectos Nuevos",perfil:"Perfilador",cotiz:"Cotizador"};Object.assign(window,{openModule:De,mcFilter:re,mcOpen:Ge,mcClose:qe,mcSelect:Je,mcRemove:Ke,secFilter:Ut,secPage:go,setSecView:vo,openDetail:Fe,openSecDetail:fo,showDpPhoto:Jt,navDp:Ht,closeDetail:Kt,shareProperty:bo,downloadPhotos:$o,printFicha:Co,openVideo:Fo,copyVideoLink:Po,closeVideo:Pe,toggleSecPill:t=>{t.classList.toggle("active"),Ut()},togglePriPill:t=>{t.classList.toggle("active"),_t()},toggleTipPill:t=>{t.classList.toggle("active"),Ut()},toggleDormPill:Xo,priFilter:_t,priPage:Ho,setPriView:Go,openProject:Jo,closeProjModal:Qt,pmTab:Se,renderCC:Ue,pmShowGalPhoto:Zt,pmGalNav:Ko,selectProjUnit:Wo,pmUpdateTotal:Te,pmBack:Zo,pmCotizar:Qo,calcPerfil:Yo,searchFromPerfil:tn,showBudgetBanner:Gt,clearBudget:en,cotizFromProp:we,syncPie:Oo,calcCotiz:Wt,recalcCotizPanel:Ie,volverDesdeCotiz:So});function De(t){document.querySelectorAll(".module").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".snav-btn").forEach(n=>n.classList.remove("active")),document.getElementById("mod-"+t).classList.add("active"),document.querySelector(`.snav-btn[data-m="${t}"]`).classList.add("active"),document.getElementById("topbar-title").textContent=on[t]||t;const e=document.getElementById("sbf-sec"),o=document.getElementById("sbf-pri");e&&(e.style.display=t==="sec"?"":"none"),o&&(o.style.display=t==="pri"?"":"none")}document.addEventListener("keydown",t=>{if(document.getElementById("detail-modal").classList.contains("open")){t.key==="Escape"&&Kt(),t.key==="ArrowLeft"&&Ht(-1),t.key==="ArrowRight"&&Ht(1);return}t.key==="Escape"&&Pe()});document.getElementById("detail-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Kt()});document.getElementById("proj-modal").addEventListener("click",t=>{t.target===t.currentTarget&&Qt()});async function nn(){try{const[t,e,o,n,s,a]=await Promise.all([ut.uf(),ut.stock(),ut.projects(),ut.cc(),ut.geocodes(),ut.priGeo()]);h.UF=t.valor??h.UF,h.STOCK=e??[],h.PROJECTS=o??[],h.CC_DATA=n??{};const i=document.getElementById("uf-val"),c=document.getElementById("uf-date");if(i&&(i.textContent=h.UF.toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})),c&&t.fecha){const u=new Date(t.fecha);c.textContent=u.toLocaleDateString("es-CL",{day:"numeric",month:"short"})}s&&Object.assign(h._GC,s),a&&Object.assign(h._GC,a);try{const u=JSON.parse(localStorage.getItem("_geo_cache")||"{}");Object.assign(h._GC,u)}catch{}}catch(t){console.error("Bootstrap data load failed:",t)}uo(),Vo(),De("sec")}nn();
