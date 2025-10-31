import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    // 🔍 Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 🚫 Jika user belum memiliki OTP
    if (!user.otpCode || !user.otpExpires) {
      return Response.json({ error: "Kode OTP belum dikirim" }, { status: 400 });
    }

    // ❌ Cek kecocokan kode
    if (user.otpCode !== code) {
      return Response.json({ error: "Kode OTP salah" }, { status: 400 });
    }

    // ⏰ Cek kadaluarsa
    if (new Date() > new Date(user.otpExpires)) {
      return Response.json({ error: "Kode OTP kadaluarsa" }, { status: 400 });
    }

    // ✅ Update status OTP
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
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
