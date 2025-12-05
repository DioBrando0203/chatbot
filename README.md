# Chatbot Multi-Modelo con IA

Asistente virtual desarrollado con Next.js 16 con soporte para **múltiples modelos de IA gratuitos**.

## ✨ Características

- 💬 Interfaz de chat moderna y responsiva
- 🤖 **Selector de modelos** con 10+ modelos gratuitos
- 📝 Historial de conversación con contexto
- ⚡ Next.js 16 con App Router
- 🎨 Tailwind CSS 4 + componentes reutilizables
- 🔧 Arquitectura modular y escalable

## 🚀 Modelos Disponibles

### Google Gemini (Gratis - Ya configurado)
- ✅ **Gemini 2.5 Flash** - Rápido y eficiente (15 req/min)
- ✅ **Gemini 1.5 Pro** - Más potente (15 req/min)

### Groq (Gratis - Ultra rápido ⚡)
- ✅ **Llama 3.1 70B** - 30 req/min
- ✅ **Llama 3.1 8B** - 30 req/min (instantáneo)
- ✅ **Mixtral 8x7B** - 30 req/min

### Together AI (Gratis - $25 crédito inicial)
- ✅ **Llama 3.1 70B Turbo**
- ✅ **Mixtral 8x7B**

### Hugging Face (Gratis con límites)
- ✅ **Llama 3.2 3B**

### OpenAI (Crédito inicial de $5)
- ⚠️ **GPT-3.5 Turbo**

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar API Keys

Crea un archivo `.env.local` en la raíz del proyecto. Puedes copiar el ejemplo:

```bash
cp .env.local.example .env.local
```

Luego edita `.env.local`:

```env
# REQUERIDO - Google Gemini (ya tienes esta)
GEMINI_API_KEY=AIzaSyAjrF1s3X-ON5AputsHESSk6iiMaHD_JME

# OPCIONAL - Agrega las que quieras usar
GROQ_API_KEY=tu_groq_key_aqui
TOGETHER_API_KEY=tu_together_key_aqui
HUGGINGFACE_API_KEY=tu_huggingface_token_aqui
OPENAI_API_KEY=tu_openai_key_aqui
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔑 Cómo Obtener API Keys

### Google Gemini (Ya configurado ✅)
- Enlace: https://aistudio.google.com/apikey
- Gratis: 15 requests/minuto, 1M tokens/día

### Groq (Recomendado - Ultra rápido ⚡)
1. Regístrate en https://console.groq.com/
2. Ve a **API Keys**
3. Crea una nueva API key
4. Copia y pega en `GROQ_API_KEY`
- Gratis: 30 requests/minuto

### Together AI
1. Regístrate en https://api.together.xyz/
2. Ve a **Settings → API Keys**
3. Crea una nueva API key
4. Copia y pega en `TOGETHER_API_KEY`
- Gratis: $25 de crédito inicial

### Hugging Face
1. Regístrate en https://huggingface.co/
2. Ve a **Settings → Access Tokens**
3. Crea un nuevo token
4. Copia y pega en `HUGGINGFACE_API_KEY`
- Gratis con límites de rate

### OpenAI
1. Regístrate en https://platform.openai.com/
2. Ve a **API Keys**
3. Crea una nueva secret key
4. Copia y pega en `OPENAI_API_KEY`
- $5 de crédito inicial

## 🏗️ Estructura del Proyecto

```
chatbot/
├── app/
│   ├── api/chat/route.ts        # API multi-modelo
│   ├── layout.tsx
│   └── page.tsx                 # Solo importa <Chat />
├── components/
│   ├── chat.tsx                 # Componente principal
│   ├── chat-header.tsx          # Header
│   ├── chat-message.tsx         # Mensaje individual
│   ├── chat-input.tsx           # Input + botón
│   ├── model-selector.tsx       # Selector de modelos
│   └── ui/
│       ├── button.tsx           # Botón reutilizable
│       ├── input.tsx            # Input reutilizable
│       └── select.tsx           # Select reutilizable
├── lib/
│   ├── models.ts                # Configuración de modelos
│   └── utils.ts                 # Utilidades (cn)
├── types/
│   └── index.ts                 # Tipos compartidos
└── .env.local                   # API keys (no en git)
```

## 🎨 Tecnologías

- **Framework**: Next.js 16
- **React**: 19.2
- **TypeScript**: 5
- **Estilos**: Tailwind CSS 4 + CVA
- **IA**: Google Gemini, Groq, Together AI, Hugging Face, OpenAI

## 📊 Comparación de Modelos

| Modelo | Velocidad | Calidad | Límite | Recomendación |
|--------|-----------|---------|--------|---------------|
| Gemini 2.5 Flash | ⚡⚡⚡ | ⭐⭐⭐⭐ | 15/min | Uso general |
| Groq Llama 3.1 70B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 30/min | **Más rápido** |
| Mixtral 8x7B (Groq) | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 30/min | Tareas complejas |
| GPT-3.5 Turbo | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Crédito | Máxima calidad |

## 🚀 Despliegue

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Agrega las variables de entorno:
   - `GEMINI_API_KEY` (requerida)
   - `GROQ_API_KEY` (opcional)
   - `TOGETHER_API_KEY` (opcional)
   - Otras según los modelos que uses
4. Despliega

### Otras plataformas

Asegúrate de configurar todas las API keys como variables de entorno en tu plataforma de hosting.

## 📝 Uso

1. Abre la aplicación
2. Selecciona el modelo de IA que quieres usar
3. Escribe tu mensaje y presiona Enter o clic en "Enviar"
4. El chatbot responderá usando el modelo seleccionado

## 🔒 Seguridad

- Todas las API keys deben estar en `.env.local` (nunca en git)
- El archivo `.gitignore` ya excluye `.env.local`
- En producción, configura las keys como variables de entorno seguras

## 📄 Licencia

MIT