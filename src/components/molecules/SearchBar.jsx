import React from "react"
import { cn } from "@/utils/cn"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ 
  className, 
  placeholder = "Search...",
  value,
  onChange,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={18} className="text-slate-400" />
      </div>
      <Input
        className="pl-10 pr-4"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}

export default SearchBar