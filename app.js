const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const Student = require("./models/student");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/add-attendance", async (req, res) => {
  try {
    const studentData = req.body[0];
    const date = req.body[1].date;

    for (const student_name in studentData) {
      if (studentData.hasOwnProperty(student_name)) {
        const student_attendance = studentData[student_name];
        await Student.create({
          name: student_name,
          attendance: student_attendance,
          present_date: date,
        });
      }
    }

    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create attendance" });
  }
});

app.get("/api/get-attendance", async (req, res) => {
  try {
    const selectedDate = req.query.date;

    if (!selectedDate) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const attendance = await Student.findAll({
      where: {
        present_date: selectedDate,
      },
    });

    if (attendance.length > 0) {
      return res.json({ data: attendance, message: "success" });
    } else {
      return res.json({ message: "No data found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve attendance" });
  }
});

app.get("/api/get-students-report", async (req, res) => {
  try {
    const students = await Student.findAll();
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
