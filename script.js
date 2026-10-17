const destinations = [
    {
        name: "Munnar",
        state: "Kerala",
        icon: "🌿",
        focus: "Tea plantations, technology parks and eco-learning",
        types: ["industrial", "educational", "cultural"]
    },
    {
        name: "Kochi",
        state: "Kerala",
        icon: "⚓",
        focus: "Ports, IT parks, marine and logistics industries",
        types: ["industrial", "technical", "cultural"]
    },
    {
        name: "Alleppey",
        state: "Kerala",
        icon: "🚤",
        focus: "Backwaters, tourism and hospitality learning",
        types: ["educational", "cultural"]
    },
    {
        name: "Bengaluru",
        state: "Karnataka",
        icon: "💻",
        focus: "IT companies, startups and innovation centres",
        types: ["industrial", "technical", "educational"]
    },
    {
        name: "Mysuru",
        state: "Karnataka",
        icon: "🏛️",
        focus: "Manufacturing, heritage and educational visits",
        types: ["industrial", "educational", "cultural"]
    },
    {
        name: "Coorg",
        state: "Karnataka",
        icon: "🌳",
        focus: "Agriculture, plantations and environmental learning",
        types: ["educational", "cultural"]
    },
    {
        name: "Hyderabad",
        state: "Telangana",
        icon: "🧪",
        focus: "IT, pharma, biotechnology and research",
        types: ["industrial", "technical", "educational"]
    },
    {
        name: "Chennai",
        state: "Tamil Nadu",
        icon: "🏭",
        focus: "Automobile, electronics and manufacturing industries",
        types: ["industrial", "technical", "educational"]
    },
    {
        name: "Ooty",
        state: "Tamil Nadu",
        icon: "⛰️",
        focus: "Tourism, environment and educational activities",
        types: ["educational", "cultural"]
    },
    {
        name: "Madurai",
        state: "Tamil Nadu",
        icon: "🛕",
        focus: "Heritage, food processing and cultural learning",
        types: ["educational", "cultural"]
    },
    {
        name: "Pondicherry",
        state: "Puducherry",
        icon: "🌊",
        focus: "Tourism, culture and educational exploration",
        types: ["educational", "cultural"]
    },
    {
        name: "Mumbai",
        state: "Maharashtra",
        icon: "🏙️",
        focus: "Finance, media, ports and corporate exposure",
        types: ["industrial", "technical", "educational"]
    },
    {
        name: "Pune",
        state: "Maharashtra",
        icon: "⚙️",
        focus: "Automotive, engineering and IT industries",
        types: ["industrial", "technical"]
    },
    {
        name: "Jaipur",
        state: "Rajasthan",
        icon: "🏰",
        focus: "Heritage, tourism and business exposure",
        types: ["educational", "cultural"]
    },
    {
        name: "Delhi",
        state: "Delhi",
        icon: "🏛️",
        focus: "Institutions, technology and national organizations",
        types: ["industrial", "educational", "cultural"]
    }
];

const $ = (id) => document.getElementById(id);

const money = (number) => {
    return "₹" + Number(number || 0).toLocaleString("en-IN");
};

const today = new Date().toISOString().slice(0, 10);

let students = JSON.parse(
    localStorage.getItem("campusVoyageStudents") || "[]"
);

let trip = JSON.parse(
    localStorage.getItem("campusVoyageTrip") || "null"
);

let attendance = JSON.parse(
    localStorage.getItem("campusVoyageAttendance") || "{}"
);

let checklist = JSON.parse(
    localStorage.getItem("campusVoyageChecklist") || "{}"
);

let currentRole =
    localStorage.getItem("campusVoyageRole") || "Guest";

let approval =
    localStorage.getItem("campusVoyageApproval") || "Pending";


/* =========================================
   STORAGE FUNCTIONS
========================================= */

function saveStudents() {

    localStorage.setItem(
        "campusVoyageStudents",
        JSON.stringify(students)
    );

    renderStudents();
    renderAttendance();
    updateStats();
    updateDashboard();
}


