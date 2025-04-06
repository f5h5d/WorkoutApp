const express = require("express");
const { validateToken } = require("../middleware/AuthMiddleware");
const router = express.Router();
const { Workouts, PastWorkouts } = require("../models");

router.post("/create", validateToken, async (req, res) => {
  const { title, description, colour } = req.body;
  const {  _previousDataValues } = await Workouts.create({
    title: title,
    colour: colour,
    description: description,
    excercises: [],
    UserId: req.user.id,
  });
  res.json(_previousDataValues.id);
});

router.post("/post", validateToken, async (req, res) => {
  const { title, description, colour, excercises } = req.body;
  const {  _previousDataValues } = await PastWorkouts.create({
    title: title,
    colour: colour,
    excercises: excercises,
    WorkoutId: req.user.currentWorkoutId,
    UserId: req.user.id
  });
  res.json(_previousDataValues.id);
});

router.get("/getAll", validateToken, async (req, res) => {
  const id = req.user.id;
  const workouts = await Workouts.findAll({ where: { UserId: id } });
  res.json(workouts);
});

router.get("/getOne/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const workout = await Workouts.findOne({ where: { id: id } });
  res.json(workout);
});

router.get("/verify/:id", validateToken, async (req, res) => {
  const id = req.params.id
  const entry = await Workouts.findOne({where: { id: id, userId: req.user.id}})
  res.json(entry === null)
})

router.put("/update/", validateToken, async (req, res) => {
  const { id, excerciseList } = req.body;
  console.log(id, excerciseList);
  await Workouts.update(
    { excercises: excerciseList },
    { where: { id: id } }
  );
  res.json("Sucessfully Updated Workout!");
});

router.delete("/delete/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  await Workouts.destroy({where: {id: id}});
  res.json("Successfully Deleted Workout!")
})

module.exports = router;
