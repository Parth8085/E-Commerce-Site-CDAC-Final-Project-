# SmartKartStore - E-Commerce Application

A full-stack e-commerce application built with React (Frontend) and .NET (Backend).

## 🚀 Features

### ✅ Implemented
- **User Authentication**: Register, Login, OTP verification, Password Reset
- **Product Catalog**: Browse products by categories (Mobiles, Laptops, Accessories)
- **Search Functionality**: Search products by name, brand, category, or description
- **Shopping Cart**: Add/remove items, update quantities
- **Product Comparison**: Compare up to multiple products side-by-side
- **Complete Checkout Flow**: Multi-step checkout with shipping and payment
- **Payment Integration**: Credit/Debit Card, UPI, Cash on Delivery
- **Order Management**: Place orders, track status, view order history
- **Order Tracking**: Real-time order status with tracking numbers
- **My Orders Page**: View all past orders with detailed timeline
- **Admin System**: Complete admin panel with dashboard and management tools
- **Admin Dashboard**: Statistics, order management, user management, product management
- **Role-Based Access**: Separate admin and user roles with protected routes
- **Wishlist Integration**: Add products to wishlist, auto-remove when added to cart
- **Stock Management**: Out-of-stock detection with email notification requests
- **Responsive Design**: Modern UI with animations and glassmorphism effects
- **Email Integration**: OTP via email (simulation mode, configurable for production)

## 🔍 How to Use Search

1. **Type in the search bar** at the top of the page
2. **Search by**:
   - Product name (e.g., "iPhone 15", "MacBook")
   - Brand name (e.g., "Apple", "Samsung", "Dell")
   - Category (e.g., "Mobiles", "Laptops")
   - Any keyword in product description

3. **Press Enter** or click the search button
4. View results with full product details, pricing, and add-to-cart functionality

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Lucide React (icons)
- CSS with modern design system

### Backend
- .NET 8
- Entity Framework Core
- MySQL/MariaDB
- JWT Authentication
- BCrypt for password hashing

## 📦 Installation & Setup

### Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
Server runs on: `http://localhost:5252`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on: `http://localhost:5173`

## 🎨 Design Features
- Premium color palette (Indigo & Slate)
- Smooth animations (fade, slide, scale)
- Glassmorphism navbar
- Hover effects on cards
- Gradient buttons
- Responsive grid layouts

## 📧 Email Configuration
To enable real email sending, update `backend/appsettings.json`:
```json
"EmailSettings": {
  "Host": "smtp.gmail.com",
  "Port": 587,
  "Username": "your-email@gmail.com",
  "Password": "your-app-password"
}
```

## 🗄️ Database
- Uses Entity Framework Code-First approach
- Automatic seeding with 90+ products
- Real product images from LoremFlickr and Clearbit APIs

## 📝 API Endpoints

### Products
- `GET /api/product` - Get all products
- `GET /api/product?category={name}` - Filter by category
- `GET /api/product?search={query}` - Search products
- `GET /api/product/{id}` - Get single product
- `POST /api/product/compare` - Compare products

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-phone` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove from cart

### Orders
- `POST /api/order/checkout` - Place order (checkout)
- `GET /api/order/my-orders` - Get user's order history
- `GET /api/order/{id}` - Get single order details
- `PUT /api/order/{id}/status` - Update order status (Admin)

### Admin (Requires Admin Role)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/orders` - Get all orders (with pagination)
- `GET /api/admin/orders/{id}` - Get order details
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/users` - Get all users (with pagination)
- `GET /api/admin/products` - Get all products (with pagination)
- `PUT /api/admin/products/{id}/stock` - Update product stock
- `PUT /api/admin/products/{id}/price` - Update product price

## 🔐 Admin Access
**Admin Login**: `http://localhost:5173/admin/login`

**Default Credentials**:
- Email: `admin@smartkartstore.com`
- Password: `Admin@123`

**Admin Features**:
- Dashboard with statistics
- Order management (view, update status)
- User management (view all users)
- Product management (update stock, price)

## 💳 Payment Methods
- **Credit Card** - Full card validation
- **Debit Card** - Full card validation
- **UPI** - UPI ID validation
- **Cash on Delivery (COD)** - Pay on delivery

## 📦 Order Features
- **Multi-step Checkout**: Shipping → Payment → Review
- **Order Tracking**: Real-time status updates
- **Order History**: View all past orders
- **Order Statuses**: Pending, Processing, Shipped, Delivered, Cancelled, Delayed
- **Tracking Numbers**: Auto-generated for shipped orders
- **Expected Delivery**: Calculated delivery dates

## 🎯 Future Enhancements
- Real payment gateway integration (Stripe/Razorpay)
- Email/SMS notifications for order updates
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard for order management
- Invoice generation (PDF)
- Real-time inventory updates
- Return/refund management

## 📄 License
This project is for educational purposes.

---
**Created with ❤️ using React & .NET**
