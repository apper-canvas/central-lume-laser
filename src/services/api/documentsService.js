import documentsData from "@/services/mockData/documents.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const documentsService = {
  async getAll() {
    await delay(300)
    return [...documentsData]
  },
  
  async getById(id) {
    await delay(200)
    const document = documentsData.find(d => d.Id === id)
    if (!document) {
      throw new Error("Document not found")
    }
    return { ...document }
  },
  
  async getByCompany(companyId) {
    await delay(250)
    return documentsData.filter(d => d.companyId === companyId).map(d => ({ ...d }))
  },
  
  async create(documentData) {
    await delay(400)
    const newId = Math.max(...documentsData.map(d => d.Id), 0) + 1
    const newDocument = {
      ...documentData,
      Id: newId,
      uploadDate: new Date().toISOString().split('T')[0]
    }
    documentsData.push(newDocument)
    return { ...newDocument }
  },
  
  async update(id, updates) {
    await delay(350)
    const index = documentsData.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Document not found")
    }
    documentsData[index] = { ...documentsData[index], ...updates }
    return { ...documentsData[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = documentsData.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Document not found")
    }
    const deleted = documentsData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default documentsService