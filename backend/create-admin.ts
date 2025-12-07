import { PrismaClient, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Création du compte administrateur...\n');

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.admin.findFirst({
      where: { role: AdminRole.SUPER_ADMIN }
    });

    if (existingAdmin) {
      console.log('⚠️  Un compte SUPER_ADMIN existe déjà :');
      console.log(`   Email : ${existingAdmin.email}`);
      console.log(`   Nom   : ${existingAdmin.name}`);
      console.log(`   ID    : ${existingAdmin.id}\n`);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Voulez-vous créer un autre admin ? (oui/non) : ', async (answer) => {
        if (answer.toLowerCase() !== 'oui') {
          console.log('\n✅ Opération annulée');
          readline.close();
          await prisma.$disconnect();
          process.exit(0);
        }
        readline.close();
        await promptAdminDetails();
      });
    } else {
      await promptAdminDetails();
    }
  } catch (error) {
    console.error('❌ Erreur :', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function promptAdminDetails() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query: string): Promise<string> => {
    return new Promise(resolve => {
      readline.question(query, resolve);
    });
  };

  try {
    console.log('\n📝 Informations du compte admin :');
    const email = await question('Email : ');
    const name = await question('Nom complet : ');
    const password = await question('Mot de passe : ');
    const roleChoice = await question('Role (1=SUPER_ADMIN, 2=MODERATOR) [1]: ');

    const role = roleChoice === '2' ? AdminRole.MODERATOR : AdminRole.SUPER_ADMIN;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        isActive: true,
      }
    });

    console.log('\n✅ Compte admin créé avec succès !');
    console.log(`   ID    : ${admin.id}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Nom   : ${admin.name}`);
    console.log(`   Role  : ${admin.role}`);
    console.log('\n🚀 Vous pouvez maintenant vous connecter à /admin\n');

    readline.close();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors de la création :', error);
    readline.close();
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
