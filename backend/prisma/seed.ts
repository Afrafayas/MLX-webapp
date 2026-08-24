import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MongoDB Atlas for Cbez B2C...');

  // Delete existing documents
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Seller User
  const sellerUser = await prisma.user.create({
    data: {
      email: 'seller@cbez.com',
      password: hashedPassword,
      name: 'Rahul Electronics Owner',
      phone: '+91 9876543210',
      role: 'seller',
    },
  });

  // 2. Create Customer User
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@cbez.com',
      password: hashedPassword,
      name: 'Anjali Nair',
      phone: '+91 9123456789',
      role: 'customer',
    },
  });

  // 3. Create Shop linked to Seller User
  const shop = await prisma.shop.create({
    data: {
      name: 'Rahul Electronics & Mobiles',
      ownerName: sellerUser.name,
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210',
      address: 'MG Road, Commercial Complex, Bay #4',
      city: 'Kochi',
      category: 'Electronics',
      verified: true,
      rating: 4.8,
      ownerId: sellerUser.id,
    },
  });

  // 4. Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max 256GB Natural Titanium',
      brand: 'Apple',
      category: 'Smartphones',
      description: 'Brand new sealed Indian unit with 1-year Apple Care warranty.',
      price: 134900,
      stock: 5,
      specsJson: JSON.stringify({ Storage: '256GB', Color: 'Natural Titanium', Warranty: '1 Year' }),
      imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800']),
      shopId: shop.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra 5G 512GB',
      brand: 'Samsung',
      category: 'Smartphones',
      description: 'AI powered flagship phone with S-Pen included.',
      price: 129999,
      stock: 8,
      specsJson: JSON.stringify({ Storage: '512GB', RAM: '12GB', Camera: '200MP' }),
      imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800']),
      shopId: shop.id,
    },
  });

  // 5. Create Lead
  await prisma.lead.create({
    data: {
      shopId: shop.id,
      productId: p1.id,
      productName: p1.name,
      customerName: customerUser.name,
      customerPhone: customerUser.phone || '+91 9123456789',
      contactType: 'whatsapp',
    },
  });

  console.log('✅ MongoDB Atlas Seeding Successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
