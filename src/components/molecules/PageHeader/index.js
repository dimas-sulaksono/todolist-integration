import React from "react";
import useBackNavigation from "@/hooks/useBackNavigation";

export default function PageHeader({ title, buttonText = "Kembali", buttonAction }) {
    const handleBack = useBackNavigation();

    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <button
                onClick={buttonAction || handleBack}
                className="bg-blue-500 min-w-32 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
                {buttonText}
            </button>
        </div>
    );
}
