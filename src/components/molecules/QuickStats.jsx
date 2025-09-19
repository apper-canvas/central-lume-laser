import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const QuickStats = ({ title, value, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50"
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className="inline mr-1" 
              />
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default QuickStats