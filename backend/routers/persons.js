const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // idに対応する人物情報を取得
    const person = await prisma.person.findUnique({
      where: { id: Number(id) },
    });

    res.status(200).json({ person });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/findAll", isAuthenticated, async (req, res) => {
  try {
    const persons = await prisma.person.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        personName: true,
        sex: true,
        birthDate: true,
      },
    });

    // クライアントで表示するプロパティを作成
    const formattedPersons = persons.map((person) => ({
      id: person.id,
      name: person.personName,
      sex: person.sex,
      birthDate: person.birthDate,
    }));

    res.status(200).json({ formattedPersons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  const { personName, sex, birthDate, userId } = req.body;

  try {
    const persons = await prisma.person.create({
      data: {
        personName,
        sex,
        birthDate,
        isAccountUser: false,
        userId,
      },
    });

    res.status(200).json({ persons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { personName, sex, birthDate } = req.body;
    const { id } = req.params;

    // idに対応する人物情報を更新
    await prisma.person.update({
      where: {
        id: Number(id),
      },
      data: {
        personName,
        sex,
        birthDate,
      },
    });

    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // 人物情報取得
    const person = await prisma.person.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });

    // 人物情報が存在しない場合
    if (!person) {
      return res.status(404).json({ error: "選択された人物情報はありません" });
    }

    // 人物情報がユーザアカウントの場合
    if (person.isAccountUser) {
      return res
        .status(403)
        .json({ error: "ユーザアカウントは削除できません" });
    }

    // idに対応する人物情報を削除
    await prisma.person.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
