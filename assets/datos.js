/* =====================================================================
   DATOS DE LA RED — este es el único archivo que hace falta editar para
   cambiar textos generales o sumar / modificar profesionales.
   Después de editarlo, ejecutá:  python3 _fuente/construir.py
   (regenera las páginas individuales, por localidad y el sitemap).
   ===================================================================== */
var RED = {};

/* Configuración general (el nombre de la Red se cambia SOLO acá) */
RED.CONFIG = {
  "nombreRed": "ARANDU: profesionales de la salud mental, del desarrollo y bienestar",
  "nombreCorto": "ARANDU",
  "logoLinea1": [
    "ARANDU",
    ""
  ],
  "logoLinea2": "Profesionales de la salud mental, del desarrollo y bienestar",
  "sitioUrl": "https://redprofesionales-chaco-vercel.vercel.app",
  "umamiWebsiteId": "70a296e1-5511-4dbc-a00a-a31bd7c4a5d9",
  "umamiDominios": "redprofesionales-chaco-vercel.vercel.app,redarandu.com.ar,www.redarandu.com.ar",
  "emailRed": "psicologa.lorenainsaurralde@gmail.com",
  "emailSumarse": "psicologa.lorenainsaurralde@gmail.com",
  "fechaLegales": "11 de noviembre de 2026",
  "mensajeWhatsApp": "Hola, te escribo desde la web de ARANDU, profesionales de la salud mental, del desarrollo y bienestar. Quisiera consultar por un turno.",
  "asuntoEmail": "Consulta desde ARANDU",
  "guardiaDiurna": "362 461-8432",
  "guardiaNocturna": "362 481-4825",
  "velocidadCarrusel": 6000,
  "fotosInicio": [
    {
      "foto": "img/hero-1.jpg",
      "posicion": "72% 35%"
    },
    {
      "foto": "img/hero-2.jpg",
      "posicion": "66% 25%"
    },
    {
      "foto": "img/hero-3.jpg",
      "posicion": "68% 30%"
    },
    {
      "foto": "img/hero-4.jpg",
      "posicion": "68% 30%"
    },
    {
      "foto": "img/hero-5.jpg",
      "posicion": "70% 28%"
    }
  ]
};

/* Localidades por provincia. Para expandir al NEA, completá las otras provincias. */
RED.LOCALIDADES = {
  "Chaco": [
    "Villa Ángela",
    "Avia Terai",
    "Barranqueras",
    "Basail",
    "Campo Largo",
    "Capitán Solari",
    "Charadai",
    "Charata",
    "Chorotis",
    "Ciervo Petiso",
    "Colonia Benítez",
    "Colonia Elisa",
    "Colonia Popular",
    "Colonias Unidas",
    "Concepción del Bermejo",
    "Coronel Du Graty",
    "Corzuela",
    "Cote Lai",
    "El Espinillo",
    "El Sauzalito",
    "Enrique Urien",
    "Fontana",
    "Fuerte Esperanza",
    "Gancedo",
    "General Capdevila",
    "General José de San Martín",
    "General Pinedo",
    "General Vedia",
    "Hermoso Campo",
    "Isla del Cerrito",
    "Juan José Castelli",
    "La Clotilde",
    "La Eduvigis",
    "La Escondida",
    "La Leonesa",
    "La Tigra",
    "La Verde",
    "Laguna Blanca",
    "Laguna Limpia",
    "Lapachito",
    "Las Breñas",
    "Las Garcitas",
    "Las Palmas",
    "Los Frentones",
    "Machagai",
    "Makallé",
    "Margarita Belén",
    "Miraflores",
    "Misión Nueva Pompeya",
    "Napenay",
    "Pampa Almirón",
    "Pampa del Indio",
    "Pampa del Infierno",
    "Presidencia de la Plaza",
    "Presidencia Roca",
    "Presidencia Roque Sáenz Peña",
    "Puerto Bermejo",
    "Puerto Eva Perón",
    "Puerto Tirol",
    "Puerto Vilelas",
    "Quitilipi",
    "Resistencia",
    "Samuhú",
    "San Bernardo",
    "Santa Sylvina",
    "Selvas del Río de Oro",
    "Taco Pozo",
    "Tres Isletas",
    "Villa Berthet",
    "Villa Río Bermejito"
  ],
  "Corrientes": [],
  "Formosa": [],
  "Misiones": [],
  "Santiago del Estero": []
};

/* Profesiones y sus colores de etiqueta */
RED.PROFESIONES = {
  "Psicología": {
    "etq": "Psicólogo/a",
    "color": "#e4ebe2",
    "texto": "#3f5644"
  },
  "Psiquiatría": {
    "etq": "Psiquiatra",
    "color": "#e2e8f1",
    "texto": "#34496b"
  },
  "Psicopedagogía": {
    "etq": "Psicopedagogo/a",
    "color": "#f3e6f0",
    "texto": "#6b3a60"
  },
  "Acompañamiento terapéutico": {
    "etq": "Acompañante terapéutico/a",
    "color": "#f6e3da",
    "texto": "#7d3a24"
  },
  "Estimulación temprana": {
    "etq": "Estimulador/a temprano/a",
    "color": "#fbefd2",
    "texto": "#6b5214"
  },
  "Psicomotricidad": {
    "etq": "Psicomotricista",
    "color": "#e0eff0",
    "texto": "#2f5d61"
  },
  "Terapia ocupacional": {
    "etq": "Terapista ocupacional",
    "color": "#ece6f6",
    "texto": "#4d3f73"
  },
  "Fonoaudiología": {
    "etq": "Fonoaudiólogo/a",
    "color": "#f0ebdf",
    "texto": "#5c4d2c"
  }
};

/* Motivos de consulta en lenguaje cotidiano.
   Un profesional aparece en una categoría SOLO si sus propias áreas de trabajo,
   su presentación o la población que atiende lo dicen (claves / poblaciones),
   o si se la asignás a mano en su campo "categorias" después de verificarlo. */
