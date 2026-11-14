import bcrypt from 'bcrypt'; import { env } from '../config/env.config.js';
export function hashPassword(password){return bcrypt.hash(password,env.bcryptSaltRounds);}
export function comparePassword(password,hash){return bcrypt.compare(password,hash);}
