const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Users, Workouts } = require("../models");

const { validateToken }  = require("../middleware/AuthMiddleware")

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (user) {
    res.json("Email Already In Use!");
    return;
  }

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({ name: name, email: email, password: hash, currentWorkoutId: -1 });
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

    res.cookie('token', accessToken, { httpOnly: true, overwrite: true});

    res.json({
      accessToken: accessToken,
      email: user.email,
      name: user.name, 
      id: user.id,
    });
  });
});


router.post("/startWorkout/", async (req, res) => {
  const { id, email } = req.body;
  console.log(id, email)
  await Users.update({ currentWorkoutId: id}, {
    where: {
      email: email
    }
  })
  res.json("Workout Started!")
})

router.get("/authenticate", validateToken, async (req, res) => {
  const user = await Users.findOne({where: {email: req.user.email}})
  res.json(user);
})

router.get("/logout", validateToken, (req, res) => {
  res.clearCookie('token')
  res.end();
})





module.exports = router;
