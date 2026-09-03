"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckCircle, XCircle, QrCode, Mail, Search, Users } from "lucide-react";
import { LinkButton } from "@/components/Button";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  {
    ssr: false,
  }
);

type VerificationResult = {
  valid: boolean;
  message: string;
  ticket?: {
    code: string;
    tier: string;
    buyer: string;
    event: string;
    is_verified: boolean;
  };
};

export default function VerifyPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [searchMode, setSearchMode] = useState<"qr" | "email">("qr");
  const [email, setEmail] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle QR scan
  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes.length === 0 || !detectedCodes[0]?.rawValue) return;
    
    const data = detectedCodes[0].rawValue;
    
    if (!result) {
      setScanning(false);
      setLoading(true);
      
      try {
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: data }),
        });
        
        const verificationResult = await response.json();
        setResult(verificationResult);
      } catch (error) {
        setResult({
          valid: false,
          message: "Network error. Please try again."
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!result?.ticket) return;
    
    setIsCheckingIn(true);
    
    try {
      const response = await fetch("/api/verify/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: result.ticket.code }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({
          ...result,
          ticket: {
            ...result.ticket,
            is_verified: true
          }
        });
        
        // Play success sound
        new Audio("/sounds/success.mp3").play().catch(() => {});
      } else {
        alert("Check-in failed: " + data.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Reset scanner
  const handleScanAgain = () => {
    setResult(null);
    setScanning(true);
  };

  // Email search
  const handleEmailSearch = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/verify/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success && data.tickets && data.tickets.length > 0) {
        const ticket = data.tickets[0];
        setResult({
          valid: true,
          message: `Found ${data.tickets.length} ticket(s) for this email`,
          ticket: {
            code: ticket.unique_code,
            tier: ticket.tier_name,
            buyer: ticket.buyer_name,
            event: ticket.event_title,
            is_verified: ticket.is_verified || false,
          }
        });
      } else {
        setResult({
          valid: false,
          message: "No tickets found for this email."
        });
      }
    } catch (error) {
      setResult({
        valid: false,
        message: "Search failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual code search
  const handleManualSearch = async () => {
    if (!manualCode.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/verify/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: manualCode.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success && data.tickets && data.tickets.length > 0) {
        const ticket = data.tickets[0];
        setResult({
          valid: true,
          message: "Ticket found",
          ticket: {
            code: ticket.unique_code,
            tier: ticket.tier_name,
            buyer: ticket.buyer_name,
            event: ticket.event_title,
            is_verified: ticket.is_verified || false,
          }
        });
      } else {
        setResult({
          valid: false,
          message: "No ticket found with this code."
        });
      }
    } catch (error) {
      setResult({
        valid: false,
        message: "Search failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display">Ticket Scanner</h1>
            <p className="text-sm text-gray-400">Scan QR codes or search by email</p>
          </div>
          <LinkButton href="/admin" variant="outline" size="md">
            Admin
          </LinkButton>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-900 rounded-xl p-1">
          <button
            onClick={() => setSearchMode("qr")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
              searchMode === "qr" ? "bg-signal text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <QrCode size={18} />
            QR Scan
          </button>
          <button
            onClick={() => {
              setSearchMode("email");
              setResult(null);
              setScanning(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
              searchMode === "email" ? "bg-signal text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Mail size={18} />
            Email
          </button>
        </div>

        {/* QR Scanner */}
        {searchMode === "qr" && (
          <div className="bg-gray-900 rounded-xl p-4">
            {scanning ? (
              <div className="relative">
                <Scanner
                  onScan={handleScan}
                  onError={(error) => console.error(error)}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                />
                <div className="absolute inset-0 border-2 border-signal/50 pointer-events-none" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <QrCode size={48} className="text-gray-500" />
                <p className="text-gray-400 mt-2">Scanning paused</p>
                <button
                  onClick={() => {
                    setScanning(true);
                    setResult(null);
                  }}
                  className="mt-4 bg-signal text-white px-6 py-2 rounded-lg"
                >
                  Resume Scanning
                </button>
              </div>
            )}
          </div>
        )}

        {/* Email Search */}
        {searchMode === "email" && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">Search by Email</h2>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="Enter attendee email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSearch()}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-signal"
              />
              <button
                onClick={handleEmailSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-signal text-white px-4 py-1.5 rounded-lg text-sm hover:bg-signal-dim transition disabled:opacity-50"
              >
                {loading ? "Searching..." : <Search size={16} />}
              </button>
            </div>

            {/* Manual Code Entry */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Or enter ticket code manually:</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. VD-XXXXX-XXXX-01"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-signal"
                />
                <button
                  onClick={handleManualSearch}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-signal text-white px-4 py-1.5 rounded-lg text-sm hover:bg-signal-dim transition disabled:opacity-50"
                >
                  {loading ? "Searching..." : <Search size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className={`mt-6 p-6 rounded-xl border ${
            result.valid ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {result.valid ? (
                  <CheckCircle size={32} className="text-emerald-500" />
                ) : (
                  <XCircle size={32} className="text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-medium ${
                  result.valid ? "text-emerald-500" : "text-red-500"
                }`}>
                  {result.valid ? "✅ VALID TICKET" : "❌ INVALID TICKET"}
                </h3>
                <p className="text-gray-300 mt-1">{result.message}</p>
                
                {result.ticket && (
                  <div className="mt-4 space-y-2 bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event</span>
                      <span className="text-white">{result.ticket.event}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tier</span>
                      <span className={`font-medium ${
                        result.ticket.tier === "Men" ? "text-blue-400" : "text-pink-400"
                      }`}>
                        {result.ticket.tier}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Buyer</span>
                      <span className="text-white">{result.ticket.buyer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Code</span>
                      <span className="text-gray-400 font-mono text-sm">{result.ticket.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={result.ticket.is_verified ? "text-yellow-400" : "text-emerald-400"}>
                        {result.ticket.is_verified ? "Already Checked In" : "Ready for Check-in"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  {result.ticket && !result.ticket.is_verified && (
                    <button
                      onClick={handleCheckIn}
                      disabled={isCheckingIn}
                      className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50"
                    >
                      {isCheckingIn ? "Checking in..." : "Check In"}
                    </button>
                  )}
                  
                  {result.ticket && result.ticket.is_verified && (
                    <button
                      disabled
                      className="flex-1 bg-yellow-500/20 text-yellow-400 py-3 rounded-lg font-medium cursor-not-allowed"
                    >
                      Already Checked In
                    </button>
                  )}

                  {result.ticket && searchMode === "email" && (
                    <button
                      onClick={() => {
                        setResult(null);
                        setEmail("");
                        setManualCode("");
                      }}
                      className="px-4 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
                    >
                      New Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats / Quick Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleScanAgain}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
          >
            Scan Another
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <Users size={20} className="mx-auto text-gray-400" />
            <p className="text-2xl font-display mt-1">0</p>
            <p className="text-xs text-gray-500">Checked In</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <Users size={20} className="mx-auto text-gray-400" />
            <p className="text-2xl font-display mt-1">0</p>
            <p className="text-xs text-gray-500">Remaining</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <Users size={20} className="mx-auto text-gray-400" />
            <p className="text-2xl font-display mt-1">0</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}