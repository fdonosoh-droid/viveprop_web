---
name: feedback-cotizador
description: Reglas de colaboración aprendidas trabajando en el cotizador
metadata:
  type: feedback
---

No implementar ni modificar código hasta recibir confirmación explícita del usuario después de entregar un diagnóstico.

**Why:** Felipe prefiere revisar el diagnóstico técnico antes de proceder. Cuando pregunta "ayúdame con el diagnóstico", espera análisis → confirmación → implementación, no todo de golpe.

**How to apply:** Ante bugs del cotizador: entregar diagnóstico con puntos numerados, esperar "si confirmo" u orden explícita antes de tocar código.

---

El bono pie aplica SOLO sobre la unidad principal (depto) después del descuento, NO sobre estacionamientos/bodegas (conjuntos).

**Why:** Es la regla de negocio de las inmobiliarias chilenas. El bono es un aporte del desarrollador al comprador para reducir el pie efectivo.

**How to apply:** En `calc_cotizador.js`, la base del bono siempre es `precioDescDepto`, nunca `precioListaTotal` ni valor que incluya conjuntos.

---

MAESTRA Inmobiliaria tiene su propia fórmula de LTV y NO debe modificarse cuando se arreglan bugs del modelo general.

**Why:** MAESTRA usa algebra especial: `chPct = 1 - piePct - bonoPiePct`. Los otros tipos (INGEVEC, URMENETA, DEFAULT) usan el modelo unificado.

**How to apply:** Toda modificación a la lógica de bono/pie/CH debe ir dentro del `else` (no-maestra), nunca tocar el branch `tipoCalculoBono === 'maestra'`.
