const User = require("../models/usres");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Post = require("../models/posts");
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);
  // console.log(name, email, password, hashpassword);
  try {
    const userInDB = await User.find({ email: email });
    if (userInDB.length == 0) {
      const data = new User({ name, email, password: hashpassword });
      await data.save();
      var userId = data._id

      res.status(201).json({
        message: " Successfully",
        status: 1,

      });

    } else {
      res.status(200).json({
        message: "this email is Alredy Used",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 0,
      message: "something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const data = await User.findOne({
    where: { email: email, isActive: true },
  });

  try {
    const isData = await bcrypt.compare(password, data.password);
    console.log(isData);
    if (data && isData) {
      const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET);
      return res.status(200).json({
        status: 1,
        token: token,
      });
    } else {
      res.send("user not found");
    }
  } catch (err) {
    return res.status(500).json({
      status: 0,
      message: "something went wrong",
    });
  }
};

exports.postCreate = async (req, res) => {
  const { title, postData, createdBy, latitude, longitude, isActive } = req.body;
  try {
    if (req.userId == undefined) {
      return res.status(401).json({
        status: 0,
        message: "request not authorize."
      })
    }

    const data = new Posts({ userId: req.userId, title, postData, createdBy, latitude, longitude, isActive });
    await data.save();
    return res.status(200).json({
      status: 1,
      message: "Post add Successfully",

    });
  } catch (err) {
    return res.status(500).json({
      status: 0,
      message: "something went wrong",
    });
  }
};
exports.getPost = async (req, res) => {
  try {
    if (req.userId == undefined) {
      return res.status(401).json({
        status: 0,
        message: "request not authorize."
      })
    }
    const data = await Post.find({ userId: req.userId });

    res.status(200).json({
      status: 1,
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "error",
    });

  }



};


exports.editPost = async (req, res) => {

  const data = new Posts(req.body);
  const { id } = req.query;
  //console.log(data.meta, data.title, "ooioioiioo");
  // console.log(data, id, "0-=]0=-=90=-0");
  try {

    if (req.userId == undefined) {
      return res.status(401).json({
        status: 0,
        message: "request not authorize."
      })
    }
    await Post.updateOne({ userId: req.userId, _id: id }, data);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
  }
};

exports.removePost = async (req, res) => {
  try {
    const { id } = req.query;
    if (req.userId == undefined) {
      return res.status(401).json({
        status: 0,
        message: "request not authorize."
      })
    }
    const data = await Post.findByIdAndDelete(-id)

    res.status(200).json({
      status: 1,
      message: "data Deleted",

    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "error",
    });
    console.log(error);
  }
};


exports.getGeoLocation = async (req, res) => {

  try {
    const { id } = req.query;
    const data = await Post.findOne({ _id: id }, { latitude: 1, longitude: 1 });

    res.status(200).json({
      status: 1,
      message: "data fetch",
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "error",
    });
    console.log(error);
  }
};

exports.getCount = async (req, res) => {

  try {
    const activeCount = Post.filter(post => post.isActive).length;
    const inactiveCount = Post.filter(post => !post.isActive).length;

    return res.status(200).json({
      status: 1,
      data: {
        "activeCount": activeCount, "inactiveCount": inactiveCount
      },

    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "something went wrong",
      error: error
    });
  }
};