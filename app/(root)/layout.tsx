import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");
  return (
    <main className='flex h-screen'>
      <Sidebar {...currentUser} />
      <section className='flex flex-col h-full flex-1'>
        <MobileNavigation {...currentUser} />
        <Header />
        <div className='main-content'>{children}</div>
      </section>
    </main>
  );
};

export default Layout;
