const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.cookies.token
  console.log("doesnt work")

  if (!accessToken) return res.json("doent wrok");

  try {
    const validToken = verify(accessToken, "G#^A67f$T&8x!sL2WnEj$#yR*QZp@5vH");

    if (validToken) {
      req.user = validToken;
      return next();
    }
  } catch {
    return res.json({ error: "Bad" });
  }
};

module.exports = { validateToken };
