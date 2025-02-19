import React from "react";

const Label = ({ children, htmlFor }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="block  mt-3 font-medium text-sm text-gray-700 mb-1"
        >
            {children}
        </label>
    );
};

export default Label;