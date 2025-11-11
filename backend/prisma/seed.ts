import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  // Créer un admin SUPER_ADMIN par défaut
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@spotlightlover.com' },
    update: {},
    create: {
      email: 'admin@spotlightlover.com',
      password: hashedPassword,
      name: 'Admin Principal',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ SUPER_ADMIN créé:', superAdmin.email);

  // Créer un moderator par défaut
  const moderator = await prisma.admin.upsert({
    where: { email: 'moderator@spotlightlover.com' },
    update: {},
    create: {
      email: 'moderator@spotlightlover.com',
      password: hashedPassword,
      name: 'Modérateur',
      role: 'MODERATOR',
      isActive: true,
    },
  });

  console.log('✅ MODERATOR créé:', moderator.email);

  // Créer quelques candidats de test
  const candidate1 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Kouadio',
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
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Mamadou Diallo',
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
    },
  });

  const candidate3 = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Fatou Ndiaye',
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
    },
  });

  console.log('✅ Candidats de test créés:', [candidate1.name, candidate2.name, candidate3.name]);

  // Créer un candidat en attente
  const pendingCandidate = await prisma.candidate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Koffi Mensah',
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

  console.log('✅ Candidat PENDING créé:', pendingCandidate.name);

  console.log('');
  console.log('🎉 Seed terminé avec succès !');
  console.log('');
  console.log('📧 Comptes admin créés :');
  console.log('   Email: admin@spotlightlover.com');
  console.log('   Email: moderator@spotlightlover.com');
  console.log('   Password: Admin123!');
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
