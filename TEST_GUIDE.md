# Quick Test Guide - New Features

## 🎯 Testing Stock Management & Wishlist Integration

### Feature 1: Wishlist to Cart Auto-Removal

**Steps:**
1. Login to your account
2. Add any **in-stock** product to your wishlist (click the heart icon)
3. Navigate to **Wishlist** page (click heart icon in navbar)
4. Click **"Add to Cart"** button on any wishlist item
5. ✅ **Expected Result**: 
   - Product is added to cart
   - Product is automatically removed from wishlist
   - Message: "Product added to cart and removed from wishlist!"

---

### Feature 2: Out-of-Stock Product Handling

**Out-of-Stock Products (for testing):**
- iPhone 15 Pro
- Samsung Galaxy S24 Ultra
- MacBook Pro M3
- Dell XPS 15
- AirPods Pro 2
- Sony WH-1000XM5

**Steps:**
1. Go to **Home** page or browse categories
2. Find one of the out-of-stock products listed above
3. Click **"Add to Cart"**
4. ✅ **Expected Result**: 
   - Popup appears: "This product is out of stock. Enter your email to get notified when it's back in stock:"
5. Enter your email address (e.g., `test@example.com`)
6. Click OK
7. ✅ **Expected Result**: 
   - Message: "Thank you! We will notify you when this product is back in stock."

**Test Duplicate Request:**
1. Try to add the same out-of-stock product again
2. Enter the same email
3. ✅ **Expected Result**: 
   - Message: "You are already subscribed for notifications on this product"

---

### Feature 3: Stock Validation

**Steps:**
1. Find a product with limited stock
2. Add it to cart multiple times (more than available stock)
3. ✅ **Expected Result**: 
   - Error: "Not enough stock available"

---

## 🔍 Where to Test

### Pages with Out-of-Stock Handling:
- ✅ Home page (`/`)
- ✅ Category pages (`/mobiles`, `/laptops`, `/accessories`)
- ✅ Search results (`/search`)
- ✅ Wishlist page (`/wishlist`)
- ✅ Product details page (if implemented)

### Wishlist Integration:
- ✅ Wishlist page (`/wishlist`)

---

## 📊 Verify in Database

You can verify the stock notifications in the database:

```sql
-- View all stock notification requests
SELECT * FROM StockNotifications;

-- View notifications for a specific product
SELECT * FROM StockNotifications WHERE ProductId = 1;

-- View out-of-stock products
SELECT Id, Name, Stock FROM Products WHERE Stock = 0;
```

---

## 🐛 Troubleshooting

### Issue: "Add to Cart" doesn't show email prompt for out-of-stock products
- **Solution**: Make sure the backend is running and the database has been updated with the SQL script

### Issue: Product not removed from wishlist
- **Solution**: Refresh the page or check browser console for errors

### Issue: Database error
- **Solution**: Make sure the StockNotifications table was created successfully:
  ```bash
  Get-Content add_stock_notifications.sql | mysql -u root -pParth@123 ecommerce_db
  ```

---

## ✅ Success Checklist

- [ ] Can add in-stock products from wishlist to cart
- [ ] Products are automatically removed from wishlist when added to cart
- [ ] Out-of-stock products show email prompt
- [ ] Email notifications are saved to database
- [ ] Duplicate notification requests are prevented
- [ ] Stock validation works (can't add more than available)
- [ ] All pages handle out-of-stock products correctly

---

**Happy Testing! 🚀**
