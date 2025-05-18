const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const friendsAndFollowersRoutes = require('./routes/friendsAndFollowers');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const { setupSwagger } = require('./swagger');

dotenv.config();

const app = express();
app.set('trust proxy', 1);
connectDB();
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users', require('./routes/userSearch'));
app.use(bodyParser.json()); 
app.use('/api/users', friendsAndFollowersRoutes);
const messenger = require('./routes/messenger');
const { initSockets } = require('./sockets/messenger');
app.use('/api/messenger', messenger);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/statistics', require('./routes/statistics')); 
app.use('/api/admin-stats', require('./routes/adminStats')); 

setupSwagger(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
initSockets(server);
