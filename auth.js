// auth.js
function ensureSameUser(req, res, next) {
  const sessionUser = req.cookies && req.cookies.session_user;
  const requestedId = req.params.id;

  if (!sessionUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (sessionUser !== requestedId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}

module.exports = { ensureSameUser };
