import React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" },
  { name: "Companies", to: "/companies", icon: "Building2" },
  { name: "Calendar", to: "/calendar", icon: "Calendar" },
  { name: "Documents", to: "/documents", icon: "FileText" },
  { name: "Reports", to: "/reports", icon: "BarChart3" }
]

const Sidebar = ({ className }) => {
  return (
    <aside className={cn("bg-white border-r border-slate-200 h-full", className)}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LTD Central</h1>
            <p className="text-xs text-slate-500">Company Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  size={18}
                  className={cn(
                    "mr-3 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar