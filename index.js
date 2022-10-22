const express = require ("express");
const app = express ();
const path = require ("path");
const cookieParser = require ("cookie-parser");
const ejsMate = require ("ejs-mate");
const methodOverride = require ("method-override");
const bcrypt = require ("bcrypt");
const mongoose = require ("mongoose");
const Auth = require ("./models/auth");
const session = require ("express-session");
const flash = require ("connect-flash");
const loginRoutes = require ("./routes/login");
const homeRoutes = require ("./routes/home");
const { join } = require("path");
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const catchAsync = require ("./utils/catchAsync");
const expressError = require ("./utils/expressError");
const cors = require ("cors");
app.use (cors());
const io = require("socket.io")(8000);





const users = {};

io.on ('connection', socket => { 
    socket.on ('new-user-joined', name => {
        users [socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on ('send', message => {
        socket.broadcast.emit ('receive', {message: message, name: user [socket.id]})
    })
})

mongoose.connect ('mongodb://localhost:27017/social-media', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on ("error", console.error.bind (console, "connection error:"));
db.once ("open", () => {
    console.log ("Database connected!!!");
});

app.engine ('ejs', ejsMate);

app.set ('view engine', 'ejs');
app.set ('views', path.join (__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use (methodOverride('_method'));
app.use (cookieParser());
app.use (flash());
app.use (express.static(__dirname + '/public'));
app.use (session({ secret: 'notagoodsecret' }));

app.use (passport.initialize());
app.use (passport.session());
passport.use (new LocalStrategy (Auth.authenticate()));

passport.serializeUser (Auth.serializeUser());
passport.deserializeUser (Auth.deserializeUser());

app.use ('/login', loginRoutes);
app.use ('/', homeRoutes);



app.post ('/logout', (req, res) => {
    req.session.destroy ();
    return res.redirect("/login");
})

app.get ("/chatroom", (req, res) => {
    res.render ("pages/chatroom");
})

app.use ((err, req, res, next) => {
    const {message = "Something went wong!!!", statusCode = 500} = err;
    if (!err.message) {
        err.message = "Oh No! SOmething went wrong!!!";
    }
    res.status(statusCode).render ('error', {err});
})

app.listen (4000, () => {
    console.log ("Listening on Port 4000!!!");
})