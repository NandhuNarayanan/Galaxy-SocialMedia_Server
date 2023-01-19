const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')


router.get('/getUsers',adminController.getUsers)

router.get('/reportPost',adminController.reportPost)

router.patch('/removePost',adminController.removePost)

router.patch('/blockUser',adminController.blockUser)

router.post('/declinePost',adminController.declinePost)

router.post('/',adminController.adminlogin)




module.exports = router;