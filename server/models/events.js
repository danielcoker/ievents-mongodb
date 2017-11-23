export default (sequelize, DataTypes) => {
  const userEvent = sequelize.define('userEvent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.STRING,
    },
    centerName: {
      type: DataTypes.STRING,
    },
    centerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'RESTRICT',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
  });
  return userEvent;
};