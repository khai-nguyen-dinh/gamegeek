# Google Sheets Integration Setup

Để form liên hệ có thể gửi dữ liệu vào Google Sheets, bạn cần thiết lập Google Apps Script.

## Bước 1: Tạo Google Sheet

1. Tạo một Google Sheet mới tại [Google Sheets](https://sheets.google.com)
2. Đặt tên sheet (ví dụ: "Contact Form Submissions")
3. Tạo header row với các cột sau (dòng 1):
   - Timestamp
   - Object Type
   - Interest
   - Full Name
   - Email
   - Title / Position
   - Company Name
   - Social Contact Link

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, vào **Extensions** > **Apps Script**
2. Xóa code mặc định và dán code sau:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Thêm dữ liệu vào sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.objectType || '',
      data.interest || '',
      data.fullName || '',
      data.email || '',
      data.title || '',
      data.companyName || '',
      data.socialContact || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Lưu script (Ctrl+S hoặc Cmd+S)
4. Đặt tên project (ví dụ: "Contact Form Handler")

## Bước 3: Deploy Web App

1. Click vào **Deploy** > **New deployment**
2. Click vào biểu tượng bánh răng ⚙️ bên cạnh "Select type"
3. Chọn **Web app**
4. Thiết lập:
   - **Description**: "Contact Form Web App"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (quan trọng!)
5. Click **Deploy**
6. Copy **Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/.../exec`)

## Bước 4: Cấu hình trong dự án

1. Tạo file `.env` trong thư mục gốc của dự án (nếu chưa có)
2. Thêm dòng sau:

```
PUBLIC_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Thay `YOUR_SCRIPT_ID` bằng URL bạn đã copy ở bước 3.

3. Khởi động lại dev server nếu đang chạy

## Bước 5: Test

1. Mở website và click vào floating button
2. Điền form và submit
3. Kiểm tra Google Sheet để xem dữ liệu đã được thêm chưa

## Lưu ý

- Nếu bạn thay đổi script, cần **Deploy lại** với version mới
- Web App URL sẽ không thay đổi sau khi deploy lại
- Đảm bảo quyền truy cập là "Anyone" để form có thể submit từ website

## Troubleshooting

### Form không submit được
- Kiểm tra console trong browser (F12) để xem lỗi
- Đảm bảo `PUBLIC_GOOGLE_SHEETS_WEB_APP_URL` đã được set đúng
- Kiểm tra Google Apps Script có được deploy chưa

### Dữ liệu không xuất hiện trong Sheet
- Kiểm tra script có lỗi không (trong Apps Script editor)
- Kiểm tra Execution log trong Apps Script
- Đảm bảo sheet đang mở đúng sheet (không phải sheet khác)
