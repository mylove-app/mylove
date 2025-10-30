"use client";

import { useRouter } from "next/navigation";

export default function Button({ 
  label, 
  href, 
  onClick, 
  variant = "primary" 
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition w-full md:w-fit";
  const variants = {
    primary: "bg-primary text-background hover:bg-background hover:text-primary border border-primary",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button onClick={handleClick} className={`${baseStyles} ${variants[variant]}`}>
      {label}
    </button>
  );
}
