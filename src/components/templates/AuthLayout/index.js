import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
