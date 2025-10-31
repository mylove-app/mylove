import prisma from "@/lib/prisma";
import { generateOTP, otpExpiry } from "@/lib/otp";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const code = generateOTP();
    const expiresAt = otpExpiry(5);

    await prisma.otp.create({
      data: { code, expiresAt, userId: user.id },
    });

    const subject = "Kode OTP Verifikasi";
    const text = `Halo ${user.name},\n\nKode OTP kamu adalah: ${code}\nKode ini berlaku selama 5 menit.\n\nTerima kasih.`;
    const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
    ">
      <h2 style="text-align: center; color: #0070f3;">Verifikasi OTP</h2>

      <p style="font-size: 16px; color: #374151;">
        Halo <strong>${user.name}</strong>,
      </p>

      <p style="font-size: 15px; color: #4b5563;">
        Berikut adalah kode OTP untuk verifikasi akun kamu:
      </p>

      <div style="
        text-align: center;
        margin: 25px 0;
        padding: 20px;
        background-color: #ecfdf5;
        border: 2px dashed #0070f3;
        border-radius: 8px;
      ">
        <span style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #0070f3;
        ">
          ${code}
        </span>
      </div>

      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        Kode ini hanya berlaku selama <strong>5 menit</strong>.<br/>
        Demi keamanan akunmu, jangan berikan kode ini kepada siapa pun.
      </p>

      <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
        Salam hangat,<br/>
        <strong>Tim ${process.env.APP_NAME || "Kami"}</strong>
      </p>
    </div>
    `;
    await sendEmail(email, subject, { text, html });

    return Response.json({ message: "OTP telah dikirim ke email" }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
