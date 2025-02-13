# 📝 TaskMate

TaskMate, kullanıcıların üye olarak giriş yapıp görev oluşturmasına, düzenlemesine ve kategorilere göre filtrelemesine olanak tanıyarak görev yönetimini kolaylaştırmayı hedefleyen modern bir uygulamadır.

Bu proje, Laravel, Inertia.js, React ve Tailwind CSS kullanılarak geliştirilmiştir.

## 📌 Özellikler

✅ Kullanıcı girişi & kayıt sistemi

✅ Görev ekleme, düzenleme ve silme

✅ Görevleri tamamlandı / tamamlanmadı olarak sürükleyerek taşıma (Drag & Drop)

✅ Kategori bazlı filtreleme

✅ Arama fonksiyonu ile hızlı görev bulma

✅ Modern ve minimalist UI

✅ Tamamen responsive (Mobil ve masaüstü uyumlu)

## 🚀 Kurulum ve Çalıştırma (Installation & Setup)

Öncelikle projeyi yerel ortamınıza clone edin:

```
git clone https://github.com/cemlevent54/ToDoApp.git
cd TaskProject
```

### 📌 Frontend Kurulumu (React + Inertia.js)

Node.js bağımlılıklarını yükleyin:

```
npm install
```

Vite geliştirme sunucusunu başlatın:

```
npm run dev
```

### 📌 Backend Kurulumu (Laravel)

Laravel bağımlılıklarını yükleyin:

```
composer install
```

Laravel geliştirme sunucusunu başlatın:

```
php artisan serve
```

📂 Proje Dosya Yapısı (Project Structure)

```

TaskProject/
│── app/
│    ├── Http/
│    │    ├── Controllers/
│    │    │    ├── Auth/
│    │    │    ├── ProfileController.php
│    │    │    ├── TaskController.php
│    │    ├── Middleware/
│    │    ├── Requests/
│    ├── Models/
│    │    ├── Task.php
│    │    ├── TaskCategory.php
│    │    ├── User.php
│    ├── Providers/
│
│── database/
│    ├── factories/
│    ├── migrations/
│    ├── seeders/
│    ├── database.sqlite
|
│── resources/
│    ├── js/
│    │    ├── ApplicationContext/
│    │    │    ├── TaskForm.jsx
│    │    │    ├── TaskItem.jsx
│    │    ├── Components/
│    │    ├── Layouts/
│    │    │    ├── AuthenticatedLayout.jsx
│    │    ├── Pages/
│    │    │    ├── Dashboard.jsx
│    │    │    ├── Tasks.jsx
│    │    │    ├── Welcome.jsx
|    ├── app.jsx
│
│── routes/
│    ├── web.php
|

```

## 🎥 Proje Demo Videosu
