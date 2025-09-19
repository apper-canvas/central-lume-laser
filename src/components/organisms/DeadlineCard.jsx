import React from "react"
import { format, differenceInDays } from "date-fns"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const DeadlineCard = ({ deadline }) => {
  const daysUntil = differenceInDays(new Date(deadline.dueDate), new Date())
  
  const getPriorityColor = (priority, daysUntil) => {
    if (daysUntil <= 7) return "error"
    if (daysUntil <= 30 || priority === "high") return "warning"
    return "info"
  }
  
  const priorityColor = getPriorityColor(deadline.priority, daysUntil)
  
  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 mb-1">
            {deadline.description}
          </h4>
          <p className="text-sm text-slate-600">
            {deadline.companyName}
          </p>
        </div>
        <Badge variant={priorityColor}>
          {daysUntil <= 0 ? "Overdue" : `${daysUntil} days`}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-slate-500">
          <ApperIcon name="Calendar" size={14} className="mr-1" />
          <span>{format(new Date(deadline.dueDate), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center text-slate-500">
          <ApperIcon name="AlertTriangle" size={14} className="mr-1" />
          <span className="capitalize">{deadline.priority}</span>
        </div>
      </div>
    </Card>
  )
}

export default DeadlineCard