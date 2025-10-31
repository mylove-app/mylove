"use client";

import Navbar from "./navbar";
import Footer from "./footer";

export default function AppShell({ children }){

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
