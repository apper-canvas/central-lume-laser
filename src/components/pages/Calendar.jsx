import React, { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import keyDatesService from "@/services/api/keyDatesService"

const Calendar = () => {
  const [keyDates, setKeyDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState("calendar") // calendar or list
  
  const loadKeyDates = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await keyDatesService.getAll()
      setKeyDates(data)
    } catch (err) {
      setError("Failed to load calendar data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadKeyDates()
  }, [])
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }
  
const getDatesForDay = (day) => {
    return keyDates.filter(date => isSameDay(new Date(date.due_date_c), day))
  }
  
const getPriorityColor = (priority, dueDate) => {
    const daysUntil = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysUntil <= 0) return "error"
    if (daysUntil <= 7) return "error"
    if (daysUntil <= 30 || priority === "high") return "warning"
    return "info"
  }
  
  if (loading) return (
    <div className="p-6">
      <Loading type="table" />
    </div>
  )
  
  if (error) return (
    <div className="p-6">
      <Error message="Calendar Error" description={error} onRetry={loadKeyDates} />
    </div>
  )
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
          <p className="text-slate-600">Track important dates and deadlines</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === "calendar" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewType("calendar")}
          >
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewType === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewType("list")}
          >
            <ApperIcon name="List" size={16} className="mr-2" />
            List
          </Button>
        </div>
      </div>
      
      {viewType === "calendar" ? (
        <Card className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <h3 className="text-xl font-semibold text-slate-900">
                {format(currentDate, "MMMM yyyy")}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-slate-100 p-2 text-center text-sm font-medium text-slate-700">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const dayDates = getDatesForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              
              return (
                <div
                  key={index}
                  className={`bg-white p-2 min-h-[100px] ${
                    !isCurrentMonth ? "opacity-50" : ""
                  } ${isToday ? "bg-primary-50 border-l-2 border-primary-500" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? "text-primary-600" : "text-slate-900"
                  }`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayDates.slice(0, 2).map((date) => (
                      <div
key={date.Id}
                        className="text-xs p-1 rounded truncate"
                        style={{
                          backgroundColor: getPriorityColor(date.priority_c, date.due_date_c) === "error" 
                            ? "#fef2f2" : getPriorityColor(date.priority_c, date.due_date_c) === "warning" 
                            ? "#fffbeb" : "#eff6ff",
                          color: getPriorityColor(date.priority_c, date.due_date_c) === "error" 
                            ? "#dc2626" : getPriorityColor(date.priority_c, date.due_date_c) === "warning" 
                            ? "#d97706" : "#2563eb"
                        }}
                        title={date.description_c}
                      >
                        {date.description_c}
                      </div>
                    ))}
                    {dayDates.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{dayDates.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {keyDates.length === 0 ? (
            <Empty
              title="No Dates Scheduled"
              description="No important dates or deadlines have been added yet."
              icon="Calendar"
              actionLabel="Add Date"
            />
          ) : (
keyDates
              .sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c))
              .map((date) => {
                const daysUntil = Math.ceil((new Date(date.due_date_c) - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <Card key={date.Id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{date.description_c}</h3>
                          <Badge variant={getPriorityColor(date.priority_c, date.due_date_c)}>
                            {daysUntil <= 0 ? "Overdue" : `${daysUntil} days`}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <ApperIcon name="Building2" size={14} className="mr-1" />
                            <span>{date.company_name_c}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Tag" size={14} className="mr-1" />
                            <span className="capitalize">{date.type_c}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            <span>{format(new Date(date.due_date_c), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {date.completed ? (
                          <Badge variant="success">
                            <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Check" size={16} className="mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar