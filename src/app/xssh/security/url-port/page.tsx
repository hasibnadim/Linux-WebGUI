"use client"

import { useState, useEffect } from "react";
import { getNetworkInfo } from "@/lib/actions/system";
import { SSHCredentials } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const PORT_DESCRIPTIONS: Record<string, string> = {
  "22": "SSH",
  "80": "HTTP",
  "443": "HTTPS",
  "21": "FTP",
  "25": "SMTP",
  "53": "DNS",
  "110": "POP3",
  "143": "IMAP",
  "3306": "MySQL",
  "5432": "PostgreSQL",
  "6379": "Redis",
  "27017": "MongoDB",
  "1521": "Oracle",
  "2049": "NFS",
  "3128": "HTTP Proxy",
  "3307": "MySQL",
  "3389": "Remote Desktop",
  "5433": "PostgreSQL",
  "5632": "pmcd",
  "5900": "VNC",
  "6667": "IRC",
  "8000": "HTTP Alternate",
  "8080": "HTTP Alternate",
  "8443": "HTTPS Alternate",
  "8888": "HTTP Alternate",
  "9000": "SonarQube",
  "9200": "Elasticsearch",
  "9300": "Elasticsearch",
  "9999": "Urbackup",
  // Add more as needed
};

function getPort(str: string) {
  // Extract port from address like 0.0.0.0:22 or [::]:80
  const match = str.match(/:(\d+)$/);
  return match ? match[1] : "";
}

export default function UrlPortPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const credentialsStr = sessionStorage.getItem("ssh-credentials");
      if (!credentialsStr) {
        setError("No SSH credentials found");
        setLoading(false);
        return;
      }
      const credentials: SSHCredentials = JSON.parse(credentialsStr);
      const result = await getNetworkInfo(credentials);
      if (result.success && result.data) {
        setConnections(result.data.connections || []);
      } else {
        setError(result.error || "Failed to fetch info");
      }
    } catch (err) {
      setError("Failed to fetch info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Open Ports & Local Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-3 py-2 border">Port</th>
                    <th className="px-3 py-2 border">Protocol</th>
                    <th className="px-3 py-2 border">Local Address</th>
                    <th className="px-3 py-2 border">Remote Address</th>
                    <th className="px-3 py-2 border">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-4">No open ports found</td>
                    </tr>
                  ) : (
                    connections.map((conn, idx) => {
                      const port = getPort(conn.local);
                      return (
                        <tr key={idx}>
                          <td className="px-3 py-2 border font-mono">{port}</td>
                          <td className="px-3 py-2 border">{conn.proto}</td>
                          <td className="px-3 py-2 border font-mono">{conn.local}</td>
                          <td className="px-3 py-2 border font-mono">{conn.remote}</td>
                          <td className="px-3 py-2 border">{PORT_DESCRIPTIONS[port] || "Unknown"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
