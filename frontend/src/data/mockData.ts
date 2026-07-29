import { Shop, Product } from '../types';

export const INITIAL_SHOPS: Shop[] = [
  {
    id: "shop-1",
    name: "Tech World Dealers",
    ownerName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "Shop 42, Ground Floor, Nehru Place",
    city: "New Delhi",
    category: "Mobiles & Tablets",
    verified: true,
    rating: 4.9,
    joinedDate: "Feb 2024"
  },
  {
    id: "shop-2",
    name: "Apex Electronics",
    ownerName: "Vikram Mehta",
    phone: "+91 98123 45678",
    whatsapp: "919812345678",
    address: "102, Lamington Road, Grant Road",
    city: "Mumbai",
    category: "Laptops & Accessories",
    verified: true,
    rating: 4.7,
    joinedDate: "Nov 2023"
  },
  {
    id: "shop-3",
    name: "Sri Balaji Gadgets",
    ownerName: "S. Srinivasan",
    phone: "+91 99400 12345",
    whatsapp: "919940012345",
    address: "Shop 15, Ritchie Street, Mount Road",
    city: "Chennai",
    category: "All Tech Products",
    verified: true,
    rating: 4.8,
    joinedDate: "May 2024"
  },
  {
    id: "shop-4",
    name: "Alpha Wearables",
    ownerName: "Amit Shah",
    phone: "+91 90001 90002",
    whatsapp: "919000190002",
    address: "S-5, 2nd Floor, SP Road",
    city: "Bengaluru",
    category: "Smart Watches & Audio",
    verified: false,
    rating: 4.2,
    joinedDate: "Jan 2025"
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "iPhone 17 Pro (Grade A)",
    brand: "Apple",
    category: "Mobiles",
    description: "128GB, Space Grey. Mint condition, tested and graded A. Battery health 98%. Comes with original box and cable. Ideal for immediate resale. Bulk inquiries welcome.",
    price: 112000,
    stock: 8,
    shopId: "shop-1",
    specs: {
      "Storage": "128GB",
      "Color": "Space Grey",
      "Condition": "Grade A (Like New)",
      "Battery Health": "98%",
      "Box & Cable": "Included"
    },
    images: [
      "/images/iphone_17_pro_1.png",
      "/images/iphone_17_pro_2.png"
    ]
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Mobiles",
    description: "256GB, Titanium Gray. Dual Sim, Indian unit. 6 months brand warranty remaining. Box and bill available. Minimal micro-scratches on side frame, screen is 100% scratch-free.",
    price: 94000,
    stock: 5,
    shopId: "shop-1",
    specs: {
      "Storage": "256GB",
      "Color": "Titanium Gray",
      "Condition": "Grade A- (Excellent)",
      "Warranty": "6 Months Remaining",
      "Bill & Box": "Available"
    },
    images: [
      "/images/s24_ultra_1.png"
    ]
  },
  {
    id: "prod-3",
    name: "MacBook Air M3 13-inch",
    brand: "Apple",
    category: "Laptops",
    description: "8GB Unified Memory, 256GB SSD, 8-Core CPU and 8-Core GPU. Space Grey, Indian Retail unit, sealed in box. 1 year Apple official warranty. Perfect wholesale stock for shops looking to fulfill direct customer orders.",
    price: 88500,
    stock: 4,
    shopId: "shop-2",
    specs: {
      "Processor": "Apple M3 Chip",
      "RAM": "8GB Unified Memory",
      "Storage": "256GB SSD",
      "Warranty": "1 Year Official Apple Warranty",
      "Condition": "Brand New (Sealed)"
    },
    images: [
      "/images/macbook_air_m3.png"
    ]
  },
  {
    id: "prod-4",
    name: "Dell Latitude 7420",
    brand: "Dell",
    category: "Laptops",
    description: "Intel Core i5 11th Gen, 16GB RAM, 512GB SSD. Corporate refurb, fully clean keyboard and trackpad. Battery backup 4+ hours. 3 months shop warranty provided. Great value laptop for corporate client requirements.",
    price: 32000,
    stock: 15,
    shopId: "shop-2",
    specs: {
      "Processor": "Intel Core i5-1145G7",
      "RAM": "16GB DDR4",
      "Storage": "512GB NVMe SSD",
      "Condition": "Grade A Refurbished",
      "Warranty": "3 Months Seller Warranty"
    },
    images: [
      "/images/dell_latitude.png"
    ]
  },
  {
    id: "prod-5",
    name: "OnePlus Nord Buds 2",
    brand: "OnePlus",
    category: "Accessories",
    description: "Lightning White color, active noise cancellation. Wholesale pack. Minimum order quantity: 2 units. Fully sealed brand new retail box.",
    price: 1850,
    stock: 25,
    shopId: "shop-3",
    specs: {
      "Color": "Lightning White",
      "ANC": "Yes (Up to 25dB)",
      "Condition": "Brand New (Sealed)",
      "MOQ": "2 Units"
    },
    images: [
      "/images/nord_buds_2.png"
    ]
  },
  {
    id: "prod-6",
    name: "Apple Watch Ultra 2 (Refurb)",
    brand: "Apple",
    category: "Smart Watches",
    description: "Titanium Case with Blue Ocean Band. Minor signs of wear on casing, sapphire crystal display has zero marks. Comes with charging dock and compatible high-quality box. 100% functional, tested by our engineers.",
    price: 52000,
    stock: 2,
    shopId: "shop-4",
    specs: {
      "Case": "Titanium",
      "Band": "Blue Ocean Band",
      "Condition": "Grade B (Minor Wear)",
      "Battery Health": "92%",
      "Functions": "100% Tested"
    },
    images: [
      "/images/watch_ultra_2.png"
    ]
  },
  {
    id: "prod-7",
    name: "Samsung Galaxy Tab S9 FE",
    brand: "Samsung",
    category: "Tablets",
    description: "128GB, Gray. Wi-Fi variant. Box opened for demonstration purposes, never used. S-Pen and original charging cable included. Indian retail stock with bill.",
    price: 29500,
    stock: 3,
    shopId: "shop-3",
    specs: {
      "Storage": "128GB",
      "S-Pen": "Included",
      "Condition": "Open Box (Like New)",
      "Color": "Gray",
      "Network": "Wi-Fi Only"
    },
    images: [
      "/images/tab_s9_fe.png"
    ]
  }
];

export const CATEGORIES = [
  "All Categories",
  "Mobiles",
  "Laptops",
  "Accessories",
  "Tablets",
  "Smart Watches"
];
