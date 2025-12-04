# 🚀 Tu Frontend del Asistente Virtual - Guía Rápida

## ✅ Ya está todo creado

Tu proyecto Next.js ya está listo para desplegarse. Solo necesitas seguir estos pasos:

## 📝 Paso 1: Configurar la URL del Backend

Edita el archivo `.env.local` en esta carpeta:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Cuando tu amigo te dé la URL del backend Laravel, cámbiala ahí.

## 🧪 Paso 2: Probar Localmente

```bash
npm run dev
```

Abre: http://localhost:3000

**Nota:** El backend de tu amigo también debe estar corriendo.

## 🌐 Paso 3: Desplegar en Vercel

### Opción A: Desde el navegador

1. Sube tu código a GitHub:
```bash
git init
git add .
git commit -m "Asistente virtual"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

2. Ve a https://vercel.com
3. Clic en "Import Project"
4. Selecciona tu repositorio
5. En "Environment Variables" agrega:
   - Nombre: `NEXT_PUBLIC_API_URL`
   - Valor: La URL del backend de tu amigo
6. Clic en "Deploy"

### Opción B: Desde la terminal

```bash
npm i -g vercel
vercel
```

## 📋 Lo que necesitas de tu amigo (Backend Laravel)

Tu amigo debe crear un endpoint que:

**URL:** `POST /api/chat`

**Recibe esto:**
```json
{
  "message": "Hola",
  "history": []
}
```

**Debe responder esto:**
```json
{
  "success": true,
  "response": "¡Hola! ¿En qué puedo ayudarte?"
}
```

**Comparte con tu amigo el archivo:** `ESPECIFICACIONES-BACKEND-LARAVEL.md`

## 🎨 Personalización (Opcional)

Para cambiar colores y textos, edita `app/page.tsx`:

- **Línea 88:** Título del asistente
- **Línea 128:** Color de los mensajes
- **Línea 84:** Color de fondo

## ✅ Checklist Final

Antes de desplegar:

- [ ] `.env.local` tiene la URL correcta del backend
- [ ] El proyecto funciona localmente (`npm run dev`)
- [ ] El código está subido a GitHub
- [ ] Las variables de entorno están en Vercel

## 🔗 URLs Importantes (Completar después)

- **Frontend (Vercel):** _____________________
- **Backend (Laravel):** _____________________

---

**¡Eso es todo!** Tu frontend está listo. Solo espera la URL del backend de tu amigo y despliega en Vercel. 🎉
