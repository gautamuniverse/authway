//Captcha variables and function

//response variable for registration captcha
let regCaptcha;

//response variable for login captcha
let logCaptcha;

//Password forgot captcha
let forgotCaptcha;

function registrationCaptcha(response) {
  regCaptcha = response;
}

function loginCaptcha(response) {
  logCaptcha = response;
}

function pwdForgotCaptcha(response) {
  forgotCaptcha = response;
}

document.addEventListener("DOMContentLoaded", function () {
  // ---------------Handle the registration functionality------------------------
  document
    .getElementById("registration-form")
    .addEventListener("submit", (event) => {
      //Prevent the default behaviour of the registration form
      event.preventDefault();

      //Check if the password and confirm password match
      const pass = document.getElementById("register-password-field");
      const confirmPass = document.getElementById(
        "register-password-field-confirm"
      );
      if (pass.value !== confirmPass.value) {
        alert("Passwords don't match, please re-enter passwords");
        return;
      }

      if (!regCaptcha || !regCaptcha.length > 0) {
        alert("Please verify you are human!");
        return;
      }

      //Get the form data
      const formData = new FormData(event.target);

      //Convert the form data to url encoded format
      const urlEncodedData = new URLSearchParams(formData).toString();
      //Make a post request to the registration route
      fetch("/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            showSuccessAlert("Registration successful!");
            window.location.reload();
          } else {
            showErrorAlert(data.msg);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showErrorAlert("An error occurred while submitting the form.");
        });
    });

  // ---------------Handle the Login functionality------------------------

  document.getElementById("login-form").addEventListener("submit", (event) => {
    //Prevent the default behavior of the login form
    event.preventDefault();

    if (!logCaptcha || !logCaptcha.length > 0) {
      alert("Please verify you are human!");
      return;
    }

    //get the form data
    const formData = new FormData(event.target);

    //Convert the form data to urlEncodedFormat
    const urlEncodedData = new URLSearchParams(formData).toString();

    //Send the data to the server using post fetch request
    fetch("/api/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //Check if the result is success or not
        if (!data.success) {
          //Show the error msg alert
          alert("Error: " + data.msg);
        } else {
          //Show success alert
          alert("Success: " + data.msg);
          window.location.replace("/login-success");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorAlert("An error occurred while submitting the form.");
      });
  });

  let userEmail; //Storing for otp form usage

  // Prevent default behaviour of password-forgot form
  document
    .getElementById("password-forgot")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      if (!forgotCaptcha || !forgotCaptcha.length > 0) {
        window.location.reload();
      } else {
        //Get the email
        const email = document.getElementById("forgot-email-field").value;
        userEmail = email;
        const urlEncodedData = new URLSearchParams({ email }).toString();

        //make a fetch request to the server
        fetch("/api/forgot-password", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            //Check if the result is success or not
            if (!data.success) {
              //Show the error msg alert
              return showErrorAlert(data.msg);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            showErrorAlert("An error occurred while submitting the form.");
          });
      }
    });

  // Handle the otp field
  document
    .getElementById("post-password-reset-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      //Get the otp
      const otp = document.getElementById("post-password-field").value;

      //Conver the otp in url encoded format
      const urlEncodedData = new URLSearchParams({
        otp,
        email: userEmail,
      }).toString();

      //Make a fetch request to the server
      fetch("/api/validate-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //Check if the result is success or not
          if (!data.success) {
            //Show the error msg alert
            alert("Error: " + data.msg);
          } else {
            //Show the user's new password
            alert("Your new password: " + data.msg);
            window.location.replace("/");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showErrorAlert("An error occurred while submitting the form.");
        });
    });

  //Handle login with google
  document
    .getElementById("google-login-btn")
    .addEventListener("click", (event) => {
      //redirect to google login page
      window.location.replace("/api/google/");
    });

  function showSuccessAlert(message) {
    alert("Success: " + message);
    window.location.reload();
  }

  function showErrorAlert(message) {
    alert("Error: " + message);
    window.location.reload();
  }
});

// Variable to track whether countdown is running
let countdownRunning = false;

// handle start countdown
document
  .getElementById("user-pass-forgot-model")
  .addEventListener("click", (event) => {
    if (document.getElementById("forgot-email-field").value == "") {
      alert("Can't continue without email!");
      window.location.reload();
      return;
    }
    if (!forgotCaptcha || !forgotCaptcha.length > 0) {
      return alert("Please verify you are human!");
    }
    if (countdownRunning) return;

    countdownRunning = true;

    var startTime = Date.now();
    var targetTime = startTime + 5 * 60 * 1000; // 5 minutes

    // Update the timer every second
    var timerInterval = setInterval(function () {
      var currentTime = Date.now();
      var remainingTime = targetTime - currentTime;

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "00:00";
        countdownRunning = false;
      } else {
        var minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        // Update the timer display
        document.getElementById("timer").textContent = minutes + ":" + seconds;
      }
    }, 1000);
  });
