// templates/baseEmailLayout.ts
export const baseEmailLayout = (subject: string, content: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f7f7f7;
              padding: 0;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            }
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo img {
              max-width: 150px;
            }
            h1 {
              color: #222222;
              text-align: center;
              font-size: 24px;
            }
            p {
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
              text-align: center;
            }
            .button {
              display: inline-block;
              margin: 20px auto 0;
              padding: 12px 24px;
              background-color: #b89934;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://res.cloudinary.com/djhugxcv9/image/upload/v1743468786/logo_ph9j6b.png" alt="CraftCircle Logo" />
            </div>
            ${content}
            <div class="footer">
              &copy; ${new Date().getFullYear()} CraftCircle. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
  };
  