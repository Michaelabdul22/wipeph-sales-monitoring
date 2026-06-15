import nodemailer from 'nodemailer';

export async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'WIPE PHILIPPINES'}" <${process.env.MAIL_USER}>`,
    to,
    subject: 'WIPE PH - Password Reset OTP',
    html: `
      <div style="margin:0;padding:24px;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;color:#111;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:28px;text-align:center;">
          <h1 style="margin:0 0 10px;font-size:24px;line-height:1.2;color:#111;">WIPE PHILIPPINES</h1>
          <p style="margin:0 0 22px;color:#666;font-size:14px;">Password Reset Verification</p>
          <div style="display:inline-block;background:#ffcc00;color:#000;font-size:30px;font-weight:800;letter-spacing:4px;padding:14px 22px;border-radius:8px;margin-bottom:20px;">${otp}</div>
          <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">Use this verification code to reset your password. It will expire in <strong>10 minutes</strong>.</p>
        </div>
      </div>
    `
  });
}