function saveTrip() {

    trip = getTripForm();

    localStorage.setItem(
        "campusVoyageTrip",
        JSON.stringify(trip)
    );

    updatePreview();
    updateDashboard();
}


/* =========================================
   GET TRIP FORM DATA
========================================= */

function getTripForm() {

    const travel =
        Number($("travelCost").value || 0);

    const stay =
        Number($("stayCost").value || 0);

    const food =
        Number($("foodCost").value || 0);

    const other =
        Number($("otherCost").value || 0);

    return {

        tripName:
            $("tripName").value.trim(),

        destination:
            $("destination").value.trim(),

        students:
            Number($("students").value || 0),

        department:
            $("department").value,

        coordinator:
            $("coordinator").value.trim(),

        startDate:
            $("startDate").value,

        endDate:
            $("endDate").value,

        transport:
            $("transport").value,

        vehicleNo:
            $("vehicleNo").value.trim(),

        hotel:
            $("hotel").value.trim(),

        rooms:
            Number($("rooms").value || 0),

        emergency:
            $("tripEmergency").value.trim(),

        budget: {

            travel: travel,

            stay: stay,

            food: food,

            other: other,

            perStudent:
                travel + stay + food + other
        }
    };
}


/* =========================================
   DATE FUNCTIONS
========================================= */

function daysBetween(startDate, endDate) {

    if (!startDate || !endDate) {
        return 0;
    }

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    const difference =
        (end - start) / 86400000;

    if (difference < 0) {
        return 0;
    }

    return Math.floor(difference) + 1;
}


