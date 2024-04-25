const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  try {
    let authHeaderAccess = req.headers.authorization

    //!authHeaderAccess?.startsWith('Bearer') same below if / if
    // if (!authHeaderAccess || !authHeaderAccess.startsWith('Bearer')) {
    if (!authHeaderAccess?.startsWith('Bearer')) {
      return res.status(403).json({ message: 'May missed bearer' })
    }

    const token = authHeaderAccess.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'Token does not exist' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' }) //invalid token
      req.user = { username: decoded.username, userId: decoded.userId }
      next()
    })
  } catch (err) {
    next(err)
  }
}

module.exports = verifyJWT
