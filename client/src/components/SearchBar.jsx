import { useState } from 'react'
import { MagnifyingGlassIcon, KeyIcon } from '@heroicons/react/24/outline'

export default function SearchBar({ onScan, isLoading }) {
    const [url, setUrl] = useState('')
    const [token, setToken] = useState('')
    const [showToken, setShowToken] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (url.trim()) {
            onScan(url.trim(), token.trim())
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-300">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-cyber-green transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-md leading-5 bg-black/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green sm:text-sm transition-all shadow-inner backdrop-blur-sm"
                                placeholder="Enter GitHub Repository URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className={`p-3 rounded-md border text-sm font-medium transition-colors ${showToken
                                ? 'border-cyber-green text-cyber-green bg-cyber-green/10'
                                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-black/30'
                                }`}
                            title="Add Private Repo Token"
                        >
                            <KeyIcon className="h-5 w-5" />
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className={`
                inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-black 
                ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyber-green hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-green transition-all duration-300 transform active:scale-95
                font-bold whitespace-nowrap
              `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Scanning...
                                </>
                            ) : (
                                'SCAN REPO'
                            )}
                        </button>
                    </div>

                    {/* Token Input Section - Collapsible */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showToken ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <KeyIcon className="h-4 w-4 text-cyber-blue" />
                            </div>
                            <input
                                type="password"
                                className="block w-full pl-10 pr-3 py-2 border border-cyber-blue/30 rounded-md leading-5 bg-cyber-blue/5 text-white placeholder-cyber-blue/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue sm:text-sm transition-all shadow-inner backdrop-blur-sm"
                                placeholder="GitHub Personal Access Token (for private repos)"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
