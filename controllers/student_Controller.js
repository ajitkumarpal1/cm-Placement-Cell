//import required packages
const Student = require("../models/student");
const csv = require("fast-csv");
const fs = require("fs");
const converter = require('json-2-csv');
const path = require("path")
//list the all students (view all students)
module.exports.allStudents = async (req, res) => {
  try {
    const students = await Student.find();
    const BASE_URL = process.env.BASE_URL;

    return res.render("student", { students , BASE_URL });
  } catch (err) {
    console.log(`Error in view all students controller ${err}`);
    return;
  }
};

//Add new student (from to create a student )
module.exports.create = async (req, res) => {
  try {
    await Student.create(req.body);
    req.flash("success", "Student Added Successfully");
    return res.redirect("/students");
  } catch (err) {
    console.log(`Error in create student controller ${err}`);
    return;
  }
};

//Download a complete CSV of all the data of students
module.exports.downloadCSV = async (req, res) => {
  try {
    let students = await Student.find({}).populate("interviews").lean();
    console.log(students);

    const csvData = await converter.json2csv(students);
    console.log(csvData);
    console.log("done");

    const exportDir = "public/files/export";
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = `${exportDir}/students.csv`;
    fs.writeFileSync(filePath, csvData);
    console.log("=>>",path.resolve())
    return res.json({
      downloadURL: `${process.env.BASE_URL}/files/export/students.csv`,
    });
  } catch (err) {
    console.log(`Error in download CSV controller: ${err}`);
    return res.status(500).send('Internal Server Error');
  }
};