function formatDate(value) {

    if (!value) {
        return "-";
    }

    return new Date(
        value + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    $("toastMessage").textContent =
        message;

    $("toast").classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer =
        setTimeout(
            () => {
                $("toast").classList.remove("show");
            },
            2200
        );
}


/* =========================================
   DESTINATION DISPLAY
========================================= */

function renderDestinations(list = destinations) {

    const grid =
        $("destinationGrid");

    if (!grid) {
        return;
    }

    if (!list.length) {

        grid.innerHTML =
            '<p class="empty-state">No matching destination found.</p>';

        return;
    }

    grid.innerHTML =
        list.map(
            (destination, index) => {

                return `
                    <article class="destination-card">

                        <div class="destination-image">
                            ${destination.icon}
                        </div>

                        <div class="destination-body">

                            <h3>
                                ${escapeHtml(destination.name)}
                            </h3>

                            <p>
                                ${escapeHtml(destination.state)}
                            </p>

                            <p>
                                ${escapeHtml(destination.focus)}
                            </p>

                            <div class="tag-list">

                                ${destination.types
                        .map(
                            type =>
                                `<span class="tag">
                                                ${escapeHtml(type)}
                                            </span>`
                        )
                        .join("")}

                            </div>

                            <div class="card-actions">

                                <button
                                    class="outline-btn"
                                    onclick="choosePlace(${index})">
                                    Use Place
                                </button>

                                <button
                                    class="outline-btn"
                                    onclick="viewPlace(${index})">
                                    View
                                </button>

                            </div>

                        </div>

                    </article>
                `;
            }
        ).join("");
}


/* =========================================
   SELECT DESTINATION
========================================= */

function choosePlace(index) {

    const destination =
        destinations[index];

    if (!destination) {
        return;
    }

    $("destination").value =
        destination.name;

    $("searchPlace").value =
        destination.name;

    showToast(
        destination.name + " selected"
    );

    document
        .querySelector("#planner")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================
   VIEW DESTINATION
========================================= */

function viewPlace(index) {

    const destination =
        destinations[index];

    if (!destination) {
        return;
    }

    $("placeModalContent").innerHTML = `

        <div class="place-info">

            <div class="place-info-icon">
                ${destination.icon}
            </div>

            <h2>
                ${escapeHtml(destination.name)},
                ${escapeHtml(destination.state)}
            </h2>

            <p>
                ${escapeHtml(destination.focus)}
            </p>

            <div class="place-facts">

                <div>
                    <b>Trip Types</b>
                    <br>
                    ${destination.types.join(", ")}
                </div>

                <div>
                    <b>Country</b>
                    <br>
                    India 🇮🇳
                </div>

            </div>

        </div>
    `;

    $("placeModal")
        .classList
        .add("active");
}


/* =========================================
   DESTINATION SEARCH
========================================= */

function filterDestinations() {

    const query =
        $("searchPlace")
            .value
            .toLowerCase()
            .trim();

    const type =
        $("tripType").value;

    const filtered =
        destinations.filter(
            destination => {

                const text =
                    `${destination.name}
                     ${destination.state}
                     ${destination.focus}`
                        .toLowerCase();

                const matchesSearch =
                    !query ||
                    text.includes(query);

                const matchesType =
                    type === "all" ||
                    destination.types.includes(type);

                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );

    renderDestinations(filtered);
}


/* =========================================
   ITINERARY
========================================= */

function generateItinerary(tripData) {

    const days =
        daysBetween(
            tripData.startDate,
            tripData.endDate
        );

    const destination =
        tripData.destination ||
        "your destination";

    if (!days) {

        return `
            <p class="empty-state">
                Select valid start and end dates.
            </p>
        `;
    }

    const items = [];

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        let activity;

        if (day === 1) {

            activity =
                "Departure, registration and orientation";

        } else if (day === days) {

            activity =
                "Industrial visit wrap-up, feedback and return journey";

        } else if (day % 2 === 0) {

            activity =
                `Industrial / technical exposure at ${destination}`;

        } else {

            activity =
                `Educational visit and local learning at ${destination}`;
        }

        items.push(`

            <div class="itinerary-item">

                <b>
                    Day ${day}
                </b>

                <br>

                ${escapeHtml(activity)}

            </div>
        `);
    }

    return items.join("");
}


/* =========================================
   PREVIEW
========================================= */

function updatePreview() {

    if (!trip) {
        trip = getTripForm();
    }

    const tripData =
        trip;

    const days =
        daysBetween(
            tripData.startDate,
            tripData.endDate
        );

    const studentNumber =
        Number(tripData.students || 0);

    const perStudent =
        Number(
            tripData.budget?.perStudent || 0
        );

    const total =
        studentNumber * perStudent;

    $("previewTitle").textContent =
        tripData.tripName ||
        "Your IV Plan";

    $("previewDestination").textContent =
        tripData.destination ||
        "Select a destination";

    $("previewDates").textContent =
        tripData.startDate
            ? `${formatDate(tripData.startDate)}
               - ${formatDate(tripData.endDate)}`
            : "Select your travel dates";

    $("previewStudents").textContent =
        studentNumber;

    $("previewDays").textContent =
        days;

    $("previewPerStudent").textContent =
        money(perStudent);

    $("previewTotal").textContent =
        money(total);

    $("itineraryList").innerHTML =
        generateItinerary(tripData);
}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const tripData =
        trip || getTripForm();

    const studentNumber =
        students.length ||
        tripData.students ||
        0;

    const perStudent =
        Number(
            tripData.budget?.perStudent || 0
        );

    const total =
        studentNumber * perStudent;

    $("dashboardTrip").textContent =
        tripData.tripName ||
        "No trip created";

    $("dashboardStudents").textContent =
        studentNumber;

    $("dashboardDestination").textContent =
        tripData.destination ||
        "-";

    $("dashboardDays").textContent =
        `${daysBetween(
            tripData.startDate,
            tripData.endDate
        )} days`;

    $("dashboardBudget").textContent =
        money(total);

    $("currentUserText").textContent =
        currentRole === "Guest"
            ? "Not logged in"
            : `Logged in as ${currentRole}`;

    setApprovalUI();
}


/* =========================================
   APPROVAL STATUS
========================================= */

function setApprovalUI() {

    const elements = [
        $("approvalStatus"),
        $("dashboardStatus")
    ];

    elements.forEach(element => {

        if (!element) {
            return;
        }

        element.textContent =
            approval;

        if (approval === "Approved") {

            element.className =
                "status approved";

        } else if (approval === "On Hold") {

            element.className =
                "status hold";

        } else {

            element.className =
                "status pending";
        }
    });
}


/* =========================================
   LOAD TRIP INTO FORM
========================================= */

function fillTripForm(tripData) {

    if (!tripData) {
        return;
    }

    const fields = [
        "tripName",
        "destination",
        "students",
        "department",
        "coordinator",
        "startDate",
        "endDate",
        "transport",
        "vehicleNo",
        "hotel",
        "rooms",
        "tripEmergency"
    ];

    fields.forEach(
        field => {

            if (
                $(field) &&
                tripData[field] !== undefined
            ) {

                $(field).value =
                    tripData[field];
            }
        }
    );

    if (tripData.budget) {

        $("travelCost").value =
            tripData.budget.travel || 0;

        $("stayCost").value =
            tripData.budget.stay || 0;

        $("foodCost").value =
            tripData.budget.food || 0;

        $("otherCost").value =
            tripData.budget.other || 0;
    }
}


/* =========================================
   EXPORT COMPLETE PROJECT
========================================= */

function exportProject() {

    const data = {

        exportedAt:
            new Date().toISOString(),

        role:
            currentRole,

        trip:
            trip,

        students:
            students,

        attendance:
            attendance,

        checklist:
            checklist,

        approval:
            approval
    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "campusvoyage-project-data.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast(
        "Project data exported"
    );
}


/* =========================================
   STUDENT FORM
========================================= */

function resetStudentForm() {

    $("studentForm").reset();

    $("studentEditId").value = "";

    $("studentSubmit").textContent =
        "Add Student";
}


function studentFormData() {

    return {

        id:
            $("studentEditId").value ||
            crypto.randomUUID(),

        name:
            $("studentName")
                .value
                .trim(),

        registerNo:
            $("registerNo")
                .value
                .trim(),

        studentId:
            $("studentId")
                .value
                .trim(),

        department:
            $("studentDepartment")
                .value
                .trim(),

        year:
            $("studentYear").value,

        section:
            $("studentSection")
                .value
                .trim(),

        gender:
            $("gender").value,

        phone:
            $("studentPhone")
                .value
                .trim(),

        email:
            $("studentEmail")
                .value
                .trim(),

        parentName:
            $("parentName")
                .value
                .trim(),

        parentPhone:
            $("parentPhone")
                .value
                .trim(),

        bloodGroup:
            $("bloodGroup").value,

        emergency:
            $("studentEmergency")
                .value
                .trim(),

        attendance:
            $("studentAttendance").value
    };
}


/* =========================================
   RENDER STUDENTS
========================================= */

function renderStudents() {

    const searchInput =
        $("studentSearch");

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    const filteredStudents =
        students.filter(
            student => {

                const text =
                    `${student.name}
                     ${student.registerNo}
                     ${student.department}`
                        .toLowerCase();

                return text.includes(query);
            }
        );

    $("studentCount").textContent =
        students.length;

    if (!filteredStudents.length) {

        $("studentTableBody").innerHTML = `
            <tr>
                <td colspan="8">
                    No student records found.
                </td>
            </tr>
        `;

        return;
    }

    $("studentTableBody").innerHTML =
        filteredStudents
            .map(
                (student, index) => {

                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                <b>
                                    ${escapeHtml(student.name)}
                                </b>

                                <br>

                                <small>
                                    ${escapeHtml(
                        student.studentId || ""
                    )}
                                </small>
                            </td>

                            <td>
                                ${escapeHtml(
                        student.registerNo
                    )}
                            </td>

                            <td>
                                ${escapeHtml(
                        student.department
                    )}
                            </td>

                            <td>
                                ${escapeHtml(
                        student.year
                    )}
                            </td>

                            <td>
                                ${escapeHtml(
                        student.phone || "-"
                    )}
                            </td>

                            <td>
                                ${escapeHtml(
                        student.attendance
                    )}
                            </td>

                            <td>

                                <button
                                    class="table-action"
                                    onclick="editStudent('${student.id}')">
                                    Edit
                                </button>

                                <button
                                    class="table-action delete"
                                    onclick="deleteStudent('${student.id}')">
                                    Delete
                                </button>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================
   EDIT STUDENT
========================================= */

function editStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );

    if (!student) {
        return;
    }

    const fields = {

        studentEditId: "id",

        studentName: "name",

        registerNo: "registerNo",

        studentId: "studentId",

        studentDepartment: "department",

        studentYear: "year",

        studentSection: "section",

        gender: "gender",

        studentPhone: "phone",

        studentEmail: "email",

        parentName: "parentName",

        parentPhone: "parentPhone",

        bloodGroup: "bloodGroup",

        studentEmergency: "emergency",

        studentAttendance: "attendance"
    };

    Object.entries(fields).forEach(
        ([elementId, property]) => {

            $(elementId).value =
                student[property] || "";
        }
    );

    $("studentSubmit").textContent =
        "Update Student";

    document
        .querySelector("#students")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================
   DELETE STUDENT
========================================= */

function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Delete this student record?"
        );

    if (!confirmDelete) {
        return;
    }

    students =
        students.filter(
            student =>
                student.id !== id
        );

    delete attendance[id];

    saveStudents();

    showToast(
        "Student deleted"
    );
}


/* =========================================
   ATTENDANCE
========================================= */

function renderAttendance() {

    const grid =
        $("attendanceGrid");

    if (!grid) {
        return;
    }

    if (!students.length) {

        grid.innerHTML = `
            <p class="empty-state">
                Add student details first.
            </p>
        `;

        updateAttendanceCount();

        return;
    }

    grid.innerHTML =
        students
            .map(
                student => {

                    const checked =
                        student.attendance ===
                        "Present";

                    return `

                        <div class="attendance-item">

                            <label>

                                <input
                                    type="checkbox"
                                    ${checked ? "checked" : ""}
                                    onchange="
                                        toggleAttendance(
                                            '${student.id}',
                                            this.checked
                                        )
                                    "
                                >

                                <b>
                                    ${escapeHtml(
                        student.name
                    )}
                                </b>

                            </label>

                            <small>
                                ${escapeHtml(
                        student.registerNo
                    )}
                            </small>

                        </div>
                    `;
                }
            )
            .join("");

    updateAttendanceCount();
}


/* =========================================
   TOGGLE ATTENDANCE
========================================= */

function toggleAttendance(
    id,
    present
) {

    const student =
        students.find(
            item => item.id === id
        );

    if (!student) {
        return;
    }

    student.attendance =
        present
            ? "Present"
            : "Absent";

    attendance[id] =
        present;

    saveStudents();

    localStorage.setItem(
        "campusVoyageAttendance",
        JSON.stringify(attendance)
    );
}


/* =========================================
   ATTENDANCE COUNT
========================================= */

function updateAttendanceCount() {

    const total =
        students.length;

    const present =
        students.filter(
            student =>
                student.attendance ===
                "Present"
        ).length;

    $("presentCount").textContent =
        present;

    $("totalCount").textContent =
        total;
}


/* =========================================
   EXPORT STUDENTS CSV
========================================= */

function exportStudentsCSV() {

    const headers = [

        "Name",
        "Register Number",
        "Student ID",
        "Department",
        "Year",
        "Section",
        "Gender",
        "Phone",
        "Email",
        "Parent Name",
        "Parent Phone",
        "Blood Group",
        "Emergency Contact",
        "Attendance"
    ];

    const properties = [

        "name",
        "registerNo",
        "studentId",
        "department",
        "year",
        "section",
        "gender",
        "phone",
        "email",
        "parentName",
        "parentPhone",
        "bloodGroup",
        "emergency",
        "attendance"
    ];

    const rows =
        students.map(
            student => {

                return properties
                    .map(
                        property =>
                            JSON.stringify(
                                student[property] || ""
                            )
                    )
                    .join(",");
            }
        );

    const csv =
        [
            headers.join(","),
            ...rows
        ].join("\n");

    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "campusvoyage-students.csv";

    link.click();

    URL.revokeObjectURL(url);

    showToast(
        "Student CSV exported"
    );
}


/* =========================================
   CHECKLIST
========================================= */

function saveChecklist() {

    localStorage.setItem(
        "campusVoyageChecklist",
        JSON.stringify(checklist)
    );

    const boxes =
        [
            ...document.querySelectorAll(
                ".checklist"
            )
        ];

    const completed =
        boxes.filter(
            checkbox =>
                checkbox.checked
        ).length;

    const percentage =
        boxes.length
            ? Math.round(
                completed /
                boxes.length *
                100
            )
            : 0;

    $("checkProgress").style.width =
        percentage + "%";

    $("checkProgressText").textContent =
        percentage + "%";
}


function loadChecklist() {

    document
        .querySelectorAll(".checklist")
        .forEach(
            checkbox => {

                checkbox.checked =
                    !!checklist[
                    checkbox.dataset.key
                    ];
            }
        );

    saveChecklist();
}


/* =========================================
   LOGIN
========================================= */

function login(role) {

    currentRole =
        role;

    localStorage.setItem(
        "campusVoyageRole",
        role
    );

    $("loginModal")
        .classList
        .remove("active");

    $("loginBtn").textContent =
        `${role} · Logout`;

    updateStats();

    updateDashboard();

    showToast(
        `Logged in as ${role}`
    );
}


function logout() {

    currentRole =
        "Guest";

    localStorage.removeItem(
        "campusVoyageRole"
    );

    $("loginBtn").textContent =
        "Login";

    updateStats();

    updateDashboard();

    showToast(
        "Logged out"
    );
}


function openLogin() {

    if (currentRole !== "Guest") {

        logout();

        return;
    }

    $("loginModal")
        .classList
        .add("active");
}


/* =========================================
   RESET PROJECT
========================================= */

function resetProject() {

    const confirmed =
        confirm(
            "Reset all saved CampusVoyage project data?"
        );

    if (!confirmed) {
        return;
    }

    const keys = [

        "campusVoyageStudents",

        "campusVoyageTrip",

        "campusVoyageAttendance",

        "campusVoyageChecklist",

        "campusVoyageApproval",

        "campusVoyageRole",

        "campusVoyageTheme"
    ];

    keys.forEach(
        key =>
            localStorage.removeItem(key)
    );

    location.reload();
}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStats() {

    $("studentStat").textContent =
        students.length;

    $("loginStat").textContent =
        currentRole;
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            character => {

                const map = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"
                };

                return map[character];
            }
        );
}


