
const mongoose = require("mongoose");

const posts = mongoose.Schema({
    userId: String,
    title: String,
    postData: String,
    createdBy: String,
    latitude: String,
    longitude: String,
    isActive: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

var Post = mongoose.model("Post", posts);

module.exports = Post;
