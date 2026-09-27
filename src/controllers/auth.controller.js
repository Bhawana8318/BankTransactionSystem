const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
// const tokenBlackListModel = require("../models/blackList.model")

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({
        email: email //check already exist to nhi krta hai user 
    }) 

    if (isExists) { // here will check
        return res.status(422).json({   // 422 means Invalid input data 
            message: "User already exists with email.",
            status: "failed"
        })
    } 
    // if user does not exist then we will create new account 
    const user = await userModel.create({
        email, password, name
    })
// to make user login for a interval we need jwt token n for that we need jsonwebtoken which is npm i jwt 
    const token = jwt.sign({ userId: user._id },  process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(201).json({ // when we create new resource it says created successfully 
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
    //mailoader for sending mail for registration 
    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
    const { email, password } = req.body


    // email k basis p hm user ko find krnge  
    const user = await userModel.findOne({ email }).select("+password")
  

// agar nhi milta hai then response

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }
 
 // if found then compare password 

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }
 
 // if pass word is correcr then we generate a token to do this 

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}