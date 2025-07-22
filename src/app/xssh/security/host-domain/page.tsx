"use client"

import { useState, useEffect } from "react"; 
import { SSHCredentials } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getHostDomainInfo } from "@/lib/actions/security";

export default function HostDomainPage() {
  const [hostname, setHostname] = useState("");
  const [domain, setDomain] = useState("");
  const [ip, setIp] = useState("");
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
      const result = await getHostDomainInfo(credentials);
      if (result.success && result.data) {
        setHostname(result.data.hostname);
        setDomain(result.data.domain);
        setIp(result.data.ip);
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
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Host & Domain Information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-600">Host Name</span>
                <span className="block text-lg font-mono">{hostname}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Domain Name</span>
                <span className="block text-lg font-mono">{domain}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">IP Address</span>
                <span className="block text-lg font-mono">{ip}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 