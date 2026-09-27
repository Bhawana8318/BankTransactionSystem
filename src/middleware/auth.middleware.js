const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
// const tokenBlackListModel = require("../models/blackList.model")


// request to check whether the token for cookies wxist or not  
async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ] //we have two options to check 

    if (!token) { // if token not found 
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    // const isBlacklisted = await tokenBlackListModel.findOne({ token })

    // if (isBlacklisted) {
    //     return res.status(401).json({
    //         message: "Unauthorized access, token is invalid"
    //     })
    // }

    try {
       // token verify from the token we receive which is jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
     // dedcoded k andar user id save from auth.controller.js which expires in 3 days  we will find user from database 
        const user = await userModel.findById(decoded.userId)

        req.user = user

        return next()

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

            
// async function authSystemUserMiddleware(req, res, next) {

//     const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

//     if (!token) {
//         return res.status(401).json({
//             message: "Unauthorized access, token is missing"
//         })
//     }

//     const isBlacklisted = await tokenBlackListModel.findOne({ token })

//     if (isBlacklisted) {
//         return res.status(401).json({
//             message: "Unauthorized access, token is invalid"
//         })
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)

//         const user = await userModel.findById(decoded.userId).select("+systemUser")
//         if (!user.systemUser) {
//             return res.status(403).json({
//                 message: "Forbidden access, not a system user"
//             })
//         }

//         req.user = user

//         return next()
//     }
//     catch (err) {
//         return res.status(401).json({
//             message: "Unauthorized access, token is invalid"
//         })
//     }

// }

module.exports = {
    authMiddleware,
    // authSystemUserMiddleware
}