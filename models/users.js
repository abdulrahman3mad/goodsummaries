const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const usersSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },

    password: {
        type: String,
    },

    booksLiked: [String],
    publishedBooks: [String],
    savedBooks: [String],

    following: [String]
})

/*
usersSchema.virtual("coverimagepath").get(function () {
    if (this.personalcover != null && this.personalcovertype != null) {
        return `data:${this.personalcovertype};charset=utf-8;base64,
        ${this.personalcover.toString(`base64`)}`
    }
})
*/

//mongoose hooks 
//to make something occure before or after something else

//after any saving document process

// fire a function before doc saved to db
/*
usersSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
usersSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};
*/


const users = mongoose.model("users", usersSchema);
module.exports = users;

//the process of hashing password is based on two steps 
//1- add a random text before the main password (salt)
//2- the password pass throught the hashing algorithm, and this algorithm will convert the final password to a rendom string 


// when a user log in
//his password will pass through the same steps, so if the final result as the same as a one saved in the db
//it will log in correctlly


