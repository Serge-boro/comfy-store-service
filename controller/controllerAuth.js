const UserSchema = require('../moduleDB/moduleUser')
const jwt = require('jsonwebtoken')

let userFound
const getAllUsers = (req, res) => {
  res.send('All users')
}

const postRegister = async (req, res, next) => {
  const { user, pwd } = req.body

  try {
    if (!user && !pwd) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' })
    }

    userFound = await UserSchema.findOne({ user })
    if (userFound) {
      return res.status(401).json({ message: `Username ${user} already exist` })
    }

    const createUser = await UserSchema.create({ user, pwd })

    res.status(201).json({ success: `New user ${user} created`, createUser })
  } catch (err) {
    next(err)
  }
}

const postLogin = async (req, res, next) => {
  const { user, pwd, credentialName, credentialPassword } = req.body

  try {
    if (
      !user &&
      !pwd &&
      credentialName === 'test' &&
      credentialPassword === 'test@test.com'
    ) {
      const user = 'guest'
      return res.status(200).json({ user })
    }

    if (!user || !pwd) {
      return res
        .status(400)
        .json({ message: 'Username and password are required.' })
    }

    userFound = await UserSchema.findOne({ user })
    const userId = JSON.parse(JSON.stringify(userFound._id))
    if (!userFound) {
      return res
        .status(401)
        .json({ message: `Username "${user}" does not exist` })
    }

    const comparePassword = await userFound.comparePassword(pwd)
    if (!comparePassword) {
      return res.status(401).json({ message: `Password does not match` })
    }

    const accessToken = jwt.sign(
      { username: userFound.user, userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '90s' }
    )
    const refreshToken = jwt.sign(
      { username: userFound.user, userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '90s' }
    )

    userFound.refreshToken = refreshToken
    await userFound.save()

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 90 * 1000,
    })

    res.status(200).json({ userID: userId, user, accessToken })
  } catch (err) {
    next(err)
  }
}

const refreshTokenController = async (req, res, next) => {
  const cookies = req.cookies
  console.log({ cookies })

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Cookie is missing' })
  }
  const refreshToken = cookies.jwt
  console.log({ refreshToken })

  // if (!refreshToken) {
  //   return res.status(401).json({ message: 'Cookie is not match' })
  // }
  const userFoundToken = await UserSchema.findOne({ user })
  console.log({ userFoundToken })

  console.log({ refUserToken: userFoundToken.refreshToken })

  const matchToken = userFoundToken.refreshToken === refreshToken
  if (!matchToken) {
    return next(res.status(401).json({ message: 'Cookie is not match' }))
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userFound.user !== decoded.username) {
      return res.status(401).json({ message: 'verify jwt failed' })
    }

    const accessToken = jwt.sign(
      { username: decoded.username, userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '90s' }
    )
    res.json({ accessToken })
  })
}

const logout = async (req, res, next) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.status(201).json({ message: 'Cookie already removed' })
  }

  const refreshToken = cookies.jwt
  foundUser = userFound.refreshToken === refreshToken
  if (!foundUser) {
    res.cookie('jwt', 'logout', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(Date.now()),
    })
    return res
      .status(201)
      .json({ message: 'JWT is not matches, will be delete' })
  }

  userFound.refreshToken = ''
  await userFound.save()
  res.cookie('jwt', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(201).json({ message: 'Logged out successfully' })
}

module.exports = {
  getAllUsers,
  postRegister,
  postLogin,
  refreshTokenController,
  logout,
}
