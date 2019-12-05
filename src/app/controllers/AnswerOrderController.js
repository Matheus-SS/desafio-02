import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer_academy: Yup.string().required(),
    });
    // valida os campos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }

    const questionID = req.params.id;
    // ENCONTRA UM PERGUNTA COM O ID DIGITADO
    const questionFind = await HelpOrder.findByPk(questionID, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!questionFind) {
      return res.status(401).json({ error: 'Question does not exists' });
    }

    if (questionFind.answer_academy !== null) {
      return res
        .status(401)
        .json({ error: 'question has already been answered ' });
    }

    questionFind.answer_academy = req.body.answer_academy;
    questionFind.answer_at = new Date();
    await questionFind.save();

    await Queue.add(AnswerMail.key, {
      questionFind,
    });

    return res.json(questionFind);
  }
}

export default new AnswerOrderController();
