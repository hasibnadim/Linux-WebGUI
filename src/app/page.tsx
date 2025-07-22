import React from "react";

export default function Home() {
  return (
    <div className="font-mono min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
        <span className="text-2xl font-bold tracking-tight">Linux WebGUI</span>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Linux Server Management, Simplified</h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
          A practical web interface for engineers to monitor and manage Linux systems. No distractions. No bloat. Just the tools you need.
        </p>
        <a
          href="/ssh-login"
          className="inline-block border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-base shadow-sm"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
            <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc list-inside space-y-1">
              <li>CPU, memory, disk, and network stats</li>
              <li>Simple, readable charts</li>
              <li>Instant refresh</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">SSH & File Management</h3>
            <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc list-inside space-y-1">
              <li>Secure SSH terminal in browser</li>
              <li>Upload, download, and edit files</li>
              <li>Session management</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Minimal UI</h3>
            <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc list-inside space-y-1">
              <li>No unnecessary graphics</li>
              <li>Keyboard-friendly navigation</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="why" className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-3">Why Linux WebGUI?</h2>
          <ul className="text-base text-gray-800 dark:text-gray-200 list-disc list-inside mb-6 space-y-1">
            <li>Built for engineers: no marketing fluff, just functionality</li>
            <li>Open, auditable, and easy to deploy</li>
            <li>Works on any modern browser</li>
            <li>Focus on security and reliability</li>
          </ul> 
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-12 px-4 bg-blue-50 dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-200">Ready to get started?</h2>
        <p className="mb-6 text-base text-gray-800 dark:text-gray-200">Deploy on your server and start managing in minutes.</p>
        <a
          href="/ssh-login"  
          className="inline-block border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors text-base shadow-sm"
        >
          Try it Now
        </a>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-xs bg-transparent border-t border-gray-200 dark:border-gray-800 mt-4">
        &copy; {new Date().getFullYear()} Linux WebGUI. All rights reserved.
      </footer>
    </div>
  );
}
