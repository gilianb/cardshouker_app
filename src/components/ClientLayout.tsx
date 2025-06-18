'use client'
import { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? '14rem' : '3.5rem';

  return (
    <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <Navbar sidebarWidth={sidebarWidth} />
      <main
        style={{
          marginLeft: sidebarWidth,
          marginTop: '4rem',
          transition: 'margin-left 0.3s'
        }}
      >
        {children}
      </main>
    </>
  );
}