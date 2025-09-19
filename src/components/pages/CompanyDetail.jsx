import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import StatusIndicator from "@/components/molecules/StatusIndicator"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import companiesService from "@/services/api/companiesService"
import keyDatesService from "@/services/api/keyDatesService"
import financialsService from "@/services/api/financialsService"

const CompanyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [keyDates, setKeyDates] = useState([])
  const [financials, setFinancials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  
  const loadCompanyData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [companyData, datesData, financialData] = await Promise.all([
        companiesService.getById(parseInt(id)),
        keyDatesService.getByCompany(parseInt(id)),
        financialsService.getByCompany(parseInt(id))
      ])
      
      setCompany(companyData)
      setKeyDates(datesData)
      setFinancials(financialData)
    } catch (err) {
      setError("Failed to load company details")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (id) {
      loadCompanyData()
    }
  }, [id])
  
  const handleDeleteCompany = async () => {
    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        await companiesService.delete(parseInt(id))
        toast.success("Company deleted successfully")
        navigate("/companies")
      } catch (err) {
        toast.error("Failed to delete company")
      }
    }
  }
  
  if (loading) return (
    <div className="p-6">
      <Loading type="table" />
    </div>
  )
  
  if (error || !company) return (
    <div className="p-6">
      <Error 
        message="Company Not Found" 
        description={error || "The requested company could not be found."} 
        onRetry={loadCompanyData} 
      />
    </div>
  )
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "Eye" },
    { id: "finances", label: "Finances", icon: "PoundSterling" },
    { id: "dates", label: "Key Dates", icon: "Calendar" },
    { id: "documents", label: "Documents", icon: "FileText" }
  ]
  
  const calculateTotals = () => {
const revenue = financials.filter(f => f.type_c === "revenue").reduce((sum, f) => sum + (f.amount_c || 0), 0)
    const expenses = financials.filter(f => f.type_c === "expense").reduce((sum, f) => sum + (f.amount_c || 0), 0)
    return { revenue, expenses, profit: revenue - expenses }
  }
  
  const totals = calculateTotals()
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/companies")}>
            <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
            Back to Companies
          </Button>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <div className="flex items-center space-x-3">
<h1 className="text-2xl font-bold text-slate-900">{company.name_c || company.Name}</h1>
              <StatusIndicator status={company.status_c} />
            </div>
            <p className="text-slate-600">Registration #{company.registration_number_c}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary">
            <ApperIcon name="Edit" size={16} className="mr-2" />
            Edit
          </Button>
          <Button variant="secondary" onClick={handleDeleteCompany}>
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Company Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Basic Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Incorporation Date:</span>
<span className="text-slate-900">{format(new Date(company.incorporation_date_c), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Year End:</span>
<span className="text-slate-900">{format(new Date(company.year_end_c), "MMM d")}</span>
                      </div>
{company.vat_number_c && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">VAT Number:</span>
                          <span className="text-slate-900">{company.vat_number_c}</span>
                        </div>
)}
                      {company.website_c && (
                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="Globe" size={16} className="text-slate-400" />
                          <a 
                            href={company.website_c} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {company.website_c}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Registered Address</h4>
<div className="text-sm text-slate-900 space-y-1">
                      {company.registered_address_c && company.registered_address_c.split('\n').map((line, index) => (
                        line.trim() && <div key={index}>{line.trim()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Revenue:</span>
                    <span className="text-emerald-600 font-semibold">£{totals.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expenses:</span>
                    <span className="text-red-600 font-semibold">£{totals.expenses.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-900 font-medium">Net Profit:</span>
                      <span className={`font-bold ${totals.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        £{totals.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === "finances" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Financial Records</h3>
              <Button variant="primary" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Record
              </Button>
            </div>
            
            {financials.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="PoundSterling" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No financial records yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Type</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
{financials.map((record) => (
                      <tr key={record.Id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-600">
                          {format(new Date(record.date_c), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4 text-slate-900">{record.description_c}</td>
                        <td className="py-3 px-4 text-slate-600">{record.category_c}</td>
                        <td className="py-3 px-4">
                          <Badge variant={record.type_c === "revenue" ? "success" : "warning"}>
                            {record.type_c}
                          </Badge>
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${record.type_c === "revenue" ? "text-emerald-600" : "text-red-600"}`}>
                          £{(record.amount_c || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
        
        {activeTab === "dates" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Key Dates & Deadlines</h3>
              <Button variant="primary" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Date
              </Button>
            </div>
            
            {keyDates.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No key dates recorded</p>
              </div>
            ) : (
              <div className="space-y-4">
                {keyDates.map((date) => (
<div key={date.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">{date.description_c}</h4>
                      <p className="text-sm text-slate-600">{date.type_c}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-900 font-medium">
                        {format(new Date(date.due_date_c), "MMM d, yyyy")}
                      </p>
                      <Badge variant={date.completed_c ? "success" : "warning"}>
                        {date.completed_c ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {activeTab === "documents" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Documents</h3>
              <Button variant="primary" size="sm">
                <ApperIcon name="Upload" size={16} className="mr-2" />
                Upload Document
              </Button>
            </div>
            
            <div className="text-center py-8">
              <ApperIcon name="FileText" size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No documents uploaded yet</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CompanyDetail