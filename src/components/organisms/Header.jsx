import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function Header({ onMenuClick, rightContent }) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
        
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-slate-900">
            LTD Central
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ApperIcon name="Bell" size={18} />
        </Button>
        <Button variant="ghost" size="sm">
          <ApperIcon name="Settings" size={18} />
        </Button>
        {rightContent}
      </div>
    </header>
  )
}

export default Header