import React from "react"
import { motion } from "framer-motion"

const Loading = ({ type = "cards" }) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-5 bg-slate-200 rounded w-32"></div>
            <div className="h-5 bg-slate-200 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
          <div className="h-4 bg-slate-200 rounded w-28"></div>
        </div>
        <div className="h-8 w-8 bg-slate-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-18"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-12"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="h-8 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  )
  
  const renderTableSkeleton = () => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-slate-200 last:border-b-0">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
  
  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-12"></div>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  )
  
  if (type === "table") return renderTableSkeleton()
  if (type === "stats") return renderStatsSkeleton()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          {renderCardSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}

export default Loading