// authCheck.js
const API_URL = "https://api.form2chat.me/api/auth";
let token = localStorage.getItem("token") || "";

// Function to check authentication
async function checkAuth() {
    if (!token) {
        // No token → redirect to login page
        window.location.href = "login.html";
        return;
    }

    try {
      const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`, // ✅ correct format
        "Content-Type": "application/json"
    }
});


        if (!res.ok) {
            // Token invalid → clear and redirect
            localStorage.removeItem("token");
            // inside if (!res.ok) block
            localStorage.removeItem("userEmail"); // also clear stored email

            window.location.href = "login.html";
            return;
        }

        // Token valid → return user data
        const user = await res.json();
        console.log("✅ Authenticated User:", user);
        // after console.log("✅ Authenticated User:", user);
if (user?.email) {
    localStorage.setItem("userEmail", user.email);
    console.log("📩 Stored Email:", localStorage.getItem("userEmail"));
}

        return user;
    } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("token");
        // inside catch block
localStorage.removeItem("userEmail");

        window.location.href = "login.html";
    }
}

// Run auth check when page loads
window.addEventListener("DOMContentLoaded", checkAuth);
