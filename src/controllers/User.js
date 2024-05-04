import User from "../models/User";

class UserController {
  async store(req, res) {
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(401).json({
        errors: ["usuario já existe"],
      });
    }
    const {id, username} = await User.create(req.body);
    res.json({id, username, email});
  }

  async update(req, res) {

    console.log(req.userId)
    res.json({
      "tudo ok": "yes"
    })
    
  }
}

export default new UserController();
