import { format, subDays } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async store(req, res) {
    const studentID = req.params.id;

    // verifica se existe aluno
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

    const dateNow = new Date();
    const dateSub7d = subDays(dateNow, 6);

    // METODO DO MONGO DB
    const amountCheckin = await Checkin.countDocuments({
      student_id: studentID,
      createdAt: { $gte: dateSub7d },
    });

    if (amountCheckin >= 5) {
      return res.status(400).json({
        error: 'You can not checkin anymore for today. Five checkins reached.',
      });
    }
    const formattedDate = format(
      new Date(),
      "'dia ' dd 'de ' MMMM 'de ' yyyy 'às, 'HH:mm 'h' ",
      { locale: ptLocale }
    );

    // create do mongoDB
    const result = await Checkin.create({
      content: `Checkin efetuado por ${student.name} ${formattedDate}`,
      student_id: studentID,
    });

    return res.json(result);
  }

  async index(req, res) {
    const studentID = req.params.id;

    // verifica se existe aluno
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

    const result = await Checkin.find({
      student_id: studentID,
    }).limit(10);
    return res.json(result);
  }
}
export default new CheckinController();
