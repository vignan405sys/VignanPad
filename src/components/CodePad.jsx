import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { usePeer } from '../context/PeerContext';
import { useCloud } from '../context/CloudContext';
import { Copy, Check, Cloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CodePad = () => {
    const { updateCode, code, isConnected, isHost } = usePeer();
    const { saveToCloud, isSaving, savedCode, setSavedCode, cloudError } = useCloud();
    const [copied, setCopied] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleEditorChange = (value) => {
        updateCode(value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveToCloud = async () => {
        const result = await saveToCloud(code);
        if (result) {
            setShowSaveModal(true);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(savedCode);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${!isConnected ? 'bg-red-500' : 'bg-red-900/30'}`} />
                    <div className={`w-3 h-3 rounded-full ${!isConnected && !isHost ? 'bg-yellow-500' : 'bg-yellow-900/30'}`} title={isHost ? "Hosting" : "Connecting"} />
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-green-900/30'}`} />
                    <span className="ml-2 text-xs text-stone-400 font-mono">
                        {isConnected ? 'Connected' : (isHost ? 'Waiting for Peer...' : 'Disconnected')}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleSaveToCloud}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded transition-colors disabled:opacity-50"
                        title="Save to Cloud (72h)"
                    >
                        <Cloud size={14} />
                        {isSaving ? 'Saving...' : 'Save 72h'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        title="Copy Code"
                    >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-stone-400" />}
                    </button>
                </div>
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

            {/* Save Success Modal */}
            <AnimatePresence>
                {showSaveModal && savedCode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20"
                        onClick={() => setShowSaveModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-800 border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded"
                            >
                                <X size={18} className="text-slate-400" />
                            </button>
                            <div className="p-3 bg-emerald-500/20 rounded-full w-fit mx-auto mb-4">
                                <Check size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Saved to Cloud!</h3>
                            <p className="text-slate-400 text-sm mb-4">Share this code. Valid for 72 hours.</p>
                            <div className="flex items-center justify-center gap-2 bg-slate-900 rounded-lg p-3 mb-4">
                                <span className="text-2xl font-mono font-bold tracking-widest text-white">{savedCode}</span>
                                <button
                                    onClick={handleCopyCode}
                                    className="p-1.5 hover:bg-white/10 rounded"
                                    title="Copy Code"
                                >
                                    <Copy size={18} className="text-slate-400" />
                                </button>
                            </div>
                            <button
                                onClick={() => { setShowSaveModal(false); setSavedCode(''); }}
                                className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
                            >
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error display */}
            {cloudError && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm">
                    {cloudError}
                </div>
            )}
        </div>
    );
};

export default CodePad;

