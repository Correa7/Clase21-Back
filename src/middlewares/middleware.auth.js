function isUser(req, res, next) {
    if (req.session?.user?.email) {
      return next();
    }
    return res.status(401).render('error', { error: 'error de autenticacion!' }); 
  }
  
  function isAdmin(req, res, next) {
    if (req.session?.user?.rol) {
      return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
  }

  module.exports = { isUser,isAdmin}