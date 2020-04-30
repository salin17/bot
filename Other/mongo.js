var mongoose = require('mongoose');

function Setup() {
  var connStr = 'mongodb+srv://RWuser:QHXn2AFWwCdMiQ23@clustermio-5ftwd.mongodb.net/Bot_DB?retryWrites=true&w=majority';
  mongoose.connect(connStr, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  var db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
}

var userSchema = new mongoose.Schema({
  username: String,
  password: String
})

var userModel = mongoose.model('user', userSchema, 'Bot_Users')

/*
async function SetUser(nome,psw) {
  var x = new userModel({
    username: nome,
    password: psw
  })
  await x.save();
}

async function GetUser(nome) {
  let user = await userModel.findOne({
      username: nome
  }).lean()
  return user
}*/

async function Nome(nome) {
  let user = await userModel.findOne({
    username: nome
  }).lean()
  return user
}

async function AddUser(nome, psw) {
  var NewUser = new userModel({
    username: nome,
    password: psw
  })
  await NewUser.save();
}



module.exports = {
  Setup: Setup,
  userModel: userModel,
  Nome: Nome,
  AddUser: AddUser
}