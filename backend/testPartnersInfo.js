const Partner = require('./models/Partner');
const PartnersInfo = require('./models/PartnersInfo');
const { connectDB, disconnectDB } = require('./config/db');

const buildPartnerPayload = () => {
    const stamp = Date.now();
    return {
        restaurantName: `Test Restaurant ${stamp}`,
        ownerName: 'Test Owner',
        resMobile: '9000000001',
        ownerMobile: '9000000002',
        resImage: 'https://example.com/restaurant.jpg',
        email: `test-partner-${stamp}@example.com`,
        password: 'test-password',
        area: 'Test Area',
        status: 'Active'
    };
};

const buildPartnersInfoPayload = (partnerId) => ({
    partnerId,
    logo: 'https://example.com/logo.png',
    email: 'contact@example.com',
    memberSince: '2024-01-01',
    restaurantName: 'Test Restaurant',
    subtitle: 'Fresh and tasty',
    foodType: 'Veg',
    description: 'Sample description for testing.',
    rating: 4.2,
    location: 'Mumbai',
    openTime: '09:00 AM',
    closeTime: '10:00 PM',
    callNumber: '+91-9000000000',
    directionLink: 'https://maps.example.com/?q=test',
    menuSections: [
        {
            name: 'Starters',
            items: [
                { name: 'Paneer Tikka', description: 'Spicy starter', price: 199, image: 'https://example.com/paneer.jpg' },
                { name: 'Veg Soup', description: 'Hot soup', price: 99, image: 'https://example.com/soup.jpg' }
            ]
        },
        {
            name: 'Main Course',
            items: [
                { name: 'Veg Biryani', description: 'Aromatic rice', price: 249, image: 'https://example.com/biryani.jpg' }
            ]
        }
    ],
    interiorImages: ['https://example.com/interior1.jpg'],
    foodImages: ['https://example.com/food1.jpg'],
    menuImages: ['https://example.com/menu1.jpg'],
    otherImages: [],
    photos: ['https://example.com/photo1.jpg'],
    videos: ['https://example.com/video1.mp4']
});

const runTest = async () => {
    let partner;
    let partnersInfo;

    try {
        await connectDB();

        partner = await Partner.create(buildPartnerPayload());
        partnersInfo = await PartnersInfo.create(buildPartnersInfoPayload(partner._id));

        const stored = await PartnersInfo.findOne({ partnerId: partner._id }).lean();

        console.log('Stored PartnersInfo document:');
        console.log(JSON.stringify(stored, null, 2));
    } catch (error) {
        console.error(`Test failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        if (partnersInfo?._id) {
            await PartnersInfo.deleteOne({ _id: partnersInfo._id });
        }
        if (partner?._id) {
            await Partner.deleteOne({ _id: partner._id });
        }
        await disconnectDB();
    }
};

runTest();
