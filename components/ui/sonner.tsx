"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "white", // or "transparent" if you don’t want background
          "--normal-text": "black", // adjust as needed
          "--normal-border": "rgb(110 231 183)", // Tailwind emerald-300
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
