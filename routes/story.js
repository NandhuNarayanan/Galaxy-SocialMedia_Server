const Router = require('express');
const router = Router();
const storyController = require('../controller/storyController')


router.post('/uploadStory',storyController.uploadStory)

router.get('/getStory',storyController.getStory)



module.exports = router