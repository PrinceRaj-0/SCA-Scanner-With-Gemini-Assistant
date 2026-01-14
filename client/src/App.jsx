import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultsTable from './components/ResultsTable'
import ChatWindow from './components/ChatWindow'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleScan = async (repoUrl, token) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, githubToken: token })
      })

      if (!response.ok) {
        throw new Error('Scan failed. Please check the URL and try again.')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">

      {/* Main Glass Panel Container - Wider for Split View */}
      <div className="w-full max-w-7xl bg-black/20 backdrop-blur-sm border border-cyber-green/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,157,0.1)] p-8 relative z-10 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Top Shine */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent"></div>

        <header className="mb-6 flex-none flex items-center gap-4 border-b border-gray-800 pb-4">
          <div className="h-8 w-8 bg-gradient-to-br from-cyber-green to-cyber-blue rounded-md flex items-center justify-center shadow-lg shadow-cyber-green/20">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Trivy<span className="text-cyber-green">Scan</span>
            </h1>
          </div>
        </header>

        {/* Content Area - Split View */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Scanner (Takes 2/3 space) */}
          <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <SearchBar onScan={handleScan} isLoading={loading} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-center font-mono text-sm">
                {error}
              </div>
            )}

            {results && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ResultsTable data={results} />
              </div>
            )}
          </div>

          {/* Right Column: AI Chat Assistant (Takes 1/3 space) */}
          <div className="hidden lg:block h-full">
            <ChatWindow />
          </div>

        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        {/* Cyber Grid Overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-cyber-black/80 to-cyber-black"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] bg-cyber-green/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
        <div className="absolute bottom-[-100px] right-[20%] w-[500px] h-[500px] bg-cyber-blue/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]"></div>
      </div>
    </div>
  )
}

export default App
