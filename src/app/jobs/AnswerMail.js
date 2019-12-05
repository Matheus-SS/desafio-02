import { format, parseISO } from 'date-fns';
import ptLocale from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'Answer';
  }

  async handle({ data }) {
    const { questionFind } = data;
    await Mail.sendMail({
      to: `${questionFind.student.name} <${questionFind.student.email}>`,
      subject: 'GymPoint Pergunta respondida',
      template: 'answer',
      context: {
        question: questionFind.question,
        answer: questionFind.answer_academy,
        answerDate: format(
          parseISO(questionFind.answer_at),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: ptLocale,
          }
        ),
        questionDate: format(
          parseISO(questionFind.createdAt),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: ptLocale,
          }
        ),
      },
    });
  }
}
export default new AnswerMail();