/* =========================================
   EVENT LISTENERS
========================================= */

$("searchBtn")
    .addEventListener(
        "click",
        filterDestinations
    );


$("searchPlace")
    .addEventListener(
        "input",
        filterDestinations
    );


$("tripType")
    .addEventListener(
        "change",
        filterDestinations
    );


$("generateBtn")
    .addEventListener(
        "click",
        () => {

            saveTrip();

            showToast(
                "Trip generated and saved"
            );
        }
    );


$("saveBtn")
    .addEventListener(
        "click",
        () => {

            saveTrip();

            showToast(
                "Trip details saved"
            );
        }
    );


$("exportBtn")
    .addEventListener(
        "click",
        exportProject
    );


$("resetBtn")
    .addEventListener(
        "click",
        resetProject
    );


$("approveBtn")
    .addEventListener(
        "click",
        () => {

            approval =
                "Approved";

            localStorage.setItem(
                "campusVoyageApproval",
                approval
            );

            setApprovalUI();

            showToast(
                "Trip approved"
            );
        }
    );


$("holdBtn")
    .addEventListener(
        "click",
        () => {

            approval =
                "On Hold";

            localStorage.setItem(
                "campusVoyageApproval",
                approval
            );

            setApprovalUI();

            showToast(
                "Trip put on hold"
            );
        }
    );


