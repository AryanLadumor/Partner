const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const router = express.Router();

const USER_SAFE_DATA = "firstName lastName age about gender photoURL skills"


//API -> [GET user/connections] => (to fetch all the match friends)
router.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedUser = req.user;

        const userConnections = await ConnectionRequest.find({
            $or:
                [
                    { fromUserId: loggedUser._id, status: "accepted" },
                    { toUserId: loggedUser._id, status: "accepted" }
                ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        //}).populate("fromUserId" , ["firstName" , "lastName"]) this also works


        const allConnections = userConnections.map((obj) => {
            if (obj.fromUserId._id.toString() === loggedUser._id.toString()) {
                return obj.toUserId;
            } else {
                return obj.fromUserId;
            }
        })

        res.json({
            msg: "Data Fetched Successfully",
            connections: allConnections
        })
    } catch (error) {
        res.status(400).json({ msg: "Error: " + error.message })
    }


})

//API -> [GET /user/requests/received] => (To Get All the requests)
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            msg: "Data Fetched Successfully",
            requests: requests,
        })
    } catch (error) {
        res.status(400).json({ msg: "Error " + error.message })
        
    }
})

//API -> [GET /user/feed] => (To Get Feed Of User With pagination )
router.get("/user/feed", userAuth, async (req, res) => {

    try {
        const loggedUser = req.user;

        //pagination for feed API 
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit>20? 20 : limit
        const skip = (page-1)*limit

        //all user which have sended or reviewed request to logged User
        const hideFromFeedUsers = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }]
        }).select("fromUserId toUserId")
        
        //Fetching their ID only
        const hideFromFeedUserIds = new Set();
        hideFromFeedUsers.forEach(conReq => {
            hideFromFeedUserIds.add(conReq.fromUserId.toString());
            hideFromFeedUserIds.add(conReq.toUserId.toString());
        })

        //Users which the logged user has Never seen with pagination
        const feedUsers = await User.find({
           $and : [
                {_id : {$nin :  Array.from(hideFromFeedUserIds)} },
                {_id : {$ne : loggedUser._id}} 
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);


        res.json({ msg: "Feed Created"  , feedUsers   })
        
    } catch (error) {
        res.status(400).json({msg : "Error: " + error.message})
    }
})

module.exports = router;