RED.CATEGORIAS = [
  {
    "id": "ansiedad-estres",
    "nombre": "Ansiedad y estrés",
    "icono": "🌬️",
    "claves": [
      "ansiedad",
      "estres",
      "burnout",
      "angustia",
      "panico"
    ]
  },
  {
    "id": "dificultades-emocionales",
    "nombre": "Dificultades emocionales",
    "icono": "💭",
    "claves": [
      "depresion",
      "autoestima",
      "emocional",
      "tristeza",
      "desanimo",
      "malestar psiquico",
      "psicosis",
      "crisis vitales"
    ]
  },
  {
    "id": "crianza-familia",
    "nombre": "Crianza y orientación familiar",
    "icono": "🏡",
    "claves": [
      "crianza",
      "familia",
      "orientacion familiar"
    ],
    "poblaciones": [
      "Familias"
    ]
  },
  {
    "id": "infancias",
    "nombre": "Infancias",
    "icono": "🧒",
    "claves": [
      "\\binfancia",
      "\\binfantil",
      "\\bninos?\\b",
      "\\bninas?\\b"
    ],
    "poblaciones": [
      "Bebés y primera infancia",
      "Niños"
    ]
  },
  {
    "id": "adolescencias",
    "nombre": "Adolescencias",
    "icono": "🧑",
    "claves": [
      "adolescen"
    ],
    "poblaciones": [
      "Adolescentes"
    ]
  },
  {
    "id": "pareja-vinculos",
    "nombre": "Pareja y vínculos",
    "icono": "🤝",
    "claves": [
      "\\bpareja",
      "\\bseparacion"
    ],
    "poblaciones": [
      "Parejas"
    ]
  },
  {
    "id": "duelo-perdidas",
    "nombre": "Duelo y pérdidas",
    "icono": "🕯️",
    "claves": [
      "duelo",
      "perdidas"
    ]
  },
  {
    "id": "aprendizaje-desarrollo",
    "nombre": "Aprendizaje y desarrollo",
    "icono": "📚",
    "claves": [
      "aprendizaje",
      "lectoescritura",
      "lenguaje",
      "habla",
      "desarrollo infantil",
      "estimulacion",
      "psicomotri",
      "orientacion vocacional"
    ]
  },
  {
    "id": "consumos",
    "nombre": "Consumos problemáticos",
    "icono": "🌱",
    "claves": [
      "adiccion",
      "consumo problematico",
      "consumos"
    ]
  },
  {
    "id": "neurodesarrollo",
    "nombre": "Neurodesarrollo",
    "icono": "🧩",
    "claves": [
      "espectro autista",
      "neurodesarrollo",
      "\\btea\\b",
      "tdah",
      "apraxia"
    ]
  },
  {
    "id": "adultos-mayores",
    "nombre": "Salud mental en adultos mayores",
    "icono": "🌿",
    "claves": [],
    "poblaciones": [
      "Adultos mayores"
    ]
  }
];

/* Estructura preparada para membresías futuras. Ninguna opción paga está activa. */
RED.PLANES = {
  "basico": {
    "nombre": "Perfil básico",
    "activo": true,
    "descripcion": "Ficha completa en el directorio, página propia y contacto directo."
  },
  "ampliado": {
    "nombre": "Perfil profesional ampliado",
    "activo": false,
    "descripcion": "En definición."
  },
  "visibilidad": {
    "nombre": "Servicios adicionales de visibilidad",
    "activo": false,
    "descripcion": "En definición. Si se implementan, se mostrarán siempre identificados como espacio promocionado, separados de la verificación profesional."
  }
};

/* PROFESIONALES
   - verificado: poné true SOLO cuando hayas comprobado la matrícula ante el colegio.
   - consentimiento: poné true cuando tengas la autorización escrita para publicar.
   - categorias: ids de RED.CATEGORIAS asignados a mano (opcional).
   - whatsapp: número con 549 + código de área sin 0 + número sin 15. */
