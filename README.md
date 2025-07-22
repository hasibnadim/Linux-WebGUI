# Linux WebGUI

A modern web-based GUI for managing Linux servers remotely via SSH. Built with Next.js, React, and Tailwind CSS. Features a native-like file manager, system monitoring, software management, and more—all accessible from your browser.

---

## Features

- **SSH File Manager**: Upload, download, delete, compress, extract, and manage files/folders with a native desktop feel.
- **System Monitoring**: View CPU, memory, disk, and network stats in real time.
- **Software Management**: Check installed software (git, node, docker, etc.), install/remove packages, and see running applications.
- **Security Tools**: View open ports, firewall status, and SSL info.
- **Modern UI**: Inspired by Linux file managers (Thunar/Kali), with responsive design and keyboard/mouse support.
- **Server/Client Separation**: All SSH and system actions run server-side for security and compatibility.

---

## Requirements

- **Node.js** v16 or newer
- **npm** v8 or newer
- Linux server(s) with SSH access
- Windows, Linux, or Mac for running the WebGUI

---

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd Linux-WebGUI
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```sh
   npm run build
   npm start
   ```

---

## Usage Notes

- **SSH Credentials**: The app stores SSH credentials in `sessionStorage` for your session. They are never sent to third parties.
- **File Uploads**: Max upload size is 10GB per file. Upload progress is shown on the button.
- **All SSH/system actions are server-side**: No Node.js code runs in the browser. Do not import SSH logic in client components.
- **Next.js + SWC**: The project uses SWC for transpilation and Webpack for bundling. No extra Webpack config is needed unless you see errors about Node modules (see Troubleshooting).

---

## Troubleshooting

### "Module not found: Can't resolve 'cpu-features'" or similar errors
- This means a Node-only module is being bundled for the browser. Make sure all SSH/system code is only imported in server actions or API routes.
- If you still see this error, add the following to your `next.config.js`:
  ```js
  module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          'cpu-features': false,
          'fs': false,
          'net': false,
          'tls': false,
          'child_process': false,
        };
      }
      return config;
    },
  };
  ```

### "UNKNOWN: unknown error, open ...pages-manifest.json"
- Stop all dev/build processes.
- Delete `.next` and `node_modules` folders and `package-lock.json`.
- Run `npm install` and try again.

### File upload not working
- Make sure the file is under 10GB.
- Check your server's available disk space.

---

## Project Structure

- `src/app/` — Next.js app directory (pages, UI, routes)
- `src/lib/ssh/` — SSH client logic (server-only)
- `src/lib/actions/` — Server actions for system, file, and software management
- `src/components/` — UI components

---

## Security
- All sensitive operations (SSH, file, system) are server-side only.
- Never expose your SSH credentials or private keys.
- Use HTTPS in production.

---

## License
MIT