/* =========================================
   STUDENT FORM SUBMIT
========================================= */

$("studentForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const data =
                studentFormData();

            const index =
                students.findIndex(
                    student =>
                        student.id === data.id
                );

            if (index >= 0) {

                students[index] =
                    data;

            } else {

                students.push(data);
            }

            saveStudents();

            resetStudentForm();

            showToast(
                index >= 0
                    ? "Student updated"
                    : "Student added"
            );
        }
    );


$("studentCancel")
    .addEventListener(
        "click",
        resetStudentForm
    );


$("studentSearch")
    .addEventListener(
        "input",
        renderStudents
    );


$("exportStudentsBtn")
    .addEventListener(
        "click",
        exportStudentsCSV
    );


/* =========================================
   ATTENDANCE BUTTONS
========================================= */

$("markAllBtn")
    .addEventListener(
        "click",
        () => {

            students.forEach(
                student => {

                    student.attendance =
                        "Present";

                    attendance[
                        student.id
                    ] = true;
                }
            );

            saveStudents();

            localStorage.setItem(
                "campusVoyageAttendance",
                JSON.stringify(attendance)
            );

            showToast(
                "All students marked present"
            );
        }
    );


$("clearAllBtn")
    .addEventListener(
        "click",
        () => {

            students.forEach(
                student => {

                    student.attendance =
                        "Absent";

                    attendance[
                        student.id
                    ] = false;
                }
            );

            saveStudents();

            localStorage.setItem(
                "campusVoyageAttendance",
                JSON.stringify(attendance)
            );

            showToast(
                "Attendance cleared"
            );
        }
    );


