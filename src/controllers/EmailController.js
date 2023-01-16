const transport = require("../tools/emailSender");

class EmailController {
  static async sendPasswordRecoveryEmail(email) {}

  static async sendAuthenticateEmail(email, code) {
    try {
      return await transport.sendMail({
        from: "oauth2.autorization.server@gmail.com",
        to: email,
        subject: "Email Validation",
        html: `<html>
        <head>
          <style>
            @media only screen and (max-width: 400px) {
              html {
                  font-size: 8px;
              }
            }
      
            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }
      
            .container {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              width: 31.25rem;
              height: 25rem;
            }
      
            .text {
              font-size: 1.5rem;
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              margin-bottom: 4rem;
            }
      
            .code {
              display: flex;
              justify-content: center;
              width: 100%;
              background-color: rgb(236, 207, 39);
              padding: 2rem 0;
              margin: 0 2rem;
              box-sizing: border-box;
              border-radius: 10px;
              font-size: 3.5rem;
              font-family: Arial, Helvetica, sans-serif;
              letter-spacing: 1.5rem;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="text">
              Account created successfully, now use the code below to validate your
              email
            </p>
            <div class="code">${code}</div>
          </div>
        </body>
      </html>
      `,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmailController;
