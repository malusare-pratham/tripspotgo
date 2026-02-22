const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const { mongoUri } = require('./config/env');

mongoose.connect(mongoUri)
.then(async () => {
    const adminExists = await Admin.findOne({ email: 'admin@magicpoint.com' });
    if (!adminExists) {
        await Admin.create({
            username: 'SuperAdmin',
            email: 'admin@magicpoint.com',
            password: 'adminPassword123' // हे नंतर बदलून घे
        });
        console.log("Admin User Created!");
    } else {
        console.log("Admin already exists.");
    }
    await mongoose.connection.close();
    process.exit(0);
})
.catch(async (err) => {
    console.log(err);
    await mongoose.connection.close();
    process.exit(1);
});
