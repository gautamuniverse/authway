//If the logged in using google, the we don't want to show the reset or forget password button
if (!document.cookie.includes("jwt")) {
  document.getElementById("reset-forgot-row").style.display = "none";
}

//Password forgot captcha variable which will contain the response from the captcha
let forgotCaptcha;

// Reset password form captcha
let resetCaptcha;

function pwdForgotCaptcha(response) {
  forgotCaptcha = response;
}

function pwdResetCaptcha(response) {
  resetCaptcha = response;
}

//Handle the signout
function signout() {
  //Send a confirmation alert if the user wants to logout or not
  const confirmLogout = confirm("Are you sure you want to signout?");
  if (confirmLogout) {
    alert("You have successfully logged out.");
    window.location.replace("/api/logout");
  }
}

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
      const urlEncodedData = new URLSearchParams({ email, "g-recaptcha-response": forgotCaptcha }).toString();

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

//Validate empty password/email fields on the password reset form
//We are adding the post-user-passReset-modal modal only when the user enters both the fields
function validateEmptyFields() {
  //Validate empty fields
  const email = document.getElementById("reset-email-field").value;
  const password = document.getElementById("reset-password-field").value;
  const button = document.getElementById("pasword-reset-submit");

  if (!email || email == "" || !password || password == "") {
    button.dataset.bsToggle = "";
    button.dataset.bsTarget = "";
    alert("Please fill both the fields");
  } else if (!resetCaptcha || !resetCaptcha.length > 0) {
    alert("Please verify you are human!");
  } else {
    //Handle the password reset functionality
    document
      .getElementById("password-reset")
      .addEventListener("submit", (event) => {
        //Prevent default behaviour of form submission
        event.preventDefault();

        //Get the form data
        const formData = new FormData(event.target);

        //Convert the form data to url encoded format
        const urlEncodedData = new URLSearchParams(formData).toString();

        //Make a post request to the registration route
        fetch("/api/reset-password", {
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
              //Set the dataset for the button to load the reset-password modal
              button.dataset.bsToggle = "modal";
              button.dataset.bsTarget = "#post-user-passReset-modal";
              document.getElementById("button-info").textContent =
                "Click again";
            } else {
              alert("Error: " + data.msg);
              window.location.reload();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            showErrorAlert("An error occurred while submitting the form.");
          });
      });
  }
}

// Handle the reset password form, validate and change the user password
document
  .getElementById("post-user-passReset-modal")
  .addEventListener("submit", (event) => {
    //Prevent the default behaviour of the form
    event.preventDefault();

    //Check if the password and confirm password match
    const pass = document.getElementById("post-reset-password-field");
    const confirmPass = document.getElementById(
      "consfirm-post-reset-password-field"
    );
    if (pass.value !== confirmPass.value) {
      alert("Passwords don't match, please re-enter passwords");
      return;
    }

    //Convert the password to url encoded format
    const urlEncodedData = new URLSearchParams({
      password: pass.value
    }).toString();
    //Make a post request to the registration route
    fetch("/api/reset-password/change-pass", {
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
          showSuccessAlert("Password Reset Successful!");
          window.location.reload();
        } else {
          showErrorAlert("Something went wrong, please try again!");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorAlert("An error occurred while submitting the form.");
      });
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

function showSuccessAlert(message) {
  alert("Success: " + message);
  window.location.reload();
}

function showErrorAlert(message) {
  alert("Error: " + message);
  window.location.reload();
}
