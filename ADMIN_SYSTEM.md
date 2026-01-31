# 🔐 Admin System - Complete Guide

## ✅ **Admin Features Implemented**

### **1. Admin Authentication**
- **Separate Admin Login Page** (`/admin/login`)
- **Role-Based Access Control** (Admin role required)
- **Default Admin Credentials**:
  - Email: `admin@smartkartstore.com`
  - Password: `Admin@123`
- **Auto-seeded Admin User** in database

### **2. Admin Dashboard** (`/admin/dashboard`)
- **Dashboard Overview**:
  - Total Revenue
  - Total Orders
  - Total Users
  - Total Products
  - Order Status Breakdown (Pending, Processing, Shipped, Delivered)
  - Recent Orders List

### **3. Order Management**
- **View All Orders** with pagination
- **Filter by Status** (Pending, Processing, Shipped, Delivered, Cancelled, Delayed)
- **Update Order Status** in real-time
- **Auto-generate Tracking Numbers** when status changes to "Shipped"
- **View Order Details**:
  - Customer information
  - Order items
  - Payment details
  - Shipping address
  - Order timeline

### **4. User Management**
- **View All Users** with pagination
- **User Details**:
  - Name, Email, Phone
  - Role (Admin/User)
  - Total Orders
  - Total Amount Spent
  - Phone Verification Status

### **5. Product Management**
- **View All Products** with pagination
- **Filter by Category**
- **Update Product Stock** in real-time
- **Update Product Price** (endpoint available)
- **Stock Status Indicators**:
  - In Stock (> 10 items)
  - Low Stock (1-10 items)
  - Out of Stock (0 items)

---

## 🚀 **How to Access Admin Panel**

### **Step 1: Navigate to Admin Login**
```
http://localhost:5173/admin/login
```

### **Step 2: Login with Admin Credentials**
```
Email: admin@smartkartstore.com
Password: Admin@123
```

### **Step 3: Access Dashboard**
After successful login, you'll be redirected to:
```
http://localhost:5173/admin/dashboard
```

---

## 📊 **Admin Dashboard Features**

### **Dashboard Tab**
- **Statistics Cards**:
  - Total Revenue (₹)
  - Total Orders
  - Total Users
  - Total Products

- **Order Status Cards**:
  - Pending Orders
  - Processing Orders
  - Shipped Orders
  - Delivered Orders

- **Recent Orders Table**:
  - Order Number
  - Customer Name
  - Order Date
  - Total Amount
  - Status Badge

### **Orders Tab**
- **Order List** with:
  - Order Number
  - Customer Name & Email
  - Order Date & Time
  - Total Amount
  - Item Count
  - Current Status

- **Status Update Dropdown**:
  - Pending
  - Processing
  - Shipped (auto-generates tracking number)
  - Delivered (auto-records delivery date)
  - Cancelled
  - Delayed

- **Tracking Number Display** (when available)

### **Users Tab**
- **User Table** with:
  - Name
  - Email
  - Phone Number
  - Role Badge (Admin/User)
  - Total Orders
  - Total Spent (₹)

### **Products Tab**
- **Product List** with:
  - Product Name
  - Brand & Category
  - Price (₹)
  - Stock (editable)
  - Stock Status Badge

- **Real-time Stock Update**:
  - Click on stock number
  - Enter new value
  - Auto-saves on change

---

## 🔧 **API Endpoints**

### **Admin Dashboard**
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "totalUsers": 15,
  "totalOrders": 42,
  "totalProducts": 90,
  "totalRevenue": 1250000,
  "pendingOrders": 5,
  "processingOrders": 8,
  "shippedOrders": 12,
  "deliveredOrders": 15,
  "recentOrders": [...]
}
```

### **Get All Orders (Admin)**
```http
GET /api/admin/orders?status={status}&page={page}&pageSize={pageSize}
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)

### **Get Order Details (Admin)**
```http
GET /api/admin/orders/{id}
Authorization: Bearer {admin_token}
```

### **Update Order Status (Admin)**
```http
PUT /api/admin/orders/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "Shipped",
  "trackingNumber": "TRK202601310001"
}
```

### **Get All Users (Admin)**
```http
GET /api/admin/users?page={page}&pageSize={pageSize}
Authorization: Bearer {admin_token}
```

### **Get All Products (Admin)**
```http
GET /api/admin/products?category={category}&page={page}&pageSize={pageSize}
Authorization: Bearer {admin_token}
```

### **Update Product Stock (Admin)**
```http
PUT /api/admin/products/{id}/stock
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "stock": 50
}
```

### **Update Product Price (Admin)**
```http
PUT /api/admin/products/{id}/price
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 79999
}
```

---

## 🎨 **Admin UI Features**

### **Sidebar Navigation**
- **Fixed Sidebar** with:
  - Dashboard
  - Orders
  - Users
  - Products
  - Logout Button

- **Active Tab Highlighting**
- **Smooth Transitions**

