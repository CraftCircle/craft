import { baseEmailLayout } from './baseLayout';

export const ticketPurchaseTemplate = (
  name: string,
  ticketType: string,
  eventName: string,
  ticketUrl: string,
): string => {
  const content = `
    <h1>Your ticket is confirmed 🎫</h1>
    <p>Hi ${name},</p>
    <p>You’ve successfully purchased a <strong>${ticketType}</strong> ticket for the event: <strong>${eventName}</strong>.</p>
    <p>
      <a href="${ticketUrl}" class="button">View Ticket</a>
    </p>
  `;

  return baseEmailLayout('Ticket Purchase Confirmation', content);
};

export const ticketCreatedTemplate = (
  name: string,
  ticketType: string,
  eventName: string,
  price: number,
  quantity: number,
  eventUrl: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ticket Created</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 0; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 140px; }
          h2 { color: #222; text-align: center; }
          p { color: #555; font-size: 16px; line-height: 1.5; text-align: center; }
          .btn { display: inline-block; width: fit-content; margin: 20px auto 0; padding: 12px 24px; background-color: #b89934; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { font-size: 12px; text-align: center; color: #999; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://res.cloudinary.com/djhugxcv9/image/upload/v1743468786/logo_ph9j6b.png" alt="CraftCircle Logo" />
          </div>
          <h2>🎫 Ticket Type Created</h2>
          <p>Hey ${name},</p>
          <p>Your ticket type <strong>${ticketType}</strong> for the event <strong>${eventName}</strong> has been created successfully.</p>
          <p><strong>Price:</strong> KES ${price}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p>Click below to view the event and manage ticket sales:</p>
          <a href="${eventUrl}" class="btn">View Event</a>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CraftCircle. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};
