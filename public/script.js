document.addEventListener("DOMContentLoaded", async function () {
  let storeSeletctedDate;
  const form = document.getElementById("attendance-form");
  const formMainDiv = document.getElementById("form-main-div");
  const reportMainDiv = document.getElementById("report-main-div");
  const attendeceMainDiv = document.getElementById("attendece-main-div");
  const studentReport = document.getElementById("report-body");
  const attendanceData = document.getElementById("attendece-body");
  const dateSearch = document.getElementById("datesearch");
  const generateReport = document.getElementById("report-button");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      const formData = new FormData(this);
      const studentData = {};
      formData.forEach(function (value, key) {
        studentData[key] = value;
      });
      const dataArray = [studentData, { date: storeSeletctedDate }];
      // console.table(storeSeletctedDate, JSON.stringify(dataArray));
      const response = await fetch("/api/add-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataArray),
      });
      const responseData = await response.json();
      if (responseData.message === "success") {
        swal
          .fire({
            title: "Your Attendance has been submitted successfully.",
            icon: "success",
            timer: 2000,
            buttons: false,
          })
          .then(function () {
            window.location.href = window.location.href;
          });
      } else {
        Swal.fire({
          icon: "info",
          title: "Error while saving data",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  dateSearch.addEventListener("submit", async function (event) {
    event.preventDefault();
    const selectedDate = document.getElementById("date").value;
    storeSeletctedDate = selectedDate;
    if (selectedDate) {
      try {
        const response = await fetch(
          `/api/get-attendance?date=${selectedDate}`
        );
        const students = await response.json();
        // console.log(students);
        if (students.message === "success") {
          reportMainDiv.style.display = "none";
          attendeceMainDiv.style.display = "block";
          formMainDiv.style.display = "none";
          console.log(students.data);
          for (let i = 0; i < students.data.length; i++) {
            let name = students.data[i].name;
            let attendance = students.data[i].attendance === 1 ? "✔️" : "❌";

            const studentElement = document.createElement("tr");
            studentElement.innerHTML = `
            <td>${name}</td>
            <td>${attendance}</td>
          `;
            attendanceData.appendChild(studentElement);
            // console.log(`Name: ${name}, Attendance: ${attendance}`);
          }
        } else if (students.message === "No data found") {
          console.log("No data found");
          reportMainDiv.style.display = "none";
          attendeceMainDiv.style.display = "none";
          formMainDiv.style.display = "block";
        }
      } catch (e) {
        console.error("error getting");
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Please select date",
      });
      document.getElementById("student-data").style.display = "none";
    }
  });

  generateReport.addEventListener("click", async function () {
    try {
      const response = await fetch("/api/get-students-report");
      const students = await response.json();
      // console.log(students);
      reportMainDiv.style.display = "block";
      attendeceMainDiv.style.display = "none";
      formMainDiv.style.display = "none";

      const attendanceData = {};
      students.forEach((student) => {
        if (attendanceData[student.name]) {
          attendanceData[student.name].totalDays++;
          if (student.attendance === 1) {
            attendanceData[student.name].presentDays++;
          }
        } else {
          attendanceData[student.name] = {
            totalDays: 1,
            presentDays: student.attendance === 1 ? 1 : 0,
          };
        }
      });

      for (const name in attendanceData) {
        const studentElement = document.createElement("tr");
        const attendanceInfo = attendanceData[name];
        const presentRatio =
          (attendanceInfo.presentDays / attendanceInfo.totalDays) * 100;

        studentElement.innerHTML = `
            <td>${name}</td>
            <td>${attendanceInfo.presentDays}/${attendanceInfo.totalDays}</td>
            <td>${presentRatio.toFixed(2)}%</td>
          `;
        studentReport.appendChild(studentElement);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
