import { signToken } from '../utils/jwt.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600000,
};

export function register(req, res) {
  return res.status(201).json({ status: 'success', payload: req.user });
}

export function login(req, res) {
  const user = req.user;
  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  res.cookie('currentUser', token, cookieOptions);
  return res.status(200).json({ status: 'success', message: 'Login correcto' });
}

export function current(req, res) {
  return res.status(200).json({ status: 'success', payload: req.user });
}

export function logout(_req, res) {
  res.clearCookie('currentUser', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
}
