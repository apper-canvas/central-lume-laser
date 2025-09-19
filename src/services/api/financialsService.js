import financialsData from "@/services/mockData/financials.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const financialsService = {
  async getAll() {
    await delay(300)
    return [...financialsData]
  },
  
  async getById(id) {
    await delay(200)
    const financial = financialsData.find(f => f.Id === id)
    if (!financial) {
      throw new Error("Financial record not found")
    }
    return { ...financial }
  },
  
  async getByCompany(companyId) {
    await delay(250)
    return financialsData.filter(f => f.companyId === companyId).map(f => ({ ...f }))
  },
  
  async create(financialData) {
    await delay(400)
    const newId = Math.max(...financialsData.map(f => f.Id), 0) + 1
    const newFinancial = {
      ...financialData,
      Id: newId
    }
    financialsData.push(newFinancial)
    return { ...newFinancial }
  },
  
  async update(id, updates) {
    await delay(350)
    const index = financialsData.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error("Financial record not found")
    }
    financialsData[index] = { ...financialsData[index], ...updates }
    return { ...financialsData[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = financialsData.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error("Financial record not found")
    }
    const deleted = financialsData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default financialsService