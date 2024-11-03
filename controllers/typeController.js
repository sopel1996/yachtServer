const { Type, Work, WorkInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require('../db')

class TypeController {
  async create(req, res, next) {
    try {
      const { name, parent_id } = req.body;
      const type = await Type.create({ name, parent_id });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const types = await Type.findAll();
      return res.json(types);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const type = await Type.findOne({
        where: {id: id}
      });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getCategoryList(req, res, next){
    try{
      const a = await sequelize.query( "WITH RECURSIVE lv_hierarchy AS (" + 
      " SELECT c.id," + 
      "        c.parent_id," + 
      "        c.name," + 
      "        1 AS level," + 
      "        '/' || c.name AS path," + 
      "        array[row_number () over (order by c.name)] AS path_sort" + 
      "   FROM types c" + 
      "  WHERE c.parent_id IS NULL" + 
      "  UNION ALL" + 
      " SELECT c.id," + 
      "        c.parent_id," + 
      "        c.name," + 
      "        p.level + 1 AS level," + 
      "        p.path || '/' || c.name AS path," + 
      "        p.path_sort || row_number () over (partition by c.parent_id order by c.name) AS path_sort" + 
      "   FROM lv_hierarchy p," + 
      "        types c" + 
      "  WHERE c.parent_id = p.id" + 
      ")" + 
      "SELECT c.id," + 
      "       c.name," + 
      "       c.level," + 
      "       c.parent_id," + 
      "       c.level >= lead(c.level, 1, c.level) over (order by c.path_sort) AS is_leaf" + 
      "  FROM lv_hierarchy c" + 
      " ORDER BY path_sort",
      { raw: true })

      return res.json(a[0]);
  }
  catch (e) {
    next(ApiError.badRequest(e.message));
  }
  }

  async editType(req, res, next) {
    try {
      let {
        name,
        parent_id,
      } = req.body;
      let { id } = req.params;

      let type = await Type.findOne({
        where: { id: id },
      });

      type.name = name;
      type.parent_id = parent_id;
      type.changed("name", true);
      type.changed("parent_id", true);

      await type.save();

      return res.json({ status: 200, message: "edited" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteType(req, res, next) {
    try {
      const { id } = req.params;

      const works = await Work.findAll({
        where: {typeId: id}
      })

      for (const work of works) {
          await WorkInfo.destroy({
            where: { workId: work.id },
          });
        await Work.destroy({
          where: {id:  work.id}
        })
      }
      await Type.destroy({
        where: { id: id },
      });
      return res.json({ status: 200, message: "deleted" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TypeController();
