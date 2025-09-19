import { toast } from "react-toastify";

const tableName = 'key_date_c'

const keyDatesService = {
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
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}}
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
      console.error("Error fetching key dates:", error?.response?.data?.message || error)
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
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}}
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
      console.error(`Error fetching key date ${id}:`, error?.response?.data?.message || error)
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
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}}
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
      console.error("Error fetching key dates by company:", error?.response?.data?.message || error)
      return []
    }
  },
  
  async getUpcoming(days = 90) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + days)

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}}
        ],
        where: [
          {"FieldName": "due_date_c", "Operator": "LessThanOrEqualTo", "Values": [cutoffDate.toISOString().split('T')[0]]},
          {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords(tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching upcoming key dates:", error?.response?.data?.message || error)
      return []
    }
  },
  
  async create(keyDateData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: keyDateData.description || "",
          company_id_c: parseInt(keyDateData.companyId) || 0,
          company_name_c: keyDateData.companyName || "",
          type_c: keyDateData.type || "",
          description_c: keyDateData.description || "",
          due_date_c: keyDateData.dueDate || "",
          completed_c: keyDateData.completed || false,
          priority_c: keyDateData.priority || "medium"
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
      console.error("Error creating key date:", error?.response?.data?.message || error)
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
          company_id_c: updates.companyId ? parseInt(updates.companyId) : undefined,
          company_name_c: updates.companyName || "",
          type_c: updates.type || "",
          description_c: updates.description || "",
          due_date_c: updates.dueDate || "",
          completed_c: updates.completed !== undefined ? updates.completed : undefined,
          priority_c: updates.priority || ""
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
      console.error("Error updating key date:", error?.response?.data?.message || error)
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
      console.error("Error deleting key date:", error?.response?.data?.message || error)
      return false
    }
}
}

export default keyDatesService