# Chatbot multi modelo con IA

Asistente virtual en Next.js 16 con selector de modelos y soporte para proveedores compatibles con el formato de chat de OpenAI.

## Caracteristicas principales
- Interfaz de chat responsive con historial y manejo de contexto.
- Selector de modelo con OpenAI (gpt-4o mini por defecto), Groq y DeepSeek listos para usar.
- Arquitectura modular en TypeScript, Tailwind CSS 4 y App Router.
- Preparado para agregar mas modelos compatibles (Together AI, Hugging Face).

## Modelos disponibles
- **OpenAI**: `gpt-4o-mini` (default), `gpt-4o`.
- **Groq**: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`.
- **DeepSeek**: `deepseek-chat`, `deepseek-reasoner`.
- **Opcionales comentados**: Together AI y Hugging Face (puedes activarlos en `lib/models.ts`).

## Instalacion
```bash
npm install
```

## Variables de entorno
Duplica el archivo de ejemplo y completa tus keys:
```bash
cp .env.local.example .env.local
```

Variables soportadas:
```
OPENAI_API_KEY=tu_openai_api_key_aqui          # requerido (gpt-4o mini por defecto)
GROQ_API_KEY=tu_groq_api_key_aqui              # opcional
DEEPSEEK_API_KEY=tu_deepseek_api_key_aqui      # opcional
HUGGINGFACE_API_KEY=tu_huggingface_token_aqui  # opcional
TOGETHER_API_KEY=tu_together_api_key_aqui      # opcional
```

## Ejecutar en desarrollo
```bash
npm run dev
# abrir http://localhost:3000
```

## Despliegue
- Configura las mismas variables de entorno en tu hosting (Vercel u otro).
- El archivo `.gitignore` ya excluye `.env.local`.

## Estructura rapida
```
app/                 # rutas y API
components/          # UI y selector de modelos
lib/models.ts        # configuracion de modelos y default
types/               # tipos compartidos
```

## Notas
- El endpoint se adapta a cada proveedor usando el mismo formato de mensajes de OpenAI.
- Si activas nuevos modelos, agrega su endpoint y variable en `lib/models.ts` y la API key en tu `.env.local`.
