import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import Gate from './models/Gate.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/indra_netra');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Event.deleteMany({});
        await Gate.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create event
        const event = new Event({
            name: 'Hackathon 2025 - Indra Netra Demo',
            totalCapacity: 3000,
            safeLimit: 2550,
            zones: ['A', 'B', 'C'],
            gates: [
                { gateId: 'G1', zoneName: 'A', capacity: 1000 },
                { gateId: 'G2', zoneName: 'B', capacity: 1000 },
                { gateId: 'G3', zoneName: 'C', capacity: 1000 },
            ],
        });

        const savedEvent = await event.save();
        console.log('✅ Event created:', savedEvent._id);

        // Create gates
        const gates = [
            {
                gateId: 'G1',
                gateName: 'Main Gate - North',
                zoneName: 'A',
                capacity: 1000,
                eventId: savedEvent._id,
            },
            {
                gateId: 'G2',
                gateName: 'Secondary Gate - East',
                zoneName: 'B',
                capacity: 1000,
                eventId: savedEvent._id,
            },
            {
                gateId: 'G3',
                gateName: 'Tertiary Gate - South',
                zoneName: 'C',
                capacity: 1000,
                eventId: savedEvent._id,
            },
        ];

        await Gate.insertMany(gates);
        console.log('✅ Gates created');

        console.log('\n📋 Seed Data Summary:');
        console.log(`Event ID: ${savedEvent._id}`);
        console.log(`Event Name: ${savedEvent.name}`);
        console.log(`Total Capacity: ${savedEvent.totalCapacity}`);
        console.log(`Zones: ${savedEvent.zones.join(', ')}`);
        console.log(`Gates: ${gates.map(g => g.gateId).join(', ')}`);
        console.log('\n✨ Database seeded successfully!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
