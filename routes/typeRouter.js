const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRoleMIddleware = require('../middleware/CheckRoleMiddleware')

// router.post('/', checkRoleMIddleware("ADMIN"), typeController.create)
router.get('/', typeController.getAll)
router.get('/getCategoryList', typeController.getCategoryList)
router.get('/:id', typeController.getOne)
router.post('/', typeController.create)
router.put('/:id/edit', typeController.editType)
router.delete('/:id', typeController.deleteType)


module.exports = router