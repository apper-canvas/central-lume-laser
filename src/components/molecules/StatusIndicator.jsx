import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusIndicator = ({ status, showText = true }) => {
  const statusConfig = {
    active: {
      variant: "success",
      icon: "CheckCircle",
      text: "Active"
    },
    dormant: {
      variant: "warning", 
      icon: "Clock",
      text: "Dormant"
    },
    inactive: {
      variant: "default",
      icon: "XCircle", 
      text: "Inactive"
    }
  }
  
  const config = statusConfig[status] || statusConfig.inactive
  
  return (
    <Badge variant={config.variant}>
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {showText && config.text}
    </Badge>
  )
}

export default StatusIndicator