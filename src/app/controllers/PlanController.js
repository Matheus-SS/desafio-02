import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  // criar planos
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required()
        .positive(),
      monthly_price: Yup.number()
        .required()
        .positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failured' });
    }

    // aqui o plano é criado
    const { title, duration, monthly_price } = await Plan.create(req.body);
    return res.json({
      title,
      duration,
      monthly_price,
    });
  }

  // atualizar planos
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required()
        .positive(),
      monthly_price: Yup.number()
        .required()
        .positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failured' });
    }

    // encontra um plano com o id que está nos parametros
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    // aqui o plano é atualizado
    const { title, duration, monthly_price } = await plan.update(req.body);
    return res.json({
      title,
      duration,
      monthly_price,
    });
  }

  // deletar planos
  async delete(req, res) {
    // encontra um plano com o id que está nos parametros
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }
    // aqui o plano é excluido
    await plan.destroy();

    return res.json(plan);
  }

  // listar planos
  async index(req, res) {
    // aqui o plano é listado
    const plan = await Plan.findAll();
    return res.json(plan);
  }
}
export default new PlanController();
