const sequelize = require('../db')

const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},

})
const Basket = sequelize.define('basket',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},

})
const BasketWork = sequelize.define('basket_device',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},

})

const Work = sequelize.define('work',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    oneTimeJob: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    period: {type: DataTypes.STRING, allowNull: true},
    firstWorkDate: {type: DataTypes.DATE, allowNull: false},
    nextWorkDate: {type: DataTypes.DATE, allowNull: true},

})
const Type = sequelize.define('type',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},

})
const Brand = sequelize.define('brand',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},

})
const Rating = sequelize.define('rating',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, unique: true, allowNull: false},

})
const WorkInfo = sequelize.define('work_info',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    factWorkDate: {type: DataTypes.DATE, allowNull: false},
    planWorkDate: {type: DataTypes.DATE, allowNull: false},
    whoDidWork: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},

})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketWork)
BasketWork.belongsTo(Basket)

Type.hasMany(Work)
Work.belongsTo(Type)

Brand.hasMany(Work)
Work.belongsTo(Brand)

Work.hasMany(Rating)
Rating.belongsTo(Work)

Work.hasMany(BasketWork)
BasketWork.belongsTo(Work)

Work.hasMany(WorkInfo, {as: 'info'})
WorkInfo.belongsTo(Work)

Type.belongsToMany(Brand,{through:TypeBrand})
Brand.belongsToMany(Type,{through:TypeBrand})

module.exports = {
    User,
    Basket,
    BasketWork,
    Work,
    Type,
    Brand,
    Rating,
    WorkInfo
}