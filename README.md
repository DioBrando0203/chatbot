# Chatbot con Gemini AI

Asistente virtual desarrollado con Next.js 16 y Google Gemini AI.

## Características

- 💬 Interfaz de chat moderna y responsiva
- 🤖 Integración con Google Gemini 2.5 Flash (modelo gratuito)
- 📝 Historial de conversación
- ⚡ Next.js 16 con App Router
- 🎨 Tailwind CSS 4 para estilos

## Configuración

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar la API Key de Gemini

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
GEMINI_API_KEY=tu_api_key_aqui
\`\`\`

Para obtener tu API Key:
1. Visita [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea o selecciona un proyecto
3. Genera una nueva API Key
4. Copia la clave y pégala en `.env.local`

### 3. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías

- **Framework**: Next.js 16
- **React**: 19.2
- **TypeScript**: 5
- **Estilos**: Tailwind CSS 4
- **IA**: Google Gemini API (@google/generative-ai)

## Estructura del Proyecto

\`\`\`
chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Endpoint de la API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Interfaz del chat
├── .env.local                 # Variables de entorno (no incluido)
├── .gitignore
├── package.json
└── README.md
\`\`\`

## Despliegue

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Agrega la variable de entorno `GEMINI_API_KEY`
4. Despliega

### Otros servicios

Asegúrate de configurar la variable de entorno `GEMINI_API_KEY` en tu plataforma de hosting.

## Licencia

MIT
