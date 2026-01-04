const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

console.log('Testing DB Access...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            console.log('Attempting to create generic test user...');
            const testEmail = `test${Date.now()}@example.com`;
            const user = await User.create({
                username: `testuser${Date.now()}`,
                email: testEmail,
                password: 'password123'
            });
            console.log('✅ User created successfully:', user._id);

            await User.deleteOne({ _id: user._id });
            console.log('✅ Test user cleaned up');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during user creation:', err);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err);
        process.exit(1);
    });
