const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/profile/:username', isAuth, userController.getProfileInfoByUsername);

router.post('/user/add-friend', isAuth, userController.sendFriendRequest);

router.post('/user/undo-request', isAuth, userController.undoFriendRequest);

router.post('/user/handle-received-request', isAuth, userController.handleFriendRequest);

router.delete('/user/delete-friend/:friendId', isAuth, userController.removeFriend);

module.exports = router;