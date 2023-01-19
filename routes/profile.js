const Router = require('express');
const router = Router();
const profileController = require('../controller/profileController')


router.get('/:id',profileController.profile)

router.get('/userList/:id',profileController.userList)

router.patch('/follow', profileController.follow)

router.patch('/profilePicture', profileController.profilePicture)

router.patch('/editProfile', profileController.editProfile)

router.post('/searchUser',profileController.searchUser)



module.exports = router