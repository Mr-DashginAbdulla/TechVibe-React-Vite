require("dotenv").config();
const mongoose = require("mongoose");
const firebaseAdmin = require("./config/firebase-admin");
const User = require("./models/User");

const SUPER_ADMIN_EMAIL = "superadmin@techvibe.com";
const SUPER_ADMIN_PASSWORD = "superadmin123";

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB-yə qoşuldu.");

    let firebaseUser;
    
    // 1. Check if user exists in Firebase Admin
    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(SUPER_ADMIN_EMAIL);
      console.log("Firebase hesabı artıq mövcuddur. Parol yenilənir...");
      await firebaseAdmin.auth().updateUser(firebaseUser.uid, { password: SUPER_ADMIN_PASSWORD });
    } catch (error) {
       if (error.code === 'auth/user-not-found') {
          console.log("Firebase-də yeni Super Admin hesabı yaradılır...");
          firebaseUser = await firebaseAdmin.auth().createUser({
            email: SUPER_ADMIN_EMAIL,
            password: SUPER_ADMIN_PASSWORD,
            displayName: "Super Admin",
            emailVerified: true
          });
       } else {
          throw error;
       }
    }

    // 2. Check if user exists in MongoDB
    let dbUser = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (dbUser) {
        console.log("MongoDB-də hesab artıq mövcuddur. Rolu 'super-admin' olaraq güncəllənir...");
        dbUser.role = "super-admin";
        dbUser.firebaseUid = firebaseUser.uid; 
        dbUser.isVerified = true;
        await dbUser.save();
    } else {
        console.log("MongoDB-də Super Admin hesabı yaradılır...");
        dbUser = await User.create({
            firebaseUid: firebaseUser.uid,
            firstName: "Super",
            lastName: "Admin",
            email: SUPER_ADMIN_EMAIL,
            role: "super-admin",
            isVerified: true,
            memberSince: new Date().toISOString()
        });
    }

    console.log("\n✅ Super Admin hesabı uğurla yaradıldı!");
    console.log("Məlumatlar:");
    console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`Parol: ${SUPER_ADMIN_PASSWORD}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("Xəta baş verdi:", error);
    process.exit(1);
  }
}

createSuperAdmin();
