import app from './app.js';
import { env } from './config/env.config.js';
import { connectDatabase } from './config/db.js';
async function startServer(){try{await connectDatabase();app.listen(env.port,()=>console.log(`Servidor activo en http://localhost:${env.port} (${env.nodeEnv})`));}catch(error){console.error('No se pudo iniciar la aplicación:',error.message);process.exit(1);}}
startServer();
