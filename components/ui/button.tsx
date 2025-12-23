import React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = {
      default: "btn-default",
      outline: "btn-outline",
      ghost: "btn-ghost",
    }[variant]

    const sizeClass = {
      default: "",
      sm: "btn-sm",
      lg: "btn-lg",
    }[size]

    return (
      <button
        className={cn("btn", variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
