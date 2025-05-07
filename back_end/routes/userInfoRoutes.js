const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const UserInfo = require('../controllers/user/userInfoController');
const app = express();
const router = express.Router();

router.use(authMiddleware);

router.get('/', UserInfo);
