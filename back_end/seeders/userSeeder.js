const User = require('../Models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async (roles) => {
  const usersData = [
    {
      name: 'Driver One',
      email: 'driver1@example.com',
      password: 'Password1', // Will be hashed by pre-save hook
      phone: '+12345678910',
      national_num: '12345678901',
      role: 'driver', // Driver role
    },
    {
      name: 'Driver Two',
      email: 'driver2@example.com',
      password: 'Password1',
      phone: '+12345678911',
      national_num: '12345678902',
      role: 'driver', // Driver role
    },
    {
      name: 'user one',
      email: 'user1@example.com',
      password: 'Password1',
      phone: '+12345678912',
      national_num: '00',
      role: 'user', // normal role
    },
    {
      name: 'admin one',
      email: 'admin1@example.com',
      password: 'Password1',
      phone: '+74852',
      national_num: '00',
      role: 'admin', // admin role
    },
  ];
  try {
    // Clear existing data
    await User.deleteMany({}).exec();
    console.log('🧹 Existing users cleared');

    // hash password
    const hashedUsersData = await Promise.all(
      usersData.map(async (user) => {
        return {
          ...user,
          password: await bcrypt.hash(user.password, 12),
        };
      })
    );

    // Insert users after hashing
    const users = await User.insertMany(hashedUsersData);
    console.log(`✅ ${users.length} users seeded`);
    return users;
  } catch (error) {
    console.error('❌ Seeding users failed:', error.message);
  }
};
module.exports = seedUsers;
