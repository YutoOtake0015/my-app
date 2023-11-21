const router = require("express").Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        persons: {
          where: {
            isAccountUser: true,
          },
        },
      },
    });

    // ユーザーを取得できない場合
    if (!user) {
      res.status(404).json({ error: "ユーザ見つかりませんでした" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        sex: user.persons[0].sex,
        birthDate: user.persons[0].birthDate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/update", isAuthenticated, async (req, res) => {
  try {
    const { id, email, password } = req.body;

    // emailがユーザの登録しているメールアドレスであることを確認
    const existUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: id,
        },
      },
    });

    if (existUser) {
      return res
        .status(400)
        .json({ message: "このemailは他のユーザが使用しています" });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザ情報を更新
    await prisma.user.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json(this.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/delete", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;

    // ユーザ情報取得
    const user = await prisma.user.findFirst({
      where: { id: Number(id) },
    });

    // ユーザ情報の確認
    if (!user) {
      return res.status(404).json({ error: "アカウント情報が見つかりません" });
    }

    // idに対応するユーザ情報を削除
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
