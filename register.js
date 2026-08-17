document.getElementById("registerForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();


    if (username === "") {

        alert("Please enter your username.");

        return;
    }


    if (email === "") {

        alert("Please enter your email.");

        return;
    }


    if (password === "") {

        alert("Please enter your password.");

        return;
    }


    // Store registration data

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);


    alert("Account created successfully!");


    // Redirect to login page

    window.location.href = "login.html";

});