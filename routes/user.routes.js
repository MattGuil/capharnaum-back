const router = require('express').Router();

authController = require('../contollers/auth.controller');
userController = require('../contollers/user.controller');

// Auth
router.post('/register', authController.signUp);
router.get('/confirm/:token', authController.confirmEmail);
router.post('/login', authController.signIn);
router.get('/logout', authController.signOut);

// CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;