import React from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import StatusIndicator from "@/components/molecules/StatusIndicator"
import ApperIcon from "@/components/ApperIcon"

const CompanyCard = ({ company }) => {
  const navigate = useNavigate()
  
  const handleViewDetails = () => {
    navigate(`/companies/${company.Id}`)
  }
  
  const getUpcomingDeadline = (companyId) => {
    // Mock calculation for next filing deadline
    const nextFiling = new Date()
    nextFiling.setMonth(nextFiling.getMonth() + 3)
    return nextFiling
  }
  
  const nextDeadline = getUpcomingDeadline(company.Id)
  const daysUntilDeadline = Math.ceil((nextDeadline - new Date()) / (1000 * 60 * 60 * 24))
  
  return (
    <Card className="p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
{company.name_c || company.Name}
            </h3>
            <StatusIndicator status={company.status} />
          </div>
<p className="text-sm text-slate-500 mb-1">
            Reg. #{company.registration_number_c}
          </p>
<p className="text-sm text-slate-500">
Incorporated {format(new Date(company.incorporation_date_c), "MMM d, yyyy")}
          </p>
          {company.website_c && (
            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
              <ApperIcon name="Globe" size={14} />
              <a 
                href={company.website_c} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {company.website_c.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleViewDetails}>
          <ApperIcon name="ExternalLink" size={16} />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Next Filing:</span>
          <span className={`font-medium ${daysUntilDeadline <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>
            {daysUntilDeadline} days
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Year End:</span>
<span className="text-slate-900 font-medium">
            {format(new Date(company.year_end_c), "MMM d")}
          </span>
        </div>
        
{company.vat_number_c && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">VAT Registered:</span>
            <div className="flex items-center text-emerald-600">
              <ApperIcon name="CheckCircle" size={14} className="mr-1" />
              <span className="font-medium">Yes</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleViewDetails}
          className="w-full"
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}

export default CompanyCard