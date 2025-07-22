'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { testSSHConnection } from '@/lib/actions/system'
import { SSHCredentials } from '@/lib/types' 
const loginSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1).max(65535).default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      host: 'localhost',
      port: 22,
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsConnecting(true)
    setError('')

    try {
      const credentials: SSHCredentials = {
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password,
      }

      const result = await testSSHConnection(credentials)

      if (result.success) {
        // Store credentials in sessionStorage for the session
        sessionStorage.setItem('ssh-credentials', JSON.stringify(credentials))
        router.push('/xssh')
      } else {
        setError(result.error || 'Connection failed')
      }
    } catch (err) {
      setError('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4   bg-gray-200" style={{fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}>
      <div className="w-full max-w-md">
        <Card className="bg-[#e5e7eb] border border-gray-500 rounded-sm shadow-none font-mono" style={{boxShadow: '0 2px 8px rgba(60,60,60,0.08)'}}>
          <CardHeader className="text-center flex flex-col items-center gap-2 pb-2">
             <CardTitle className="text-2xl font-bold text-gray-800 font-mono tracking-tight">
              Linux WebGUI Login
            </CardTitle>
            <CardDescription className="text-gray-600 font-mono text-sm mt-1">
              Stable. Trusted. Functional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="host" className="text-gray-700 font-mono text-xs">Host</Label>
                  <Input
                    id="host"
                    {...register('host')}
                    placeholder="Server IP or hostname"
                    className="bg-gray-100 border border-gray-400 text-gray-800 placeholder:text-gray-400 font-mono rounded-sm focus:ring-0 focus:border-gray-600"
                  />
                  {errors.host && (
                    <p className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 text-xs mt-1 font-mono">{errors.host.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="port" className="text-gray-700 font-mono text-xs">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    {...register('port', { valueAsNumber: true })}
                    placeholder="22"
                    className="bg-gray-100 border border-gray-400 text-gray-800 placeholder:text-gray-400 font-mono rounded-sm focus:ring-0 focus:border-gray-600"
                  />
                  {errors.port && (
                    <p className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 text-xs mt-1 font-mono">{errors.port.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="username" className="text-gray-700 font-mono text-xs">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Your username"
                  className="bg-gray-100 border border-gray-400 text-gray-800 placeholder:text-gray-400 font-mono rounded-sm focus:ring-0 focus:border-gray-600"
                />
                {errors.username && (
                  <p className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 text-xs mt-1 font-mono">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-mono text-xs">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Your password"
                  className="bg-gray-100 border border-gray-400 text-gray-800 placeholder:text-gray-400 font-mono rounded-sm focus:ring-0 focus:border-gray-600"
                />
                {errors.password && (
                  <p className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 text-xs mt-1 font-mono">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1">
                  <p className="text-yellow-800 text-xs font-mono">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isConnecting}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 border border-gray-500 rounded-sm font-mono text-base shadow-none transition-none"
                style={{boxShadow: 'none'}}
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs font-mono italic">
            "Only those who ask, shall connect."
          </p>
        </div>
      </div>
    </div>
  )
}