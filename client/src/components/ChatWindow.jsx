import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function ChatWindow() {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a cybersecurity expert assistant. Help the user understand vulnerabilities found in their scan. Keep responses concise and actionable.' },
        { role: 'assistant', content: 'Hello! I am your security assistant. Found something suspicious? Ask me about it!' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg = { role: 'user', content: input }
        const newMessages = [...messages, userMsg]

        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        // Create a placeholder for the assistant's response
        const assistantMsg = { role: 'assistant', content: '' }
        setMessages([...newMessages, assistantMsg])

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.filter(m => m.role !== 'system') })
            })

            if (!response.ok) throw new Error('Failed to get response')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let done = false
            let streamedText = ''

            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                if (value) {
                    const chunk = decoder.decode(value, { stream: true })
                    streamedText += chunk

                    // Update state with new chunk
                    // We need to use a functional update to ensure we're updating the LATEST messages state
                    // or just update the last message.
                    setMessages(prev => {
                        const updated = [...prev]
                        const lastMsg = updated[updated.length - 1]
                        if (lastMsg.role === 'assistant') {
                            lastMsg.content = streamedText
                        }
                        return updated
                    })
                }
            }

        } catch (error) {
            setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Sorry, I encountered an error. Please check your connection and API key.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-[600px] flex flex-col bg-black/20 backdrop-blur-md border border-cyber-blue/30 rounded-2xl shadow-[0_0_50px_rgba(0,208,255,0.1)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-cyber-blue/20 bg-cyber-blue/5 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-cyber-blue" />
                <h3 className="font-bold text-white tracking-wide">Security <span className="text-cyber-blue">AI</span></h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user'
                            ? 'bg-cyber-blue/20 text-white border border-cyber-blue/30'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex gap-1">
                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-cyber-blue/20 bg-black/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a vulnerability..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 p-2 rounded-lg hover:bg-cyber-blue/20 transition-colors disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}
