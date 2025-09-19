import React from "react"
import { useLocation } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const pageNames = {
  "/dashboard": "Dashboard",
  "/companies": "Companies", 
  "/calendar": "Calendar",
  "/documents": "Documents",
  "/reports": "Reports"
}

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const currentPage = pageNames[location.pathname] || "Dashboard"
  
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentPage}</h1>
            <p className="text-sm text-slate-500">Manage your limited companies</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={18} className="mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={18} className="mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header