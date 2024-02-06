const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')
const checkRoleMIddleware = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRoleMIddleware("ADMIN"), brandController.create)
router.get('/', brandController.getAll)

module.exports = router