import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "fill" | "blue" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  fill: "bg-[#111111] text-white hover:bg-[#000000]",
  blue: "bg-[#10B981] text-white hover:bg-[#059669]",
  ghost:
    "border-[1.5px] border-border text-[#111111] hover:border-[#111111]",
  white: "bg-white text-[#111111] hover:bg-[#FAFAFA]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-7 py-3 text-sm",
  lg: "px-10 py-4 text-base",
};

export default function Button({
  variant = "fill",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 hover:scale-[1.02]",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
