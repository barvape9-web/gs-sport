import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

console.log('Connecting to:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gs-sport.com' },
    update: {},
    create: {
      name: 'GS Admin',
      email: 'admin@gs-sport.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@gs-sport.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@gs-sport.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Demo user:', user.email);

  // Products: Men's collection
  const menProducts = [
    {
      name: 'GS Pro Elite Running Jacket',
      description: 'Engineered for peak performance with moisture-wicking MoistureGuard™ fabric and reflective details for visibility.',
      price: 129.99,
      originalPrice: 179.99,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
      category: 'UPPER_WEAR' as const,
      gender: 'MEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#0ea5e9', '#1e293b', '#f97316'],
      stock: 42,
      isFeatured: true,
    },
    {
      name: 'GS Aero Training Tee',
      description: 'Ultra-lightweight training tee built for high-intensity workouts. Four-way stretch fabric keeps you moving freely.',
      price: 39.99,
      originalPrice: 54.99,
      images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600'],
      category: 'UPPER_WEAR' as const,
      gender: 'MEN' as const,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#f97316', '#ffffff', '#0f172a'],
      stock: 85,
      isFeatured: true,
    },
    {
      name: 'GS ThermoFlex Compression Pants',
      description: 'Next-generation compression pants with targeted muscle support and thermal regulation technology.',
      price: 79.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
      category: 'LOWER_WEAR' as const,
      gender: 'MEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#0f172a', '#3b82f6'],
      stock: 61,
      isFeatured: false,
    },
    {
      name: 'GS Storm Shield Winter Parka',
      description: 'Conquer the cold with this premium winter parka. PrimaLoft® insulation provides warmth without bulk.',
      price: 249.99,
      originalPrice: 329.99,
      images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600'],
      category: 'WINTER_WEAR' as const,
      gender: 'MEN' as const,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#0f172a', '#374151'],
      stock: 28,
      isFeatured: true,
    },
    {
      name: 'GS Velocity Shorts',
      description: 'Designed for speed and comfort. Lightweight, breathable fabric with built-in compression liner.',
      price: 54.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600'],
      category: 'SUMMER_WEAR' as const,
      gender: 'MEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#0ea5e9', '#f97316', '#10b981'],
      stock: 73,
      isFeatured: false,
    },
  ];

  // Products: Women's collection
  const womenProducts = [
    {
      name: 'GS FlexFit Sports Bra',
      description: 'Medium-support sports bra with FlexFit technology for all movement types. Soft, moisture-wicking fabric keeps you cool.',
      price: 49.99,
      originalPrice: 64.99,
      images: ['https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600'],
      category: 'UPPER_WEAR' as const,
      gender: 'WOMEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#ec4899', '#8b5cf6', '#000000'],
      stock: 95,
      isFeatured: true,
    },
    {
      name: 'GS PowerMove Leggings',
      description: 'High-waist PowerMove leggings with seamless construction and cloud-soft fabric. Squat-proof and supportive.',
      price: 89.99,
      originalPrice: 119.99,
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
      category: 'LOWER_WEAR' as const,
      gender: 'WOMEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#ec4899', '#0f172a', '#6d28d9'],
      stock: 112,
      isFeatured: true,
    },
    {
      name: 'GS Bliss Yoga Top',
      description: 'The perfect yoga companion. Lightweight drape-front top with built-in support and minimal seams.',
      price: 44.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1522898467493-49726bf28798?w=600'],
      category: 'UPPER_WEAR' as const,
      gender: 'WOMEN' as const,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#fce7f3', '#f97316', '#10b981'],
      stock: 67,
      isFeatured: false,
    },
    {
      name: 'GS Alpine Winter Hoodie',
      description: 'Premium fleece-lined hoodie with a brushed interior for maximum warmth during cold training sessions.',
      price: 99.99,
      originalPrice: 134.99,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
      category: 'WINTER_WEAR' as const,
      gender: 'WOMEN' as const,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#ec4899', '#f8fafc', '#7c3aed'],
      stock: 44,
      isFeatured: true,
    },
    {
      name: 'GS Breeze Running Tank',
      description: 'Ultralight running tank with open-back design and AirMesh technology for superior ventilation.',
      price: 34.99,
      originalPrice: 44.99,
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
      category: 'SUMMER_WEAR' as const,
      gender: 'WOMEN' as const,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#f9a8d4', '#ffffff', '#a5f3fc'],
      stock: 80,
      isFeatured: false,
    },
  ];

  // Unisex / accessories
  const unisexProducts = [
    {
      name: 'GS Pro Sport Cap',
      description: 'Structured performance cap with moisture-wicking sweatband and UV protection.',
      price: 29.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'],
      category: 'ACCESSORIES' as const,
      gender: 'UNISEX' as const,
      sizes: ['ONE SIZE'],
      colors: ['#0f172a', '#f97316', '#ffffff'],
      stock: 150,
      isFeatured: false,
    },
    {
      name: 'GS Training Socks (3 Pack)',
      description: 'Cushioned training socks with arch support and anti-blister construction.',
      price: 19.99,
      originalPrice: null,
      images: ['https://images.unsplash.com/photo-1576113903296-cebc85ca3b5c?w=600'],
      category: 'ACCESSORIES' as const,
      gender: 'UNISEX' as const,
      sizes: ['S/M', 'L/XL'],
      colors: ['#ffffff', '#0f172a', '#f97316'],
      stock: 200,
      isFeatured: false,
    },
  ];

  const allProducts = [...menProducts, ...womenProducts, ...unisexProducts];

  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: {},
      create: {
        id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? undefined,
        images: product.images,
        category: product.category,
        gender: product.gender,
        sizes: product.sizes,
        colors: product.colors,
        stock: product.stock,
        isFeatured: product.isFeatured,
      },
    });
  }

  console.log(`✅ Created ${allProducts.length} products`);

  // Default theme
  await prisma.siteTheme.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#f97316',
      secondaryColor: '#10b981',
      accentColor: '#8b5cf6',
      isDarkMode: true,
    },
  });
  console.log('✅ Created default theme');

  console.log('\n🎉 Seeding complete!\n');
  console.log('Demo accounts:');
  console.log('  Admin: admin@gs-sport.com / admin123');
  console.log('  User:  user@gs-sport.com / user123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
