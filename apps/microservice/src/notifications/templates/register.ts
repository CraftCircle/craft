export const registrationEmailTemplate = (name: string) => ({
  subject: `🎉 Welcome to CraftCircle, ${name}!`,
  html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome aboard, ${name} 👋</h2>
        <p>We're thrilled to have you at <strong>CraftCircle</strong>.</p>
        <p>Explore community posts, events, and products created by creatives like you.</p>
        <a href="https://craftcirclehq.com" style="padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Visit CraftCircle</a>
        <p style="margin-top: 20px;">Happy creating! 🎨</p>
      </div>
    `,
});
