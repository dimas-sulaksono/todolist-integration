import React from "react";

const InputForm = ({
  text,
  label,
  classNameLabel,
  type = "text",
  id,
  name,
  placeholder,
  classNameInput,
  children,
}) => {
  return (
    <>
      <label
        htmlFor={label}
        className={`text-gray-secondary !lg:text-base dm-sans block !text-sm ${classNameLabel}`}
      >
        {text}
      </label>
      <div className="text-sm lg:text-base" id={id}>
        <div className="form-content relative z-0">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            id={id}
            className={`focus:shadow-outline relative z-0 w-full appearance-none rounded-lg border py-3 leading-tight text-gray-700 focus:outline-none ${classNameInput}`}
          />
          {children}
        </div>
      </div>
    </>
  );
};

export default InputForm;