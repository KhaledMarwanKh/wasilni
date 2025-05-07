const City = require('../Models/City');
const seedCity = async () => {
  const citiesData = [
    { name: 'Damascus' },
    { name: 'Homs' },
    { name: 'Aleppo' },
  ];
  try {
    // Clear existing data
    await City.deleteMany({}).exec();
    console.log('🧹 Existing cities cleared');

    // Insert cities
    const cities = await City.insertMany(citiesData);

    console.log(`✅ ${cities.length} cities seeded`);
    return cities;
  } catch (error) {
    console.error('❌ Seeding cities failed:', error.message);
  }
};

module.exports = seedCity;
