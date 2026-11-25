
const api = "/api/students";
// Check admin login status
async function checkLogin() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();

    document.getElementById("loginSection").style.display =
        data.loggedIn ? "none" : "block";

    document.getElementById("adminSection").style.display =
        data.loggedIn ? "block" : "none";

    document.getElementById("studentControls").style.display =
        data.loggedIn ? "block" : "none";

    document.getElementById("adminName").textContent =
        data.username || "";
}

// Admin login
document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    });

    const data = await res.json();

    document.getElementById("loginMessage").textContent = data.message;

    if (res.ok) {
        document.getElementById("loginForm").reset();
        checkLogin();
        loadStudents();
    }
};

// Admin logout
async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    checkLogin();
    loadStudents();
}

checkLogin();
const form = document.getElementById("studentForm");

form.onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById("id").value;

    const data = {
        name: document.getElementById("name").value.trim(),
        rollNo: document.getElementById("rollNo").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        year: Number(document.getElementById("year").value),
        phone: document.getElementById("phone").value.trim()
    };

    console.log("Sending student data:", data);

    try {
        const res = await fetch(id ? `${api}/${id}` : api, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(res.ok ? "Student saved successfully!" : result.message);

        if (res.ok) {
            form.reset();
            document.getElementById("id").value = "";
            loadStudents();
        }
    } catch (err) {
        alert("Server connection failed!");
        console.error(err);
    }
};

async function loadStudents() {
    const roll = document.getElementById("search").value;
    const dept = document.getElementById("deptFilter").value;

    const params = new URLSearchParams();
    if (roll) params.set("rollNo", roll);
    if (dept) params.set("department", dept);

    const res = await fetch(`${api}?${params}`);
    const students = await res.json();

    document.getElementById("studentList").innerHTML =
        students.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.rollNo}</td>
            <td>${s.email}</td>
            <td>${s.department}</td>
            <td>${s.year}</td>
            <td>${s.phone}</td>
            <td>
               ${document.getElementById("adminSection").style.display !== "none" ? `
<button onclick="editStudent('${s._id}')">Edit</button>
<button onclick="deleteStudent('${s._id}')">Delete</button>
` : ""}
            </td>
        </tr>`).join("");
}

async function editStudent(id) {
    const res = await fetch(api);
    const students = await res.json();
    const s = students.find(x => x._id === id);

    if (!s) return;

    document.getElementById("id").value = s._id;
    document.getElementById("name").value = s.name;
    document.getElementById("rollNo").value = s.rollNo;
    document.getElementById("email").value = s.email;
    document.getElementById("department").value = s.department;
    document.getElementById("year").value = s.year;
    document.getElementById("phone").value = s.phone;
}

async function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    const res = await fetch(`${api}/${id}`, { method: "DELETE" });
    const result = await res.json();

    alert(result.message);
    loadStudents();
}

function clearForm() {
    document.getElementById("id").value = "";
}

loadStudents();
