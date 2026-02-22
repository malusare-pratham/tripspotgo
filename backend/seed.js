const Membership = require('./models/Membership');
const { connectDB, disconnectDB } = require('./config/db');

const plans = [
    {
        title: 'Basic Plan',
        price: 999,
        features: ['Local Trips', '24/7 Support'],
        isActive: true
    },
    {
        title: 'Premium Plan',
        price: 2999,
        features: ['International Trips', 'Luxury Hotels'],
        isActive: true
    },
    {
        title: 'Elite Plan',
        price: 4999,
        features: ['Private Jet', 'Personal Guide'],
        isActive: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        for (const plan of plans) {
            await Membership.updateOne({ title: plan.title }, { $set: plan }, { upsert: true });
        }

        console.log('Membership plans seeded successfully');
    } catch (error) {
        console.error(`Seeding failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        await disconnectDB();
    }
};

seedData();
