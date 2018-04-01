let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bCrypt = require('bcryptjs');

let userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Укажите Имя Пользователя'],
  },
  password: {
    type: String,
    required: [true, 'Укажите Пароль'],
  },
  firstName: {
    type: String,
    default: ""
  },
  middleName: {
    type: String,
    default: ""
  },
  surName: {
    type: String,
    default: ""
  },
  permissionId: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  access_token: {
    type: String,
    default: "",
  },
  permission: {
    chat: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    },
    news: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean  }
    },
    setting: {
      C: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    }
  },
  versionKey: false
});

userSchema.methods.setPassword = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validatePassword = function (password) {
 return bCrypt.compareSync(password, this.password);
};

mongoose.model('user', userSchema);