import keyDatesData from "@/services/mockData/keyDates.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const keyDatesService = {
  async getAll() {
    await delay(300)
    return [...keyDatesData]
  },
  
  async getById(id) {
    await delay(200)
    const keyDate = keyDatesData.find(d => d.Id === id)
    if (!keyDate) {
      throw new Error("Key date not found")
    }
    return { ...keyDate }
  },
  
  async getByCompany(companyId) {
    await delay(250)
    return keyDatesData.filter(d => d.companyId === companyId).map(d => ({ ...d }))
  },
  
  async getUpcoming(days = 90) {
    await delay(300)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)
    
    return keyDatesData
      .filter(d => new Date(d.dueDate) <= cutoffDate && !d.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(d => ({ ...d }))
  },
  
  async create(keyDateData) {
    await delay(400)
    const newId = Math.max(...keyDatesData.map(d => d.Id), 0) + 1
    const newKeyDate = {
      ...keyDateData,
      Id: newId
    }
    keyDatesData.push(newKeyDate)
    return { ...newKeyDate }
  },
  
  async update(id, updates) {
    await delay(350)
    const index = keyDatesData.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Key date not found")
    }
    keyDatesData[index] = { ...keyDatesData[index], ...updates }
    return { ...keyDatesData[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = keyDatesData.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error("Key date not found")
    }
    const deleted = keyDatesData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default keyDatesService