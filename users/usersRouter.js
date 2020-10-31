const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("./user-model");
const { restrict } = require("./middleware");

router.get("/users", restrict(), async (req, res, next) => {
  try {
    const users = await db.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: " This username not available",
      });
    }
    const newUser = await db.add({
      username,
      // hased password with bcrypt.hash and passed password & time complexity.
      password: await bcrypt.hash(password, 14),
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const theUser = await db.findBy({ username }).first();

    // check if its the user??? if not send err
    if (!theUser) {
      return res.status(400).json({
        message: "You shall not pass!",
      });
    }
    // compare the request password by using bcrypt.compare if it's matches the one we have in database.
    const passwordCheck = await bcrypt.compare(password, theUser.password);

    // if dosen't match with what we have in db send err
    if (!passwordCheck) {
      return res.status(400).json({
        message: "You shall not pass!",
      });
    }
    req.session.theUser = theUser;
    // if it's user send this message
    res.json({ message: `welcome ${theUser.username}` });
  } catch (err) {
    next(err);
  }
});
router.get("/logout", restrict(), async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).end();
      }
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
