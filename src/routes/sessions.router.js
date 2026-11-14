import { Router } from 'express';
import passport from 'passport';
import { register, login, current, logout } from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { session: false }), register);
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    req.user = user;
    return next();
  })(req, res, next);
}, login);
router.get('/current',
  (req, res, next) => passport.authenticate('current', { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
    req.user = user;
    return next();
  })(req, res, next),
  current
);
router.post('/logout', logout);

export default router;
