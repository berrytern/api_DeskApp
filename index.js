const app = require('express')()
const consign = require('consign')
const path =require('path')
const handlebars = require('express-handlebars')


consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./config/routes.js')
    .into(app)


app.listen(4000, () => {
    console.log('Backend executando...')
})