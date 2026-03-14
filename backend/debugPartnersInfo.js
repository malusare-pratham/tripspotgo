const PartnersInfo = require('./models/PartnersInfo');
const Partner = require('./models/Partner');
const { connectDB, disconnectDB } = require('./config/db');

const run = async () => {
  try {
    await connectDB();

    const total = await PartnersInfo.countDocuments();
    const legacyCount = await PartnersInfo.countDocuments({ menu: { $exists: true } });
    const noMenuSectionsCount = await PartnersInfo.countDocuments({ $or: [{ menuSections: { $exists: false } }, { menuSections: { $size: 0 } }] });

    const sample = await PartnersInfo.findOne({ menu: { $exists: true } }).lean();
    const recent = await PartnersInfo.findOne({}).sort({ updatedAt: -1 }).lean();

    console.log('PartnersInfo stats:', { total, legacyCount, noMenuSectionsCount });
    if (sample) {
      console.log('Legacy sample keys:', Object.keys(sample));
      console.log('Legacy sample menu:', JSON.stringify(sample.menu, null, 2));
    } else {
      console.log('No legacy menu field found in PartnersInfo documents.');
    }

    if (recent) {
      console.log('Recent document keys:', Object.keys(recent));
      console.log('Recent document menuSections:', JSON.stringify(recent.menuSections, null, 2));
    }

    if (recent?.partnerId) {
      const partner = await Partner.findById(recent.partnerId).lean();
      console.log('Recent partner id:', String(recent.partnerId));
      console.log('Recent partner email:', partner?.email || null);
    }
  } catch (error) {
    console.error(`Debug failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

run();
