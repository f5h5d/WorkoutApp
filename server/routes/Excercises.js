const express = require("express");
const { validateToken } = require("../middleware/AuthMiddleware");
const router = express.Router();
const API_KEY = "Q8hJCHIlYz6aVNICf9HXtw==hdFiEHOli3tCHyI3";
const axios = require("axios");



router.get("/", validateToken, async (req, res) => {
  const name = req.query.name;
  const { data } = await axios.get(
    `https://exercisedb.p.rapidapi.com/exercises/name/${name}`,
    {
      headers: {
        "X-RapidAPI-Key": "09f9e1e133mshb71cdd7a85a86b3p10c404jsn56581a21668d",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    }
  )
  res.json(data);
});

module.exports = router;
