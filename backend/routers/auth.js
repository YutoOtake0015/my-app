const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.get("/test", (req, res) => {
  const crypto = require("crypto");
  const secretKey = crypto.randomBytes(32).toString("hex");
  return res.json({ secretKey: secretKey });
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザ登録
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
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
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

module.exports = router;
