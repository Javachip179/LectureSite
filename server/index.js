const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/main');
const categoriesRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const userInfoRoutes = require('./routes/userInfo');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const lectureRoutes = require('./routes/lectures');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'session123',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/search-list', searchRoutes);
app.use('/api/userInfo', userInfoRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/modify', paymentRoutes);
app.use('/api/lecture', lectureRoutes);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;
