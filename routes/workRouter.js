const Router = require('express')
const router = new Router()
const workController = require('../controllers/workController')
const checkRoleMIddleware = require('../middleware/CheckRoleMiddleware')

// router.post('/', checkRoleMIddleware("ADMIN"), workController.create)
router.get('/', workController.getAll)
router.get('/getAllWithParams', workController.getAllWithParams)
router.get('/:id', workController.getOne)
router.get('/donework/:id', workController.getDoneWork)
router.post('/', workController.create)
router.post('/donework', workController.addDoneWork)
router.put('/:id/edit', workController.editWork)
router.put('/donework/:id/edit', workController.editDoneWork)
router.delete('/donework/:id', workController.deleteDoneWork)
router.delete('/:id', workController.deleteWork)

module.exports = router