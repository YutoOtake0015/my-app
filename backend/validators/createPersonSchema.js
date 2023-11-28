const Joi = require("joi");

const createPersonSchema = Joi.object({
  personName: Joi.string().trim().required().max(15).messages({
    "any.required": "名前を入力してください",
    "string.empty": "名前を入力してください",
    "string.max": "名前は15文字以内で入力してください",
  }),

  birthDate: Joi.date().required().messages({
    "any.required": "生年月日を指定してください",
    "date.base": "有効な日付を指定してください",
  }),

  sex: Joi.string().trim().required().messages({
    "any.required": "性別を指定してください",
    "string.empty": "性別を指定してください",
  }),

  userId: Joi.number().required().messages({
    "any.custom": "ユーザ情報が不正です",
    "any.only": "ユーザ情報が不正です",
  }),
});

module.exports = createPersonSchema;
