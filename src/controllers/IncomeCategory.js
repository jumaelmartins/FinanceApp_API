import IncomeCategory from "../models/IncomeCategory";

class IncomeCategoryController {
  async index(req, res) {

    const categories = await IncomeCategory.findAll()
    
    res.json(categories);
  }

  async store(req, res) {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(401).json({
        errors: ["Categoria não pode ser null"],
      });
    }
    const categoryExist = await IncomeCategory.findOne({
      where: { category_name: category_name },
    });

    if (categoryExist) {
      return res.status(401).json({
        errors: ["Categoria já existe"],
      });
    }

    const category = await IncomeCategory.create({
      user_id: req.userId,
      category_name,
    });
    return res.json(category);
  }

  async update(req, res) {
    const { category_name, id } = req.body;
    const category = await IncomeCategory.findByPk(id);

    const errors = [];

    if (category_name !== category.category_name) {
      const categoryExist = await IncomeCategory.findOne({
        where: { category_name: category_name },
      });
      categoryExist !== null ? errors.push("Categoria já existe") : "";
      console.log(category_name, "Aqui", category_name);
    }

    if (errors.length > 0) {
      console.log("maior que 0");
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    const updatedCategory = await category.update(req.body);
    return res.json(updatedCategory);
  }

  async delete(req, res) {
    const { id } = req.body;
    const category = await IncomeCategory.findByPk(id);

    const errors = [];

    if (!category) {
      errors.push("Categoria não localizada");
    }

    if (errors.length > 0) {
      return res.status(401).json({
        errors: errors.map((err) => err),
      });
    }

    category.destroy();
    return res.status(200).json({ Tudo: "OK" });
  }
}

export default new IncomeCategoryController();