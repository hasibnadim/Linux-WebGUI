'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMemoryInfo } from '@/lib/actions/system'
import { SSHCredentials, MemoryInfo } from '@/lib/types'
import { RefreshCw } from 'lucide-react'

export default function MemoryPage() {
  const [memoryData, setMemoryData] = useState<MemoryInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchMemoryInfo = async () => {
    setIsLoading(true)
    setError('')

    try {
      const credentialsStr = sessionStorage.getItem('ssh-credentials')
      if (!credentialsStr) {
        setError('No SSH credentials found')
        return
      }

      const credentials: SSHCredentials = JSON.parse(credentialsStr)
      const result = await getMemoryInfo(credentials)

      if (result.success && result.data) {
        setMemoryData(result.data)
      } else {
        setError(result.error || 'Failed to fetch memory info')
      }
    } catch (err) {
      setError('Failed to fetch memory info')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemoryInfo()
  }, [])

  const formatBytes = (bytes: number, unit: string) => {
    return `${bytes} ${unit}`
  }

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Memory/RAM Information</h1>
          <p className="text-gray-600 mt-2">Monitor system memory usage and statistics</p>
        </div>
        <Button onClick={fetchMemoryInfo} disabled={isLoading}>
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

      {memoryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Memory</CardTitle>
              <CardDescription>Primary RAM usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">
                    {formatBytes(memoryData.total, memoryData.unit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className="font-semibold text-orange-600">
                    {formatBytes(memoryData.used, memoryData.unit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Free:</span>
                  <span className="font-semibold text-green-600">
                    {formatBytes(memoryData.free, memoryData.unit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${getUsagePercentage(memoryData.used, memoryData.total)}%`
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {getUsagePercentage(memoryData.used, memoryData.total)}% used
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Swap Memory</CardTitle>
              <CardDescription>Virtual memory usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">
                    {formatBytes(memoryData.swapTotal, memoryData.unit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className="font-semibold text-orange-600">
                    {formatBytes(memoryData.swapUsed, memoryData.unit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Free:</span>
                  <span className="font-semibold text-green-600">
                    {formatBytes(memoryData.swapFree, memoryData.unit)}
                  </span>
                </div>
                {memoryData.swapTotal > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${getUsagePercentage(memoryData.swapUsed, memoryData.swapTotal)}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      {getUsagePercentage(memoryData.swapUsed, memoryData.swapTotal)}% used
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Details</CardTitle>
              <CardDescription>Additional memory information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Shared:</span>
                  <span>{formatBytes(memoryData.shared, memoryData.unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Buffers:</span>
                  <span>{formatBytes(memoryData.buffers, memoryData.unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cached:</span>
                  <span>{formatBytes(memoryData.cached, memoryData.unit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.keys(memoryData.physical).length > 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Detailed Memory Information</CardTitle>
                <CardDescription>Complete memory statistics from /proc/meminfo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {Object.entries(memoryData.physical)
                    .slice(0, 12)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-mono">{value}</span>
                      </div>
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