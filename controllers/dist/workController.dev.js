"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("../models/models"),
    Work = _require.Work,
    WorkInfo = _require.WorkInfo;

var ApiError = require("../error/ApiError");

var _require2 = require("sequelize"),
    Op = _require2.Op,
    Sequelize = _require2.Sequelize; // нужен для условий <>= https://sequelize.org/docs/v6/core-concepts/model-querying-basics/


var uuid = require("uuid");

var path = require("path");

var dayjs = require("dayjs");

var WorkController =
/*#__PURE__*/
function () {
  function WorkController() {
    _classCallCheck(this, WorkController);
  }

  _createClass(WorkController, [{
    key: "create",
    value: function create(req, res, next) {
      var _req$body, name, category, description, oneTimeJob, period, firstWorkDate, nextWorkDate, info, typeId, work;

      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _req$body = req.body, name = _req$body.name, category = _req$body.category, description = _req$body.description, oneTimeJob = _req$body.oneTimeJob, period = _req$body.period, firstWorkDate = _req$body.firstWorkDate, nextWorkDate = _req$body.nextWorkDate, info = _req$body.info, typeId = _req$body.typeId;
              _context.next = 4;
              return regeneratorRuntime.awrap(Work.create({
                name: name,
                category: category,
                description: description,
                oneTimeJob: oneTimeJob,
                period: period,
                firstWorkDate: firstWorkDate,
                nextWorkDate: nextWorkDate,
                typeId: typeId
              }));

            case 4:
              work = _context.sent;

              if (info) {
                info = JSON.parse(info);
                info.forEach(function (el) {
                  WorkInfo.create({
                    title: el.title,
                    factWorkDate: el.factWorkDate,
                    planWorkDate: el.planWorkDate,
                    whoDidWork: el.whoDidWork,
                    description: el.description,
                    workId: work.id
                  });
                });
              }

              return _context.abrupt("return", res.json(work));

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              next(ApiError.badRequest(_context.t0.message));

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }, {
    key: "getAll",
    value: function getAll(req, res, next) {
      var _req$query, brandId, typeId, limit, page, offset, devices;

      return regeneratorRuntime.async(function getAll$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _req$query = req.query, brandId = _req$query.brandId, typeId = _req$query.typeId, limit = _req$query.limit, page = _req$query.page;
              page = page || 1;
              limit = limit || 9;
              offset = page * limit - limit;

              if (!(!brandId && !typeId)) {
                _context2.next = 9;
                break;
              }

              _context2.next = 8;
              return regeneratorRuntime.awrap(Work.findAndCountAll({
                where: {// firstWorkDate: { [Op.lt]: '2024-01-01' } // Выбираем записи с firstWorkDate > 2024-01-01
                },
                order: [["id", "ASC"] // ['name', 'ASC'],
                ],
                limit: limit,
                offset: offset
              }));

            case 8:
              devices = _context2.sent;

            case 9:
              if (!(!brandId && typeId)) {
                _context2.next = 13;
                break;
              }

              _context2.next = 12;
              return regeneratorRuntime.awrap(Work.findAndCountAll({
                where: {
                  typeId: typeId
                },
                limit: limit,
                offset: offset
              }));

            case 12:
              devices = _context2.sent;

            case 13:
              if (!(!typeId && brandId)) {
                _context2.next = 17;
                break;
              }

              _context2.next = 16;
              return regeneratorRuntime.awrap(Work.findAndCountAll({
                where: {
                  brandId: brandId
                },
                limit: limit,
                offset: offset
              }));

            case 16:
              devices = _context2.sent;

            case 17:
              if (!(brandId && typeId)) {
                _context2.next = 21;
                break;
              }

              _context2.next = 20;
              return regeneratorRuntime.awrap(Work.findAndCountAll({
                where: {
                  brandId: brandId,
                  typeId: typeId
                },
                limit: limit,
                offset: offset
              }));

            case 20:
              devices = _context2.sent;

            case 21:
              return _context2.abrupt("return", res.json(devices));

            case 24:
              _context2.prev = 24;
              _context2.t0 = _context2["catch"](0);
              next(ApiError.badRequest(_context2.t0.message));

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 24]]);
    }
  }, {
    key: "getAllWithParams",
    value: function getAllWithParams(req, res, next) {
      var today, nextDate, overdueWorks, upcomingWorks;
      return regeneratorRuntime.async(function getAllWithParams$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              today = req.query.today;
              nextDate = new Date(today);
              nextDate.setDate(nextDate.getDate() + 7);
              _context3.next = 6;
              return regeneratorRuntime.awrap(Work.findAll({
                where: {
                  nextWorkDate: _defineProperty({}, Op.between, [new Date(today), nextDate])
                }
              }));

            case 6:
              upcomingWorks = _context3.sent;
              _context3.next = 9;
              return regeneratorRuntime.awrap(Work.findAll({
                where: {
                  nextWorkDate: _defineProperty({}, Op.lt, new Date(today))
                }
              }));

            case 9:
              overdueWorks = _context3.sent;
              return _context3.abrupt("return", res.json({
                upcomingWorks: upcomingWorks,
                overdueWorks: overdueWorks
              }));

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              next(ApiError.badRequest(_context3.t0.message));

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 13]]);
    }
  }, {
    key: "getOne",
    value: function getOne(req, res, next) {
      var id, work;
      return regeneratorRuntime.async(function getOne$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              id = req.params.id;
              _context4.next = 4;
              return regeneratorRuntime.awrap(Work.findOne({
                where: {
                  id: id
                },
                include: [{
                  model: WorkInfo,
                  as: "info"
                }],
                order: [["info", "id", "DESC"]]
              }));

            case 4:
              work = _context4.sent;
              return _context4.abrupt("return", res.json(work));

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              next(ApiError.badRequest(_context4.t0.message));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "addDoneWork",
    value: function addDoneWork(req, res, next) {
      var _req$body2, title, factWorkDate, planWorkDate, whoDidWork, description, workId, workInfo, work;

      return regeneratorRuntime.async(function addDoneWork$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _req$body2 = req.body, title = _req$body2.title, factWorkDate = _req$body2.factWorkDate, planWorkDate = _req$body2.planWorkDate, whoDidWork = _req$body2.whoDidWork, description = _req$body2.description, workId = _req$body2.workId;
              workInfo = WorkInfo.create({
                title: title,
                factWorkDate: factWorkDate,
                planWorkDate: planWorkDate,
                whoDidWork: whoDidWork,
                description: description,
                workId: workId
              });
              _context5.next = 5;
              return regeneratorRuntime.awrap(Work.findOne({
                where: {
                  id: workId
                }
              }));

            case 5:
              work = _context5.sent;
              _context5.t0 = work.period;
              _context5.next = _context5.t0 === "1 день" ? 9 : _context5.t0 === "1 неделя" ? 11 : _context5.t0 === "1 месяц" ? 14 : _context5.t0 === "1 год" ? 17 : 20;
              break;

            case 9:
              work.nextWorkDate = dayjs(factWorkDate).add(1, "day").format("YYYY-MM-DD");
              return _context5.abrupt("break", 20);

            case 11:
              work.nextWorkDate = dayjs(factWorkDate).add(1, "week").format("YYYY-MM-DD");
              dayjs();
              return _context5.abrupt("break", 20);

            case 14:
              work.nextWorkDate = dayjs(factWorkDate).add(1, "month").format("YYYY-MM-DD");
              dayjs();
              return _context5.abrupt("break", 20);

            case 17:
              work.nextWorkDate = dayjs(factWorkDate).add(1, "year").format("YYYY-MM-DD");
              dayjs();
              return _context5.abrupt("break", 20);

            case 20:
              work.changed("nextWorkDate", true);
              _context5.next = 23;
              return regeneratorRuntime.awrap(work.save());

            case 23:
              return _context5.abrupt("return", res.json({
                status: 200,
                message: "added"
              }));

            case 26:
              _context5.prev = 26;
              _context5.t1 = _context5["catch"](0);
              next(ApiError.badRequest(_context5.t1.message));

            case 29:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 26]]);
    }
  }, {
    key: "getDoneWork",
    value: function getDoneWork(req, res, next) {
      var id, doneWorks;
      return regeneratorRuntime.async(function getDoneWork$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              id = req.params.id;
              _context6.next = 4;
              return regeneratorRuntime.awrap(WorkInfo.findOne({
                where: {
                  id: id
                }
              }));

            case 4:
              doneWorks = _context6.sent;
              return _context6.abrupt("return", res.json(doneWorks));

            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](0);
              next(ApiError.badRequest(_context6.t0.message));

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "editWork",
    value: function editWork(req, res, next) {
      var _req$body3, workName, category, typeId, description, oneTimeJob, period, firstWorkDate, nextWorkDate, id, work;

      return regeneratorRuntime.async(function editWork$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _req$body3 = req.body, workName = _req$body3.workName, category = _req$body3.category, typeId = _req$body3.typeId, description = _req$body3.description, oneTimeJob = _req$body3.oneTimeJob, period = _req$body3.period, firstWorkDate = _req$body3.firstWorkDate, nextWorkDate = _req$body3.nextWorkDate;
              id = req.params.id;
              _context7.next = 5;
              return regeneratorRuntime.awrap(Work.findOne({
                where: {
                  id: id
                }
              }));

            case 5:
              work = _context7.sent;
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
              _context7.next = 24;
              return regeneratorRuntime.awrap(work.save());

            case 24:
              return _context7.abrupt("return", res.json({
                status: 200,
                message: "edited"
              }));

            case 27:
              _context7.prev = 27;
              _context7.t0 = _context7["catch"](0);
              next(ApiError.badRequest(_context7.t0.message));

            case 30:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 27]]);
    }
  }, {
    key: "editDoneWork",
    value: function editDoneWork(req, res, next) {
      var _req$body4, title, factWorkDate, whoDidWork, description, id, work;

      return regeneratorRuntime.async(function editDoneWork$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _req$body4 = req.body, title = _req$body4.title, factWorkDate = _req$body4.factWorkDate, whoDidWork = _req$body4.whoDidWork, description = _req$body4.description;
              id = req.params.id;
              _context8.next = 5;
              return regeneratorRuntime.awrap(WorkInfo.findOne({
                where: {
                  id: id
                }
              }));

            case 5:
              work = _context8.sent;
              work.title = title;
              work.factWorkDate = factWorkDate;
              work.whoDidWork = whoDidWork;
              work.description = description;
              work.changed("title", true);
              work.changed("factWorkDate", true);
              work.changed("whoDidWork", true);
              work.changed("description", true);
              _context8.next = 16;
              return regeneratorRuntime.awrap(work.save());

            case 16:
              return _context8.abrupt("return", res.json(work.workId));

            case 19:
              _context8.prev = 19;
              _context8.t0 = _context8["catch"](0);
              next(ApiError.badRequest(_context8.t0.message));

            case 22:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 19]]);
    }
  }, {
    key: "deleteDoneWork",
    value: function deleteDoneWork(req, res, next) {
      var id, doneWorks;
      return regeneratorRuntime.async(function deleteDoneWork$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              id = req.params.id;
              _context9.next = 4;
              return regeneratorRuntime.awrap(WorkInfo.destroy({
                where: {
                  id: id
                }
              }));

            case 4:
              doneWorks = _context9.sent;
              return _context9.abrupt("return", res.json({
                status: 200,
                message: "deleted"
              }));

            case 8:
              _context9.prev = 8;
              _context9.t0 = _context9["catch"](0);
              next(ApiError.badRequest(_context9.t0.message));

            case 11:
            case "end":
              return _context9.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }, {
    key: "deleteWork",
    value: function deleteWork(req, res, next) {
      var id;
      return regeneratorRuntime.async(function deleteWork$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              id = req.params.id;
              _context10.next = 4;
              return regeneratorRuntime.awrap(WorkInfo.destroy({
                where: {
                  workId: id
                }
              }));

            case 4:
              _context10.next = 6;
              return regeneratorRuntime.awrap(Work.destroy({
                where: {
                  id: id
                }
              }));

            case 6:
              return _context10.abrupt("return", res.json({
                status: 200,
                message: "deleted"
              }));

            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10["catch"](0);
              next(ApiError.badRequest(_context10.t0.message));

            case 12:
            case "end":
              return _context10.stop();
          }
        }
      }, null, null, [[0, 9]]);
    }
  }]);

  return WorkController;
}();

module.exports = new WorkController();