/* =========================================
   CHECKLIST EVENTS
========================================= */

document
    .querySelectorAll(".checklist")
    .forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                () => {

                    checklist[
                        checkbox.dataset.key
                    ] =
                        checkbox.checked;

                    saveChecklist();
                }
            );
        }
    );


/* =========================================
   LOGIN MODAL
========================================= */

$("loginBtn")
    .addEventListener(
        "click",
        openLogin
    );


$("closeModal")
    .addEventListener(
        "click",
        () => {

            $("loginModal")
                .classList
                .remove("active");
        }
    );


$("loginModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("loginModal")
            ) {

                $("loginModal")
                    .classList
                    .remove("active");
            }
        }
    );


/* =========================================
   ROLE BUTTONS
========================================= */

document
    .querySelectorAll(
        ".role-option, .role-login"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    login(
                        button.dataset.role
                    );
                }
            );
        }
    );


/* =========================================
   PLACE MODAL
========================================= */

$("closePlaceModal")
    .addEventListener(
        "click",
        () => {

            $("placeModal")
                .classList
                .remove("active");
        }
    );


$("placeModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("placeModal")
            ) {

                $("placeModal")
                    .classList
                    .remove("active");
            }
        }
    );


/* =========================================
   MOBILE MENU
========================================= */

