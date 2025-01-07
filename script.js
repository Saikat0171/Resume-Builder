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

    // Update the preview
    const preview = `
        <h2>${name}</h2>
        <p><strong>Father's Name:</strong> ${fatherName}</p>
        <p><strong>Mother's Name:</strong> ${motherName}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Present Address:</strong> ${presentAddress}</p>
        <p><strong>Permanent Address:</strong> ${permanentAddress}</p>
        <p><strong>Religion:</strong> ${religion}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Marital Status:</strong> ${maritalStatus}</p>
        <p><strong>Nationality:</strong> ${nationality}</p>
        
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

        <h3>Work Experience</h3>
        <p>${experience}</p>
        
        <h3>Skills</h3>
        <p>${skills}</p>
    `;
    document.getElementById("resume-preview").innerHTML = preview;
    document.getElementById("resume-preview").style.display = "block"; // Show the preview

    // Generate PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Set header section (Name)
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(name, 10, 10);

    // Add personal details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Father's Name: ${fatherName}`, 10, 20);
    pdf.text(`Mother's Name: ${motherName}`, 10, 30);
    pdf.text(`Date of Birth: ${dob}`, 10, 40);
    pdf.text(`Present Address: ${presentAddress}`, 10, 50);
    pdf.text(`Permanent Address: ${permanentAddress}`, 10, 60);
    pdf.text(`Religion: ${religion}`, 10, 70);
    pdf.text(`Gender: ${gender}`, 10, 80);
    pdf.text(`Marital Status: ${maritalStatus}`, 10, 90);
    pdf.text(`Nationality: ${nationality}`, 10, 100);

    // Add Education Section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 10, 110);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    educationData.forEach((item, index) => {
        const yOffset = 120 + (index * 10);
        pdf.text(`${item.examName} - ${item.board} - ${item.result} - ${item.year}`, 10, yOffset);
    });

    // Add Work Experience Section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Work Experience", 10, 140);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(experience, 10, 150);

    // Add Skills Section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Skills", 10, 170);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(skills, 10, 180);

    // Save the PDF
    pdf.save("resume.pdf");
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