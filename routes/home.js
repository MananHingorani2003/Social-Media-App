const express = require ("express");
const Auth = require ("../models/auth");
const mongoose = require ("mongoose");
const bcrypt = require ("bcrypt");
const router = express.Router();
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const catchAsync = require ("../utils/catchAsync");
const expressError = require ("../utils/expressError");




router.get ('/', (req, res) => {
    res.render ('pages/landingPage');
})

router.post ("/", catchAsync(async (req, res) => {
    
    const {username2, password2, email, name} = req.body;
        const auth = new Auth ({
            username: username2,
            password: bcrypt.hashSync(password2,10),
            email: email,
            name: name
        })
        await auth.save();
        req.flash ('success', "Welcome to my page!");
        req.session.auth_id = auth._id;
        if (req.session.auth_id) {
            res.redirect (`/login/${auth._id}`);
        }
    
    

}))

router.get ("/login/:id", catchAsync(async (req, res) => {
    res.render ("pages/page2");

}))


module.exports = router;