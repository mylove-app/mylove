import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email },
      include: { otp: true },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const otp = user.otp.find(o => o.code === code && o.verified === false);

    if (!otp) {
      return Response.json({ error: "Kode OTP salah atau sudah digunakan" }, { status: 400 });
    }

    if (new Date() > new Date(otp.expiresAt)) {
      return Response.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });
    }

    await prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    return Response.json({ message: "OTP berhasil diverifikasi", userId: user.id }, { status: 200 });
  } catch {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
