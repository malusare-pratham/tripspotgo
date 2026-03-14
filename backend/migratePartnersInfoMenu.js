const PartnersInfo = require('./models/PartnersInfo');
const { connectDB, disconnectDB } = require('./config/db');

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }
  return [];
};

const toObject = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  }
  return null;
};

const mapLegacyMenuToSections = (menu) => {
  const legacyMenu = toObject(menu);
  if (!legacyMenu) return [];

  const buckets = [
    { key: 'vegMenu', name: 'Veg Menu' },
    { key: 'nonVegMenu', name: 'Non-Veg Menu' },
    { key: 'cafeMenu', name: 'Cafe Menu' }
  ];

  const normalizeItem = (item) => {
    const entry = item && typeof item === 'object' ? item : {};
    const name = String(entry.name || entry.title || '').trim();
    const description = String(entry.description || entry.desc || '').trim();
    const priceRaw = entry.price ?? entry.amount ?? entry.rate;
    const price = Number(priceRaw);
    const image = String(entry.image || entry.img || entry.photo || '').trim();

    if (!name) return null;
    return {
      name,
      description,
      price: Number.isFinite(price) ? price : 0,
      image
    };
  };

  return buckets.map((bucket) => {
    const items = toArray(legacyMenu[bucket.key])
      .map(normalizeItem)
      .filter(Boolean);
    return { name: bucket.name, items };
  }).filter((section) => section.items.length);
};

const run = async () => {
  try {
    await connectDB();

    const docs = await PartnersInfo.find({ menu: { $exists: true } }).lean();
    let migrated = 0;

    for (const doc of docs) {
      if (Array.isArray(doc.menuSections) && doc.menuSections.length) {
        await PartnersInfo.updateOne({ _id: doc._id }, { $unset: { menu: 1 } });
        continue;
      }

      const menuSections = mapLegacyMenuToSections(doc.menu);
      await PartnersInfo.updateOne(
        { _id: doc._id },
        { $set: { menuSections }, $unset: { menu: 1 } }
      );
      migrated += 1;
    }

    console.log(`Migrated ${migrated} PartnersInfo documents.`);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

run();
