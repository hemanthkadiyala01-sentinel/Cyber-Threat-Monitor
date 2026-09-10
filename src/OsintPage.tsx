import { useState } from "react";

export default function OsintPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-2">
        OSINT Investigator
      </h1>

      <p className="text-slate-400 mb-6">
        Investigate IP addresses, domains, URLs, and emails.
      </p>

      <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-5 max-w-3xl">
        <label className="block text-sm text-slate-300 mb-2">
          Enter IOC
        </label>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: 8.8.8.8 or google.com"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-3 rounded-lg">
            Investigate
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="text-cyan-400 font-bold mb-2">IOC Details</h2>
          <p className="text-slate-300">Value: {query || "No IOC entered"}</p>
          <p className="text-slate-400 text-sm mt-2">Type: Auto Detect</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="text-cyan-400 font-bold mb-2">Threat Intel</h2>
          <p className="text-slate-300">Risk Score: Pending</p>
          <p className="text-slate-400 text-sm mt-2">Source: AbuseIPDB / VirusTotal later</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="text-cyan-400 font-bold mb-2">OSINT Tools</h2>
          <p className="text-slate-300">WHOIS, DNS, Shodan, SpiderFoot</p>
          <p className="text-slate-400 text-sm mt-2">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