### **Color Coding**
- **Revenue**: Green (#10b981)
- **Orders**: Blue (#3b82f6)
- **Users**: Purple (#8b5cf6)
- **Products**: Orange (#f59e0b)

### **Status Badges**
- **Pending**: Orange
- **Processing**: Blue
- **Shipped**: Purple
- **Delivered**: Green
- **Cancelled**: Red
- **Delayed**: Orange

### **Stock Status**
- **In Stock**: Green (> 10 items)
- **Low Stock**: Orange (1-10 items)
- **Out of Stock**: Red (0 items)

---

## 🔐 **Security Features**

### **Role-Based Authorization**
- All admin endpoints require `[Authorize(Roles = "Admin")]`
- Frontend checks user role before allowing access
- Automatic redirect to login if not admin

### **JWT Token Validation**
- Admin token includes role claim
- Token validated on every API request
- Expired tokens automatically rejected

### **Protected Routes**
- `/admin/login` - Public (admin login)
- `/admin/dashboard` - Protected (admin only)

---

## 📝 **Admin Workflow Examples**

### **1. Process a New Order**
```
1. Login to admin panel
2. Go to "Orders" tab
3. Find the pending order
4. Change status to "Processing"
5. Order status updates in database
6. Customer sees updated status in "My Orders"
```

### **2. Ship an Order**
```
1. Go to "Orders" tab
2. Find the processing order
3. Change status to "Shipped"
4. Tracking number auto-generated
5. Shipped date recorded
6. Customer receives tracking number
```

### **3. Update Product Stock**
```
1. Go to "Products" tab
2. Find the product
3. Click on stock number
4. Enter new stock value
5. Stock updates immediately
6. Customers see updated availability
```

### **4. View Customer Details**
```
1. Go to "Users" tab
2. View customer list
3. See total orders and spending
4. Identify top customers
```

---

## 🎯 **Admin Capabilities**

### **What Admins Can Do:**
✅ View all orders from all users
✅ Update order status
✅ Generate tracking numbers
✅ View all user accounts
✅ See customer purchase history
✅ Manage product inventory
✅ Update product prices
✅ View revenue statistics
✅ Monitor order pipeline
✅ Track stock levels

### **What Admins Cannot Do (Yet):**
❌ Delete users
❌ Delete orders
❌ Add new products (use database seeding)
❌ Edit product details (name, description)
❌ Send notifications to users
❌ Generate reports/invoices
❌ View analytics charts

---

## 🚀 **Quick Start Guide**

### **1. Access Admin Panel**
```
1. Open browser: http://localhost:5173/admin/login
2. Enter credentials:
   - Email: admin@smartkartstore.com
   - Password: Admin@123
3. Click "Login to Dashboard"
```

### **2. Navigate Dashboard**
```
1. View statistics on Dashboard tab
2. Click "Orders" to manage orders
3. Click "Users" to view customers
4. Click "Products" to manage inventory
```

### **3. Update Order Status**
```
1. Go to Orders tab
2. Select order
3. Choose new status from dropdown
4. Status updates automatically
```

### **4. Manage Stock**
```
1. Go to Products tab
2. Find product
3. Edit stock number
4. Press Enter or click away to save
```

---

## 🔄 **Order Status Flow**

```
Pending → Processing → Shipped → Delivered
            ↓
        Cancelled
            ↓
         Delayed
```

### **Status Descriptions:**
- **Pending**: Order placed, awaiting processing
- **Processing**: Order being prepared
- **Shipped**: Order dispatched (tracking number generated)
- **Delivered**: Order successfully delivered
- **Cancelled**: Order cancelled
- **Delayed**: Order delayed in transit

---

## 💡 **Pro Tips**

1. **Bulk Status Updates**: Process multiple orders by quickly changing status
2. **Stock Monitoring**: Check "Low Stock" products regularly
3. **Revenue Tracking**: Monitor total revenue on dashboard
4. **Customer Insights**: Use Users tab to identify VIP customers
5. **Order Pipeline**: Track pending/processing orders to manage workload

---

## 🐛 **Troubleshooting**

### **Can't Access Admin Panel?**
- Ensure you're using admin credentials
- Check if backend is running on port 5252
- Clear browser cache and try again

### **Not Seeing Orders?**
- Ensure users have placed orders
- Check if backend database is populated
- Verify API endpoint is responding

### **Stock Update Not Working?**
- Ensure you're logged in as admin
- Check network tab for API errors
- Verify backend is running

---

## 📚 **Related Documentation**

- **Main README**: `README.md`
- **Order System**: `ORDER_SYSTEM.md`
- **Complete Guide**: `IMPLEMENTATION_COMPLETE.md`
- **Quick Start**: `QUICK_START.md`

---

## 🎉 **Admin System Complete!**

Your admin panel is fully functional with:
- ✅ Secure role-based authentication
- ✅ Comprehensive dashboard
- ✅ Order management
- ✅ User management
- ✅ Product management
- ✅ Real-time updates
- ✅ Professional UI/UX

**Start managing your e-commerce store like a pro!** 🚀

---

**Built with ❤️ using React & .NET**
