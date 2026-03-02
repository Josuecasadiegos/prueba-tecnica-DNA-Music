import mongoose from 'mongoose';
import dns from 'node:dns/promises';

import '@/models/User';
import '@/models/Role';
import '@/models/Student';
import '@/models/Subject';
import '@/models/Grade';

let isConnected = false;

dns.setServers(['1.1.1.1', '1.0.0.1']);

export const connectToDB = async () => {
  if (isConnected) return;

  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Conectado a MongoDB Atlas →', mongoose.connection.db.databaseName);

    console.log('Modelos registrados:', Object.keys(mongoose.models));

  } catch (error) {
    console.error('Error al conectar:', error);
    throw error;
  }
};
