import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DOUBLE,
        height: Sequelize.DOUBLE,
      },
      { sequelize }
    );
    /** antes de atualizar, converte para ter apenas 2 casas decimais na altura
     e 3 casas decimais no peso ,então SALVA no banco de dados */
    this.addHook('beforeUpdate', async student => {
      student.weight = parseFloat(await student.weight.toFixed(3));
      student.height = parseFloat(await student.height.toFixed(2));
    });

    return this;
  }
}
export default Student;
