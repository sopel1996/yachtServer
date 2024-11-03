const { Work, WorkInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op, Sequelize } = require("sequelize"); // нужен для условий <>= https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
const uuid = require("uuid");
const path = require("path");
const dayjs = require("dayjs");
class WorkController {
  async create(req, res, next) {
    try {
      let {
        name,
        category,
        description,
        oneTimeJob,
        period,
        firstWorkDate,
        nextWorkDate,
        info,
        typeId
      } = req.body;
      const work = await Work.create({
        name,
        category,
        description,
        oneTimeJob,
        period,
        firstWorkDate,
        nextWorkDate,
        typeId
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((el) => {
          WorkInfo.create({
            title: el.title,
            factWorkDate: el.factWorkDate,
            planWorkDate: el.planWorkDate,
            whoDidWork: el.whoDidWork,
            description: el.description,
            workId: work.id,
          });
        });
      }

      return res.json(work);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let devices;
      if (!brandId && !typeId) {
        devices = await Work.findAndCountAll({
          where: {
            // firstWorkDate: { [Op.lt]: '2024-01-01' } // Выбираем записи с firstWorkDate > 2024-01-01
          },
          order: [
            ["id", "ASC"],
            // ['name', 'ASC'],
          ],
          limit,
          offset,
        });
      }
      if (!brandId && typeId) {
        devices = await Work.findAndCountAll({
          where: { typeId },
          limit,
          offset,
        });
      }
      if (!typeId && brandId) {
        devices = await Work.findAndCountAll({
          where: { brandId },
          limit,
          offset,
        });
      }
      if (brandId && typeId) {
        devices = await Work.findAndCountAll({
          where: { brandId, typeId },
          limit,
          offset,
        });
      }
      
      return res.json(devices);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllWithParams(req, res, next) {
    try {
      let { today } = req.query;
      let nextDate = new Date(today);
      let overdueWorks, upcomingWorks;

      nextDate.setDate(nextDate.getDate() + 7);

      upcomingWorks = await Work.findAll({
        where: {
          nextWorkDate: { [Op.between]: [new Date(today), nextDate] },
        },
      });
      overdueWorks = await Work.findAll({
        where: {
          nextWorkDate: { [Op.lt]: new Date(today) },
        },
      });

      return res.json({
        upcomingWorks: upcomingWorks,
        overdueWorks: overdueWorks,
      });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const work = await Work.findOne({
        where: { id },
        include: [{ model: WorkInfo, as: "info" }],
        order: [["info", "id", "DESC"]],
      });
      return res.json(work);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async addDoneWork(req, res, next) {
    try {
      let {
        title,
        factWorkDate,
        planWorkDate,
        whoDidWork,
        description,
        workId,
      } = req.body;

      let workInfo = WorkInfo.create({
        title: title,
        factWorkDate: factWorkDate,
        planWorkDate: planWorkDate,
        whoDidWork: whoDidWork,
        description: description,
        workId: workId,
      });

      let work = await Work.findOne({
        where: { id: workId },
      });

      switch (work.period) {
        case "1 день": {
          work.nextWorkDate = dayjs(factWorkDate)
            .add(1, "day")
            .format("YYYY-MM-DD");
          break;
        }
        case "1 неделя": {
          work.nextWorkDate = dayjs(factWorkDate)
            .add(1, "week")
            .format("YYYY-MM-DD");
          dayjs();
          break;
        }
        case "1 месяц": {
          work.nextWorkDate = dayjs(factWorkDate)
            .add(1, "month")
            .format("YYYY-MM-DD");
          dayjs();
          break;
        }
        case "1 год": {
          work.nextWorkDate = dayjs(factWorkDate)
            .add(1, "year")
            .format("YYYY-MM-DD");
          dayjs();
          break;
        }
      }

      work.changed("nextWorkDate", true);

      await work.save();

      return res.json({ status: 200, message: "added" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getDoneWork(req, res, next) {
    try {
      const { id } = req.params;
      const doneWorks = await WorkInfo.findOne({
        where: { id: id },
      });
      return res.json(doneWorks);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async editWork(req, res, next) {
    try {
      let {
        workName,
        category,
        typeId,
        description,
        oneTimeJob,
        period,
        firstWorkDate,
        nextWorkDate,
      } = req.body;
      let { id } = req.params;

      let work = await Work.findOne({
        where: { id: id },
      });

      work.name = workName;
      work.category = category;
      work.description = description;
      work.oneTimeJob = oneTimeJob;
      work.period = period;
      work.firstWorkDate = firstWorkDate;
      work.nextWorkDate = nextWorkDate;
      work.typeId = typeId;
      work.changed("name", true);
      work.changed("category", true);
      work.changed("description", true);
      work.changed("oneTimeJob", true);
      work.changed("period", true);
      work.changed("firstWorkDate", true);
      work.changed("nextWorkDate", true);
      work.changed("typeId", true);

      await work.save();

      return res.json({ status: 200, message: "edited" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async editDoneWork(req, res, next) {
    try {
      let { title, factWorkDate, whoDidWork, description } = req.body;
      let { id } = req.params;

      let work = await WorkInfo.findOne({
        where: { id: id },
      });

      work.title = title;
      work.factWorkDate = factWorkDate;
      work.whoDidWork = whoDidWork;
      work.description = description;
      work.changed("title", true);
      work.changed("factWorkDate", true);
      work.changed("whoDidWork", true);
      work.changed("description", true);

      await work.save();

      return res.json(work.workId);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteDoneWork(req, res, next) {
    try {
      const { id } = req.params;
      const doneWorks = await WorkInfo.destroy({
        where: { id: id },
      });
      return res.json({ status: 200, message: "deleted" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteWork(req, res, next) {
    try {
      const { id } = req.params;
      await WorkInfo.destroy({
        where: { workId: id },
      });
      await Work.destroy({
        where: { id: id },
      });

      return res.json({ status: 200, message: "deleted" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new WorkController();
