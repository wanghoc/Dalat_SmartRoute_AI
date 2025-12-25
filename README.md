# Smart Da Lat Tourism Recommendation System 🌸

Hệ thống gợi ý du lịch thông minh cho Đà Lạt, Việt Nam. Sử dụng AI để đề xuất địa điểm dựa trên **thời tiết thực** và **giờ mở cửa**.

![Da Lat](https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800)

## ✨ Tính năng chính

### 1. 🌤️ Thời tiết thực (Real-time Weather)
- Lấy dữ liệu thời tiết Đà Lạt từ OpenWeatherMap API
- Hiển thị: Nhiệt độ, trạng thái (Mưa/Nắng/Nhiều mây), dự báo ngắn
- Tự động cập nhật mỗi 10 phút

### 2. 🎯 Gợi ý thông minh (Weather + Time Based)
- **Quy tắc thời tiết:**
  - Trời mưa → Gợi ý: Quán cà phê, bảo tàng, nhà hàng (trong nhà)
  - Trời nắng/nhiều mây → Gợi ý: Thác nước, viewpoint, ngoài trời
- **Quy tắc giờ mở cửa:**
  - Chỉ hiển thị địa điểm đang MỞ CỬA theo giờ hiện tại

### 3. 💬 Chatbot thông minh
- Bong bóng chat nổi góc phải
- Hỏi tự nhiên: "Quán cà phê view đẹp?", "Đi đâu lúc 10 PM?"
- Tìm kiếm theo từ khóa + thời gian
- Fallback: Google Search nếu không tìm thấy

### 4. 🗺️ Tích hợp Google Maps
- Bản đồ tổng quan Đà Lạt (Embed)
- Nút "Chỉ đường" → Mở Google Maps Directions

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (Vite), Tailwind CSS |
| Backend | Node.js, Express |
| Database | Local `data.json` |
| APIs | OpenWeatherMap, Google Maps |

## 📁 Cấu trúc dự án

```
Dalat_SmartRoute_AI/
├── 📦 package.json           # Root scripts
├── 📁 client/                 # Frontend React
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── 📁 src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       └── 📁 components/
│           ├── WeatherWidget.jsx
│           ├── PlaceCard.jsx
│           ├── Chatbot.jsx
│           └── MapEmbed.jsx
└── 📁 server/                 # Backend Express
    ├── package.json
    ├── server.js
    ├── data.json
    └── 📁 controllers/
        ├── recommendationController.js
        └── chatbotController.js
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Node.js >= 18.0.0
- npm hoặc yarn

### Bước 1: Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies (root, client, server)
npm run install:all
```

### Bước 2: Cấu hình API Key (Tùy chọn)

Để sử dụng thời tiết thực từ OpenWeatherMap:

1. Đăng ký tại [openweathermap.org](https://openweathermap.org/api)
2. Lấy API Key
3. Mở file `server/server.js` và thay thế:

```javascript
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
// Thay bằng:
const OPENWEATHER_API_KEY = 'your_actual_api_key';
```

> **Note:** Nếu không có API key, hệ thống sẽ sử dụng dữ liệu demo.

### Bước 3: Chạy ứng dụng

```bash
# Chạy cả client và server đồng thời
npm run dev
```

Hoặc chạy riêng:

```bash
# Terminal 1: Chạy server
cd server
npm run dev

# Terminal 2: Chạy client
cd client
npm run dev
```

### Bước 4: Truy cập

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server |
| GET | `/api/weather` | Thời tiết Đà Lạt |
| GET | `/api/recommendations?condition=sunny` | Gợi ý theo thời tiết |
| GET | `/api/places` | Tất cả địa điểm |
| POST | `/api/chatbot` | Xử lý câu hỏi chatbot |
| GET | `/api/chatbot/suggestions` | Gợi ý câu hỏi mẫu |

## 🎨 Màu sắc & Theme

| Color | Hex | Ý nghĩa |
|-------|-----|---------|
| Primary | `#E0F7FA` | Sky Blue - Bầu trời |
| Secondary | `#E8F5E9` | Green - Thiên nhiên |
| Accent | `#FFF3E0` | Orange - Ấm áp |

## 📝 Dữ liệu mẫu

File `server/data.json` chứa 12 địa điểm Đà Lạt:
- 🏠 Crazy House, Nhà Thờ Con Gà, Bảo Tàng Lâm Đồng
- ☕ The Married Cafe, Windmills Cafe, An Cafe (24/7)
- 💧 Thác Datanla, Thác Voi
- 🏔️ Đỉnh Langbiang, Hồ Tuyền Lâm
- 🌙 Chợ Đêm Đà Lạt
- 🍽️ Memory Restaurant

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

Made with 💚 for Da Lat lovers 🌸


fhdskjhfkjsdlfhkjsdlhfkjsfhkjsdal