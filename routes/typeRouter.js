const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRoleMIddleware = require('../middleware/CheckRoleMiddleware')

// router.post('/', checkRoleMIddleware("ADMIN"), typeController.create)
router.post('/', typeController.create)
router.get('/', typeController.getAll)

module.exports = router