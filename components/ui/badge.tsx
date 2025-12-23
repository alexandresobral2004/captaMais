// Nota: Erros de lint desaparecerão após executar 'npm install'
// Os tipos do React serão resolvidos quando as dependências estiverem instaladas
import React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger"
}

export function Badge({ 
  className, 
  variant = "default", 
  ...props 
}: BadgeProps) {
  const variantClass = {
    default: "badge-default",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  }[variant]

  return (
    <div
      className={cn("badge", variantClass, className)}
      {...props}
    />
  )
}
