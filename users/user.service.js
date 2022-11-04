﻿const config = require("config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  logout,
  getAudit,
};

async function authenticate({ username, password }, ip) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    user.login.push({ date: new Date(), ip });
    await user.save();
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);

    return {
      ...userWithoutHash,
      token,
    };
  }
}

async function getAll() {
  return await User.find().select("-hash");
}

async function getById(id) {
  return await User.findById(id).select("-hash");
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function logout(id, ip) {
  const user = await User.findById(id).select("-hash");

  user.logout.push({ date: new Date(), ip });

  await user.save();
}

async function getAudit(id) {
  //   console.log(id);
  const user = await User.findById(id).select("-hash");
  if (user.role.toLowerCase() != "auditor") {
    throw { name: "Unauthorized" };
  }

  const users = await User.find().select("-hash");

  let response = [];

  users.forEach((user) => {
    //return only those who have logged in once atleast
    if (user.login.length && user.logout) {
      response.push({
        user: user.username,
        login: user.login,
        logout: user.logout,
      });
    }
  });

  return response;
}
