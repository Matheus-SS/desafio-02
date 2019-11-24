import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        monthly_price: Sequelize.DECIMAL(10, 2),
      },
      { sequelize }
    );

    return this;
  }
}
export default Plan;
