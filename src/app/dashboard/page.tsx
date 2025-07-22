import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Linux WebGUI</h1>
        <p className="text-gray-600 mt-2">
          Manage your Linux server through a modern web interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Memory/RAM</CardTitle>
            <CardDescription>
              Monitor memory usage and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              View detailed memory statistics including total, used, free, and swap memory.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPU Information</CardTitle>
            <CardDescription>
              Check processor details and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get comprehensive CPU information including architecture, cores, and specifications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disk/Storage</CardTitle>
            <CardDescription>
              Monitor disk usage and storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              View disk usage, available space, and mounted filesystems.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Navigate through the system monitoring options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Use the sidebar navigation to access different system monitoring tools</p>
            <p>• Click on Memory/RAM to view real-time memory statistics</p>
            <p>• Check CPU information to see processor details</p>
            <p>• Monitor disk usage to manage storage efficiently</p>
            <p>• All data is fetched securely via SSH connection</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}