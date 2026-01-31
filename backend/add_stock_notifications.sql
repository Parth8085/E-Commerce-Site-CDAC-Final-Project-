-- Create StockNotifications table
CREATE TABLE IF NOT EXISTS `StockNotifications` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Email` varchar(255) NOT NULL,
    `ProductId` int NOT NULL,
    `IsNotified` tinyint(1) NOT NULL DEFAULT 0,
    `CreatedAt` datetime(6) NOT NULL,
    `NotifiedAt` datetime(6) NULL,
    PRIMARY KEY (`Id`),
    KEY `IX_StockNotifications_ProductId` (`ProductId`),
    CONSTRAINT `FK_StockNotifications_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Set some products to out of stock (0 stock) for demonstration
-- Setting 5 products from different categories to out of stock

-- iPhone 15 Pro (Product ID 1)
UPDATE Products SET Stock = 0 WHERE Id = 1;

-- Samsung Galaxy S24 Ultra (Product ID 5)
UPDATE Products SET Stock = 0 WHERE Id = 5;

-- MacBook Pro M3 (Product ID 21)
UPDATE Products SET Stock = 0 WHERE Id = 21;

-- Dell XPS 15 (Product ID 25)
UPDATE Products SET Stock = 0 WHERE Id = 25;

-- AirPods Pro 2 (Product ID 41)
UPDATE Products SET Stock = 0 WHERE Id = 41;

-- Sony WH-1000XM5 (Product ID 43)
UPDATE Products SET Stock = 0 WHERE Id = 43;

SELECT 'StockNotifications table created and 6 products set to out of stock' AS Status;
