# DesPho.ai - Hệ thống xử lý hình ảnh bằng AI

**DesPho.ai** là hệ thống xử lý hình ảnh thông minh cho phép người dùng thực hiện các tác vụ như **xóa nền, xóa vật thể và quản lý tài nguyên hình ảnh** một cách tự động.
Hệ thống được xây dựng với kiến trúc hiện đại, dễ mở rộng và tối ưu cho hiệu năng.

---

# Công nghệ sử dụng

## Frontend

* Framework: **React.js (Vite)**
* Styling: **Tailwind CSS**
* Icons: **Lucide React**
* Authentication: **Firebase Phone Authentication (OTP)**
* HTTP Client: **Axios (Interceptor)**

---

## Backend

* Framework: **Laravel 11 (PHP 8.2 FPM)**
* Database: **PostgreSQL 15**
* Cache / Queue: **Redis 7**
* Security: **Laravel Sanctum + Firebase Admin SDK**

---

## AI Service

* Ngôn ngữ: **Python**
* Chức năng chính:

  * Xóa nền ảnh (Background Removal)
  * Xóa vật thể (Object Removal)
  * Xử lý ảnh bằng mô hình AI

---

# Cấu trúc dự án

```
.
├── AI/                # Python scripts và các model xử lý ảnh
├── Backend/           # Laravel API xử lý logic và database
├── Frontend/          # Giao diện React (Vite)
├── docker-compose.yml # Cấu hình Docker toàn hệ thống
└── README.md
```

---

# Cài đặt và khởi chạy

## 1. Yêu cầu hệ thống

Cần cài đặt trước các công cụ sau:

* Docker
* Docker Compose
* Node.js (phiên bản 18 trở lên)
* Git

---

## 2. Khởi chạy nhanh bằng Docker

Hệ thống đã được Docker hóa toàn bộ để việc triển khai trở nên đơn giản.

```bash
# Clone repository
git clone https://github.com/yourusername/despho-system.git

# Di chuyển vào thư mục dự án
cd despho-system

# Build và chạy các container
docker-compose up -d --build
```

Các service sẽ bao gồm:

* Nginx
* PHP (Laravel)
* PostgreSQL
* Redis

---

## 3. Cấu hình Backend (Laravel)

Truy cập vào container backend:

```bash
docker exec -it despho_api sh
```

Cài đặt thư viện:

```bash
composer install
```

Cấu hình file môi trường:

```
Backend/.env
```

Thêm các thông tin:

* Kết nối PostgreSQL
* Firebase Admin SDK credentials

Chạy migration database:

```bash
php artisan migrate
```

---

## 4. Cấu hình Frontend (React)

Di chuyển vào thư mục frontend:

```bash
cd Frontend
```

Cài đặt dependencies:

```bash
npm install
```

Chạy server development:

```bash
npm run dev
```

Đảm bảo file **vite.config.js** đã cấu hình proxy đúng tới backend (port 80 hoặc 8000).

---

# Luồng xác thực (Authentication Flow)

Hệ thống sử dụng cơ chế xác thực hai lớp:

1. **Frontend**

   * Người dùng nhập số điện thoại.
   * Firebase gửi mã OTP để xác thực.

2. **Frontend → Backend**

   * Sau khi xác thực thành công, frontend gửi **Firebase ID Token** về backend.

3. **Backend**

   * Backend xác minh token bằng **Firebase Admin SDK**.
   * Nếu hợp lệ, backend cấp **Laravel API Token** để truy cập hệ thống.

---

# License

Dự án được phát triển và bảo trì bởi **DesPho Team**.
