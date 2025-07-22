'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDiskInfo } from '@/lib/actions/system'
import { SSHCredentials, DiskInfo } from '@/lib/types'
import { RefreshCw, HardDrive } from 'lucide-react'

export default function DiskPage() {
  const [diskData, setDiskData] = useState<DiskInfo[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDiskInfo = async () => {
    setIsLoading(true)
    setError('')

    try {
      const credentialsStr = sessionStorage.getItem('ssh-credentials')
      if (!credentialsStr) {
        setError('No SSH credentials found')
        return
      }

      const credentials: SSHCredentials = JSON.parse(credentialsStr)
      const result = await getDiskInfo(credentials)

      if (result.success && result.data) {
        setDiskData(result.data)
      } else {
        setError(result.error || 'Failed to fetch disk info')
      }
    } catch (err) {
      setError('Failed to fetch disk info')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDiskInfo()
  }, [])

  const getUsagePercentage = (use: string) => {
    return parseInt(use.replace('%', '')) || 0
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-orange-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatFileSystem = (fs: string) => {
    if (fs.length > 20) {
      return fs.substring(0, 17) + '...'
    }
    return fs
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disk/Storage Information</h1>
          <p className="text-gray-600 mt-2">Monitor disk usage and storage capacity</p>
        </div>
        <Button onClick={fetchDiskInfo} disabled={isLoading}>
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

      {diskData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {diskData.map((disk, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-gray-600" />
                  <span className="truncate" title={disk.fileSystem}>
                    {formatFileSystem(disk.fileSystem)}
                  </span>
                </CardTitle>
                <CardDescription>
                  Mounted on: {disk.mountedOn}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Size</p>
                      <p className="font-semibold">{disk.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available</p>
                      <p className="font-semibold text-green-600">{disk.available}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Used</p>
                      <p className="font-semibold text-orange-600">{disk.used}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Usage</p>
                      <p className="font-semibold">{disk.use}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage</span>
                      <span>{disk.use}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(disk.use))}`}
                        style={{
                          width: disk.use
                        }}
                      ></div>
                    </div>
                  </div>

                  {getUsagePercentage(disk.use) >= 90 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2">
                      <p className="text-red-600 text-xs">
                        ⚠️ Warning: Disk usage is critically high
                      </p>
                    </div>
                  )}
                  
                  {getUsagePercentage(disk.use) >= 75 && getUsagePercentage(disk.use) < 90 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
                      <p className="text-orange-600 text-xs">
                        ⚠️ Caution: Disk usage is high
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {diskData && diskData.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No disk information available</p>
          </CardContent>
        </Card>
      )}

      {diskData && diskData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Summary</CardTitle>
            <CardDescription>Overview of all mounted filesystems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Filesystem</th>
                    <th className="text-left py-2">Size</th>
                    <th className="text-left py-2">Used</th>
                    <th className="text-left py-2">Available</th>
                    <th className="text-left py-2">Use%</th>
                    <th className="text-left py-2">Mounted on</th>
                  </tr>
                </thead>
                <tbody>
                  {diskData.map((disk, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-mono text-xs" title={disk.fileSystem}>
                        {formatFileSystem(disk.fileSystem)}
                      </td>
                      <td className="py-2">{disk.size}</td>
                      <td className="py-2">{disk.used}</td>
                      <td className="py-2">{disk.available}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          getUsagePercentage(disk.use) >= 90 
                            ? 'bg-red-100 text-red-800'
                            : getUsagePercentage(disk.use) >= 75
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {disk.use}
                        </span>
                      </td>
                      <td className="py-2 font-mono text-xs">{disk.mountedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}