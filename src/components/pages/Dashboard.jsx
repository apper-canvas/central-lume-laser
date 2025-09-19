import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import QuickStats from "@/components/molecules/QuickStats"
import CompanyCard from "@/components/organisms/CompanyCard"
import DeadlineCard from "@/components/organisms/DeadlineCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import companiesService from "@/services/api/companiesService"
import keyDatesService from "@/services/api/keyDatesService"

const Dashboard = () => {
  const [companies, setCompanies] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [companiesData, deadlinesData] = await Promise.all([
        companiesService.getAll(),
        keyDatesService.getUpcoming()
      ])
      setCompanies(companiesData)
      setUpcomingDeadlines(deadlinesData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  if (loading) return (
    <div className="p-6 space-y-6">
      <Loading type="stats" />
      <Loading type="cards" />
    </div>
  )
  
  if (error) return (
    <div className="p-6">
      <Error message="Dashboard Error" description={error} onRetry={loadData} />
    </div>
  )
  
  const activeCompanies = companies.filter(c => c.status === "active").length
  const dormantCompanies = companies.filter(c => c.status === "dormant").length
  const overdueTasks = upcomingDeadlines.filter(d => new Date(d.dueDate) < new Date()).length
  const upcomingTasks = upcomingDeadlines.filter(d => new Date(d.dueDate) >= new Date()).length
  
  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <QuickStats
          title="Active Companies"
          value={activeCompanies}
          icon="Building2"
          color="success"
        />
        <QuickStats
          title="Dormant Companies"
          value={dormantCompanies}
          icon="Clock"
          color="warning"
        />
        <QuickStats
          title="Upcoming Tasks"
          value={upcomingTasks}
          icon="Calendar"
          color="primary"
        />
        <QuickStats
          title="Overdue Items"
          value={overdueTasks}
          icon="AlertTriangle"
          color="error"
        />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Companies */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Companies</h2>
          </div>
          
          {companies.length === 0 ? (
            <Empty
              title="No Companies Yet"
              description="Add your first limited company to get started with tracking and management."
              icon="Building2"
              actionLabel="Add Company"
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {companies.slice(0, 4).map((company, index) => (
                <motion.div
                  key={company.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <CompanyCard company={company} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Upcoming Deadlines */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Upcoming Deadlines</h2>
          </div>
          
          {upcomingDeadlines.length === 0 ? (
            <Empty
              title="No Deadlines"
              description="All caught up! No upcoming deadlines to worry about."
              icon="Calendar"
            />
          ) : (
            <div className="space-y-4">
              {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                <motion.div
                  key={deadline.Id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <DeadlineCard deadline={deadline} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard