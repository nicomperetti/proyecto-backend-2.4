import { createUserDao,findUserByEmailDao } from '../dao/users.dao.js';
export function findUserByEmailRepository(email,includePassword=false){return findUserByEmailDao(email,includePassword);}
export function createUserRepository(data){return createUserDao(data);}
