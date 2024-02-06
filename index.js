require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router= require('./routes/index')
const errorHandler= require('./middleware/ErrorHandlingMiddleware')
const path= require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static/img')))
app.use('/api', router)




//Самый последний app.use, ибо обработка ошибок
app.use('/api', errorHandler)

app.get('/', (req, res) =>{
    res.status(200).json({message: 'WORK'})
})
const start = async () =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, ()=>{console.log(`Server started on port ${PORT}`)})
    }
    catch (e){
        console.log(e)
    }
}

start()