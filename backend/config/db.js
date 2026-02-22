const mongoose = require('mongoose');
const {
    mongoUri,
    mongoMinPoolSize,
    mongoMaxPoolSize
} = require('./env');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return mongoose.connection;
    }

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const conn = await mongoose.connect(mongoUri, {
                minPoolSize: mongoMinPoolSize,
                maxPoolSize: mongoMaxPoolSize,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000
            });

            isConnected = true;
            console.log(`MongoDB connected: ${conn.connection.host}`);

            mongoose.connection.on('error', (error) => {
                console.error(`MongoDB connection error: ${error.message}`);
            });

            mongoose.connection.on('disconnected', () => {
                isConnected = false;
                console.warn('MongoDB disconnected');
            });

            return conn.connection;
        } catch (error) {
            attempt += 1;
            console.error(
                `MongoDB connection failed (attempt ${attempt}/${maxRetries}): ${error.message}`
            );

            if (attempt >= maxRetries) {
                throw error;
            }

            const retryDelayMs = Math.min(1000 * 2 ** (attempt - 1), 10000);
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
    }

    throw new Error('MongoDB connection failed after maximum retries.');
};

const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        isConnected = false;
        console.log('MongoDB connection closed');
    }
};

module.exports = { connectDB, disconnectDB };
