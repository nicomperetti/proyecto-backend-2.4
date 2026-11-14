import mongoose from 'mongoose';
import { env } from './env.config.js';
export async function connectDatabase(){if(!env.mongoUrl) throw new Error('Falta configurar MONGO_URL en .env.'); await mongoose.connect(env.mongoUrl); console.log('Conexión con MongoDB establecida.');}
