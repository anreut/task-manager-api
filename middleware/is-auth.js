const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils');

// 1. Frontend sends two tokens (access and refresh tokens) by every requets
// 2. If access token is valid -> return old tokens + user data
// 3. If access token is NOT valid -> check the refresh token, if it's valid generate a new access token.
// Return new access token, old refresh token + user data
// 4. If refresh token is NOT valid -> logout

module.exports = async (req, res, next) => {
  const accessToken = req.get('x-token');
  const refreshToken = req.get('x-refresh-token');

  if (!accessToken || !refreshToken) {
    return res
      .status(401)
      .json({ message: 'No tokens, authorization denied' });
  }

  try {
    // check access token
    const decoded = await jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
    );

    // if access token is valid -> return old tokens + user data
    req.id = decoded.id;
    req.tokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (err) {
    // if access token is NOT valid -> check the refresh token
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      // if refresh token is valid -> generate new access token, return new access token, old refresh token + user data
      const newAccessToken = await generateToken(
        { id: decoded.id },
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_ACCESS_TIMEOUT,
      );

      req.id = decoded.id;
      req.tokens = {
        refresh_token: refreshToken,
        access_token: newAccessToken,
      };
    } catch (err) {
      // if refresh token is NOT valid -> logout
      return err;
    }
  } finally {
    next();
  }
};
