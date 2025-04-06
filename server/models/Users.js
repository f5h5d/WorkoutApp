module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentWorkoutId: {
      type: DataTypes.CHAR,
      allowNull: false,
    }
  });
  Users.associate = (models) => {
    Users.hasMany(models.Workouts, {
      onDelete: "cascade",
    });

    Users.hasMany(models.PastWorkouts, {
      onDelete: "cascade",
    });
  };
  return Users;
};
