import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } =await params;
    const userId = parseInt(id, 10);
    const { name, email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (!user.otpVerified) {
      return Response.json({ error: "Akun belum diverifikasi melalui OTP" }, { status: 403 });
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        otpVerified: true,
      },
    });

    return Response.json(
      { message: "Data user berhasil diperbarui", user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { otpVerified: true },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (!user.otpVerified) {
      return Response.json({ error: "Akun belum diverifikasi melalui OTP" }, { status: 403 });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    return Response.json(
      { message: "User berhasil dihapus", user: deletedUser },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

