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
    const { id } = await params;
    const userId = parseInt(id, 10);
    const { name, email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return Response.json(
      { message: "Password berhasil diubah", user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    const deleted = await prisma.user.delete({
      where: { id: userId },
    });

    return Response.json(
      { message: "User berhasil dihapus", user: deleted },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
