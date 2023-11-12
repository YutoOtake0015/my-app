const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

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
      birthDate: person.birthDate.toLocaleString("ja").split(" ")[0],
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

module.exports = router;
