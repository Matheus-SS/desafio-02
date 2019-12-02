import { format } from 'date-fns';
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

    const formattedDate = format(
      new Date(),
      "'dia ' dd 'de ' MMMM 'de ' yyyy 'às, 'HH:mm 'h' ",
      { locale: ptLocale }
    );
    const result = await Checkin.create({
      content: `Checkin efetuado por ${student.name} ${formattedDate}`,
      student_id: studentID,
    });
    return res.json(result);
  }
}
export default new CheckinController();
