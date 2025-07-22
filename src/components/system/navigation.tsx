'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Monitor, HardDrive, Cpu, LogOut, Package, Network, Folder, Shield, Globe, Link2, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_STRUCTURE = [
  {
    label: 'System',
    icon: Monitor,
    children: [
      { name: 'CPU', path: '/xssh/system/cpu', icon: Cpu },
      { name: 'Memory/RAM', path: '/xssh/system/memory', icon: Monitor },
      { name: 'Disk/Storage', path: '/xssh/system/disk', icon: HardDrive },
      { name: 'Network', path: '/xssh/system/network', icon: Network },
    ],
  },
  {
    label: 'Software',
    icon: Package,
    children: [
      { name: 'Packages', path: '/xssh/software/packages', icon: Package },
      { name: 'Software', path: '/xssh/software/software', icon: Package },
      { name: 'Applications', path: '/xssh/software/applications', icon: Package },
    ],
  },
  {
    label: 'File Manager',
    icon: Folder,
    children: [],
    path: '/xssh/filemanager',
  },
  {
    label: 'Security',
    icon: Shield,
    children: [
      { name: 'Host & Domain', path: '/xssh/security/host-domain', icon: Globe },
      { name: 'URL & Port', path: '/xssh/security/url-port', icon: Link2 },
    ],
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState<{ [key: string]: boolean }>({})

  const handleLogout = () => {
    sessionStorage.removeItem('ssh-credentials')
    router.push('/ssh-login')
  }

  return (
    <div className="fixed top-0 left-0 h-screen z-30 w-44 bg-slate-800 text-white flex flex-col items-stretch py-1 font-mono text-xs">
      <div className="flex flex-col items-center mb-2 mt-1">
        <span className="text-xs" title="Linux WebGUI">
          Linux WebGUI
        </span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          href="/xssh"
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded font-bold transition-colors',
            pathname === '/xssh'
              ? 'bg-blue-700 text-white'
              : 'text-gray-100 hover:bg-gray-700 hover:text-white'
          )}
          style={{ lineHeight: '1.2' }}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        {NAV_STRUCTURE.map((section) => (
          <div key={section.label}>
            {section.children.length === 0 && section.path ? (
              <Link
                href={section.path}
                className={cn(
                  'flex items-center gap-1 w-full px-2 py-1 rounded font-bold text-left transition-colors',
                  pathname.startsWith(section.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                )}
                style={{ lineHeight: '1.2' }}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </Link>
            ) : (
              <button
                className={cn('flex items-center gap-1 w-full px-2 py-1 rounded font-bold text-left hover:bg-slate-700', open[section.label] ? 'bg-slate-700' : '')}
                onClick={() => setOpen((prev) => ({ ...prev, [section.label]: !prev[section.label] }))}
                type="button"
              >
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            )}
            {section.children.length > 0 && open[section.label] && (
              <div className="pl-6 flex flex-col gap-1">
                {section.children.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded transition-colors',
                      pathname === item.path
                        ? 'bg-blue-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                    style={{ lineHeight: '1.2' }}
                    title={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-stretch w-full">
        <Button
          onClick={handleLogout} 
          className="flex items-center gap-1 px-2 py-1 text-gray-300 hover:bg-red-700 hover:text-white rounded font-mono text-xs"
          title="Disconnect"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </Button>
      </div>
    </div>
  )
}