const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, "Email is required for creating a user" ],
        trim: true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
        unique: [ true, "Email already exists." ]
    },
    name: {
        type: String,
        required: [ true, "Name is required for creating an account" ]
    },
    password: {
        type: String,
        required: [ true, "Password is required for creating an account" ],
        minlength: [ 6, "password should contain more than 6 character" ],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    } //user pass chnge krta hai future m 
    //pre pass ko hash me covert krke database me save kr degi 

    const hash = await bcrypt.hash(this.password, 10) // convert to hash using bcrypt 
    this.password = hash    // save krnge 

    return

})

userSchema.methods.comparePassword = async function (password) {   //comapare pass jo database m save hai usse comapre krti hai

    console.log(password, this.password)

    return await bcrypt.compare(password, this.password)
// bcrypt.compare user n pass dia hai sahi hai to true return else false rteurn   
}


const userModel = mongoose.model("user", userSchema)

module.exports = userModel




// pre is middleware 