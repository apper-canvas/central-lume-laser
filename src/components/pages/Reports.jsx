import React, { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import QuickStats from "@/components/molecules/QuickStats";
import companiesService from "@/services/api/companiesService";
import financialsService from "@/services/api/financialsService";
import keyDatesService from "@/services/api/keyDatesService";
const Reports = () => {
  const [companies, setCompanies] = useState([])
  const [financials, setFinancials] = useState([])
  const [keyDates, setKeyDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState("12months")
  
  const loadReportData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [companiesData, financialsData, datesData] = await Promise.all([
        companiesService.getAll(),
        financialsService.getAll(),
        keyDatesService.getAll()
      ])
      
      setCompanies(companiesData)
      setFinancials(financialsData)
      setKeyDates(datesData)
    } catch (err) {
      setError("Failed to load report data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadReportData()
  }, [])
  
const getFilteredFinancials = () => {
    const months = dateRange === "3months" ? 3 : dateRange === "6months" ? 6 : 12
    const cutoffDate = subMonths(new Date(), months)
    return financials.filter(f => new Date(f.date_c) >= cutoffDate)
  }
  
  const calculateMetrics = () => {
    const filtered = getFilteredFinancials()
    
    const totalRevenue = filtered
      .filter(f => f.type_c === "revenue")
      .reduce((sum, f) => sum + (f.amount_c || 0), 0)
    
    const totalExpenses = filtered
      .filter(f => f.type_c === "expense")
      .reduce((sum, f) => sum + (f.amount_c || 0), 0)
    
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    
    const activeCompanies = companies.filter(c => c.status_c === "active").length
    const complianceScore = keyDates.filter(d => d.completed_c).length / Math.max(keyDates.length, 1) * 100
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      activeCompanies,
      complianceScore
    }
  }
  
const getCompanyFinancials = () => {
    const filtered = getFilteredFinancials()
    return companies.map(company => {
      const companyFinancials = filtered.filter(f => {
        const companyId = f.company_id_c?.Id || f.company_id_c
        return companyId === company.Id
      })
      
      const revenue = companyFinancials
        .filter(f => f.type_c === "revenue")
        .reduce((sum, f) => sum + (f.amount_c || 0), 0)
      
      const expenses = companyFinancials
        .filter(f => f.type_c === "expense")
        .reduce((sum, f) => sum + (f.amount_c || 0), 0)
      
      const profit = revenue - expenses
      
      return {
        ...company,
        revenue,
        expenses,
        profit,
        profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }
  
  if (loading) return (
    <div className="p-6">
      <Loading type="stats" />
    </div>
  )
  
  if (error) return (
    <div className="p-6">
      <Error message="Reports Error" description={error} onRetry={loadReportData} />
    </div>
  )
  
  const metrics = calculateMetrics()
  const companyFinancials = getCompanyFinancials()
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-600">Financial performance and compliance overview</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            className="input-field w-auto"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <Button variant="secondary">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStats
          title="Total Revenue"
          value={`£${metrics.totalRevenue.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
        />
        <QuickStats
          title="Total Expenses"
          value={`£${metrics.totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="warning"
        />
        <QuickStats
          title="Net Profit"
          value={`£${metrics.netProfit.toLocaleString()}`}
          icon="DollarSign"
          color={metrics.netProfit >= 0 ? "success" : "error"}
        />
        <QuickStats
          title="Active Companies"
          value={metrics.activeCompanies}
          icon="Building2"
          color="primary"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Performance */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Company Performance</h3>
              <Badge variant="info">
                {dateRange === "3months" ? "Last 3 Months" : 
                 dateRange === "6months" ? "Last 6 Months" : "Last 12 Months"}
              </Badge>
            </div>
            
            {companyFinancials.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="BarChart3" size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No financial data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {companyFinancials.map((company) => (
<div key={company.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{company.name_c || company.Name}</h4>
                      <p className="text-sm text-slate-600">Reg. #{company.registration_number_c}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-sm text-slate-600">Revenue</p>
                        <p className="font-semibold text-emerald-600">£{company.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Expenses</p>
                        <p className="font-semibold text-red-600">£{company.expenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Profit</p>
                        <p className={`font-semibold ${company.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          £{company.profit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        {/* Summary Stats */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Profit Margin:</span>
                <span className={`font-semibold ${metrics.profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metrics.profitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avg. per Company:</span>
                <span className="text-slate-900 font-semibold">
                  £{metrics.activeCompanies > 0 ? (metrics.totalRevenue / metrics.activeCompanies).toLocaleString() : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Compliance Score:</span>
                <span className="text-emerald-600 font-semibold">
                  {metrics.complianceScore.toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ApperIcon name="FileText" size={16} className="mr-2" />
                Generate Tax Report
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ApperIcon name="PieChart" size={16} className="mr-2" />
                Expense Breakdown
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Deadline Summary
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ApperIcon name="Send" size={16} className="mr-2" />
                Email Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Reports