const { PrismaClient, UserType } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Création du compte administrateur (UserType.ADMIN)...\n');
  
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  // Créer ou mettre à jour l'admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@spotlightlover.cm' },
    update: {},
    create: {
      email: 'admin@spotlightlover.cm',
      name: 'Admin Principal',
      phone: '+237600000000',
      password: hashedPassword,
      userType: UserType.ADMIN,
      isActive: true,
    }
  });
  
  console.log('✅ Admin créé avec succès !');
  console.log(`   ID       : ${admin.id}`);
  console.log(`   Email    : ${admin.email}`);
  console.log(`   Nom      : ${admin.name}`);
  console.log(`   Phone    : ${admin.phone}`);
  console.log(`   UserType : ${admin.userType}\n`);
  console.log('🔑 Credentials:');
  console.log('   Email    : admin@spotlightlover.cm');
  console.log('   Password : Admin123!\n');
  console.log('🌐 URL Login : http://localhost:5173/login\n');
  console.log('🎯 Admin Dashboard : http://localhost:5173/admin\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
