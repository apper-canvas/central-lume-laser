import companiesData from "@/services/mockData/companies.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const companiesService = {
  async getAll() {
    await delay(300)
    return [...companiesData]
  },
  
  async getById(id) {
    await delay(200)
    const company = companiesData.find(c => c.Id === id)
    if (!company) {
      throw new Error("Company not found")
    }
    return { ...company }
  },
  
  async create(companyData) {
    await delay(400)
    const newId = Math.max(...companiesData.map(c => c.Id), 0) + 1
    const newCompany = {
      ...companyData,
      Id: newId
    }
    companiesData.push(newCompany)
    return { ...newCompany }
  },
  
  async update(id, updates) {
    await delay(350)
    const index = companiesData.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error("Company not found")
    }
    companiesData[index] = { ...companiesData[index], ...updates }
    return { ...companiesData[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = companiesData.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error("Company not found")
    }
    const deleted = companiesData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default companiesService