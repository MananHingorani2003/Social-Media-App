const express = require ("express");
const Auth = require ("../models/auth");
const mongoose = require ("mongoose");
const bcrypt = require ("bcrypt");
const router = express.Router();
const catchAsync = require ("../utils/catchAsync");
const expressError = require ("../utils/expressError");
const passport = require("passport");
const LocalStrategy = require ("passport-local");
const Post = require ("../models/posts");
const methodOverride = require ("method-override");
const auth = require("../models/auth");
router.use (methodOverride('_method'));


router.get ("/", (req, res) => {
    res.render ("pages/login");
})

router.post ("/",catchAsync(async (req, res) => {

    const {username, password} = req.body;
    const auth = await Auth.findOne({username});
    if (!auth) {
        res.redirect ('/login');
    }
    else {
        const validPassword = await bcrypt.compare(password, auth.password);
        if (validPassword) {
            req.session.auth_id = auth._id;
            res.redirect (`/login/${auth._id}`);
        }
        else {
            res.redirect ('/login');
        }
    }
    

}))

router.post ("/:id", catchAsync(async (req, res) => {
    req.session.auth_id = null;
    res.redirect ('/login');
}))

router.post ("/:id/savedpost", catchAsync (async (req, res) => {
    const auth = await Auth.findById (req.params.id);
    const {location, description, image} = req.body;
    console.log (image);
    const post = new Post ({
        location: location,
        image: image,
        description: description,
        username: auth.username
    })
    await post.save();
    req.flash ('success', "Lets gooo!!!");
    const allPosts = await Post.find ({});
    res.render ("pages/page2", {auth, allPosts});
    // res.redirect (`/login/${auth._id}`);
    
}))

router.get ("/:id", catchAsync(async (req, res) => {
    const auth = await Auth.findById (req.params.id);
    const allPosts = await Post.find ({});
    res.render ("pages/page2", {auth, allPosts});

}))

router.get ("/:id/post", catchAsync (async (req, res) => {
    const author = await Auth.findById (req.params.id);
    res.render ("pages/post", {author});
    
}))

router.get ("/:id/viewpost/:id2", catchAsync (async (req, res) => {
    const author = await Auth.findById (req.params.id);
    const post = await Post.findById (req.params.id2);
    res.render ("pages/show", {author, post});

}))

router.delete ('/:id/viewpost/:id2', catchAsync( async (req, res) => {
    const {id2, id} = req.params;
    const author = await Auth.findById (req.params.id);
    const post = await Post.findById (req.params.id2);

    if (post.username === author.username) {
        await Post.findByIdAndDelete (id2);
        res.redirect (`/login/${id}`);
    }
    

}))

router.get ("/:id/viewpost/:id2/edit", catchAsync (async (req, res) => {
    const author = await Auth.findById (req.params.id);
    const post = await Post.findById (req.params.id2);
    res.render ("pages/edit", {author, post});

}))

router.put ('/:id/viewpost/:id2/edit' ,catchAsync( async (req, res) => {
    const {id, id2} = req.params;
    const author = await Auth.findById (req.params.id);
    const post = await Post.findByIdAndUpdate (id2, {"location": req.body.location, "image": req.body.image, "description": req.body.description});
    res.redirect (`/login/${author._id}/viewpost/${post._id}`);

}))



module.exports = router;