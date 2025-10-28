# Sections Components

Tài liệu này mô tả các components sections đã được tạo từ HTML gốc.

## 📁 Cấu trúc thư mục

```
src/components/sections/
├── IntroSection.astro              # Hero section với CTA buttons
├── BrandSliderSection.astro        # Slider hiển thị logo thương hiệu
├── AboutSection.astro              # Section giới thiệu về app
├── WorkProcessSection.astro        # Quy trình làm việc 3 bước
├── AdvantageSection.astro          # Ưu điểm của app
├── WhyChooseUsSection.astro        # Tại sao chọn chúng tôi
├── CounterSection.astro            # Thống kê số liệu
├── FAQSection.astro                # Câu hỏi thường gặp
├── TestimonialSection.astro        # Đánh giá khách hàng
├── FeatureSection.astro            # Tính năng sản phẩm
├── PricingSection.astro            # Bảng giá
├── CTASection.astro                # Call-to-action download app
├── BlogSection.astro               # Bài viết blog
└── README-sections.md              # Tài liệu này
```

## 🎯 Cách sử dụng

### 1. Import component
```astro
---
import IntroSection from '../components/sections/IntroSection.astro';
---
```

### 2. Sử dụng trong template
```astro
<IntroSection />
```

### 3. Trang demo đầy đủ
Truy cập `/sections-demo` để xem tất cả sections hoạt động cùng nhau.

## 📋 Danh sách Sections

### 1. **IntroSection**
- **Mô tả**: Hero section chính với tiêu đề, mô tả và CTA buttons
- **Tính năng**: 
  - Rating stars
  - Customer count
  - Animated shapes
  - Responsive design

### 2. **BrandSliderSection**
- **Mô tả**: Slider hiển thị logo các thương hiệu đối tác
- **Tính năng**:
  - Auto-sliding
  - Infinite loop
  - Responsive

### 3. **AboutSection**
- **Mô tả**: Giới thiệu về ứng dụng và công ty
- **Tính năng**:
  - Image gallery
  - Feature checklist
  - Animated elements

### 4. **WorkProcessSection**
- **Mô tả**: Quy trình làm việc 3 bước
- **Tính năng**:
  - Step indicators
  - Animated counters
  - Clean layout

### 5. **AdvantageSection**
- **Mô tả**: Ưu điểm và lợi ích của ứng dụng
- **Tính năng**:
  - Feature grid
  - Image animations
  - CTA buttons

### 6. **WhyChooseUsSection**
- **Mô tả**: Lý do khách hàng nên chọn dịch vụ
- **Tính năng**:
  - Icon grid
  - Central image
  - Responsive layout

### 7. **CounterSection**
- **Mô tả**: Thống kê số liệu quan trọng
- **Tính năng**:
  - Animated counters
  - Background shapes
  - Statistics display

### 8. **FAQSection**
- **Mô tả**: Câu hỏi thường gặp với accordion
- **Tính năng**:
  - Collapsible content
  - Bootstrap accordion
  - Image support

### 9. **TestimonialSection**
- **Mô tả**: Đánh giá và phản hồi khách hàng
- **Tính năng**:
  - Customer avatars
  - Star ratings
  - Slider functionality

### 10. **FeatureSection**
- **Mô tả**: Chi tiết các tính năng sản phẩm
- **Tính năng**:
  - Feature cards
  - Time stamps
  - Interactive elements

### 11. **PricingSection**
- **Mô tả**: Bảng giá các gói dịch vụ
- **Tính năng**:
  - Monthly/Yearly toggle
  - Feature comparison
  - CTA buttons

### 12. **CTASection**
- **Mô tả**: Call-to-action download ứng dụng
- **Tính năng**:
  - App store links
  - Background shapes
  - Mobile-first design

### 13. **BlogSection**
- **Mô tả**: Hiển thị các bài viết blog mới nhất
- **Tính năng**:
  - Article cards
  - Category tags
  - Author info

## 🎨 Styling

Tất cả sections sử dụng CSS classes từ `nico-refactored.css`:
- Responsive design
- Animation effects
- Modern UI components
- Consistent spacing

## 🔧 Customization

### Thay đổi nội dung
Chỉnh sửa trực tiếp trong file `.astro` của từng component.

### Thay đổi styling
Sử dụng CSS classes từ `nico-refactored.css` hoặc thêm custom CSS.

### Thêm sections mới
1. Tạo file `.astro` mới trong thư mục `sections/`
2. Import và sử dụng trong trang chính

## 📱 Responsive Design

Tất cả sections đều được thiết kế responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, xxl
- Flexible grid system
- Optimized images

## 🚀 Performance

- Lazy loading images
- Optimized CSS
- Minimal JavaScript
- Fast loading times

## 📞 Support

Nếu cần hỗ trợ, vui lòng liên hệ team development.
