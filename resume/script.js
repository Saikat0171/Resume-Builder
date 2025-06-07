document.getElementById("generate-btn").addEventListener("click", function () {
    // Collect form data
    const name = document.getElementById("name").value;
    const fatherName = document.getElementById("fatherName").value;
    const motherName = document.getElementById("motherName").value;
    const dob = document.getElementById("dob").value;
    const presentAddress = document.getElementById("presentAddress").value;
    const permanentAddress = document.getElementById("permanentAddress").value;
    const religion = document.getElementById("religion").value;
    const gender = document.getElementById("gender").value;
    const maritalStatus = document.getElementById("maritalStatus").value;
    const nationality = document.getElementById("nationality").value;
    
    // Collect education data
    const educationRows = document.querySelectorAll("#education-table tbody tr");
    let educationData = [];
    educationRows.forEach(row => {
        const examName = row.querySelector("input[name='examName']").value;
        const board = row.querySelector("input[name='board']").value;
        const result = row.querySelector("input[name='result']").value;
        const year = row.querySelector("input[name='year']").value;
        educationData.push({ examName, board, result, year });
    });
    
    // Collect other data
    const experience = document.getElementById("experience").value;
    const skills = document.getElementById("skills").value;

    const photoInput = document.getElementById("photo");
    let photoURL = "";

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoURL = e.target.result;
            showResumePreview(photoURL);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        showResumePreview("");
    }

    function showResumePreview(photoURL) {
        const photoHTML = photoURL
            ? `<div class="resume-photo"><img src="${photoURL}" alt="Photo"></div>`
            : "";

        // Format date of birth as "dd/Month/yyyy"
        function formatDOB(dob) {
            if (!dob) return "";
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const [year, month, day] = dob.split("-");
            if (!year || !month || !day) return dob;
            return `${day}/${months[parseInt(month, 10) - 1]}/${year}`;
        }

        const formattedDOB = formatDOB(dob);

        // Use a table for personal info
        const infoHTML = `
            <div class="resume-info">
                <h2>${name}</h2>
                <table class="info-table">
                    <tr><td><strong>Father's Name</strong></td><td>${fatherName}</td></tr>
                    <tr><td><strong>Mother's Name</strong></td><td>${motherName}</td></tr>
                    <tr><td><strong>Date of Birth</strong></td><td>${formattedDOB}</td></tr>
                    <tr><td><strong>Present Address</strong></td><td>${presentAddress}</td></tr>
                    <tr><td><strong>Permanent Address</strong></td><td>${permanentAddress}</td></tr>
                    <tr><td><strong>Religion</strong></td><td>${religion}</td></tr>
                    <tr><td><strong>Gender</strong></td><td>${gender}</td></tr>
                    <tr><td><strong>Marital Status</strong></td><td>${maritalStatus}</td></tr>
                    <tr><td><strong>Nationality</strong></td><td>${nationality}</td></tr>
                </table>
            </div>
        `;

        // Only show Work Experience if not empty
        const workExpHTML = experience.trim()
            ? `<h3>Work Experience</h3><p>${experience}</p>`
            : "";

        // Only show Skills if not empty
        const skillsHTML = skills.trim()
            ? `<h3>Skills</h3><p>${skills}</p>`
            : "";

        const preview = `
            <div class="resume-header-flex">
                ${photoHTML}
                ${infoHTML}
            </div>
            <h3>Education</h3>
            <table>
                <thead>
                    <tr>
                        <th>Exam Name</th>
                        <th>Board</th>
                        <th>Result</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    ${educationData.map(item => `
                        <tr>
                            <td>${item.examName}</td>
                            <td>${item.board}</td>
                            <td>${item.result}</td>
                            <td>${item.year}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${workExpHTML}
            ${skillsHTML}
        `;
        document.getElementById("resume-preview").innerHTML = preview;
        document.getElementById("resume-preview").style.display = "block";
        document.getElementById("print-btn").style.display = "block";
    }

    // Generate PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Colors and styles
    const primaryColor = "#007bff";
    const sectionBg = "#e0eafc";
    let y = 18;

    // Name Header
    pdf.setFillColor(224, 234, 252);
    pdf.rect(0, 0, 210, 25, "F");
    pdf.setFontSize(22);
    pdf.setTextColor(0, 123, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text(name, 105, 16, { align: "center" });

    // Contact/Personal Info
    pdf.setDrawColor(0, 123, 255);
    pdf.line(10, 26, 200, 26);
    pdf.setFontSize(12);
    pdf.setTextColor(33, 37, 41);
    pdf.setFont("helvetica", "normal");
    y = 32;
    pdf.text(`Father's Name: `, 10, y); pdf.text(fatherName, 55, y);
    y += 7;
    pdf.text(`Mother's Name: `, 10, y); pdf.text(motherName, 55, y);
    y += 7;
    pdf.text(`Date of Birth: `, 10, y); pdf.text(formattedDOB, 55, y);
    y += 7;
    pdf.text(`Gender: `, 10, y); pdf.text(gender, 55, y);
    y += 7;
    pdf.text(`Marital Status: `, 10, y); pdf.text(maritalStatus, 55, y);
    y += 7;
    pdf.text(`Religion: `, 10, y); pdf.text(religion, 55, y);
    y += 7;
    pdf.text(`Nationality: `, 10, y); pdf.text(nationality, 55, y);
    y += 7;
    pdf.text(`Present Address: `, 10, y); pdf.text(presentAddress, 55, y, { maxWidth: 140 });
    y += 7;
    pdf.text(`Permanent Address: `, 10, y); pdf.text(permanentAddress, 55, y, { maxWidth: 140 });
    y += 10;

    // Section: Education
    pdf.setFillColor(224, 234, 252);
    pdf.rect(10, y, 190, 9, "F");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 123, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 12, y + 6);
    y += 13;
    pdf.setFontSize(12);
    pdf.setTextColor(33, 37, 41);
    pdf.setFont("helvetica", "normal");
    educationData.forEach((item, idx) => {
        pdf.text(`• ${item.examName} (${item.year})`, 14, y);
        pdf.text(`${item.board} | Result: ${item.result}`, 70, y);
        y += 7;
    });
    y += 3;

    // Section: Work Experience
    pdf.setFillColor(224, 234, 252);
    pdf.rect(10, y, 190, 9, "F");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 123, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("Work Experience", 12, y + 6);
    y += 13;
    pdf.setFontSize(12);
    pdf.setTextColor(33, 37, 41);
    pdf.setFont("helvetica", "normal");
    if (experience.trim()) {
        const expLines = pdf.splitTextToSize(experience, 180);
        expLines.forEach(line => {
            pdf.text(`• ${line}`, 14, y);
            y += 7;
        });
    } else {
        pdf.text("• N/A", 14, y);
        y += 7;
    }
    y += 3;

    // Section: Skills
    pdf.setFillColor(224, 234, 252);
    pdf.rect(10, y, 190, 9, "F");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 123, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("Skills", 12, y + 6);
    y += 13;
    pdf.setFontSize(12);
    pdf.setTextColor(33, 37, 41);
    pdf.setFont("helvetica", "normal");
    if (skills.trim()) {
        skills.split(",").forEach(skill => {
            pdf.text(`• ${skill.trim()}`, 14, y);
            y += 7;
        });
    } else {
        pdf.text("• N/A", 14, y);
        y += 7;
    }

    // Save the PDF
    // pdf.save("resume.pdf"); // <-- Remove or comment out this line
});

document.getElementById("add-education-row").addEventListener("click", function() {
    const educationBody = document.getElementById("education-body");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" name="examName"></td>
        <td><input type="text" name="board"></td>
        <td><input type="text" name="result"></td>
        <td><input type="text" name="year"></td>
        <td><button type="button" class="remove-row-btn">Remove</button></td>
    `;
    
    educationBody.appendChild(newRow);

    // Add event listener for the remove button
    newRow.querySelector(".remove-row-btn").addEventListener("click", function() {
        newRow.remove();
    });
});

document.getElementById("print-btn").addEventListener("click", function() {
    window.print();
});