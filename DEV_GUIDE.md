# TechVibe Development Guide

Bu sənəd TechVibe layihəsini yerli mühitdə işə salmaq, qurmaq və yerləşdirmək üçün təlimatları əhatə edir. Layihə üç əsas hissədən ibarətdir:

1.  **Server** (`/server`): Backend API (JSON Server + Custom Logic)
2.  **Admin Panel** (`/admin`): İdarəetmə paneli (React + Vite)
3.  **UI / Storefront** (`/ui`): İstifadəçi interfeysi (React + Vite)

---

## 📋 Tələblər (Prerequisites)

Layihəni işə salmaq üçün aşağıdakı proqramların quraşdırılması vacibdir:

- **Node.js** (Versiya 18 və ya daha yüksək tövsiyə olunur)
- **npm** (Node.js ilə birlikdə gəlir) və ya **yarn** / **pnpm**
- **Git**

---

## 🚀 Quraşdırma (Installation)

Layihənin hər üç hissəsi üçün asılılıqları (dependencies) ayrı-ayrılıqda quraşdırmaq lazımdır.

### 1. Layihəni klonlayın

```bash
git clone <repository-url>
cd techvibe
```

### 2. Asılılıqları quraşdırın

Hər bir qovluğa daxil olub `npm install` əmrini icra edin.

**Server:**

```bash
cd server
npm install
cd ..
```

**Admin Panel:**

```bash
cd admin
npm install
cd ..
```

**User Interface (UI):**

```bash
cd ui
npm install
cd ..
```

---

## ⚙️ Konfiqurasiya (Environment Variables)

Layihənin düzgün işləməsi üçün `admin` və `ui` qovluqlarında `.env` faylları yaradılmalıdır.

### Admin Panel (`/admin/.env`)

`admin` qovluğunda `.env` faylı yaradın və aşağıdakı sətri əlavə edin:

```env
VITE_API_URL=http://localhost:3000
```

### UI (`/ui/.env`)

`ui` qovluğunda `.env` faylı yaradın və aşağıdakı sətri əlavə edin:

```env
VITE_API_URL=http://localhost:3000
```

> **Qeyd:** Server standart olaraq 3000 portunda işləyir. Əgər server portunu dəyişsəniz, bu fayllardakı URL-i də yeniləyin.

---

## ▶️ İşə Salma (Running Locally)

Layihəni tam işə salmaq üçün 3 ayrı terminal istifadə etmək tövsiyə olunur (və ya fon rejimində işlədin).

### 1. Serveri işə salın (Terminal 1)

Server verilənlər bazası (`db.json`) və API endpoint-lərini təmin edir.

```bash
cd server
node server.js
```

_Server http://localhost:3000 ünvanında işə düşəcək._

### 2. Admin Paneli işə salın (Terminal 2)

```bash
cd admin
npm run dev
```

_Admin paneli adətən http://localhost:5173 ünvanında açılır (terminaldakı linki yoxlayın)._

### 3. UI (Mağaza) hissəsini işə salın (Terminal 3)

```bash
cd ui
npm run dev
```

_UI hissəsi adətən http://localhost:5174 ünvanında açılır (əgər 5173 məşğuldursa)._

---

## 📦 İstehsalat Üçün Hazırlıq (Building for Production)

Layihəni canlıya (production) yerləşdirməzdən əvvəl optimallaşdırılmış versiyanı hazırlamaq lazımdır.

**Admin Panel:**

```bash
cd admin
npm run build
```

_Bu əmr `dist` qovluğunda hazır faylları yaradacaq._

**UI:**

```bash
cd ui
npm run build
```

_Bu əmr `dist` qovluğunda hazır faylları yaradacaq._

**Server:**
Server üçün xüsusi build addımı yoxdur, sadəcə `node server.js` ilə işləyir.

---

## ☁️ Yerləşdirmə (Deployment)

Layihəni müxtəlif platformalarda yerləşdirə bilərsiniz.

### Frontend (Admin & UI) - Vercel / Netlify

React tətbiqləri (Vite) ən asan **Vercel** və ya **Netlify** üzərində yerləşdirilir.

1.  **Vercel CLI** quraşdırın (`npm i -g vercel`) və ya Vercel saytından GitHub repozitoriyanızı qoşun.
2.  **Build Command:** `vite build` (və ya `npm run build`)
3.  **Output Directory:** `dist`
4.  **Environment Variables:** Vercel layihə ayarlarında `VITE_API_URL` dəyişənlərini əlavə etməyi unutmayın (məsələn: Sizin canlı server URL-iniz).

### Backend (Server) - Render / Railway / Vercel

JSON Server sadə bir backend olduğu üçün Node.js dəstəkləyən istənilən platformada işləyə bilər.

**Vacib Qeyd:** `json-server` fayl sisteminə (`db.json`) yazır. Vercel kimi serverless mühitlərdə fayl sistemi efemerdir (müvəqqəti), yəni edilən dəyişikliklər (yeni məhsul, sifariş) qalıcı olmayacaq.

- Həqiqi layihələr üçün MongoDB, PostgreSQL kimi real verilənlər bazasına keçid tövsiyə olunur.
- Sadə demo üçün **Render** və ya **Railway** kimi xidmətlərdən istifadə edə bilərsiniz (burada diskə yazma qalıcı ola bilər, lakin pulsuz planlarda məhdudiyyətlər var).

**Vercel-ə yerləşdirmək üçün (Server):**
`server` qovluğunda `vercel.json` faylı yaradın:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

Bundan sonra `vercel` əmri ilə deploy edə bilərsiniz.

---

## 🛠 Tez-tez Rast Gəlinən Problemlər

- **Port Xətası:** Əgər 3000 portu məşğuldursa, `server.js` faylında portu (məs: 3001) dəyişin və `.env` fayllarını yeniləyin.
- **CORS Xətası:** Server və Frontend fərqli portlarda işlədiyi üçün brauzer bloklaya bilər. `json-server` standart olaraq CORS-u dəstəkləyir (`server.use(middlewares)` sətri bunu təmin edir).
- **Şəkillər:** Şəkillərin düzgün yüklənməsi üçün onların düzgün qovluqda (`public` və ya `assets`) olduğundan əmin olun.
