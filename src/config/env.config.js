import dotenv from 'dotenv';
dotenv.config();
const port=Number.parseInt(process.env.PORT??'8080',10);
const saltRounds=Number.parseInt(process.env.BCRYPT_SALT_ROUNDS??'10',10);
if(!Number.isInteger(port)||port<1||port>65535) throw new Error('PORT debe ser un número entre 1 y 65535.');
if(!Number.isInteger(saltRounds)||saltRounds<10||saltRounds>15) throw new Error('BCRYPT_SALT_ROUNDS debe ser un entero entre 10 y 15.');
if(!process.env.JWT_SECRET) throw new Error('Falta configurar JWT_SECRET en .env.');
export const env={port,mongoUrl:process.env.MONGO_URL??'',jwtSecret:process.env.JWT_SECRET,jwtExpiresIn:process.env.JWT_EXPIRES_IN??'1h',nodeEnv:process.env.NODE_ENV??'development',bcryptSaltRounds:saltRounds};
