# Job Board API (Express + Prisma + JWT)

API sederhana untuk **user authentication**, **job posting**, **job listing**, dan **job application**.

---

## 🚀 Fitur

- **Auth**
  - Register (role: `JOB_SEEKER` / `EMPLOYER`)
  - Login (JWT)
- **Jobs**
  - Employer: post job
  - Siapa saja: list jobs
  - Job seeker: apply job

---

## 🛠️ Tech Stack

- Node.js + Express
- Prisma ORM
- MySQL / PostgreSQL
- JSON Web Token (JWT)
- bcryptjs

---

## 📂 Struktur Proyek

```
.
├─ prisma/
│  ├─ migrations/
│  └─ schema.prisma
├─ src/
│  ├─ controllers/
│  │  ├─ jobController.js
│  │  └─ userController.js
│  ├─ helpers/
│  │  ├─ db.js
│  │  └─ jwt.js
│  ├─ middlewares/
│  │  └─ auth.js
│  ├─ routes/
│  │  └─ index.js
│  └─ index.js
├─ .env
├─ package.json
└─ README.md
```

---

## 💾 Clone Repository

### HTTPS
```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

---

## ⚙️ Setup & Jalankan

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Buat file `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nama_database?schema=public"
JWT_SECRET="superlongrandomsecret"
JWT_EXPIRES_IN="1d"
```

### 3️⃣ Prisma Setup
```bash
npx prisma format
npx prisma generate
npx prisma migrate dev --name init
```

**Jika `.env` belum terbaca di Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://user:password@localhost:5432/nama_database?schema=public"; npx prisma generate
```

### 4️⃣ Jalankan server
```bash
npm run dev
```

Akses di: **http://localhost:3000**

---

## 🔑 Endpoint API

### Auth

#### `POST /register`
**Body:**
```json
{
  "email": "hr@mail.com",
  "password": "123456",
  "name": "HR",
  "role": "EMPLOYER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Register success"
}
```

---

#### `POST /login`
**Body:**
```json
{
  "email": "hr@mail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "<JWT>",
  "user": {
    "id": 1,
    "email": "hr@mail.com",
    "role": "EMPLOYER",
    "name": "HR"
  }
}
```

---

### Jobs

#### `GET /jobs`
List semua job (public).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Backend Golang",
      "company_name": "Tech Co",
      "location": "Jakarta",
      "salary_min": 8000000,
      "salary_max": 15000000
    }
  ]
}
```

---

#### `POST /jobs` — **EMPLOYER only**
**Headers:**
```
Authorization: Bearer <TOKEN_EMPLOYER>
```

**Body:**
```json
{
  "title": "Backend Golang",
  "description": "Build APIs",
  "company_name": "Tech Co",
  "salary_min": 8000000,
  "salary_max": 15000000,
  "location": "Jakarta"
}
```

**Response:**
```json
{
  "success": true,
  "message": "job created",
  "data": {
    "id": 1,
    "title": "Backend Golang"
  }
}
```

---

#### `POST /jobs/:id/apply` — **JOB_SEEKER only**
**Headers:**
```
Authorization: Bearer <TOKEN_SEEKER>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "applied",
  "data": {
    "jobId": 1,
    "userId": 3
  }
}
```

**Response (Sudah Apply):**
```json
{
  "success": false,
  "message": "sudah pernah melamar job ini"
}
```

---

## 📝 Catatan

- Role `EMPLOYER` hanya bisa membuat job
- Role `JOB_SEEKER` hanya bisa melamar job
- Endpoint `/jobs` (GET) bisa diakses tanpa authentication
- JWT token disimpan di header `Authorization: Bearer <token>`

---