# AuthWay

AuthWay is an Authentication System built with NodeJs, Express, MongoDB (mongoose) and some libraries. 

## Features
- **Signin**
- **Register**
- **Social signin** (Google OAuth2.0) using passport library
- **Reset Password** (only after signin)
- **Forgot password** (OTP sent on email using nodemailer)
- **Session management** using custom cookies and for google signin session maintenance using passport library.
- **Recaptcha** enabled for Signin, register, reset password, forgot password.

## Middlewares
JWT middleware for protected routes, here we protect the reset password route. This middleware will also handle the google authenticated user's session cookies.

## Pages
1. **homepage.html** :  This is the homepage where we can do the following:
    - Signin
    - Signup
    - Singin using google+
    - Forgot password

2. **postLogin.html** : This is the page that we show only after a successful login. This page will contain the following functionalities:
    - Signout
    - Reset Password
    - Forgot password.

Note: In case of social login that is using google+ we will not display the reset password and forgot password buttons as they are irrelevant when the user is logged in using their google email id.

## API Information
- Homepage: `GET /`
- Login success page: `GET /login-success`
- SignIn: `POST /api/signin`
- SignUp: `POST /api/signup`
- Forgot Password: `POST /api/forgot-password`
- Validate OTP: `POST /api/validate-otp`
- Reset Password (JWT protected): `POST /api/reset-password`
- Change Password from Reset Form: `POST /api/reset-password/change-pass`
- Google Login: `GET /api/google`
- Handle google login success redirect url: `GET /api/google/redirect`
- Handle google logout using passport library: `GET /api/logout`

## Folder Structure
```
<<<<<<< HEAD
=======
.
>>>>>>> a859d3a4e3ac99fce296eec39e82b1c62858b629
├── node_modules
├── public
│   ├── scripts
│   │   ├── homepage.script.js
│   │   └── postLogin.script.js
│   └── styles.css
├── src
<<<<<<< HEAD
│   ├── config
│   │   ├── mongoose.db.js
│   │   └── passportconfig.js
│   ├── errorHandler
│   │   └── errorHandler.js
│   ├── middlewares
│   │   └── jwt.middleware.js
│   ├── pages
│   │   ├── homepage.html
│   │   └── postLogin.html
│   └── User
│       ├── google.schema.js
│       ├── user.controller.js
│       ├── user.repository.js
│       ├── user.router.js
│       └── user.schema.js
├── index.js
└── package.json
```
=======
│&nbsp;&nbsp;&nbsp;   ├── config
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   ├── mongoose.db.js
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   └── passport&nbsp;config.js
│&nbsp;&nbsp;&nbsp;   ├── errorHandler
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   └── errorHandler.js
│&nbsp;&nbsp;&nbsp;   ├── middlewares
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   └── jwt.middleware.js
│&nbsp;&nbsp;&nbsp;   ├── pages
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   ├── homepage.html
│&nbsp;&nbsp;&nbsp;   │&nbsp;&nbsp;&nbsp;   └── postLogin.html
│&nbsp;&nbsp;&nbsp;   └── User
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       ├── google.schema.js
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       ├── user.controller.js
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       ├── user.repository.js
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       ├── user.router.js
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       └── user.schema.js
├── env.variables.js
├── index.js
└── package.json
```

>>>>>>> a859d3a4e3ac99fce296eec39e82b1c62858b629
## Dependencies
- bcrypt
- cookie-parser
- cookie-session
- dotenv
- express
- express-session
- jsonwebtoken
- mongodb
- mongoose
- nodemailer
- passport
- passport-google-oauth20

## Other features
1. Error handler used for efficiently manage the custom and unhandled errors
2. dotenv library used for efficiently store the secret information from the client or other users.

## Getting Started

To get started with Habit Forge:

1. Clone the repository: `git clone `
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and navigate to `http://localhost:3767`

## Contact Information
- **Author:** Gautam
- **GitHub:** [gautamuniverse](https://github.com/gautamuniverse)
- **LinkedIn:** [Gautam](https://www.linkedin.com/in/gautam-116307bb/)
- **Instagram:** [@gautamuniverse.in](https://www.instagram.com/gautamuniverse.in/)
