
import { Product, ProductCategory, User, Order } from './types';

export const APP_NAME = "SAR Legacy";
export const FACEBOOK_PIXEL_ID = "123456789012345"; // Placeholder: Replace with actual Pixel ID
export const CURRENCY = "USD";

export const MOCK_USERS: User[] = [
    {
        id: 1,
        name: "Alex Chen",
        email: "alex.c@sar-legacy.net",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        isAdmin: false,
        memberSince: "September 2042",
        rank: "Elite",
        credits: 2450,
        tierProgress: 75,
        lastLogin: "2044-10-28T10:00:00Z",
        totalSpent: 1250.50
    },
    {
        id: 2,
        name: "Admin User",
        email: "admin@sar-legacy.net",
        avatar: "https://i.pravatar.cc/150?u=admin",
        isAdmin: true,
        memberSince: "January 2040",
        lastLogin: "2044-10-28T12:00:00Z",
        totalSpent: 0
    },
    {
        id: 3,
        name: "Jane Doe",
        email: "jane.d@example.com",
        avatar: "https://i.pravatar.cc/150?u=jane",
        isAdmin: false,
        memberSince: "March 2043",
        lastLogin: "2044-10-25T18:30:00Z",
        totalSpent: 890.00,
        rank: "Pro",
        credits: 1500,
        tierProgress: 45,
    }
];

// Using seeded picsum images for consistency
// Added sample videos from Google's public test bucket to simulate product demos
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Quantum Noise-Canceling Headphones",
    price: 299.99,
    category: ProductCategory.ELECTRONICS,
    image: "https://picsum.photos/id/1/600/600", // Generic tech
    description: "Immersive sound with next-gen active noise cancellation and 40-hour battery life.",
    rating: 4.8,
    featured: true,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    stock: 50,
    tags: ["audio", "wireless", "premium"]
  },
  {
    id: 2,
    name: "Cyberpunk Streetwear Jacket",
    price: 120.00,
    category: ProductCategory.FASHION,
    image: "https://picsum.photos/id/2/600/600", // Generic creative
    description: "Water-resistant, reflective material designed for the urban explorer.",
    rating: 4.5,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    stock: 120,
    tags: ["fashion", "techwear", "jacket"]
  },
  {
    id: 3,
    name: "Minimalist Smart Watch",
    price: 199.50,
    category: ProductCategory.ELECTRONICS,
    image: "https://picsum.photos/id/3/600/600",
    description: "Track your vitals with style. Sapphire glass display and titanium casing.",
    rating: 4.7,
    featured: true,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    stock: 75,
    tags: ["wearable", "smartwatch", "health"]
  },
  {
    id: 4,
    name: "Ergonomic Mechanical Keyboard",
    price: 149.99,
    category: ProductCategory.ELECTRONICS,
    image: "https://picsum.photos/id/4/600/600",
    description: "Hot-swappable switches with RGB underglow for the ultimate typing experience.",
    rating: 4.9,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    stock: 3, // Low stock example
    tags: ["keyboard", "mechanical", "office"]
  },
  {
    id: 5,
    name: "Smart Home Assistant Hub",
    price: 89.99,
    category: ProductCategory.HOME,
    image: "https://picsum.photos/id/5/600/600",
    description: "Control your entire home with voice commands. Compatible with all major protocols.",
    rating: 4.3,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    stock: 80,
    tags: ["smarthome", "iot", "hub"]
  },
  {
    id: 6,
    name: "Designer Sunglasses",
    price: 180.00,
    category: ProductCategory.ACCESSORIES,
    image: "https://picsum.photos/id/6/600/600",
    description: "UV400 protection with a sleek, modern frame design.",
    rating: 4.6,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    stock: 200,
    tags: ["sunglasses", "fashion", "accessory"]
  },
  {
    id: 7,
    name: "Portable 4K Projector",
    price: 450.00,
    category: ProductCategory.ELECTRONICS,
    image: "https://picsum.photos/id/7/600/600",
    description: "Cinema quality anywhere you go. 2000 lumens brightness.",
    rating: 4.4,
    featured: true,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    stock: 25,
    tags: ["projector", "cinema", "4k"]
  },
  {
    id: 8,
    name: "Ceramic Coffee Set",
    price: 65.00,
    category: ProductCategory.HOME,
    image: "https://picsum.photos/id/8/600/600",
    description: "Handcrafted ceramic set for the perfect morning brew.",
    rating: 4.8,
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    stock: 90,
    tags: ["coffee", "kitchen", "home"]
  }
];

export const MOCK_ORDERS: Order[] = [
    { id: "SAR-9921", userId: 1, date: "Oct 12, 2044", items: [{productId: 1, name: "Quantum Noise-Canceling Headphones", quantity: 1}], total: 299.99, status: "Delivered", customerName: "Alex Chen", shippingAddress: "123 Cyber Lane, Neo-Tokyo, NT-99201" },
    { id: "SAR-8823", userId: 1, date: "Sep 28, 2044", items: [{productId: 5, name: "Smart Home Hub", quantity: 1}], total: 89.99, status: "Delivered", customerName: "Alex Chen", shippingAddress: "123 Cyber Lane, Neo-Tokyo, NT-99201" },
    { id: "SAR-7710", userId: 3, date: "Aug 15, 2044", items: [{productId: 2, name: "Cyberpunk Streetwear Jacket", quantity: 1}], total: 120.00, status: "Processing", customerName: "Jane Doe", shippingAddress: "456 Grid Run, Sector 7, AET-45112" },
    { id: "SAR-7711", userId: 3, date: "Aug 18, 2044", items: [{productId: 6, name: "Designer Sunglasses", quantity: 2}], total: 360.00, status: "Shipped", customerName: "Jane Doe", shippingAddress: "456 Grid Run, Sector 7, AET-45112" },
];


export const GEMINI_MODEL = "gemini-2.5-flash";