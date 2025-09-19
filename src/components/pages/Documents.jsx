import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import documentsService from "@/services/api/documentsService"

const Documents = () => {
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  
  const loadDocuments = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await documentsService.getAll()
      setDocuments(data)
      setFilteredDocuments(data)
    } catch (err) {
      setError("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDocuments()
  }, [])
  
  useEffect(() => {
    let filtered = documents
    
    if (searchTerm) {
filtered = filtered.filter(doc =>
        (doc.name_c && doc.name_c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.Name && doc.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.company_name_c && doc.company_name_c.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(doc => doc.type_c === typeFilter)
    }
    
    setFilteredDocuments(filtered)
  }, [documents, searchTerm, typeFilter])
  
  const getFileIcon = (type) => {
    switch (type) {
      case "certificate":
        return "Award"
      case "contract":
        return "FileText"
      case "financial":
        return "Calculator"
      case "legal":
        return "Scale"
      default:
        return "File"
    }
  }
  
  const getFileSize = (size) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }
  
const documentTypes = [...new Set(documents.map(doc => doc.type_c).filter(Boolean))]
  
  if (loading) return (
    <div className="p-6">
      <Loading type="table" />
    </div>
  )
  
  if (error) return (
    <div className="p-6">
      <Error message="Documents Error" description={error} onRetry={loadDocuments} />
    </div>
  )
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
          <p className="text-slate-600">Manage company documents and files</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Upload" size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Type:</span>
          <select
            className="input-field w-auto min-w-[120px]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <Empty
          title={documents.length === 0 ? "No Documents" : "No Documents Found"}
          description={documents.length === 0 
            ? "Upload your first document to get started with document management."
            : "No documents match your current search criteria."
          }
          icon="FileText"
          actionLabel="Upload Document"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
<Card key={document.Id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <ApperIcon name={getFileIcon(document.type_c)} size={20} className="text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                      {document.name_c || document.Name}
                    </h3>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Download" size={14} />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">{document.company_name_c}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="text-xs">
                        {document.type_c}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {getFileSize(document.size_c)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Uploaded {format(new Date(document.upload_date_c), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Eye" size={14} className="mr-1" />
                  Preview
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MoreHorizontal" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Documents