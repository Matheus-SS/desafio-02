import { format, parseISO } from 'date-fns';
import ptLocale from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { FindEnrollment } = data;
    await Mail.sendMail({
      to: `${FindEnrollment.student.name} <${FindEnrollment.student.email}>`,
      subject: 'Matrícula concluída',
      template: 'welcome',
      context: {
        student: FindEnrollment.student.name,
        planName: FindEnrollment.plan.title,
        planValue: FindEnrollment.plan.monthly_price,
        date: format(
          parseISO(FindEnrollment.end_date),
          "d 'de' MMMM 'de' yyyy",
          {
            locale: ptLocale,
          }
        ),
      },
    });
  }
}
export default new WelcomeMail();
