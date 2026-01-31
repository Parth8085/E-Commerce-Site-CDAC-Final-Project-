# 🚀 Quick Start Guide - SmartKartStore

## ⚡ **Get Started in 5 Minutes**

### **Step 1: Start the Backend** (Terminal 1)
```bash
cd backend
dotnet run
```
✅ Backend running on: `http://localhost:5252`

### **Step 2: Start the Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend running on: `http://localhost:5173`

### **Step 3: Open Your Browser**
Navigate to: `http://localhost:5173`

---

## 🎯 **Quick Test Flow**

### **1. Register a New Account** (30 seconds)
1. Click **"Sign Up"** in the navbar
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `9876543210`
   - Password: `Test@123`
3. Click **"Register"**
4. Check console for OTP (simulated)
5. Enter OTP and verify

### **2. Browse & Add to Cart** (1 minute)
1. Browse home page or click **"Mobiles"**
2. Click **"Add to Cart"** on any product
3. See cart badge update
4. Add 2-3 more products

### **3. Complete Checkout** (2 minutes)
1. Click cart icon → **"Proceed to Checkout"**
2. **Shipping Info**:
   - Address: `123 Main Street`
   - City: `Mumbai`
   - State: `Maharashtra`
   - ZIP: `400001`
   - Phone: `9876543210`
   - Click **"Continue to Payment"**

3. **Payment Method**:
   - Select **"Credit Card"**
   - Card Number: `1234567890123456`
   - Expiry: `12/26`
   - CVV: `123`
   - Click **"Review Order"**

4. **Review & Place**:
   - Review your order
   - Click **"Place Order"**

### **4. View Order Confirmation** (30 seconds)
1. See order success page with:
   - ✅ Order number
   - ✅ Transaction ID
   - ✅ Expected delivery date
2. Click **"View My Orders"**

### **5. Track Your Order** (30 seconds)
1. View order in **"My Orders"** page
2. Click **"View Details"** to see timeline
3. See order status and tracking info

---

## 👨‍💼 **Admin Quick Test** ⭐ NEW!

### **1. Access Admin Panel** (30 seconds)
1. Navigate to: `http://localhost:5173/admin/login`
2. Login with:
   - Email: `admin@smartkartstore.com`
   - Password: `Admin@123`
3. You'll be redirected to admin dashboard

### **2. View Dashboard** (1 minute)
1. See statistics:
   - Total Revenue
   - Total Orders
   - Total Users
   - Total Products
2. View order status breakdown
3. See recent orders

### **3. Manage Orders** (1 minute)
1. Click **"Orders"** in sidebar
2. Find an order
3. Change status to **"Shipped"**
4. Tracking number auto-generated!
5. Customer sees update in their orders

### **4. Update Product Stock** (30 seconds)
1. Click **"Products"** in sidebar
2. Find a product
3. Click on stock number
4. Enter new value (e.g., 50)
5. Stock updates immediately!

### **5. View Users** (30 seconds)
1. Click **"Users"** in sidebar
2. See all registered users
3. View their total orders and spending

---

## 🧪 **Test Different Features**

### **Search**
```
1. Type "Apple" in search bar
2. Press Enter
3. See all Apple products
```

### **Compare Products**
```
1. Click "Add to Compare" on 2-3 products
2. Click "Compare" in navbar
3. See side-by-side comparison
```

### **Payment Methods**
Try different payment methods:
- **Credit Card**: Full validation
- **Debit Card**: Full validation
- **UPI**: Enter `test@upi`
- **COD**: No additional info needed

---

## 🔧 **Admin: Update Order Status**

Use this API call to simulate order shipping:

```bash
# Using curl
curl -X PUT http://localhost:5252/api/order/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Shipped","trackingNumber":"TRK202601310001"}'

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5252/api/order/1/status" `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"status":"Shipped","trackingNumber":"TRK202601310001"}'
```

Then refresh **"My Orders"** page to see updated status!

---

## 📋 **Available Order Statuses**

Update order status to any of these:
- `Pending` - Initial status
- `Processing` - Being prepared
- `Shipped` - Dispatched (add tracking number)
- `Delivered` - Completed
- `Cancelled` - Cancelled
- `Delayed` - Delayed

---

## 🎨 **UI Pages to Explore**

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Product showcase |
| Mobiles | `/mobiles` | Mobile category |
| Laptops | `/laptops` | Laptop category |
| Accessories | `/accessories` | Accessories category |
| Search | `/search?q=apple` | Search results |
| Cart | `/cart` | Shopping cart |
| Compare | `/compare` | Product comparison |
| Checkout | `/checkout` | Multi-step checkout |
| My Orders | `/my-orders` | Order history |
| Login | `/login` | User login |
| Signup | `/signup` | User registration |

---

## 💡 **Pro Tips**

1. **Multiple Users**: Register multiple accounts to test different orders
2. **Stock Testing**: Try ordering more than available stock (will fail validation)
3. **Cart Persistence**: Cart is saved in database, persists across sessions
4. **Responsive Design**: Try resizing browser or use mobile view
5. **Search**: Search works across product name, brand, category, and description

---

## 🐛 **Troubleshooting**

### **Backend not starting?**
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

### **Frontend not starting?**
```bash
cd frontend
npm install
npm run dev
```

### **Database issues?**
```bash
cd backend
dotnet ef database drop
dotnet ef database update
dotnet run
```

### **Port already in use?**
- Backend: Change port in `backend/Properties/launchSettings.json`
- Frontend: Change port in `frontend/vite.config.js`

---

## 📚 **Documentation**

- **Main README**: `README.md`
- **Order System**: `ORDER_SYSTEM.md`
- **Complete Guide**: `IMPLEMENTATION_COMPLETE.md`

---

## ✨ **What's Working**

✅ User authentication (register, login, OTP, password reset)
✅ Product catalog (90+ products with real images)
✅ Search functionality (full-text search)
✅ Shopping cart (add, update, remove)
✅ Product comparison (side-by-side)
✅ Multi-step checkout (shipping, payment, review)
✅ Payment processing (4 methods with validation)
✅ Order management (create, view, track)
✅ Order tracking (status, timeline, tracking numbers)
✅ Responsive design (mobile, tablet, desktop)
✅ Premium UI/UX (animations, glassmorphism)

---

## 🎉 **You're All Set!**

Your complete e-commerce platform is ready to use. Start testing and enjoy! 🚀

**Need help?** Check the documentation files or the code comments.

---

**Happy Shopping! 🛒**
