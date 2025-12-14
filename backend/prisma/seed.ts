import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  // 1. Créer un SUPER ADMIN (User avec userType='ADMIN')
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@spotlightlover.com' },
    update: {},
    create: {
      email: 'admin@spotlightlover.com',
      password: hashedPassword,
      name: 'Admin Principal',
      userType: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ SUPER ADMIN créé:', superAdmin.email);

  // 2. Créer un MODERATOR (User avec userType='MODERATOR')
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@spotlightlover.com' },
    update: {},
    create: {
      email: 'moderator@spotlightlover.com',
      password: hashedPassword,
      name: 'Modérateur',
      userType: 'MODERATOR',
      isActive: true,
    },
  });

  console.log('✅ MODERATOR créé:', moderator.email);

  // 3. Créer des candidats de test (User + Candidate)
  
  // Candidat 1: Alice Kouadio
  const user1 = await prisma.user.upsert({
    where: { email: 'alice.kouadio@example.cm' },
    update: {},
    create: {
      email: 'alice.kouadio@example.cm',
      name: 'Alice Kouadio',
      phone: '+225 07 01 02 03 04',
      userType: 'CANDIDATE',
      password: '',
      isActive: true,
    },
  });

  const candidate1 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: user1.id,
      age: 24,
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      bio: 'Danseuse professionnelle, passionnée de culture africaine. Mon rêve est de représenter la Côte d\'Ivoire sur la scène internationale.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      videoPublicId: 'sample',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instagramHandle: '@alice.danse',
      tiktokHandle: '@alicekdanse',
      status: 'APPROVED',
      totalVotes: 150,
      totalRevenue: 15000,
      viewCount: 1200,
      validatedAt: new Date(),
      validatedBy: superAdmin.id,
    },
  });

  // Candidat 2: Mamadou Diallo
  const user2 = await prisma.user.upsert({
    where: { email: 'mamadou.diallo@example.sn' },
    update: {},
    create: {
      email: 'mamadou.diallo@example.sn',
      name: 'Mamadou Diallo',
      phone: '+221 77 123 45 67',
      userType: 'CANDIDATE',
      password: '',
      isActive: true,
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      userId: user2.id,
      age: 27,
      country: 'Sénégal',
      city: 'Dakar',
      bio: 'Chanteur de mbalax, je veux faire découvrir la musique sénégalaise au monde entier !',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      videoPublicId: 'sample2',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instagramHandle: '@mamadou_music',
      status: 'APPROVED',
      totalVotes: 230,
      totalRevenue: 23000,
      viewCount: 2100,
      validatedAt: new Date(),
      validatedBy: superAdmin.id,
    },
  });

  // Candidat 3: Fatou Ndiaye
  const user3 = await prisma.user.upsert({
    where: { email: 'fatou.ndiaye@example.cm' },
    update: {},
    create: {
      email: 'fatou.ndiaye@example.cm',
      name: 'Fatou Ndiaye',
      phone: '+237 6 77 88 99 00',
      userType: 'CANDIDATE',
      password: '',
      isActive: true,
    },
  });

  const candidate3 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      userId: user3.id,
      age: 22,
      country: 'Cameroun',
      city: 'Douala',
      bio: 'Comédienne et humoriste. J\'adore faire rire les gens avec des sketchs sur la vie quotidienne africaine.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      videoPublicId: 'sample3',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tiktokHandle: '@fatou_humour',
      status: 'APPROVED',
      totalVotes: 89,
      totalRevenue: 8900,
      viewCount: 890,
      validatedAt: new Date(),
      validatedBy: superAdmin.id,
    },
  });

  // Candidat 4: En attente (PENDING)
  const user4 = await prisma.user.upsert({
    where: { email: 'koffi.mensah@example.tg' },
    update: {},
    create: {
      email: 'koffi.mensah@example.tg',
      name: 'Koffi Mensah',
      phone: '+228 90 11 22 33',
      userType: 'CANDIDATE',
      password: '',
      isActive: true,
    },
  });

  const pendingCandidate = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      userId: user4.id,
      age: 25,
      country: 'Togo',
      city: 'Lomé',
      bio: 'Beatboxer et rappeur. Je veux montrer le talent togolais !',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      videoPublicId: 'sample4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      status: 'PENDING',
      totalVotes: 0,
      totalRevenue: 0,
      viewCount: 45,
    },
  });

  console.log('✅ Candidats de test créés:', [
    user1.name,
    user2.name,
    user3.name,
    user4.name + ' (PENDING)',
  ]);

  console.log('');
  console.log('🎉 Seed terminé avec succès !');
  console.log('');
  console.log('📧 Comptes créés :');
  console.log('   👤 SUPER ADMIN: admin@spotlightlover.com / Admin123!');
  console.log('   👤 MODERATOR: moderator@spotlightlover.com / Admin123!');
  console.log('   🎭 Candidats: 4 (3 APPROVED, 1 PENDING)');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
