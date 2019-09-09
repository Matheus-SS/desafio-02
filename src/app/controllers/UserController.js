import User from '../models/User';

class UserController {
  async store(req, res) {
    // verificar se o email já existe
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'users already exists' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}
export default new UserController();
