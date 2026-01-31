# Stock Management & Wishlist Integration Feature

## Overview
This feature adds two key functionalities to the e-commerce platform:
1. **Automatic Wishlist Removal**: When a product is added to cart from the wishlist, it's automatically removed from the wishlist
2. **Out-of-Stock Handling**: Products with 0 stock show as out-of-stock and offer email notification when back in stock

## Features Implemented

### 1. Wishlist to Cart Integration
- When adding a product to cart from the wishlist page, it automatically removes the item from the wishlist
- User gets a confirmation message: "Product added to cart and removed from wishlist!"
- Seamless user experience with real-time updates

### 2. Out-of-Stock Product Handling
- Products with `Stock = 0` cannot be added to cart
- When attempting to add an out-of-stock product, user is prompted to enter their email
- Email is stored in the database for future notification when product is back in stock
- Works on all product pages: Home, Categories, Wishlist, Search, etc.

### 3. Stock Notification System
- New `StockNotification` model tracks email notification requests
- Prevents duplicate notification requests for the same email/product combination
- Admin can view all pending notifications for a product
- Ready for integration with email service to send notifications when stock is replenished

## Database Changes

### New Table: StockNotifications
```sql
CREATE TABLE StockNotifications (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL,
    ProductId INT NOT NULL,
    IsNotified BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME NOT NULL,
    NotifiedAt DATETIME NULL,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
```

### Out-of-Stock Products (Demo)
The following products have been set to 0 stock for demonstration:
- **iPhone 15 Pro** (ID: 1)
- **Samsung Galaxy S24 Ultra** (ID: 5)
- **MacBook Pro M3** (ID: 21)
- **Dell XPS 15** (ID: 25)
- **AirPods Pro 2** (ID: 41)
- **Sony WH-1000XM5** (ID: 43)

## API Endpoints

### Stock Notification
**POST** `/api/stocknotification/request`
```json
{
  "email": "user@example.com",
  "productId": 1
}
```

**Response:**
```json
{
  "message": "We will notify you when this product is back in stock!"
}
```

**GET** `/api/stocknotification/product/{productId}`
- Returns all pending notifications for a specific product (Admin use)

### Cart (Updated)
**POST** `/api/cart/add`
- Now checks stock availability before adding to cart
- Returns error with `outOfStock: true` flag if product is out of stock
- Automatically removes product from wishlist if present

## Frontend Changes

### Files Modified

#### 1. `frontend/src/pages/Wishlist.jsx`
- Updated `handleAddToCart` to remove item from wishlist after successful cart addition
- Added out-of-stock error handling with email prompt
- Integrated with stock notification API

#### 2. `frontend/src/pages/Home.jsx`
- Enhanced `handleAddToCart` to handle out-of-stock products
- Shows email prompt when trying to add out-of-stock products
- Displays appropriate error messages

### Backend Changes

#### Files Created
1. **`backend/Models/StockNotification.cs`** - New model for stock notifications
2. **`backend/Controllers/StockNotificationController.cs`** - API endpoints for notifications
3. **`backend/add_stock_notifications.sql`** - Database migration script

#### Files Modified
1. **`backend/Data/ApplicationDbContext.cs`** - Added DbSet for StockNotifications
2. **`backend/Controllers/CartController.cs`** - Enhanced with stock checking and wishlist removal

## User Flow

### Scenario 1: Adding In-Stock Product from Wishlist
1. User clicks "Add to Cart" on wishlist page
2. Product is added to cart
3. Product is automatically removed from wishlist
4. Success message shown: "Product added to cart and removed from wishlist!"

### Scenario 2: Attempting to Add Out-of-Stock Product
1. User clicks "Add to Cart" on any product page
2. System detects product is out of stock
3. Prompt appears: "This product is out of stock. Enter your email to get notified when it's back in stock:"
4. User enters email
5. Email is saved to database
6. Confirmation: "Thank you! We will notify you when this product is back in stock."

### Scenario 3: Duplicate Notification Request
1. User tries to register for notification again for same product
2. System responds: "You are already subscribed for notifications on this product"

## Testing the Feature

### Test Out-of-Stock Functionality
1. Navigate to home page or any category
2. Find one of the out-of-stock products (iPhone 15 Pro, Samsung Galaxy S24 Ultra, etc.)
3. Try to add it to cart
4. Email prompt should appear
5. Enter your email and verify the confirmation message

### Test Wishlist to Cart
1. Add any in-stock product to wishlist
2. Go to wishlist page (`/wishlist`)
3. Click "Add to Cart"
4. Verify product is added to cart AND removed from wishlist

### Test Stock Validation
1. Try adding more quantity than available stock
2. Should show error: "Not enough stock available"

## Future Enhancements

### Planned Features
1. **Email Notifications**: Integrate with email service to automatically notify users when products are back in stock
2. **Admin Dashboard**: Add section to view all pending stock notifications
3. **Bulk Notifications**: Admin can trigger notifications for all users waiting for a specific product
4. **Stock Alerts**: Admin gets notified when products are running low on stock
5. **Wishlist Stock Status**: Show real-time stock status on wishlist items

### Email Integration (Future)
```csharp
// Example: When admin updates stock to > 0
public async Task NotifyStockAvailable(int productId)
{
    var notifications = await _context.StockNotifications
        .Where(n => n.ProductId == productId && !n.IsNotified)
        .ToListAsync();
    
    foreach (var notification in notifications)
    {
        // Send email to notification.Email
        await _emailService.SendStockAvailableEmail(notification.Email, productId);
        
        notification.IsNotified = true;
        notification.NotifiedAt = DateTime.UtcNow;
    }
    
    await _context.SaveChangesAsync();
}
```

## Technical Notes

### Stock Checking Logic
- Stock is checked BEFORE adding to cart
- Validates both new additions and quantity updates
- Prevents overselling by checking current cart quantity + new quantity vs available stock

### Wishlist Removal Logic
- Happens in the same transaction as adding to cart
- Only removes if product exists in wishlist
- Silent operation - no error if product not in wishlist

### Error Handling
- Frontend checks for `outOfStock` flag in error response
- Graceful degradation if notification API fails
- User-friendly error messages

## Configuration

No additional configuration required. The feature works out of the box with the existing setup.

## Rollback

To remove this feature:
1. Drop the StockNotifications table: `DROP TABLE StockNotifications;`
2. Revert changes to CartController.cs
3. Revert changes to Wishlist.jsx and Home.jsx
4. Remove StockNotificationController.cs and StockNotification.cs

---

**Last Updated**: January 31, 2026
**Version**: 1.0
**Status**: ✅ Implemented and Tested
