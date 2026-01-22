# CMS Test - JSON Editor & GitHub Push

Trang CMS nhỏ để test khả năng edit file JSON và đẩy lên GitHub.

## 💡 Workflow

**Không cần Keystatic!** Bạn có thể:
1. Đọc file JSON từ local filesystem (`src/data/*.json`)
2. Edit trong CMS
3. Push trực tiếp lên GitHub
4. GitHub sẽ trigger deployment tự động

**Lợi ích:**
- ✅ Đơn giản, không cần cấu hình phức tạp
- ✅ Full control over data structure
- ✅ Dễ debug và maintain
- ✅ Hoạt động tốt với static site generation

## 🚀 Cách sử dụng

### 1. Setup GitHub Token

Tạo GitHub Personal Access Token:
1. Vào https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Chọn scope: `repo` (full control of private repositories)
4. Copy token

Thêm token vào file `.env`:
```env
GITHUB_TOKEN=your_github_personal_access_token_here
```

### 2. Truy cập trang CMS

Sau khi chạy `npm run dev`, truy cập:
```
http://localhost:4321/admin/test-json
```

### 3. Sử dụng

1. **Nhập file path**: Đường dẫn file JSON trong repo (ví dụ: `src/data/test.json`)
2. **Load file**:
   - Click **"Load from Local"** để load từ local filesystem (nếu file đã tồn tại)
   - Hoặc click **"Load from GitHub"** để load từ GitHub repository
3. **Edit JSON**: Chỉnh sửa nội dung JSON trong textarea
4. **Commit message**: Nhập message cho commit
5. **Save & Push**: Click "Save & Push to GitHub" để commit và push lên GitHub

### 4. Workflow đề xuất

**Development:**
```
1. Tạo/edit file JSON local (src/data/*.json)
2. Load từ Local trong CMS
3. Edit nếu cần
4. Push lên GitHub
5. GitHub auto-deploy
```

**Production:**
```
1. Load từ GitHub trong CMS
2. Edit
3. Push lên GitHub
4. GitHub auto-deploy
```

## 📁 Files được tạo

- `src/pages/admin/test-json.astro` - Trang admin UI
- `src/pages/api/local/read.ts` - API để đọc file từ local filesystem
- `src/pages/api/github/read.ts` - API để đọc file từ GitHub
- `src/pages/api/github/push.ts` - API để push file lên GitHub
- `src/data/test.json` - File JSON mẫu để test

## 🔒 Bảo mật

- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ GitHub token công khai
- Token chỉ cần scope `repo` để push file

## 🐛 Troubleshooting

### Lỗi "GITHUB_TOKEN environment variable is not set"

- Kiểm tra file `.env` đã được tạo chưa
- Đảm bảo token đã được set đúng
- Restart dev server sau khi thêm `.env`

### Lỗi "GitHub API error: 401"

- Token không hợp lệ hoặc đã hết hạn
- Token không có quyền `repo`
- Tạo token mới và cập nhật trong `.env`

### Lỗi "File not found"

- File path không đúng
- File chưa tồn tại trên GitHub (sẽ được tạo mới khi push)
- File chưa tồn tại trong local filesystem (dùng "Load from GitHub" thay vì "Load from Local")

### Lưu ý về Local API

- API `/api/local/read` chỉ hoạt động trong development mode (local)
- Trên Cloudflare/Production, chỉ có thể load từ GitHub
- Để test local, đảm bảo file JSON đã tồn tại trong `src/data/` hoặc path tương ứng

## 📝 Notes

- File sẽ được commit và push trực tiếp lên branch `main`
- Nếu file đã tồn tại, sẽ được update
- Nếu file chưa tồn tại, sẽ được tạo mới
- JSON sẽ được validate trước khi push

