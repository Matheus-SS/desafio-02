import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  // método de criar estudante
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .max(300)
        .required()
        .positive(),
      height: Yup.number()
        .positive()
        .max(3.0)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }
    // verifica se já existe um usuario com o email digitado
    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExist) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // aqui o estudante é criado
    const { name, email, age, weight, height } = await Student.create(req.body);
    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  // método de atualizar estudante
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .max(300)
        .required()
        .positive(),
      height: Yup.number()
        .positive()
        .max(3.0)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }

    // encontra um usuario com o id que está nos parametros
    const student = await Student.findByPk(req.params.id);

    // verifica se o usuario existe pelo id
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { email } = req.body;
    // verifica se já existe um usuario com o email digitado
    if (email !== student.email) {
      const studentExist = await Student.findOne({
        where: { email },
      });

      if (studentExist) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }

    // aqui o estudante é atualizado
    const { name, age, weight, height } = await student.update(req.body);
    return res.json({
      name,
      age,
      email,
      weight,
      height,
    });
  }
}
export default new StudentController();
