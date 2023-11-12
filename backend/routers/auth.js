const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const { username, email, password, birthDate, sex } = req.body;

  // 生年月日のフォーマット変換
  const birthDateAsDate = new Date(birthDate);
  const isoDate = birthDateAsDate.toISOString();

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザ登録
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      persons: {
        create: {
          personName: username,
          sex,
          birthDate: isoDate,
          isAccountUser: true,
        },
      },
    },
  });

  return res.json({ user });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // ユーザの存在確認
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "ユーザが存在しません" });
  }

  // 入力パスワードの正誤確認
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "パスワードにあやまりがあります" });
  }

  // 認証トークン生成
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

module.exports = router;
