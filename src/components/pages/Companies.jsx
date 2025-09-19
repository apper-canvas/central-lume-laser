import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import CompanyCard from "@/components/organisms/CompanyCard"
import CompanyForm from "@/components/organisms/CompanyForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import companiesService from "@/services/api/companiesService"

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  
  const loadCompanies = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await companiesService.getAll()
      setCompanies(data)
      setFilteredCompanies(data)
    } catch (err) {
      setError("Failed to load companies")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadCompanies()
  }, [])
  
  useEffect(() => {
    let filtered = companies
    
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.registrationNumber.includes(searchTerm)
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(company => company.status === statusFilter)
    }
    
    setFilteredCompanies(filtered)
  }, [companies, searchTerm, statusFilter])
  
  const handleAddSuccess = () => {
    setShowAddForm(false)
    loadCompanies()
  }
  
  if (loading) return (
    <div className="p-6">
      <Loading type="cards" />
    </div>
  )
  
  if (error) return (
    <div className="p-6">
      <Error message="Companies Error" description={error} onRetry={loadCompanies} />
    </div>
  )
  
  if (showAddForm) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Add New Company</h2>
            <p className="text-slate-600">Enter your company details to get started.</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <CompanyForm 
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Companies</h2>
          <p className="text-slate-600">Manage your limited companies</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Status:</span>
          <select
            className="input-field w-auto min-w-[120px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No Companies Found"
          description={companies.length === 0 
            ? "Add your first limited company to get started with tracking and management."
            : "No companies match your current filters. Try adjusting your search criteria."
          }
          icon="Building2"
          actionLabel="Add Company"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Companies