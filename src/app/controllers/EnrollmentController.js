import * as Yup from 'yup';
import { isBefore, parseISO, startOfDay, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive()
        .integer(),
      plan_id: Yup.number()
        .required()
        .positive()
        .integer(),
      start_date: Yup.date().required(),
    });
    // valida os campos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }

    const { student_id, plan_id, start_date } = req.body;
    // verifica se existe estudante da TABELA ESTUDANTE
    // com id que será preenchido
    const checkStudent = await Student.findByPk(student_id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student does not exists' });
    }
    // verifica se existe estudante matriculado
    const checkEnrollmentExist = await Enrollment.findOne({
      where: { student_id },
    });
    if (checkEnrollmentExist) {
      return res.status(400).json({ error: 'Enrollment already exists' });
    }
    // verifica se existe plano com id que será preenchido
    const checkPlan = await Plan.findByPk(plan_id);
    if (!checkPlan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    // calcula o preço total do plano
    const totalPrice = checkPlan.duration * checkPlan.monthly_price;
    // DATAS
    const date = startOfDay(parseISO(start_date));
    // verifica se o dia colocado pelo usuario é antes do dia de hoje
    if (isBefore(date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past days are not permitted' });
    }
    // soma a quantidade de meses do plano ao mes que foi matriculado
    const addEndDate = addMonths(date, checkPlan.duration);

    // cria a matricula
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      price: totalPrice,
      start_date,
      end_date: addEndDate,
    });

    await Mail.sendMail({
      to: `${checkStudent.name} <${checkStudent.email}>`,
      subject: 'Matrícula concluída',
      text: 'Sua matrícula foi concluída com sucesso',
    });
    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .required()
        .positive()
        .integer(),
      start_date: Yup.date().required(),
    });
    // valida os campos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failured' });
    }

    const { plan_id, start_date } = req.body;
    // verifica se existe estudante matriculado
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists' });
    }
    // verifica se existe plano com id que será preenchido
    const checkPlan = await Plan.findByPk(plan_id);
    if (!checkPlan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    // calcula o preço total do plano
    const totalPrice = checkPlan.duration * checkPlan.monthly_price;

    const date = startOfDay(parseISO(start_date));
    // verifica se o dia colocado pelo usuario é antes do dia de hoje
    if (isBefore(date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past days are not permitted' });
    }
    // soma a quantidade de meses do plano ao mes que foi matriculado
    const addEndDate = addMonths(date, checkPlan.duration);

    // cria a matricula
    const result = await enrollment.update({
      plan_id,
      price: totalPrice,
      start_date,
      end_date: addEndDate,
    });
    return res.json(result);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const result = await Enrollment.findAll({
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },

        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'monthly_price'],
        },
      ],
    });
    return res.json(result);
  }

  async show(req, res) {
    const result = await Enrollment.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },

        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'monthly_price'],
        },
      ],
    });
    return res.json(result);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }
    await enrollment.destroy();

    return res.json(enrollment);
  }
}
export default new EnrollmentController();
