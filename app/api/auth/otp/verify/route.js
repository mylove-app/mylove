import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    if (!user.otpCode || !user.otpExpires) {
      return Response.json({ error: "Kode OTP belum dikirim" }, { status: 400 });
    }
    if (user.otpCode !== code) {
      return Response.json({ error: "Kode OTP salah" }, { status: 400 });
    }
    if (new Date() > new Date(user.otpExpires)) {
      return Response.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    return Response.json(
      { message: "OTP berhasil diverifikasi", userId: user.id },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
