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
    console.log("通過");

    res.status(200).json({ persons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
