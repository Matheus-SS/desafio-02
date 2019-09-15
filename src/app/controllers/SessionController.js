import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import Auth from '../../config/auth';

class SessionController {
  // criar uma sessao de login
  async store(req, res) {
    // validar dados de sessao
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // verifica se o usuario nao existe
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // verifica se a senha NAO bate
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, Auth.secret, {
        expiresIn: Auth.expiresIn,
      }),
    });
  }
}
export default new SessionController();
