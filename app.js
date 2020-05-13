const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

/*Routerlar tanımlanıyor.*/
const userRoute = require('./router/users');
const adminRoute = require('./router/admins');

/*Veritabanı ayarları app.js dosyasına dahil edilerek connection sağlanıyor*/
const config = require('./config/database');

//Veritabanına bağlantı yapılıyor.
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => {
    console.log('Database Connection Successfully : ' + config.database);
}).catch(error => {
    console.log(error.message);
});


/*App initialize ediliyor.*/
const app = express();

/*PORT tanımı yapılıyor.*/
const PORT = process.env.PORT || 5000;

/*Defining the middlewares*/
app.use(cors());

/*Ihtiyaca göre projede kullanılacaksa resource dosyalarının path i gösteriliyor.*/
app.use(express.static(path.join(__dirname, 'public')));

/*Bodyparser Middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*Passport middleware*/
app.use(passport.initialize());
app.use(passport.session());

/*Default olarak belirlenen karşılama route'u */
app.get('/', (request, response) => {
    return response.json({message: 'This nodejs role based authentication'});
});

/*Kullanıcı tipinin belirlenmesi için yazılan basit middleware katmanı*/
const checkUserType=function(request,response,next){
    const userType =request.originalUrl.split('/')[2];
    require('./config/passport')(userType,passport);
    next();
};
app.use(checkUserType);



/*Routerların kullanıma hazır hale geldiği birim*/
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);

/*Uygulamanın başladığı listen fonksiyonu*/
app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});