const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/createuser', userController.addNewUser)
router.post('/loginuser', userController.loginUser)
router.get('/getusers', userController.findUsers)
router.put('/updateuser', userController.UpdateUsers)
router.post('/resetpassword', userController.resetPassword)
router.post('/resetpassword/:token', userController.changePassword)
router.delete('/deleteuser', userController.deleteUser)
module.exports = router
