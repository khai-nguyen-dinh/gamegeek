# Keystatic CMS Setup với GitLab

Hướng dẫn thiết lập Keystatic CMS với GitLab storage cho dự án GameGeek.

## 📋 Lưu ý quan trọng

Keystatic hiện tại chỉ hỗ trợ **GitHub**, **local**, và **cloud** storage. Để sử dụng với GitLab, chúng ta sử dụng **local storage** và tự động commit/push lên GitLab thông qua Git.

## 🔧 Cấu hình

### 1. Cấu hình Git Remote cho GitLab

Đảm bảo repository đã được cấu hình với GitLab remote:

```bash
# Kiểm tra remote hiện tại
git remote -v

# Nếu chưa có GitLab remote, thêm mới:
git remote set-url origin https://gitlab.com/your-username/gamegeek.git

# Hoặc thêm remote mới:
git remote add gitlab https://gitlab.com/your-username/gamegeek.git
```

### 2. Cấu hình Git Credentials

Để tự động push lên GitLab, bạn cần cấu hình Git credentials:

**Option 1: Sử dụng Personal Access Token**
```bash
git config --global credential.helper store
# Khi push lần đầu, nhập username và token làm password
```

**Option 2: Sử dụng SSH Key**
```bash
# Tạo SSH key nếu chưa có
ssh-keygen -t ed25519 -C "your_email@example.com"

# Thêm SSH key vào GitLab: Settings → SSH Keys
# Cấu hình remote với SSH URL
git remote set-url origin git@gitlab.com:your-username/gamegeek.git
```

## 🚀 Sử dụng

### Khởi động Development Server

```bash
npm run dev
```

### Truy cập Keystatic Admin Panel

Sau khi khởi động server, truy cập:
- **Local**: `http://localhost:4321/keystatic`
- **Hoặc**: `http://localhost:4321/admin`

### Lưu và Commit lên GitLab

Có 2 cách để commit và push lên GitLab:

#### Cách 1: Tự động với Watch Script (Khuyến nghị)

Chạy script watch để tự động commit và push khi có thay đổi:

```bash
npm run keystatic:sync
```

Script này sẽ:
- Theo dõi thay đổi trong `src/content/`
- Tự động commit khi có thay đổi
- Tự động push lên GitLab

**Lưu ý**: Chạy script này trong terminal riêng khi đang phát triển.

#### Cách 2: Commit thủ công

Khi bạn tạo hoặc chỉnh sửa content trong Keystatic:
1. Nhập thông tin và nhấn **Save** (file sẽ được lưu vào `src/content/`)
2. Commit và push thủ công:

```bash
git add src/content/
git commit -m "chore: update content via Keystatic CMS"
git push origin main
```

## 📁 Content Collections

Keystatic đã được cấu hình với các collections sau:

1. **Posts** (`src/content/posts/*`) - Bài viết tin tức
2. **Categories** (`src/content/categories/*`) - Danh mục
3. **Pages** (`src/content/pages/*`) - Trang tĩnh (About, Services, etc.)
4. **Services** (`src/content/services/*`) - Dịch vụ
5. **Team** (`src/content/team/*`) - Thành viên team
6. **Slides** (`src/content/slides/*`) - Hero slides
7. **Events** (`src/content/events/*`) - Sự kiện

## 🔒 Bảo mật

- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ GitLab token công khai
- Sử dụng GitLab CI/CD variables cho production deployment
- Rotate token định kỳ để tăng cường bảo mật

## 🐛 Troubleshooting

### Lỗi Git Push Authentication

- Kiểm tra Git credentials đã được cấu hình đúng chưa
- Nếu dùng HTTPS, đảm bảo Personal Access Token có quyền `write_repository`
- Nếu dùng SSH, kiểm tra SSH key đã được thêm vào GitLab

### Lỗi Repository Not Found

- Kiểm tra Git remote URL có đúng không: `git remote -v`
- Đảm bảo bạn có quyền truy cập repository trên GitLab

### Lỗi Branch Not Found

- Kiểm tra branch name có đúng không: `git branch`
- Đảm bảo branch đã tồn tại trên GitLab hoặc tạo branch mới

### Script không tự động commit

- Đảm bảo script đang chạy: `npm run keystatic:sync`
- Kiểm tra quyền ghi file trong thư mục `src/content/`
- Kiểm tra Git đã được cấu hình đúng

## 📚 Tài liệu tham khảo

- [Keystatic Documentation](https://keystatic.com/docs)
- [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
