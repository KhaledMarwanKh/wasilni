const express = require('express');
const router = express.Router();
const getUsers = require('../controllers/admin/getUsers.js');
const getUser = require('../controllers/admin/getUser.js');
const deleteUser = require('../controllers/admin/deleteUser.js');
const updateUser = require('../controllers/admin/updateUser.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const app = require('../app.js');
const checkRole = require('../middleware/checkRoleMiddleware.js');

// middlewares
router.use(authMiddleware);
router.use(checkRole('admin'));

// routes
router.get('/:id', getUser);
router.get('/', getUsers);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
