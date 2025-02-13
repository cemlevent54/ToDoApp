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
cd ToDoApp
cd TaskProject
```

### 📌 Backend Kurulumu (Laravel)

Laravel bağımlılıklarını yükleyin:

```
# before frontend
composer install
cp .env.example .env
php artisan key:generate
php artisan config:clear
php artisan cache:clear
php artisan config:cache

# after frontend
php artisan migrate
php artisan storage:link

php artisan serve
```

### 📌 Frontend Kurulumu (React + Inertia.js)

Node.js bağımlılıklarını yükleyin ve Vite geliştirme sunucusunu başlatın:

```
npm install
npm run build
npm run dev
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

## [![Watch the Project Demo](https://img.youtube.com/vi/KlMk7oX-yl8/0.jpg)](https://www.youtube.com/watch?v=KlMk7oX-yl8)
