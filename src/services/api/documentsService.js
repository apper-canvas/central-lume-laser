import { toast } from "react-toastify";

const tableName = 'document_c';

const documentsService = {
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
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "file_url_c"}},
          {"field": {"Name": "size_c"}},
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
      console.error("Error fetching documents:", error?.response?.data?.message || error)
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
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "file_url_c"}},
          {"field": {"Name": "size_c"}},
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
      console.error(`Error fetching document ${id}:`, error?.response?.data?.message || error)
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
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "file_url_c"}},
          {"field": {"Name": "size_c"}},
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
      console.error("Error fetching documents by company:", error?.response?.data?.message || error)
      return []
    }
  },
  
  async create(documentData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: documentData.name || "",
          company_name_c: documentData.companyName || "",
          name_c: documentData.name || "",
          type_c: documentData.type || "",
          upload_date_c: documentData.uploadDate || new Date().toISOString().split('T')[0],
          file_url_c: documentData.fileUrl || "",
          size_c: documentData.size || 0,
          company_id_c: parseInt(documentData.companyId) || 0
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
      console.error("Error creating document:", error?.response?.data?.message || error)
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
          company_name_c: updates.companyName || "",
          name_c: updates.name || "",
          type_c: updates.type || "",
          upload_date_c: updates.uploadDate || "",
          file_url_c: updates.fileUrl || "",
          size_c: updates.size || 0,
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
      console.error("Error updating document:", error?.response?.data?.message || error)
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
      console.error("Error deleting document:", error?.response?.data?.message || error)
return false
    }
  }
}

export default documentsService