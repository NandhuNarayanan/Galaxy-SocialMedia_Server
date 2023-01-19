const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/refresh', authController.refresh)
router.get('/logout/:id',verifyJWT,authController.logout)
router.get('/getUsers/:id',verifyJWT,authController.getUsers)
router.get('/getAllUsers/:id',verifyJWT,authController.getAllUsers)

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/google', authController.googleLogin)



module.exports = router;