const Joi = require("joi");

const signinSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    "any.required": "メールアドレスを入力してください",
    "string.empty": "メールアドレスを指定してください",
  }),

  password: Joi.string().trim().required().messages({
    "any.required": "パスワードを入力してください",
    "string.empty": "パスワードを指定してください",
  }),
});

module.exports = signinSchema;
