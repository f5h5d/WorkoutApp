const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const db = require("./models");

// middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true}));
app.use(cookieParser());

//Routes 

const usersRouter = require("./routes/Users");
app.use("/users", usersRouter)



db.sequelize.sync().then(() => {
  app.listen(3036, () => {
    console.log("Listening On " + 3036);
  });
});