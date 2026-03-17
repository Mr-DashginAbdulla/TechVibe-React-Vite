const admin = require("firebase-admin");
const path = require("path");

try {
  const serviceAccountPath = path.join(__dirname, "../../firebase-service-account.json");
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log("Firebase Admin Initialized successfully.");
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

module.exports = admin;
