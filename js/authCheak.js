// authCheck.js
const API_URL = "https://fback-lemon.vercel.app/api/auth";
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
            window.location.href = "login.html";
            return;
        }

        // Token valid → return user data
        const user = await res.json();
        console.log("✅ Authenticated User:", user);
        return user;
    } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

// Run auth check when page loads
window.addEventListener("DOMContentLoaded", checkAuth);
