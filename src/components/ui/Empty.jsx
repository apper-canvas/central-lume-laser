import React from "react"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Package",
  actionLabel = "Add New",
  onAction
}) => {
  return (
    <Card className="p-12 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} size={32} className="text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-sm mx-auto">
        {description}
      </p>
      
      {onAction && (
        <Button variant="primary" onClick={onAction}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}

export default Empty