const Router = require('express')
const router = new Router()
const workRouter = require('./workRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')


router.use('/work', workRouter)
router.use('/type', typeRouter)
router.use('/user', userRouter)

module.exports = router