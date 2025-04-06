module.exports = (sequelize, DataTypes) => {
  const Workouts = sequelize.define("Workouts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
  Workouts.associate = (models) => {
    Workouts.hasMany(models.PastWorkouts, {
      onDelete: "cascade",
    });
  };
  return Workouts;
};
