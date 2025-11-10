const jwt = require('jsonwebtoken');

function getSecret() {
  return process.env.JWT_SECRET || 'supersecret';
}
function getExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '1d';
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: getExpiresIn() });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { signToken, verifyToken };
