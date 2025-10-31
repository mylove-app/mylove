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

    await sendEmail(email, subject, text);

    return Response.json({ message: "OTP telah dikirim ke email" }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
