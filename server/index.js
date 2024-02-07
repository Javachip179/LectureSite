const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const subcategoriesRoutes = require('./routes/subcategories');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/main');
const categoriesRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const userInfoRoutes = require('./routes/userInfo');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const lectureRoutes = require('./routes/lectures');
const enrollmentRoutes = require('./routes/enrollment');
const fileRoute = require('./img_server/fileUpload');

// 미들웨어 등록
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/search-list', searchRoutes);
app.use('/api/userInfo', userInfoRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/modify', paymentRoutes);
app.use('/api/lecture', lectureRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/file', fileRoute);
app.use('/api/subcategories', subcategoriesRoutes);

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

module.exports = app;
