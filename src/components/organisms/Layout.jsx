import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar className="w-72" />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
<Header 
          onMenuClick={() => setMobileMenuOpen(true)}
          rightContent={
            <LogoutButton />
          }
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
function LogoutButton() {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  
  return (
    <div className="flex items-center space-x-3">
      {user && (
        <span className="text-sm text-slate-600">
          {user.firstName} {user.lastName}
        </span>
      )}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={logout}
        className="text-slate-600 hover:text-slate-900"
      >
        <ApperIcon name="LogOut" size={16} className="mr-1" />
        Logout
      </Button>
    </div>
  )
}