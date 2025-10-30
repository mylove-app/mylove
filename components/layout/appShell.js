import Navbar from "./navbar";

export default function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}