import ProfilePicture from "../models/ProfilePicture";
import multer from "multer";
import multerConfig from "../config/multer";

const upload = multer(multerConfig).single("nome");

class ProfilePictureController {
  async index(req, res) {
    const pictures = await ProfilePicture.findAll();

    res.json(pictures);
  }

  store(req, res) {
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({
          errors: [error],
        });
      }

      const picture = await ProfilePicture.create({
        user_id: req.userId,
        name: req.file.filename,
        url: req.file.path,
      });

      res.json(picture);
    });
  }

  async delete(req, res) {
    const { id } = req.file;
    const picture = await ProfilePicture.findByPk(id);

    const errors = [];

    if (!picture) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    picture.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new ProfilePictureController();
