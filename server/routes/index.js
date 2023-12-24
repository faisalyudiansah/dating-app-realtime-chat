const express = require('express')
const router = express.Router()

const authenTokenMiddleware = require('../middlewares/authentication')
const authorizationOwner = require('../middlewares/authorizationOwner')
const errorHandler = require('../middlewares/errorHandler')
const LoginController = require('../controllers/LoginController')
const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')
const PaymentController = require('../controllers/PaymentController')

//=============================================================================== // Home

router.get('/', (req, res) => {
    res.status(200).json({ message: "Server-side RESTful API Dating App is Running..."})
})

//=============================================================================== // Register + Login

router.post('/register', LoginController.register)
router.post('/login', LoginController.login)
router.post('/google-login', LoginController.googleLogin)
router.post('/payment/midtrans/notification', PaymentController.getMidtransNotification)

//=============================================================================== // User Account
router.use(authenTokenMiddleware)

router.get('/users', UserController.showAllUser)
router.get('/users/profile', authorizationOwner, UserController.userProfile)
router.put('/users', authorizationOwner, UserController.updateUser)
router.delete('/users', authorizationOwner, UserController.deleteUser)

router.post('/users/like/:idUser', UserController.likeUser)
router.post('/users/dislike/:idUser', UserController.dislikeUser)

router.get('/users/matches', UserController.matchesLike)

router.post('/payment/midtrans/token', PaymentController.getMidtransToken)

//=============================================================================== // Chat

router.post('/chat/:idUser', ChatController.createChatList)
router.get('/chat/find', ChatController.findUserChat)

router.post('/message', ChatController.createMessage)
router.get('/message/:ChatId', ChatController.getMessage)

//=============================================================================== // Error Handler

router.use(errorHandler)


module.exports = router