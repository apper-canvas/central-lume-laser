import React from "react"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  description = "We encountered an error while loading your data. Please try again.",
  onRetry 
}) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertTriangle" size={24} className="text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {message}
      </h3>
      
      <p className="text-slate-600 mb-6">
        {description}
      </p>
      
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  )
}

export default Error