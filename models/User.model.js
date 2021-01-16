// User model here
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: 'Username already exists',
        required: true
    },
    password: {
            type: String,
            required: true
        }
    
}, { timestamps: true })

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        })
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;