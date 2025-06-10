"use client"

import type React from "react"
import { Input } from "./input"
import { Label } from "./label"

interface FormFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  error?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  placeholder,
  className = "col-span-3",
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="col-span-3">
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${className} ${error ? "border-destructive" : ""}`}
          required={required}
          disabled={disabled}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    </div>
  )
}
