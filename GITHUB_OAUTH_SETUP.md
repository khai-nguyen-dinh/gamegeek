# GitHub OAuth Setup cho Keystatic

Hướng dẫn cấu hình GitHub OAuth App để sử dụng Keystatic CMS.

## 🔑 Các biến môi trường cần thiết

Đảm bảo file `.env` có các biến sau:

```env
KEYSTATIC_GITHUB_CLIENT_ID=your_client_id_here
KEYSTATIC_GITHUB_CLIENT_SECRET=your_client_secret_here
```

## 📝 Các bước cấu hình GitHub OAuth App

### 1. Tạo GitHub OAuth App

1. Truy cập: https://github.com/settings/developers
2. Click **"New OAuth App"** hoặc **"Register a new application"**
3. Điền thông tin:

   **Application name**: `GameGeek Keystatic` (hoặc tên bạn muốn)
   
   **Homepage URL**: 
   - Local: `http://localhost:4321`
   - Production: `https://your-domain.com`
   
   **Authorization callback URL** ⚠️ **QUAN TRỌNG**:
   - Local: `http://localhost:4321/api/keystatic/github/oauth/callback`
   - Production: `https://your-domain.com/api/keystatic/github/oauth/callback`

4. Click **"Register application"**

### 2. Lấy Client ID và Client Secret

Sau khi tạo OAuth App:
1. Bạn sẽ thấy **Client ID** ngay lập tức (copy vào `.env`)
2. Click **"Generate a new client secret"** để tạo **Client Secret** (copy vào `.env`)
   - ⚠️ **Lưu ý**: Client Secret chỉ hiển thị 1 lần, hãy lưu lại ngay!

### 3. Cấu hình Redirect URIs

**QUAN TRỌNG**: GitHub OAuth App chỉ chấp nhận các redirect URI đã được đăng ký. Bạn cần thêm **CẢ HAI** URLs:

#### Cho Local Development:
```
http://localhost:4321/api/keystatic/github/oauth/callback
```

#### Cho Production:
```
https://your-domain.com/api/keystatic/github/oauth/callback
```

**Lưu ý**: 
- Nếu bạn dùng port khác (không phải 4321), thay đổi URL tương ứng
- URL phải khớp **CHÍNH XÁC** (bao gồm http/https, port, path)

### 4. Cập nhật file .env

Thêm hoặc cập nhật các biến trong file `.env`:

```env
KEYSTATIC_GITHUB_CLIENT_ID=Ov23liB8XqckGz6rSr6o
KEYSTATIC_GITHUB_CLIENT_SECRET=your_client_secret_here
```

### 5. Khởi động lại dev server

Sau khi cập nhật `.env`, khởi động lại server:

```bash
npm run dev
```

## ✅ Kiểm tra cấu hình

1. Truy cập: `http://localhost:4321/keystatic`
2. Click "Sign in with GitHub"
3. Nếu thấy lỗi "redirect_uri is not associated", kiểm tra lại:
   - ✅ Client ID và Client Secret đã đúng trong `.env`
   - ✅ Authorization callback URL trong GitHub OAuth App khớp chính xác
   - ✅ Đã khởi động lại dev server sau khi cập nhật `.env`

## 🔧 Troubleshooting

### Lỗi: "redirect_uri is not associated with this application"

**Nguyên nhân**: Callback URL trong GitHub OAuth App không khớp với URL thực tế.

**Giải pháp**:
1. Kiểm tra URL hiện tại trong code: `http://localhost:4321/api/keystatic/github/oauth/callback`
2. Vào GitHub OAuth App settings
3. Đảm bảo "Authorization callback URL" khớp **CHÍNH XÁC** (bao gồm http/https, port, path)
4. Lưu lại settings
5. Thử lại

### Lỗi: "Missing KEYSTATIC_GITHUB_CLIENT_ID"

**Nguyên nhân**: Biến môi trường chưa được load.

**Giải pháp**:
1. Kiểm tra file `.env` có tồn tại không
2. Đảm bảo tên biến đúng: `KEYSTATIC_GITHUB_CLIENT_ID` và `KEYSTATIC_GITHUB_CLIENT_SECRET`
3. Khởi động lại dev server
4. Nếu vẫn lỗi, thử thêm vào `astro.config.mjs`:

```javascript
export default defineConfig({
  // ...
  env: {
    KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  }
});
```

### Lỗi: "Invalid client secret"

**Nguyên nhân**: Client Secret không đúng hoặc đã bị reset.

**Giải pháp**:
1. Vào GitHub OAuth App settings
2. Generate một Client Secret mới
3. Cập nhật trong file `.env`
4. Khởi động lại dev server

## 📚 Tài liệu tham khảo

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Keystatic GitHub Storage](https://keystatic.com/docs/storage/github)

## 🔒 Bảo mật

- ⚠️ **KHÔNG** commit file `.env` lên Git
- ⚠️ **KHÔNG** chia sẻ Client Secret công khai
- Sử dụng environment variables trong production (Cloudflare, Vercel, etc.)
- Rotate Client Secret định kỳ

