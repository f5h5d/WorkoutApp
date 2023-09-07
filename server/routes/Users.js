const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Users } = require("../models");

const { validateToken }  = require("../middleware/AuthMiddleware")

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (user) {
    res.json("Email Already In Use!");
    return;
  }

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({ name: name, email: email, password: hash });
    res.json("Success!");
  });
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) { res.json("Email does not exist!"); return; }


  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.json("Wrong username and password combination");
      return;
    }

    const accessToken = sign(
      { email: email, name: user.name, id: user.id },
      "G#^A67f$T&8x!sL2WnEj$#yR*QZp@5vH"
    );

    res.cookie('token', accessToken, { httpOnly: true});

    res.json({
      accessToken: accessToken,
      email: user.email,
      name: user.name, 
      id: user.id,
    });
  });
});

router.get("/authenticate", validateToken, (req, res) => {
  console.log(req.user)
  res.json("Hey");
})






module.exports = router;