RED.PROFESIONALES = [
  {
    "id": "cinat",
    "slug": "sol-magali-cinat",
    "nombre": "Sol Magali Cinat",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (UNC)",
    "matricula": "M.P. 861",
    "verificado": false,
    "rol": "",
    "foto": "img/cinat.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "",
    "resumen": "Practicante del Psicoanálisis. Comenzar un análisis puede ser hacer, de aquello que se repite y se padece, una pregunta.",
    "presentacion": [
      "¿Cuándo comenzar un análisis?",
      "Cuando algo te molesta y no lo podés resolver. Cuando eso insiste, vuelve y vuelve… y parece que no hay forma de hacer algo con ello.",
      "Cuando, por más proyectos que armes, planes que construyas o intentos que hagas por seguir adelante, eso aparece, vuelve y te rompe. Y ahí estás, una vez más, transitando la misma repetición.",
      "Pero quizás sea justamente esa insistencia, ese encuentro una y otra vez con lo mismo, lo que abra la puerta a una pregunta: ¿Qué me tiene tomado? ¿Qué es eso que no puedo soltar? ¿Por qué, a pesar de mis intentos, vuelvo a encontrarme con lo mismo?",
      "Tal vez comenzar un análisis tenga que ver con eso: con hacer de aquello que se repite y se padece, una pregunta. Porque no se trata solo de que algo deje de volver, sino de poder escuchar qué hay de uno en eso que insiste."
    ],
    "enfoque": "Psicoanálisis",
    "enfoqueDetalle": "Psicoanálisis de orientación lacaniana",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos",
      "Parejas"
    ],
    "poblacionDetalle": "",
    "areas": [],
    "categorias": [],
    "formacion": [
      "Lic. en Psicología, Universidad Nacional de Córdoba",
      "Acompañante terapéutica",
      "Cursos de posgrado: formación en Condición del Espectro Autista en niños y adolescentes",
      "Participante del Instituto Clínico de Buenos Aires",
      "Participante del Instituto Oscar Masotta (IOM3) Chaco-Corrientes",
      "Integrante del equipo de investigación (2026-2028) «Las respuestas del niño y su transición pubertad-adolescencia», coordinado por la Lic. María Eugenia Cora (EOL-AMP)"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": true,
    "honorarios": "",
    "disponibilidad": "Mañana, tarde y noche",
    "whatsapp": "5493512111467",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "cinatsol@gmail.com",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "ministroni",
    "slug": "maria-jose-ministroni-cordoba",
    "nombre": "María José Ministroni Córdoba",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología",
    "matricula": "M.P. 1248",
    "verificado": false,
    "rol": "",
    "foto": "img/ministroni.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Sarmiento 436, Villa Ángela",
    "resumen": "Terapia cognitivo-conductual para adolescentes y adultos: ansiedad, estrés, depresión, autoestima y habilidades sociales.",
    "presentacion": [
      "¿Sentís que la ansiedad, el estrés o el desánimo te están ganando terreno?",
      "Soy María José, psicóloga, y trabajo desde la Terapia Cognitivo-Conductual con adolescentes y adultos. Es un enfoque práctico, que te ayuda a entender cómo se conectan lo que pensás, lo que sentís y lo que hacés.",
      "En terapia podemos trabajar la ansiedad y el manejo del estrés, la depresión, la autoestima y las habilidades sociales, para que recuperes herramientas concretas para tu día a día. Si sos adolescente, o acompañás a uno, también es un espacio para atravesar esa etapa con más contención.",
      "Atiendo de forma presencial en Sarmiento 436, Villa Ángela, y también online. Escribime y coordinamos tu primera consulta."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Terapia Cognitivo-Conductual (TCC)",
    "poblacion": [
      "Adolescentes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad y manejo del estrés",
      "Depresión",
      "Fortalecimiento de la autoestima",
      "Desarrollo de habilidades sociales",
      "Acompañamiento emocional en la adolescencia",
      "Autocuidado y bienestar emocional"
    ],
    "categorias": [],
    "formacion": [
      "Especialización en Psicología Clínica (en curso)",
      "Diplomatura en Terapia Cognitivo-Conductual para Niños y Adolescentes"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular (efectivo o transferencia)",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "A coordinar",
    "whatsapp": "5493735534819",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "aguirre",
    "slug": "karina-gisela-aguirre",
    "nombre": "Karina Gisela Aguirre",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología · Sexóloga Clínica · Especialista en Psicología Forense",
    "matricula": "M.P. 848",
    "verificado": false,
    "rol": "",
    "foto": "img/aguirre.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "",
    "resumen": "Acompaño a adolescentes, adultos y parejas en procesos de autoconocimiento, bienestar emocional y vínculos más saludables, incluyendo el abordaje de la sexualidad.",
    "presentacion": [
      "Soy Karina Aguirre, Licenciada en Psicología y Sexóloga Clínica.",
      "Acompaño a adolescentes, adultos y parejas en sus procesos de autoconocimiento, bienestar emocional y construcción de vínculos más saludables.",
      "Concibo la terapia como un espacio de escucha, confianza y reflexión, donde cada persona pueda sentirse acompañada, comprender aquello que le sucede y encontrar nuevas herramientas para afrontar sus dificultades.",
      "Desde una mirada integral, incorporo también el abordaje de la sexualidad, promoviendo una vivencia más libre, consciente y saludable."
    ],
    "enfoque": "Integrativo",
    "enfoqueDetalle": "Psicoterapia de orientación psicoanalítica con enfoque integrativo",
    "poblacion": [
      "Adolescentes",
      "Adultos",
      "Parejas"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad y regulación emocional",
      "Autoestima y autoconocimiento",
      "Vínculos y relaciones interpersonales",
      "Relaciones de pareja y conflictos vinculares",
      "Sexualidad y salud sexual",
      "Deseo sexual y dificultades sexuales",
      "Procesos de cambio y crisis vitales",
      "Bienestar emocional"
    ],
    "categorias": [],
    "formacion": [
      "Licenciada en Psicología",
      "Sexóloga Clínica",
      "Especialista en Psicología Forense"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": true,
    "honorarios": "",
    "disponibilidad": "Con turnos programados",
    "whatsapp": "5493735418270",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "suster",
    "slug": "victoria-belen-suster",
    "nombre": "Victoria Belén Suster",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (Universidad de la Cuenca del Plata)",
    "matricula": "M.P. 1091",
    "verificado": false,
    "rol": "",
    "foto": "img/suster.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "",
    "resumen": "Terapia cognitiva para niños, adolescentes y adultos. También realizo evaluaciones psicológicas, aptos psicológicos y psicodiagnósticos.",
    "presentacion": [
      "A veces lo que nos pasa no se resuelve solo, y está bien pedir ayuda para entenderlo.",
      "Soy Victoria, psicóloga, y trabajo desde la Terapia Cognitivo-Conductual con niños, adolescentes y adultos. Además, me formé en Psicoterapia Cognitiva Integrativa y en Psicodiagnóstico.",
      "Acompaño situaciones de ansiedad, depresión, crisis vitales y vínculos, y también consultas sobre crianza y problemas de conducta en los más chicos. Si necesitás una evaluación psicológica, un apto psicológico o un psicodiagnóstico, también podés hacerlo conmigo.",
      "Atiendo de forma presencial en Villa Ángela y online, y emito factura para que gestiones el reintegro con tu obra social. Escribime y coordinamos un turno."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Terapia Cognitivo-Conductual (TCC)",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Depresión",
      "Crianza",
      "Problemas de conducta",
      "Crisis vitales",
      "Vínculos",
      "Desarrollo personal",
      "Evaluaciones psicológicas, aptos psicológicos y psicodiagnósticos"
    ],
    "categorias": [],
    "formacion": [
      "Posgrado en Psicoterapia Cognitiva Integrativa",
      "Diplomatura Universitaria en Psicodiagnóstico"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": true,
    "honorarios": "",
    "disponibilidad": "A consultar",
    "whatsapp": "5493735462786",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "victoriasuster1@gmail.com",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "ponce-laurentti",
    "slug": "gaston-ponce-laurentti",
    "nombre": "Gastón Ponce Laurentti",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (UNC)",
    "matricula": "M.P. 329",
    "verificado": false,
    "rol": "",
    "foto": "img/ponce-laurentti.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Donovan 95 (Espacio Psi), Villa Ángela",
    "resumen": "Terapia cognitiva: un espacio de escucha y reflexión, sin juicios, para revisar pensamientos, emociones y conductas y encontrar nuevas formas de afrontar lo que preocupa.",
    "presentacion": [
      "Hola, me llamo Gastón y soy psicólogo. Trabajo desde el enfoque de la Terapia Cognitiva, una perspectiva que invita, a través del diálogo, a detenernos y revisar nuestros pensamientos, emociones y conductas.",
      "La idea es poder tomar conciencia de lo que nos pasa, reconocer dónde estamos y hacia dónde queremos ir. A veces, comprender nuestra manera de pensar, sentir y actuar es el primer paso para empezar a generar cambios.",
      "Se trata de construir un espacio de escucha y reflexión, sin juicios, donde podamos conocernos mejor y encontrar nuevas formas de afrontar aquello que nos preocupa."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Terapia Cognitiva",
    "poblacion": [
      "Adolescentes",
      "Adultos",
      "Adultos mayores"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Duelo",
      "Crianza",
      "Adicciones",
      "Vínculos"
    ],
    "categorias": [],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "Español, inglés y portugués",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": true,
    "honorarios": "$50.000 por sesión",
    "disponibilidad": "Lunes a jueves, mañana y tarde",
    "whatsapp": "5493735515093",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "ayala",
    "slug": "selena-soledad-ayala",
    "nombre": "Selena Soledad Ayala",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología",
    "matricula": "M.P. 1358",
    "verificado": false,
    "rol": "",
    "foto": "img/ayala.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "San Martín 623 (Policonsultorio KIMED), Villa Ángela",
    "resumen": "Psicoterapia para infancias, adolescentes y jóvenes. Un espacio seguro y humano para tu proceso.",
    "presentacion": [
      "Crecer no siempre es fácil, ni para quienes crecen ni para quienes los acompañan.",
      "Soy Selena, psicóloga, y hago psicoterapia con infancias, adolescentes y jóvenes.",
      "Te ofrezco un espacio seguro y humano para tu proceso: un lugar para poner en palabras lo que te pasa, a tu ritmo.",
      "Atiendo de forma presencial en el Policonsultorio KIMED (San Martín 623, Villa Ángela) y también de forma virtual. Escribime y coordinamos una primera consulta."
    ],
    "enfoque": "",
    "enfoqueDetalle": "",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Jóvenes"
    ],
    "poblacionDetalle": "",
    "areas": [],
    "categorias": [],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "",
    "whatsapp": "5493735486555",
    "telefonos": "",
    "instagram": "psicoselenaayala",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "insaurralde",
    "slug": "lorena-c-insaurralde",
    "nombre": "Lorena C. Insaurralde",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (UNC)",
    "matricula": "M.P. 750",
    "verificado": false,
    "rol": "Fundadora de ARANDU",
    "foto": "img/insaurralde.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "",
    "resumen": "Psicóloga especializada en salud y bienestar laboral: estrés, burnout, ansiedad y transiciones profesionales. Creamos o reescribimos tu proyecto de vida según el momento que estés atravesando. Psicoterapia, mentorías, programas, cursos y consultorías.",
    "presentacion": [
      "Hola, bienvenida, bienvenido.",
      "Si llegaste hasta acá, es probable que el trabajo te esté pesando más de lo que debería. Tal vez vivís en piloto automático y el cansancio no se va con un fin de semana. Tal vez estás atravesando un cambio (un despido, una renuncia, un puesto nuevo, las ganas de reinventarte y emprender) y no sabés por dónde empezar. O quizás ocupás un rol de liderazgo, rendís mucho, y sentís que ese ritmo te está costando la salud, el descanso o tus vínculos.",
      "Antes que nada, quiero felicitarte. Buscar ayuda requiere coraje y conciencia: la de reconocer que merecés estar bien y las personas a tu alrededor también. Ese gesto ya habla de vos.",
      "Soy Lorena, psicóloga especializada en salud y bienestar laboral. Hace más de 10 años acompaño a personas que atraviesan estrés laboral, burnout, ansiedad y desorientación, especialmente en momentos de cambio o transición profesional. También acompaño a líderes y profesionales exigidos que quieren sostener su rendimiento sin quemarse.",
      "Cuando el trabajo te desborda, lo urgente tapa lo importante y empezás a postergar lo que querés, lo que necesitás y hasta a vos. Por eso no nos quedamos en aliviar síntomas: vamos a la raíz. Reconectamos con lo que te da sentido, reconocemos tus recursos y posibilidades reales, y pasamos de la postergación a una acción alineada con quien sos. Una vida más leve, coherente y verdadera es posible.",
      "Trabajo desde la psicología regenerativa, como llamo a mi orientación integrativa y salutogénica. La salutogénesis pone el foco en la generación de salud. Aunque hoy te sientas lejos de tu bienestar, siempre hay algo en vos que está sano, y desde ahí empezamos a construir.",
      "Además de la psicoterapia, ofrezco mentorías, programas, cursos y consultorías. Están pensados para profesionales, emprendedores, comerciantes y cualquier persona que quiera que su trabajo esté alineado con quien es. Que no sea un peso ni algo alejado de su esencia, sino una parte de su vida que se integra y se vuelve una fuente importante de salud y bienestar. También acompaño a equipos y organizaciones.",
      "Me formé en tantas disciplinas que ya no entran en una bio, y entendí que esas piezas no funcionan por separado. Por eso reuní todo lo que aprendí y viví en un método propio: Basta Unir. Cuida tu salud mental, tu cuerpo, tus vínculos, tus emociones, tu entorno y tu vida laboral como partes de un mismo todo.",
      "En el proceso vamos a:",
      [
        "Bajar el estrés y recuperar tu energía",
        "Entender, sin culpas, qué te trajo hasta acá",
        "Reencontrarte con tu sentido y tu propósito",
        "Decidir desde la claridad y no desde el miedo, el agotamiento o la desesperación",
        "Sostener tu rendimiento sin que te cueste la salud",
        "Crear tu proyecto de vida, o reescribirlo según el momento que estés atravesando",
        "Dar pasos concretos, posibles y sostenibles hacia la vida que realmente querés"
      ],
      "Ya diste el primer paso. Ahora lo caminamos juntas, juntos. Escribime y agendá tu primer encuentro."
    ],
    "enfoque": "Integrativo",
    "enfoqueDetalle": "Integrativo (psicología regenerativa)",
    "poblacion": [
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Estrés laboral y burnout",
      "Ansiedad y depresión vinculadas al trabajo",
      "Cambios y transiciones laborales o profesionales",
      "Decisiones de carrera, sentido y propósito",
      "Psicoterapia para líderes y ejecutivos",
      "Alto rendimiento sostenible",
      "Creación y reescritura de proyectos de vida"
    ],
    "categorias": [],
    "servicios": ["Psicoterapia individual y grupal", "Mentorías", "Programas", "Cursos", "Consultorías"],
    "formacion": [
      "Psicología integrativa",
      "TCC (Terapia cognitivo-conductual)",
      "Psicología de la Salud Ocupacional",
      "Orientación vocacional-ocupacional y desarrollo de carrera",
      "Logoterapia",
      "ACT (Terapia de Aceptación y Compromiso)",
      "Psicología Organizacional Positiva",
      "Salutogénesis",
      "Breathwork y mindfulness"
    ],
    "modalidad": [
      "Online"
    ],
    "modalidadDetalle": "Online, individual y grupal",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular, sin obras sociales. Consultá por programas y planes terapéuticos.",
    "reintegro": false,
    "honorarios": "Sesión individual de 50 min: $50.000",
    "disponibilidad": "",
    "whatsapp": "5493735409341",
    "telefonos": "",
    "instagram": "psicologa_lorena_insaurralde",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "gerzel",
    "slug": "luciana-marianela-gerzel",
    "nombre": "Luciana Marianela Gerzel",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología",
    "matricula": "M.P. 408",
    "verificado": false,
    "rol": "",
    "foto": "img/gerzel.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Policonsultorio Dr. Diego J. Montes, Hipólito Yrigoyen 880, Villa Ángela",
    "resumen": "Más de 15 años acompañando a niños, adolescentes y familias, con amplia experiencia en infancias y discapacidad. Tu bienestar emocional es una prioridad.",
    "presentacion": [
      "Mi nombre es Luciana. Soy psicóloga, mamá y una persona con discapacidad motriz, con amplia experiencia en infancias, discapacidad y familia.",
      "Hace más de 15 años que contengo, asesoro y acompaño a familias que reciben un diagnóstico inesperado.",
      "Acompaño a niños, adolescentes y familias a atravesar momentos difíciles, dentro de un espacio terapéutico seguro, respetando el proceso y su ritmo. Trabajo ansiedad, autoestima, vínculos, crianza y el impacto emocional que trae convivir con un diagnóstico de discapacidad.",
      "Estoy en Villa Ángela, Chaco, aunque podés comunicarte por cualquier consulta de manera virtual.",
      "Si estás buscando un lugar para hablar de lo que te pasa y encontrar herramientas reales para el día a día, escribime.",
      "Tu bienestar emocional es una prioridad."
    ],
    "enfoque": "",
    "enfoqueDetalle": "",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos",
      "Familias"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Autoestima",
      "Vínculos",
      "Crianza",
      "Infancias y discapacidad",
      "Impacto emocional de un diagnóstico de discapacidad"
    ],
    "categorias": [],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "Solo turno tarde",
    "whatsapp": "5493731554045",
    "telefonos": "(3735) 563309 · (3731) 554045",
    "instagram": "lucianag_psicosalud",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "fleita",
    "slug": "daniela-patricia-fleita",
    "nombre": "Daniela Patricia Fleita",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (Universidad Católica de Salta)",
    "matricula": "M.P. 872",
    "verificado": false,
    "rol": "",
    "foto": "img/fleita.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Sarmiento 214, Villa Ángela",
    "resumen": "Psicoterapia para niños, adolescentes y adultos desde una mirada integral: un espacio de confianza y contención, con escucha activa y acompañamiento personalizado.",
    "presentacion": [
      "No tenés que poder con todo sola o solo.",
      "Soy Daniela, psicóloga, y ofrezco psicoterapia para niños, adolescentes, adultos y parejas desde el psicoanálisis y una mirada integral.",
      "Te propongo un espacio de confianza y contención, con escucha activa, empatía y un acompañamiento personalizado, para trabajar la ansiedad, las emociones, la crianza y los vínculos. También realizo orientación vocacional y aptos psicológicos para el ingreso a la docencia.",
      "Atiendo de forma presencial en Sarmiento 214, Villa Ángela, y online, por la tarde. Escribime y coordinamos tu primer encuentro."
    ],
    "enfoque": "Psicoanálisis",
    "enfoqueDetalle": "Psicoanálisis, desde una mirada integral",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos",
      "Parejas"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Emociones",
      "Crianza",
      "Vínculos",
      "Orientación vocacional",
      "Aptos psicológicos para el ingreso a la docencia"
    ],
    "categorias": [],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "Por la tarde",
    "whatsapp": "5493735406088",
    "telefonos": "",
    "instagram": "psic.danielaf",
    "facebook": "https://www.facebook.com/share/1DJDvdQgcY/",
    "email": "psic.danielaf@gmail.com",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "cuadra-svriz",
    "slug": "sabrina-soledad-cuadra-svriz",
    "nombre": "Sabrina Soledad Cuadra Svriz",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (UCASAL, sede Corrientes) · Sexóloga Clínica",
    "matricula": "M.P. 472",
    "verificado": false,
    "rol": "",
    "foto": "img/cuadra-svriz.jpg",
    "provincia": "Chaco",
    "localidad": "Resistencia",
    "direccion": "Policonsultorio de Fertilidad y Tocoginecología, Remedios de Escalada 511, Resistencia",
    "resumen": "Acompaño a mujeres que transitan enfermedades, dolencias corporales o dificultades en su sexualidad, con un abordaje integral que conecta mente, cuerpo, emociones y vínculos.",
    "presentacion": [
      "¿Una enfermedad, un dolor en el cuerpo o una dificultad en tu sexualidad te están quitando las ganas y la tranquilidad?",
      "Soy Sabrina Cuadra Svriz, psicóloga con formación en psicobiología, psicogenealogía y sexología clínica. Acompaño a mujeres que transitan enfermedades, dolencias corporales o disfunciones sexuales que les generan angustia y padecimiento psíquico, o que les dificultan la vida cotidiana.",
      "Mi abordaje es integrativo, porque mente, cuerpo, emociones y vínculos están conectados, y porque la historia de vida y los patrones transgeneracionales también influyen en la salud actual. Por eso creo programas terapéuticos adaptados a cada mujer, a su entorno y a lo que está viviendo, y la acompaño en cada paso de su proceso de transformación, con herramientas pensadas para ella.",
      "Atiendo online y de forma presencial en Resistencia. Escribime y empecemos a recorrer este camino juntas."
    ],
    "enfoque": "Integrativo",
    "enfoqueDetalle": "Enfoque integral con aportes de la psicogenealogía y la psicobiología social. Sexología clínica.",
    "poblacion": [
      "Adolescentes",
      "Adultos"
    ],
    "restriccion": "Solo mujeres, desde los 16 años",
    "poblacionDetalle": "Mujeres adolescentes (desde los 16 años) y adultas",
    "areas": [
      "Mujeres que transitan enfermedades (crónicas, inmunológicas, adquiridas, etc.)",
      "Dolencias corporales",
      "Disfunciones sexuales femeninas: deseo sexual hipoactivo, anorgasmia",
      "Síntomas sexuales en el climaterio y la menopausia",
      "Psicoeducación sexual para mujeres en todas sus edades y etapas",
      "Angustia, frustración y pérdida de interés en la sexualidad"
    ],
    "categorias": [],
    "formacion": [
      "Sexología Clínica",
      "Psicobiología Social",
      "Psicogenealogía"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": false,
    "honorarios": "Consultar",
    "disponibilidad": "De 8 a 20 h",
    "whatsapp": "5493758448886",
    "telefonos": "",
    "instagram": "lic.sabrinacuadrasvriz",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "fiorella-cinat",
    "slug": "fiorella-andrea-cinat",
    "nombre": "Fiorella Andrea Cinat",
    "profesion": "Fonoaudiología",
    "titulo": "Lic. en Fonoaudiología (UNC)",
    "matricula": "M.P. 5408",
    "verificado": false,
    "rol": "",
    "foto": "img/fiorella-cinat-2026.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Entre Terapias – Servicio de Fonoaudiología, Villa Ángela",
    "resumen": "Fonoaudiología con orientación neurolingüística y en motricidad orofacial: lenguaje, habla, lectoescritura, respiración y deglución, desde la infancia hasta la adultez.",
    "presentacion": [
      "¿Tu hijo o hija comprende todo lo que le decís, pero cuando intenta hablar cuesta entender lo que quiere expresar? A veces los chicos saben perfectamente lo que quieren comunicar, pero encuentran dificultades para expresarlo con claridad.",
      "Soy Fiorella Cinat, Licenciada en Fonoaudiología por la Universidad Nacional de Córdoba. Trabajo desde un enfoque integral, con orientación neurolingüística y especial interés en la Motricidad Orofacial, y acompaño a niños, adolescentes, adultos y adultos mayores en el desarrollo y el fortalecimiento de su comunicación, su lenguaje y su habla.",
      "La comunicación se construye y se desarrolla. Por eso mi práctica se centra en las necesidades de cada paciente, con evaluaciones y tratamientos individualizados que favorecen el lenguaje y las funciones orofaciales y promueven una mejor calidad de vida. Cada persona tiene su propio camino y merece ser escuchada, comprendida y acompañada.",
      "¿Tenés dudas o querés saber si una evaluación fonoaudiológica puede ayudar? Escribime y conversemos sobre tu consulta."
    ],
    "enfoque": "",
    "enfoqueDetalle": "Neurolingüística y Motricidad Orofacial",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos",
      "Adultos mayores"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Trastornos del lenguaje y del habla",
      "Apraxia del habla infantil",
      "Trastornos de los sonidos del habla",
      "Dificultades en la comunicación y el lenguaje",
      "Lectoescritura",
      "Motricidad orofacial",
      "Respiración y deglución",
      "Reeducación lingual",
      "Alteraciones miofuncionales orofaciales"
    ],
    "categorias": [],
    "formacion": [
      "Diplomatura en Apraxia del Habla Infantil",
      "Formación en Motricidad Orofacial",
      "Formación y abordaje desde una perspectiva neurolingüística"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "Presencial y virtual",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Emite factura",
    "reintegro": true,
    "honorarios": "",
    "disponibilidad": "Lunes a viernes, de 8 a 11 y de 15 a 18 h. Consultá horarios disponibles.",
    "whatsapp": "5493735531385",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "fiorella.cinat@gmail.com",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "carauni",
    "slug": "mariana-carauni-rios",
    "nombre": "S. Mariana Carauni Ríos",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología · Especialista en Psicología Forense y Jurídica",
    "matricula": "M.P. 304",
    "verificado": false,
    "rol": "",
    "foto": "img/carauni.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "",
    "resumen": "Terapia cognitivo-conductual para adolescentes y adultos: un espacio seguro y de confianza para darle sentido a lo que te pasa y encontrar nuevas formas de atravesarlo.",
    "presentacion": [
      "¿Hay algo que hoy te duele, te pesa o no terminás de entender?",
      "Soy Mariana Carauni Ríos, psicóloga. Trabajo desde la orientación cognitivo-conductual con adolescentes y adultos. Soy especialista en psicología forense y jurídica, y diplomada en perspectiva de género y diversidades.",
      "Te doy la bienvenida a un espacio pensado para vos, donde puedas sentirte seguro/a y en confianza. Juntos/as vamos a ir dándole sentido a lo que te pasa y a encontrar nuevas formas de atravesarlo.",
      "Escribime por WhatsApp y coordinamos tu primera consulta."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Orientación cognitivo-conductual",
    "poblacion": [
      "Adolescentes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [],
    "categorias": [],
    "formacion": [
      "Especialista en Psicología Forense y Jurídica",
      "Diplomatura en Perspectiva de Género y Diversidades",
      "Psicología Deportiva (en formación)"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "Presencial y online (a consultar)",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "",
    "whatsapp": "5493735615528",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "buralli",
    "slug": "fanny-romina-buralli",
    "nombre": "Fanny Romina Buralli",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (UNC)",
    "matricula": "M.P. 860",
    "verificado": false,
    "rol": "",
    "foto": "img/buralli.jpg",
    "provincia": "Chaco",
    "localidad": "Presidencia Roque Sáenz Peña",
    "direccion": "Ejército de los Andes 1352, Presidencia Roque Sáenz Peña",
    "resumen": "Terapia cognitivo-conductual para jóvenes y adultos: ansiedad, depresión, duelos, separaciones y conflictos de pareja. También evaluaciones, aptos psicológicos y orientación vocacional.",
    "presentacion": [
      "¿Sentís que la ansiedad, la tristeza o un momento difícil te están desbordando?",
      "Soy Fanny Buralli, psicóloga egresada de la Universidad Nacional de Córdoba, con especialidad en terapia cognitivo-conductual y en salud mental. Acompaño a jóvenes y adultos.",
      "Trabajo con ansiedad, depresión, psicosis, conflictos de pareja, separaciones, duelos y todas las situaciones que generan malestar psíquico, con un enfoque práctico que te ayuda a entender lo que te pasa y a encontrar herramientas para tu día a día. También realizo evaluaciones, aptos psicológicos y orientación vocacional.",
      "Atiendo de forma presencial en Presidencia Roque Sáenz Peña y también online. Escribime y coordinamos tu primera consulta."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Terapia cognitivo-conductual",
    "poblacion": [
      "Jóvenes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Depresión",
      "Psicosis",
      "Conflictos de pareja",
      "Separaciones",
      "Duelos",
      "Malestar psíquico en general",
      "Evaluaciones psicológicas y aptos psicológicos",
      "Orientación vocacional"
    ],
    "categorias": [],
    "formacion": [
      "Especialidad en Terapia Cognitivo-Conductual",
      "Especialidad en Salud Mental"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular (no emite factura)",
    "reintegro": false,
    "honorarios": "",
    "disponibilidad": "A coordinar",
    "whatsapp": "5493516358523",
    "telefonos": "",
    "instagram": "fannyburalli",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "salomone",
    "slug": "ronit-janet-salomone",
    "nombre": "Ronit Janet Salomone",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (Universidad de la Cuenca del Plata)",
    "matricula": "M.P. 991",
    "verificado": false,
    "rol": "",
    "foto": "img/salomone.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Mitre 115, Consultorios Médicos Salud, Villa Ángela",
    "resumen": "Terapia cognitivo-conductual con niños, adolescentes y adultos. Clínica infantojuvenil, orientación a familias, regulación emocional, duelo y crisis. También aptos psicológicos y psicodiagnóstico.",
    "presentacion": [
      "¿Estás buscando un espacio de escucha y acompañamiento para tu hijo, tu familia o para vos?",
      "Será un placer acompañarte. Soy Ronit, licenciada en Psicología, con orientación cognitivo-conductual. Mi principal área de trabajo es la clínica infantojuvenil y el acompañamiento a las familias, un ámbito que disfruto especialmente.",
      "Mi trabajo se centra en construir vínculos terapéuticos basados en la confianza y la empatía, utilizando el juego, la psicoeducación y estrategias específicas según las necesidades de cada persona.",
      "También acompaño a adultos en el abordaje de ansiedad, depresión, estrés, duelos y situaciones de crisis, promoviendo el reconocimiento y desarrollo de recursos personales.",
      "Si querés realizar una consulta, escribime por WhatsApp."
    ],
    "enfoque": "Cognitivo-conductual",
    "enfoqueDetalle": "Terapia cognitivo-conductual (TCC)",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Regulación emocional",
      "Dificultades emocionales y conductuales en niños",
      "Crianza y orientación a familias",
      "Vínculos y habilidades sociales",
      "Ansiedad, depresión y estrés",
      "Duelo",
      "Crisis del desarrollo y situaciones de crisis",
      "Aptos psicológicos y evaluación psicodiagnóstica"
    ],
    "categorias": [],
    "categoriasExcluir": ["pareja-vinculos"],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "",
    "accesibilidad": "",
    "atencion": "Particular",
    "reintegro": false,
    "honorarios": "Consultar",
    "disponibilidad": "Mañana y tarde",
    "whatsapp": "5493735446935",
    "telefonos": "",
    "instagram": "",
    "facebook": "",
    "email": "",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "cardozo",
    "slug": "ayelen-cardozo",
    "nombre": "Ayelen Cardozo",
    "profesion": "Psicopedagogía",
    "titulo": "Lic. en Psicopedagogía (Universidad de la Cuenca del Plata)",
    "matricula": "M.P. U N.º 381",
    "verificado": false,
    "rol": "",
    "foto": "img/cardozo.jpg",
    "provincia": "Chaco",
    "localidad": "Villa Ángela",
    "direccion": "Hungría 731, Villa Ángela",
    "resumen": "Psicopedagoga. Acompaño a niños, niñas, adolescentes y sus familias en sus procesos de aprendizaje: evaluaciones, acompañamiento de trayectorias escolares y talleres.",
    "presentacion": [
      "¿Notás que a tu hijo o hija le cuesta aprender, sostener la atención en la escuela o se frustra con las tareas?",
      "Soy Ayelen, licenciada en Psicopedagogía. Concibo el aprendizaje como un proceso complejo que involucra dimensiones cognitivas, emocionales, sociales y vinculares. Trabajo desde un abordaje psicopedagógico integral, con una mirada contextual, singular y centrada en las potencialidades de cada persona, con aportes de la neuroeducación, la perspectiva de derechos y la diversidad en las formas de aprender.",
      "En cada proceso construimos un espacio de encuentro, escucha y acompañamiento, donde el juego, la exploración y las propuestas significativas se convierten en oportunidades para reconocer fortalezas, potenciar habilidades y desarrollar nuevas herramientas para aprender.",
      "Considero fundamental el trabajo conjunto con las familias y la articulación con las instituciones educativas, construyendo puentes y estrategias compartidas que respeten las singularidades y acompañen cada trayectoria de aprendizaje y desarrollo desde una perspectiva integral e inclusiva.",
      "Si querés consultar, escribime por WhatsApp y conversamos sobre cómo puedo acompañarlos."
    ],
    "enfoque": "Psicopedagógico integral",
    "enfoqueDetalle": "Abordaje psicopedagógico integral, con aportes de la neuroeducación y la perspectiva de derechos",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Familias"
    ],
    "poblacionDetalle": "Niños, niñas y adolescentes; familias e instituciones educativas",
    "areas": [
      "Dificultades en el aprendizaje",
      "Evaluación psicopedagógica",
      "Acompañamiento de trayectorias escolares",
      "Estimulación de habilidades cognitivas y funciones ejecutivas",
      "Orientación y asesoramiento a familias",
      "Orientación a instituciones educativas"
    ],
    "categorias": [],
    "servicios": [
      "Evaluaciones psicopedagógicas",
      "Atención y acompañamiento psicopedagógico individual",
      "Orientación y asesoramiento a familias",
      "Orientación y acompañamiento a instituciones educativas",
      "Articulación interdisciplinaria con profesionales",
      "Acompañamiento de trayectorias escolares",
      "Diseño de estrategias y recursos para favorecer los aprendizajes",
      "Talleres psicopedagógicos para niños y adolescentes",
      "Talleres de estimulación de habilidades cognitivas y funciones ejecutivas"
    ],
    "formacion": [],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "Español",
    "accesibilidad": "Planta baja",
    "atencion": "Particular y obras sociales (todas, excepto INSSSEP). Incluir Salud para pacientes con CUD.",
    "reintegro": true,
    "honorarios": "$40.000",
    "disponibilidad": "Lunes a viernes, de 8 a 12:30 y de 14 a 19:30",
    "whatsapp": "5493735522819",
    "telefonos": "",
    "instagram": "psicopedagoga_ac",
    "facebook": "",
    "email": "Aye_cardozo_94@hotmail.com",
    "plan": "basico",
    "consentimiento": false
  },
  {
    "id": "ortigoza",
    "slug": "ornella-ortigoza",
    "nombre": "Ornella Ortigoza",
    "profesion": "Psicología",
    "titulo": "Lic. en Psicología (Universidad de la Cuenca del Plata)",
    "matricula": "M.P. 1062",
    "verificado": false,
    "rol": "",
    "foto": "img/ortigoza.jpg",
    "provincia": "Chaco",
    "localidad": "Presidencia Roque Sáenz Peña",
    "direccion": "Instituto Eros, M. Jajan 1143 (calle 27 entre 24 y 26, Centro), Presidencia Roque Sáenz Peña",
    "resumen": "Psicóloga infantojuvenil y de adultos, con orientación psicoanalítica. Acompaño a niños, adolescentes y adultos, posibilitando un espacio para el juego, la palabra y la elaboración de las experiencias de vida.",
    "presentacion": [
      "¿Alguna vez sentiste que “algo” te pasa, pero no encontrás las palabras para decirlo? ¿Sentís que hay situaciones que se repiten, emociones que desbordan o pensamientos que no dejan de insistir?",
      "No necesitás saber exactamente qué te pasa para empezar. Hay malestares que no desaparecen simplemente porque nos propongamos “estar bien”.",
      "Quizás necesitás un lugar donde frenar el ruido, dejar de exigirte respuestas, donde empezar a escucharte y ser escuchado, para dar lugar a tu malestar.",
      "Trabajo desde una escucha que aloja singularidades, historias y preguntas, sin reducir el sufrimiento psíquico a un síntoma o diagnóstico, ni pensarlo por fuera de su contexto, sino como expresión de aquello que quizás aún no ha podido ser hablado ni elaborado.",
      "Si algo de esto te resuena y sentís que es el momento de pedir ayuda, te invito a escribirme y construir un espacio juntos."
    ],
    "enfoque": "Psicoanálisis",
    "enfoqueDetalle": "Psicoanálisis",
    "poblacion": [
      "Niños",
      "Adolescentes",
      "Adultos"
    ],
    "poblacionDetalle": "",
    "areas": [
      "Ansiedad",
      "Depresión",
      "Consumos problemáticos",
      "Duelos",
      "Conducta e ideación suicida",
      "Orientación a padres y referentes",
      "Dificultades en el aprendizaje",
      "Bullying",
      "Problemáticas de conducta",
      "Trastornos de la conducta alimentaria"
    ],
    "categorias": [],
    "servicios": [
      "Psicoterapia",
      "Orientación vocacional",
      "Evaluaciones psicolaborales y de aptitud psíquica",
      "Informes psicológicos"
    ],
    "formacion": [
      "Lic. en Psicología, Universidad de la Cuenca del Plata",
      "Especialización en Salud Mental Comunitaria, UNNE (Resistencia, Chaco), 2025",
      "Posgrado en Clínica Psicoanalítica, Fundación Buenos Aires, 2022"
    ],
    "modalidad": [
      "Presencial",
      "Online"
    ],
    "modalidadDetalle": "",
    "idiomas": "Español",
    "accesibilidad": "Consultorios en planta alta y planta baja",
    "atencion": "Particular",
    "reintegro": true,
    "honorarios": "$40.000 por sesión",
    "disponibilidad": "Lunes, martes y jueves de 8 a 11:30 y de 17:30 a 19:30 · Miércoles y viernes desde las 15:30",
    "whatsapp": "5493624757717",
    "telefonos": "",
    "instagram": "psi.ornellaortigoza",
    "facebook": "",
    "email": "ornellaortigozapsi@gmail.com",
    "plan": "basico",
    "consentimiento": true
  }
];

/* ---------------------------------------------------------------
   TALLERES Y SABERES: talleres, cursos y programas.
   Para agregar una propuesta, copiá el ejemplo comentado y completalo.
   Campos: tipo ("Taller" | "Curso" | "Programa"), titulo, descripcion,
   paraQuien, modalidad, lugar, fecha (texto libre), duracion,
   valor (ej. "$15.000" o "Gratuito"), facilitador, inscripcion (enlace), imagen ("img/..." opcional).
   --------------------------------------------------------------- */
RED.TALLERES = [
  /* {
    "tipo": "Taller",
    "titulo": "Nombre del taller",
    "descripcion": "Qué se va a trabajar y qué se llevan quienes participen.",
    "paraQuien": "Madres, padres y cuidadores",
    "modalidad": "Presencial",
    "lugar": "Villa Ángela",
    "fecha": "Sábado 6 de diciembre, 10 h",
    "duracion": "2 horas",
    "valor": "Gratuito",
    "facilitador": "Nombre y profesión",
    "inscripcion": "https://wa.me/549...",
    "imagen": ""
  } */
];

if (typeof module !== "undefined") module.exports = RED;
