export async function POST() {
  const cookieHeader = `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;

  return Response.json(
    { message: "Logout berhasil" },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
    }
  );
}
