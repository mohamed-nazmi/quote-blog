const express = require('express');
const multer = require('multer');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get('/profile/:username', isAuth, userController.getProfileInfoByUsername);

router.post('/user/add-friend', isAuth, userController.sendFriendRequest);

router.post('/user/undo-request', isAuth, userController.undoFriendRequest);

router.post('/user/handle-received-request', isAuth, userController.handleFriendRequest);

router.delete('/user/delete-friend/:friendId', isAuth, userController.removeFriend);

router.get('/friends/:username', userController.getFriendsByUsername);

router.get('/sent-requests', isAuth, userController.getUserSentRequests);

router.get('/received-requests', isAuth, userController.getUserReceivedRequests);

router.post('/update-image', isAuth, multer({ storage: storage }).single('image'), userController.updateUserProfilePicture);

module.exports = router;