require('dotenv').config();

import { Admin } from './models/adminModel';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = "mongodb+srv://pratush:fbla2022@cluster0.mgees8m.mongodb.net/?retryWrites=true&w=majority";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



async function main() {
  await mongoose.connect(mongoDB);
}

async function authenticateAdmin(req, res, next) {

  try {
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.splice(' ')[1];

    if(token == null) {
      return req.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, adminID) => {
      if(err) res.sendStatus(401);

      req.adminID = adminID;
      const admin = await Admin.findById(adminID);

      if (!admin) {
        throw new Error('Invalid token.');
      }

      req.admin = admin;

      next(); 
    })

    } catch(err) {
      res.status(401).json({ error: err.message });
    }
  }



main().catch((err) => console.log(err));

app.use('/', indexRouter);
app.use('/admin', adminRouter, authenticateAdmin);

module.exports = app;
