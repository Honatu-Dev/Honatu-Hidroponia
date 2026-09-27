import { sequelize, Workshop } from '../src/models/index.js';

const seedWorkshops = async () => {
  try {
    await sequelize.authenticate();
    
    // Create workshops
    await Workshop.bulkCreate([
      {
        title: 'Huertos Hidropónicos en casa (Nivel I)',
        scheduledDate: new Date('2024-10-05T17:00:00Z'),
        capacity: 20,
        price: 500.00
      },
      {
        title: 'Hidroponia General (Nivel II)',
        scheduledDate: new Date('2024-10-10T09:00:00Z'),
        capacity: 15,
        price: 800.00
      },
      {
        title: 'De la duda a la cosecha: Hablemos de hidroponía',
        scheduledDate: new Date('2024-09-30T18:00:00Z'),
        capacity: 100,
        price: 0.00 // Masterclass gratis
      }
    ]);

    console.log('Workshops seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding workshops:', error);
    process.exit(1);
  }
};

seedWorkshops();
