import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
import { createUser, authenticateUser } from '../services/sessions.service.js';
import { verifyToken } from '../utils/jwt.js';

// Cada estrategia se registra aquí. Para sumar OAuth (Google/GitHub), se agrega
// su estrategia en este archivo sin modificar app.js ni las rutas existentes.
passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, _email, _password, done) => {
  try {
    const user = await createUser(req.body ?? {});
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    if (typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || !password) {
      return done(null, false, { message: 'Credenciales inválidas' });
    }
    const user = await authenticateUser(email, password);
    if (!user) return done(null, false, { message: 'Credenciales inválidas' });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('current', new CustomStrategy(async (req, done) => {
  try {
    const token = req.cookies?.currentUser;
    if (!token) return done(null, false, { message: 'No autenticado' });
    const payload = verifyToken(token);
    if (!payload || typeof payload.id !== 'string' ||
        typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return done(null, false, { message: 'No autenticado' });
    }
    return done(null, {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  } catch (_error) {
    return done(null, false, { message: 'No autenticado' });
  }
}));

export default passport;
