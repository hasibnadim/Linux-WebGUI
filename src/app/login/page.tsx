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
        router.push('/dashboard')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-800 to-teal-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Linux WebGUI
            </CardTitle>
            <CardDescription className="text-gray-200">
              Connect to your Linux server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="host" className="text-white">Host</Label>
                  <Input
                    id="host"
                    {...register('host')}
                    placeholder="Server IP or hostname"
                    className="bg-black/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                  {errors.host && (
                    <p className="text-red-400 text-sm mt-1">{errors.host.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="port" className="text-white">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    {...register('port', { valueAsNumber: true })}
                    placeholder="22"
                    className="bg-black/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                  {errors.port && (
                    <p className="text-red-400 text-sm mt-1">{errors.port.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Your username"
                  className="bg-black/20 border-white/30 text-white placeholder:text-gray-300"
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Your password"
                  className="bg-black/20 border-white/30 text-white placeholder:text-gray-300"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-lg">
            Use this web application to manage your Linux server with a graphical interface.
          </p>
        </div>
      </div>
    </div>
  )
}