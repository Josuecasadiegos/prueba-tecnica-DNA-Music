import mongoose from 'mongoose';
import dns from 'node:dns/promises';

import '@/models/User';
import '@/models/Role';
import '@/models/Student';
import '@/models/Subject';
import '@/models/Grade';

let isConnected = false;

// Fuerza DNS públicos ANTES de cualquier conexión
dns.setServers(['1.1.1.1', '1.0.0.1']);     // Cloudflare (1.1.1.1 + 1.0.0.1)
// O prueba con Google: ['8.8.8.8', '8.8.4.4']

export const connectToDB = async () => {
  if (isConnected) return;

  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Conectado a MongoDB Atlas →', mongoose.connection.db.databaseName);

    // Opcional: log para confirmar que los modelos están registrados
    console.log('Modelos registrados:', Object.keys(mongoose.models));

    // ... el bloque de limpieza si lo tienes ...
  } catch (error) {
    console.error('Error al conectar:', error);
    throw error;
  }
};
