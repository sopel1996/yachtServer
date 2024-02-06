const Router = require('express')
const router = new Router()
const brandRouter = require('./brandRouter')
const workRouter = require('./workRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')


router.use('/brand', brandRouter)
router.use('/work', workRouter)
router.use('/type', typeRouter)
router.use('/user', userRouter)

module.exports = router