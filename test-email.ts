import nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'brandforge-ai@zohomail.com',
      pass: 'MkXZGzepdgtf',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"BrandForge AI" <brandforge-ai@zohomail.com>',
      to: 'brandforge-ai@zohomail.com',
      subject: 'Test Cloud Run',
      html: 'Works!'
    });
    console.log("Success:", info.messageId);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
