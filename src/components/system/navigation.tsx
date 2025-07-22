'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NavItem } from '@/lib/types'
import { Monitor, HardDrive, Cpu, LogOut } from 'lucide-react'

const navigationItems: NavItem[] = [
  {
    path: '/dashboard/memory',
    name: 'Memory/RAM',
    icon: 'monitor'
  },
  {
    path: '/dashboard/cpu',
    name: 'CPU',
    icon: 'cpu'
  },
  {
    path: '/dashboard/disk',
    name: 'Disk/Storage',
    icon: 'harddrive'
  }
]

const iconMap = {
  monitor: Monitor,
  cpu: Cpu,
  harddrive: HardDrive
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('ssh-credentials')
    router.push('/login')
  }

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Linux WebGUI</h1>
        
        <nav className="space-y-2">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Hardware
            </h2>
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Monitor
              const isActive = pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-gray-300 border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  )
}