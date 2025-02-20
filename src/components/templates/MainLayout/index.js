// components/templates/MainLayout.js
import React from "react";
import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;
