'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCPUInfo } from '@/lib/actions/system'
import { SSHCredentials, CPUInfo } from '@/lib/types'
import { RefreshCw } from 'lucide-react'

export default function CPUPage() {
  const [cpuData, setCpuData] = useState<CPUInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAllFlags, setShowAllFlags] = useState(true)

  const fetchCPUInfo = async () => {
    setIsLoading(true)
    setError('')

    try {
      const credentialsStr = sessionStorage.getItem('ssh-credentials')
      if (!credentialsStr) {
        setError('No SSH credentials found')
        return
      }

      const credentials: SSHCredentials = JSON.parse(credentialsStr)
      const result = await getCPUInfo(credentials)

      if (result.success && result.data) {
        setCpuData(result.data)
      } else {
        setError(result.error || 'Failed to fetch CPU info')
      }
    } catch (err) {
      setError('Failed to fetch CPU info')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCPUInfo()
  }, [])

  const importantFields = [
    'Model name',
    'Architecture', 
    'CPU(s)',
    'Thread(s) per core',
    'Core(s) per socket',
    'Socket(s)',
    'CPU MHz',
    'BogoMIPS'
  ]

  const cacheFields = [
    'L1d cache',
    'L1i cache', 
    'L2 cache',
    'L3 cache'
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CPU Information</h1>
          <p className="text-gray-600 mt-2">View processor details and specifications</p>
        </div>
        <Button onClick={fetchCPUInfo} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {cpuData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Processor Overview</CardTitle>
              <CardDescription>Key CPU specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {importantFields.map((field) => (
                  cpuData[field as keyof CPUInfo] && (
                    <div key={field} className="flex justify-between">
                      <span className="text-gray-600">{field}:</span>
                      <span className="font-semibold text-right">
                        {cpuData[field as keyof CPUInfo]}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cache Information</CardTitle>
              <CardDescription>CPU cache levels and sizes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cacheFields.map((field) => (
                  cpuData[field as keyof CPUInfo] && (
                    <div key={field} className="flex justify-between">
                      <span className="text-gray-600">{field}:</span>
                      <span className="font-semibold">
                        {cpuData[field as keyof CPUInfo]}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Complete CPU information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(cpuData)
                  .filter(([key]) => ![...importantFields, ...cacheFields].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-mono text-right max-w-xs truncate" title={value}>
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {cpuData.Flags && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>CPU Flags</CardTitle>
                <CardDescription>Supported CPU features and instruction sets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cpuData.Flags.split(' ').map((flag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}