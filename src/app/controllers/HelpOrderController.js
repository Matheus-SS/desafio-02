import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    // valida os campos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }
    const studentID = req.params.id;

    const student = await Student.findOne({
      where: { id: studentID },
    });
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    // verifica se o aluno está matriculado
    const enrollment = await Enrollment.findOne({
      where: { student_id: studentID },
    });
    if (!enrollment) {
      return res.status(400).json({ error: 'Student is not enrolled' });
    }
    const result = await HelpOrder.create({
      student_id: studentID,
      question: req.body.question,
    });
    return res.json(result);
  }

  async index(req, res) {
    const studentID = req.params.id;
    const { page = 1 } = req.query;
    const result = await HelpOrder.findAll({
      where: {
        student_id: studentID,
      },
      order: ['id'],
      attributes: [
        'id',
        'student_id',
        'question',
        'answer_academy',
        'answer_at',
        'created_at',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(result);
  }
}
export default new HelpOrderController();
