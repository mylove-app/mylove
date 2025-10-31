"use client";

function InputAuth({
  label,
  type = "text",
  placeholder = " ",
  className = "",
  error = false,
  ...props
}) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder=" "
        className={`
          peer w-full 
          px-4 py-3
          border rounded-[8px]
          outline-none transition-colors duration-200
          ${error ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary"}
          ${className}
        `}
        {...props}
      />
      {label && (
        <label
          className={`
            absolute left-3 
            ${error?"text-red-500":"text-slate-400"} text-base
            transition-all duration-200
            pointer-events-none
            bg-background px-1
            peer-placeholder-shown:top-[0.7rem]
            peer-placeholder-shown:text-[1rem]
            peer-focus:top-[-0.7rem]
            peer-focus:text-[0.8rem]
            ${error ? "peer-focus:text-red-500" : "peer-focus:text-primary"}
            peer-[&:not(:placeholder-shown)]:top-[-0.7rem]
            peer-[&:not(:placeholder-shown)]:text-[0.8rem]
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
}

export { InputAuth };
