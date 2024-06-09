const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, required: false },
        email: { type: String, required: false },
        phone: { type: String, required: false },
        avatar: {
            type: String,
            required: false,
            get: (avatar) => {
                if (avatar) {
                    return `${process.env.BASE_URL}${avatar}`;
                }
                return avatar;
            },
        },
        activated: { type: Boolean, required: false, default: false },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
    }
);

module.exports = mongoose.model('User', userSchema, 'users');
