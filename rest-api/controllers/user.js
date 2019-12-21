const User = require('../models/user');

exports.getProfileInfoByUsername = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(fetchedUser => {
            if (!fetchedUser) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }
            const profileInfo = {
                userId: fetchedUser._id.toString(),
                firstname: fetchedUser.firstname,
                lastname: fetchedUser.lastname,
                username: fetchedUser.username,
                imagePath: fetchedUser.imagePath,
                relationship: determineRelationship(req.user, fetchedUser)
            };
            res.status(200).json({
                profileInfo
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.sendFriendRequest = (req, res, next) => {
    const requestedFriendId = req.body.requestedFriendId;
    User.findById(requestedFriendId)
        .then(requestedFriend => {
            if (!requestedFriend) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                req.user._id.toString() === requestedFriendId ||
                req.user.friends.includes(requestedFriend._id) ||
                req.user.sentRequests.includes(requestedFriend._id) ||
                req.user.receivedRequests.includes(requestedFriend._id) ||
                requestedFriend.friends.includes(req.user._id) ||
                requestedFriend.sentRequests.includes(req.user._id) ||
                requestedFriend.receivedRequests.includes(req.user._id)
            ) {
                const error = new Error('Conflict!');
                error.statusCode = 409;
                throw error;
            }

            requestedFriend.receivedRequests.push(req.user);
            return requestedFriend.save();
        })
        .then(requestedFriend => {
            req.user.sentRequests.push(requestedFriend);
            return req.user.save();
        })
        .then(() => {
            res.status(200).json({});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.undoFriendRequest = (req, res, next) => {
    const requestedFriendId = req.body.requestedFriendId;
    User.findById(requestedFriendId)
        .then(requestedFriend => {
            if (!requestedFriend) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                !req.user.sentRequests.includes(requestedFriend._id) ||
                !requestedFriend.receivedRequests.includes(req.user._id)
            ) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                req.user._id.toString() === requestedFriendId ||
                req.user.friends.includes(requestedFriend._id) ||
                req.user.receivedRequests.includes(requestedFriend._id) ||
                requestedFriend.friends.includes(req.user._id) ||
                requestedFriend.sentRequests.includes(req.user._id)
            ) {
                const error = new Error('Conflict!');
                error.statusCode = 409;
                throw error;
            }

            const updatedReceivedRequests = requestedFriend.receivedRequests.filter(request => request._id.toString() !== req.user._id.toString());
            requestedFriend.receivedRequests = updatedReceivedRequests;
            return requestedFriend.save();
        })
        .then(requestedFriend => {
            const updatedSentRequests = req.user.sentRequests.filter(request => request._id.toString() !== requestedFriend._id.toString());
            req.user.sentRequests = updatedSentRequests;
            return req.user.save();
        })
        .then(() => {
            res.status(200).json({});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.handleFriendRequest = (req, res, next) => {
    const requestedFriendId = req.body.requestedFriendId;
    const doAccept = req.body.doAccept;

    User.findById(requestedFriendId)
        .then(requestedFriend => {
            if (!requestedFriend) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                !req.user.receivedRequests.includes(requestedFriend._id) ||
                !requestedFriend.sentRequests.includes(req.user._id)
            ) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                req.user._id.toString() === requestedFriendId ||
                req.user.friends.includes(requestedFriend._id) ||
                req.user.sentRequests.includes(requestedFriend._id) ||
                requestedFriend.friends.includes(req.user._id) ||
                requestedFriend.receivedRequests.includes(req.user._id)
            ) {
                const error = new Error('Conflict!');
                error.statusCode = 409;
                throw error;
            }

            const updatedSentRequests = requestedFriend.sentRequests.filter(request => request._id.toString() !== req.user._id.toString());
            requestedFriend.sentRequests = updatedSentRequests;

            if (doAccept) {
                requestedFriend.friends.unshift(req.user);
            }
            return requestedFriend.save();
        })
        .then(requestedFriend => {
            const updatedReceivedRequests = req.user.receivedRequests.filter(request => request._id.toString() !== requestedFriend._id.toString());
            req.user.receivedRequests = updatedReceivedRequests;

            if (doAccept) {
                req.user.friends.unshift(requestedFriend);
            }
            return req.user.save();
        })
        .then(() => {
            res.status(200).json({});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.removeFriend = (req, res, next) => {
    const friendId = req.params.friendId;
    User.findById(friendId)
        .then(friend => {
            if (!friend) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                !req.user.friends.includes(friend._id) ||
                !friend.friends.includes(req.user._id)
            ) {
                const error = new Error('Not Found!');
                error.statusCode = 404;
                throw error;
            }

            if (
                req.user._id.toString() === friendId ||
                req.user.sentRequests.includes(friend._id) ||
                req.user.receivedRequests.includes(friend._id) ||
                friend.sentRequests.includes(req.user._id) ||
                friend.receivedRequests.includes(req.user._id)
            ) {
                const error = new Error('Conflict!');
                error.statusCode = 409;
                throw error;
            }

            const friends = friend.friends.filter(friend => friend._id.toString() !== req.user._id.toString());
            friend.friends = friends;
            return friend.save();
        })
        .then(removedFriend => {
            const friends = req.user.friends.filter(friend => friend._id.toString() !== removedFriend._id.toString());
            req.user.friends = friends;
            return req.user.save();
        })
        .then(() => {
            res.status(200).json({});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getFriendsByUsername = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            return user.populate('friends').execPopulate();
        })
        .then(user => {
            res.status(200).json({
                friends: mapFriendsInResponse(user.friends)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserSentRequests = (req, res, next) => {
    req.user
        .populate('sentRequests')
        .execPopulate()
        .then(user => {
            res.status(200).json({
                sentRequests: mapFriendsInResponse(user.sentRequests)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserReceivedRequests = (req, res, next) => {
    req.user
        .populate('receivedRequests')
        .execPopulate()
        .then(user => {
            res.status(200).json({
                receivedRequests: mapFriendsInResponse(user.receivedRequests)
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserProfilePicture = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.user.imagePath = url + '/images/' + req.file.filename;
    req.user.save()
        .then(user => {
            res.status(200).json({});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

determineRelationship = (currentUser, fetchedUser) => {
    let relationship;

    if (currentUser._id.toString() === fetchedUser._id.toString()) {
        relationship = 'Me';
    } else if (currentUser.friends.includes(fetchedUser._id)) {
        relationship = 'Friend';
    } else if (currentUser.sentRequests.includes(fetchedUser._id)) {
        relationship = 'Sent';
    } else if (currentUser.receivedRequests.includes(fetchedUser._id)) {
        relationship = 'Received';
    } else {
        relationship = 'None';
    }

    return relationship;
};

mapOneFriendInResponse = friend => {
    const friendInResponse = {
        _id: friend._id,
        fullname: friend.firstname.concat(' ', friend.lastname),
        username: friend.username,
        imagePath: friend.imagePath
        // description: friend.description
    };
    return friendInResponse
};

mapFriendsInResponse = friends => {
    const friendsInResponse = friends.map(friend => {
        return mapOneFriendInResponse(friend);
    });
    return friendsInResponse;
};