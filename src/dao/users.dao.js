import User from '../models/User.js';
export function findUserByEmailDao(email,includePassword=false){const q=User.findOne({email});if(includePassword)q.select('+password');return q.exec();}
export function createUserDao(data){return User.create(data);}
