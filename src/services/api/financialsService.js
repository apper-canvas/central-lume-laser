import { toast } from "react-toastify"

const tableName = 'financial_c'

const financialsService = {
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tax_year_c"}},
          {"field": {"Name": "company_id_c"}}
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
      console.error("Error fetching financials:", error?.response?.data?.message || error)
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tax_year_c"}},
          {"field": {"Name": "company_id_c"}}
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
      console.error(`Error fetching financial ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },
  
  async getByCompany(companyId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tax_year_c"}},
          {"field": {"Name": "company_id_c"}}
        ],
        where: [{"FieldName": "company_id_c", "Operator": "EqualTo", "Values": [parseInt(companyId)]}]
      }

      const response = await apperClient.fetchRecords(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching financials by company:", error?.response?.data?.message || error)
      return []
    }
  },
  
  async create(financialData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: financialData.description || "",
          type_c: financialData.type || "",
          amount_c: parseFloat(financialData.amount) || 0.0,
          description_c: financialData.description || "",
          date_c: financialData.date || "",
          category_c: financialData.category || "",
          tax_year_c: financialData.taxYear || "",
          company_id_c: parseInt(financialData.companyId) || 0
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
      console.error("Error creating financial:", error?.response?.data?.message || error)
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
          Name: updates.description || "",
          type_c: updates.type || "",
          amount_c: updates.amount ? parseFloat(updates.amount) : undefined,
          description_c: updates.description || "",
          date_c: updates.date || "",
          category_c: updates.category || "",
          tax_year_c: updates.taxYear || "",
          company_id_c: updates.companyId ? parseInt(updates.companyId) : undefined
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
      console.error("Error updating financial:", error?.response?.data?.message || error)
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
      console.error("Error deleting financial:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default financialsService