$("menuBtn")
    .addEventListener(
        "click",
        () => {

            $("mainNav")
                .classList
                .toggle("active");
        }
    );


document
    .querySelectorAll("#mainNav a")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    $("mainNav")
                        .classList
                        .remove("active");
                }
            );
        }
    );


/* =========================================
   DARK / LIGHT MODE
========================================= */

$("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body
                .classList
                .toggle("dark");

            const dark =
                document.body
                    .classList
                    .contains("dark");

            localStorage.setItem(
                "campusVoyageTheme",
                dark
                    ? "dark"
                    : "light"
            );

            $("themeBtn").textContent =
                dark
                    ? "☀️"
                    : "🌙";

            showToast(
                dark
                    ? "Dark mode enabled"
                    : "Light mode enabled"
            );
        }
    );


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function init() {

    const savedTheme =
        localStorage.getItem(
            "campusVoyageTheme"
        );

    if (savedTheme === "dark") {

        document.body
            .classList
            .add("dark");

        $("themeBtn").textContent =
            "☀️";

    } else {

        $("themeBtn").textContent =
            "🌙";
    }


    if (trip) {

        fillTripForm(trip);

    } else {

        $("startDate").value =
            today;

        $("endDate").value =
            today;
    }


    $("travelDate").value =
        today;


    renderDestinations();

    renderStudents();

    renderAttendance();

    loadChecklist();

    updatePreview();

    updateDashboard();

    updateStats();


    if (currentRole === "Guest") {

        $("loginBtn").textContent =
            "Login";

    } else {

        $("loginBtn").textContent =
            `${currentRole} · Logout`;
    }
}


/* =========================================
   START APPLICATION
========================================= */

init();