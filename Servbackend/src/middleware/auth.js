const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req,res,next){
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Autorizacao necessaria' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Token invalido' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Autorizacao necessaria' });
  }
};
