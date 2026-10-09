import Navbar from "@/ui/components/Navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            {children}
        </main>
    )
}