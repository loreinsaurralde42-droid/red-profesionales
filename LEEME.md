# Red de Profesionales — versión 3

## Cómo está armado
- `_fuente/datos.js`: **el único archivo de datos.** Profesionales, localidades, categorías ("¿Qué te está pasando?"), configuración y planes.
- `_fuente/construir.py`: genera todas las páginas (inicio, una página por profesional, por localidad, bienestar, institucionales, sitemap).
- `_fuente/inicio.html` y `_fuente/textos/`: plantilla del inicio y textos de Nosotros, Privacidad y Términos.
- `assets/`: estilos y scripts comunes (`comun.js`: menú, métricas, reproductor; `inicio.js`: bienvenida, buscador y directorio).
- La carpeta `_fuente` no se publica en Vercel (`.vercelignore`).

## Para agregar o editar un profesional
1. Editá `_fuente/datos.js` (copiá un bloque existente). Elegí un `slug` único, por ejemplo `nombre-apellido`.
2. Cargá sus **áreas de trabajo** tal como las declaró: de ahí salen los motivos de consulta en los que aparece.
3. Cuando verifiques la matrícula ante el colegio, poné `verificado: true`. Hasta entonces la ficha dice “informada por el profesional”.
4. Cuando tengas su autorización escrita, poné `consentimiento: true` (registro interno).
5. Ejecutá `python3 _fuente/construir.py` (requiere Python 3 y Node.js) y subí la carpeta a Vercel.

## Métricas (Umami)
- Visitas a cada perfil: página `/profesional/<slug>.html`.
- Eventos: `contacto-whatsapp`, `contacto-email`, `instagram`, `facebook`, `ver-perfil`, `compartir-perfil`, `busqueda` (solo profesión, localidad y modalidad; nunca el motivo), `bienvenida-*`, `sonido-*`.
- Ambiente sonoro: arranca solo a volumen bajo (30 %) al tocar ENTRAR o con el primer toque en cualquier página. Si la persona lo pausa o lo apaga, se respeta en las páginas siguientes. Eventos `sonido-on` (auto: si/no) y `sonido-off`.
- Cada evento lleva `profesional` y `origen` (tarjeta, perfil, localidad…).

## Pendientes que requieren información de la titular

- Condiciones de participación de los profesionales (gratuita o con costo, opciones ampliadas).
- Revisión profesional y autoría de los textos de Bienestar; artículos de la sección A.
- Marcar `verificado` y `consentimiento` en cada profesional.
- Panel automático de estadísticas por profesional: requiere la API de Umami (plan pago) o un backend.
