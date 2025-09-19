import { toast } from "react-toastify"

const tableName = 'company_c'

const companiesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "registration_number_c"}},
          {"field": {"Name": "incorporation_date_c"}},
          {"field": {"Name": "registered_address_c"}},
          {"field": {"Name": "directors_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "vat_number_c"}},
          {"field": {"Name": "year_end_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error)
      return []
    }
  },
  
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "registration_number_c"}},
          {"field": {"Name": "incorporation_date_c"}},
          {"field": {"Name": "registered_address_c"}},
          {"field": {"Name": "directors_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "vat_number_c"}},
          {"field": {"Name": "year_end_c"}}
        ]
      }

      const response = await apperClient.getRecordById(tableName, id, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },
  
  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: companyData.name || "",
          name_c: companyData.name || "",
          registration_number_c: companyData.registrationNumber || "",
          incorporation_date_c: companyData.incorporationDate || "",
          registered_address_c: typeof companyData.registeredAddress === 'object' ? 
            `${companyData.registeredAddress.line1 || ''}\n${companyData.registeredAddress.line2 || ''}\n${companyData.registeredAddress.city || ''}\n${companyData.registeredAddress.postcode || ''}\n${companyData.registeredAddress.country || ''}`.trim() :
            companyData.registeredAddress || "",
          directors_c: Array.isArray(companyData.directors) ? companyData.directors.join(', ') : companyData.directors || "",
          status_c: companyData.status || "active",
          vat_number_c: companyData.vatNumber || "",
          year_end_c: companyData.yearEnd || ""
        }]
      }

      const response = await apperClient.createRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error)
      return null
    }
  },
  
  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: id,
          Name: updates.name || "",
          name_c: updates.name || "",
          registration_number_c: updates.registrationNumber || "",
          incorporation_date_c: updates.incorporationDate || "",
          registered_address_c: typeof updates.registeredAddress === 'object' ? 
            `${updates.registeredAddress.line1 || ''}\n${updates.registeredAddress.line2 || ''}\n${updates.registeredAddress.city || ''}\n${updates.registeredAddress.postcode || ''}\n${updates.registeredAddress.country || ''}`.trim() :
            updates.registeredAddress || "",
          directors_c: Array.isArray(updates.directors) ? updates.directors.join(', ') : updates.directors || "",
          status_c: updates.status || "active",
          vat_number_c: updates.vatNumber || "",
          year_end_c: updates.yearEnd || ""
        }]
      }

      const response = await apperClient.updateRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error)
      return null
    }
  },
  
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = { 
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0
      }
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default companiesService