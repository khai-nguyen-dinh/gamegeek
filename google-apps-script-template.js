/**
 * Google Apps Script để nhận dữ liệu từ Contact Form và ghi vào Google Sheet
 * 
 * Hướng dẫn sử dụng:
 * 1. Tạo Google Sheet mới
 * 2. Vào Extensions > Apps Script
 * 3. Dán code này vào
 * 4. Deploy as Web App với quyền "Anyone"
 * 5. Copy Web App URL và thêm vào file .env
 */

function doPost(e) {
  try {
    // Lấy sheet hiện tại
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse dữ liệu từ request
    const data = JSON.parse(e.postData.contents);
    
    // Thêm dữ liệu vào sheet (theo thứ tự cột)
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
    
    // Trả về response thành công
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log lỗi để debug
    console.error('Error in doPost:', error);
    
    // Trả về response lỗi
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Hàm test để kiểm tra script hoạt động
 * Chạy hàm này trong Apps Script editor để test
 */
function testScript() {
  const testData = {
    timestamp: new Date().toISOString(),
    objectType: 'Studio / Publisher',
    interest: 'Marketing agency services',
    fullName: 'Test User',
    email: 'test@example.com',
    title: 'CEO',
    companyName: 'Test Company',
    socialContact: 'https://linkedin.com/in/test'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
