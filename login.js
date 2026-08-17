document.getElementById("loginForm").addEventListener("submit", function (event) {

    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    if (password === "") {
        alert("Please enter your password.");
        return;
    }

    // Redirect to landing page
    window.location.href = "landing.html";

});