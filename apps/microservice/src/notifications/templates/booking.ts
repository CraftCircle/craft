// User confirmation template
export const bookingUserTemplate = (
    name: string,
    date: string,
    time: string,
    adminName: string,
    link: string
  ) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Booking Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { background: #fff; max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; font-size: 20px; }
        p { color: #555; line-height: 1.6; }
        .btn { display: inline-block; background: #b89934; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 20px; border-radius: 4px; }
        .footer { font-size: 12px; color: #999; margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Appointment is Booked</h1>
        <p>Hi ${name},</p>
        <p>Your booking with ${adminName} is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <p>You can manage your booking below.</p>
        <a href="${link}" class="btn">View Booking</a>
        <div class="footer">
          &copy; ${new Date().getFullYear()} CraftCircle. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Admin alert template
  export const bookingAdminTemplate = (
    adminName: string,
    userName: string,
    date: string,
    time: string,
    link: string
  ) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Booking Alert</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { background: #fff; max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; font-size: 20px; }
        p { color: #555; line-height: 1.6; }
        .btn { display: inline-block; background: #b89934; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 20px; border-radius: 4px; }
        .footer { font-size: 12px; color: #999; margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>New Booking Received</h1>
        <p>Hello ${adminName},</p>
        <p><strong>${userName}</strong> has booked an appointment with you for <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <a href="${link}" class="btn">View Booking</a>
        <div class="footer">
          &copy; ${new Date().getFullYear()} CraftCircle. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  