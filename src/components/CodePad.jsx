import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { usePeer } from '../context/PeerContext';
import { Copy, Check } from 'lucide-react';

const CodePad = () => {
    const { updateCode, code, isConnected, isHost } = usePeer();
    const [copied, setCopied] = useState(false);

    const handleEditorChange = (value) => {
        updateCode(value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${!isConnected ? 'bg-red-500' : 'bg-red-900/30'}`} />
                    <div className={`w-3 h-3 rounded-full ${!isConnected && !isHost ? 'bg-yellow-500' : 'bg-yellow-900/30'}`} title={isHost ? "Hosting" : "Connecting"} />
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-green-900/30'}`} />
                    <span className="ml-2 text-xs text-stone-400 font-mono">
                        {isConnected ? 'Connected' : (isHost ? 'Waiting for Peer...' : 'Disconnected')}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    title="Copy Code"
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-stone-400" />}
                </button>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 },
                        fontFamily: 'JetBrains Mono, Menlo, monospace',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
            {!isConnected && !isHost && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                    <span className="px-4 py-2 bg-black/80 rounded-lg border border-white/10">Connecting...</span>
                </div>
            )}
        </div>
    );
};

export default CodePad;
