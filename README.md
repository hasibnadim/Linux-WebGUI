# Linux WebGUI - Next.js Version

A modern web-based graphical interface for Linux server management via SSH, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🖥️ **Server Monitoring**: Real-time memory, CPU, and disk usage monitoring
- 🔐 **Secure SSH Connection**: Connect to any Linux server via SSH
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚡ **Server Actions**: Leverages Next.js Server Actions for secure server-side operations
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- 🔄 **Real-time Data**: Refresh system information on demand

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js Server Actions
- **SSH**: SSH2 library for secure server connections
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Access to a Linux server with SSH enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linux-webgui-nextjs
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Login**: Enter your SSH credentials (host, port, username, password)
2. **Dashboard**: Navigate through different system monitoring sections
3. **Memory**: View RAM usage, swap memory, and detailed memory statistics
4. **CPU**: Check processor information, architecture, and specifications
5. **Disk**: Monitor storage usage and filesystem information

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── system/           # System-specific components
├── lib/                  # Core utilities and logic
│   ├── actions/          # Server Actions
│   ├── ssh/              # SSH client utilities
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
```

## Security Features

- ✅ SSH credentials stored only in session storage
- ✅ Command validation to prevent dangerous operations
- ✅ Secure server-side execution via Server Actions
- ✅ No persistent storage of sensitive data
- ✅ Input validation with Zod schemas

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

Create a `.env.local` file for any environment-specific configurations:

```bash
# Optional: Add any environment variables here
# NODE_ENV=production
```

## Comparison with Original Version

| Feature | Original (Socket.IO) | Next.js Version |
|---------|---------------------|-----------------|
| Real-time Updates | ✅ WebSocket | ⚡ Server Actions + Polling |
| Resource Usage | High (200MB+) | Low (50-100MB) |
| Deployment | Complex (2 servers) | Simple (1 app) |
| Development Speed | Medium | Fast |
| Scalability | Manual | Built-in (Vercel/serverless) |
| Maintenance | High | Low |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] **File Manager**: Browse and manage server files
- [ ] **Terminal Emulator**: Web-based terminal access
- [ ] **Process Manager**: View and manage running processes
- [ ] **Log Viewer**: Real-time log monitoring
- [ ] **Multi-server Support**: Manage multiple servers
- [ ] **User Management**: Basic authentication system
- [ ] **Performance Charts**: Historical data visualization
- [ ] **Mobile App**: React Native version

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-repo/issues) on GitHub.