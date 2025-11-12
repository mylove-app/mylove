"use client";

import { useRouter } from "next/navigation";

export default function Button({
  label,
  href,
  onClick,
  variant = "primary",
  px = "px-6",
  py = "py-3",
  textSize = "text-base",
  fontWeight = "font-semibold",
  textColor = "",
  className = "",
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else if (href) router.push(href);
  };

  const baseStyles = `
    rounded-lg transition w-full md:w-fit 
    ${px} ${py} ${textSize} ${fontWeight}
  `;

  const variants = {
    primary: `
      bg-primary text-background 
      hover:bg-background hover:text-primary 
      border border-primary
    `,
    outline: `
      border border-gray-300 text-gray-700 
      hover:bg-gray-100 
      dark:border-gray-700 dark:text-gray-200 dark:hover:bg-neutral-800
    `,
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${textColor} ${className}`}
    >
      {label}
    </button>
  );
}
