import ProfilePicture from "../models/ProfilePicture";
import multer from "multer";
import multerConfig from "../config/multer";
import fs from "fs";
import path from "path";

const upload = multer(multerConfig).single("nome");

class ProfilePictureController {
  async index(req, res) {
    try {
      const pictures = await ProfilePicture.findAll({
        where: { user_id: req.userId },
      });
      res.json(pictures);
    } catch (error) {
      res.status(400).json({ Error: ["Somenthing's Went Wrong"] });
    }
  }

  store(req, res) {
    return upload(req, res, async (error) => {
      try {
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
      } catch (error) {
        res.status(401).json({ errors: ["Somenthing's Went Wrong"] });
      }
    });
  }

  async update(req, res) {
    return upload(req, res, async (error) => {
      try {
        if (error) {
          return res.status(400).json({
            errors: [error],
          });
        }

        const id = req.params.id;
        const picture = await ProfilePicture.findByPk(id);

        if (!picture) {
          return res.status(401).json({
            errors: ["Foto não localizada"],
          });
        }

        if (picture.user_id !== req.userId) {
          return res.status(403).json({
            errors: ["Usuario não autorizado"],
          });
        }

        // Deletar o arquivo antigo
        const oldFilePath = path.resolve(
          __dirname,
          "..",
          "uploads",
          picture.name
        );
        fs.unlink(oldFilePath, async (err) => {
          if (err) {
            return res
              .status(400)
              .json({ errors: ["Erro ao deletar o arquivo antigo"] });
          }

          // Atualizar com o novo arquivo
          picture.name = req.file.filename;
          picture.url = req.file.path;
          await picture.save();

          return res.json(picture);
        });
      } catch (error) {
        res.status(401).json({ errors: ["Something's Went Wrong"] });
      }
    });
  }

  async delete(req, res) {
    const id = req.params.id;
    try {
      const picture = await ProfilePicture.findByPk(id);

      if (!picture) {
        return res.status(401).json({
          errors: ["Foto não localizada"],
        });
      }

      if (picture.user_id !== req.userId) {
        return res.status(403).json({
          errors: ["Usuario não autorizado"],
        });
      }

      const filePath = path.resolve(__dirname, "..", "uploads", picture.name);
      console.log(filePath);

      fs.unlink(filePath, async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ errors: ["Erro ao deletar o arquivo"] });
        }

        await picture.destroy();
        return res.status(200).json({ message: "Foto deletada com sucesso" });
      });
    } catch (error) {
      res.status(401).json({ errors: ["Something's Went Wrong"] });
    }
  }
}

export default new ProfilePictureController();
