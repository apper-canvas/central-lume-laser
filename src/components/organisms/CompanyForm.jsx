import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import companiesService from "@/services/api/companiesService"

const CompanyForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [logoLoading, setLogoLoading] = useState(false)
const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    incorporationDate: "",
    registeredAddress: {
      line1: "",
      line2: "",
      city: "",
      postcode: "",
      country: "United Kingdom"
    },
    directors: [],
    status: "active",
    companySize: "small",
    vatNumber: "",
    yearEnd: "",
    website: "",
    logo: ""
  })

  // Debounce function for logo fetching
  useEffect(() => {
    const fetchLogo = async () => {
      if (!formData.website || formData.website.length < 10) {
        setFormData(prev => ({ ...prev, logo: "" }))
        return
      }

      setLogoLoading(true)
      
      try {
        const { ApperClient } = window.ApperSDK
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        })

        const result = await apperClient.functions.invoke(import.meta.env.VITE_FETCH_COMPANY_LOGO, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            website: formData.website
          })
        })

        if (result.success && result.data?.logo) {
          setFormData(prev => ({ ...prev, logo: result.data.logo }))
          toast.success("Company logo fetched successfully!")
        } else {
          console.error('Logo fetch failed:', result.message)
          toast.info("Could not fetch company logo")
        }
      } catch (error) {
        console.error('Error fetching logo:', error)
        toast.info("Could not fetch company logo")
      } finally {
        setLogoLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchLogo, 1000) // Debounce for 1 second

    return () => clearTimeout(timeoutId)
  }, [formData.website])
  
  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await companiesService.create(formData)
      toast.success("Company added successfully!")
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to add company. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter company name"
          required
        />
        
        <FormField
          label="Registration Number"
          value={formData.registrationNumber}
          onChange={(e) => handleChange("registrationNumber", e.target.value)}
          placeholder="e.g. 12345678"
          required
        />
        
        <FormField
          label="Incorporation Date"
          type="date"
          value={formData.incorporationDate}
          onChange={(e) => handleChange("incorporationDate", e.target.value)}
          required
        />
        
        <FormField
          label="Year End"
          type="date"
          value={formData.yearEnd}
          onChange={(e) => handleChange("yearEnd", e.target.value)}
          required
        />
        
        <FormField
          label="VAT Number (Optional)"
          value={formData.vatNumber}
          onChange={(e) => handleChange("vatNumber", e.target.value)}
          placeholder="GB123456789"
        />
        
<FormField label="Status">
          <select 
            className="input-field"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
        
        <FormField label="Company Size">
          <select 
            className="input-field"
            value={formData.companySize}
            onChange={(e) => handleChange("companySize", e.target.value)}
          >
            <option value="micro">Micro (1-10 employees)</option>
            <option value="small">Small (11-50 employees)</option>
            <option value="medium">Medium (51-250 employees)</option>
            <option value="large">Large (251-1000 employees)</option>
            <option value="enterprise">Enterprise (1000+ employees)</option>
          </select>
        </FormField>
<FormField label="Website" className="mb-4">
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.example.com"
            className="input-field"
          />
        </FormField>

        {/* Logo Preview Section */}
        {(formData.website && formData.website.length > 10) && (
          <FormField label="Company Logo" className="mb-4">
            <div className="flex items-center space-x-4">
              {logoLoading ? (
                <div className="w-20 h-20 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Loader2" size={24} className="animate-spin text-primary-600" />
                </div>
              ) : formData.logo ? (
                <div className="w-20 h-20 border-2 border-slate-300 rounded-lg overflow-hidden">
                  <img 
                    src={formData.logo} 
                    alt="Company logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" size={24} className="text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                {logoLoading ? (
                  <p className="text-sm text-slate-600">Fetching company logo...</p>
                ) : formData.logo ? (
                  <p className="text-sm text-emerald-600">Logo fetched successfully</p>
                ) : formData.website.length > 10 ? (
                  <p className="text-sm text-slate-500">Logo will be fetched automatically</p>
                ) : null}
              </div>
            </div>
          </FormField>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Registered Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Address Line 1"
            value={formData.registeredAddress.line1}
            onChange={(e) => handleChange("registeredAddress.line1", e.target.value)}
            placeholder="Enter address line 1"
            required
          />
          
          <FormField
            label="Address Line 2"
            value={formData.registeredAddress.line2}
            onChange={(e) => handleChange("registeredAddress.line2", e.target.value)}
            placeholder="Enter address line 2"
          />
          
          <FormField
            label="City"
            value={formData.registeredAddress.city}
            onChange={(e) => handleChange("registeredAddress.city", e.target.value)}
            placeholder="Enter city"
            required
          />
          
          <FormField
            label="Postcode"
            value={formData.registeredAddress.postcode}
            onChange={(e) => handleChange("registeredAddress.postcode", e.target.value)}
            placeholder="Enter postcode"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
              Adding Company...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Company
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default CompanyForm