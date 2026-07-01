const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read connection string from .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const mongoUriLine = envContent.split('\n').find(line => line.trim().startsWith('MONGODB_URI='));
const mongoUri = mongoUriLine ? mongoUriLine.substring(mongoUriLine.indexOf('=') + 1).trim() : null;

if (!mongoUri) {
  console.error("MONGODB_URI not found in .env file.");
  process.exit(1);
}

// Define Lead Schema to interact with MongoDB
const leadSchema = new mongoose.Schema({
  website: String,
  gmbLink: String,
  socials: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String,
    youtube: String
  }
}, { strict: false });

const Lead = mongoose.model('Lead', leadSchema);

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Count total leads
    const totalLeads = await Lead.countDocuments();
    console.log(`Total leads in database: ${totalLeads}`);

    // Update leads missing website
    const websiteRes = await Lead.updateMany(
      { website: { $exists: false } },
      { $set: { website: "" } }
    );
    console.log(`Updated website field for ${websiteRes.modifiedCount} leads.`);

    // Update leads missing gmbLink
    const gmbRes = await Lead.updateMany(
      { gmbLink: { $exists: false } },
      { $set: { gmbLink: "" } }
    );
    console.log(`Updated gmbLink field for ${gmbRes.modifiedCount} leads.`);

    // Update leads missing socials parent object
    const socialsRes = await Lead.updateMany(
      { socials: { $exists: false } },
      { $set: { socials: { facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "" } } }
    );
    console.log(`Initialized socials object for ${socialsRes.modifiedCount} leads.`);

    // If socials exists, but some subfields are missing, fill them with empty strings
    const nestedRes = await Lead.updateMany(
      { socials: { $exists: true }, "socials.facebook": { $exists: false } },
      { $set: { 
        "socials.facebook": "",
        "socials.instagram": "",
        "socials.linkedin": "",
        "socials.twitter": "",
        "socials.youtube": ""
      } }
    );
    console.log(`Fixed missing nested social fields for ${nestedRes.modifiedCount} leads.`);

    console.log("Database backfill migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
