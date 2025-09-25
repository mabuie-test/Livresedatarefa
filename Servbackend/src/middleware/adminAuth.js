module.exports = function(req,res,next){
  if (!req.user) return res.status(401).json({ error: 'Autenticacao necessaria' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
  next();
};
