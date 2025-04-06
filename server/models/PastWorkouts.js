module.exports = (sequelize, DataTypes) => {
  const PastWorkouts = sequelize.define("PastWorkouts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    colour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    excercises: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
  return PastWorkouts;
};
