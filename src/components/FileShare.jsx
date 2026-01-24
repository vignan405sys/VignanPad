import React, { useRef, useState } from 'react';
import { usePeer } from '../context/PeerContext';
import { useCloud } from '../context/CloudContext';
import { Upload, File, Download, X, Box, Check, Cloud, Users, Copy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileShare = () => {
    const { sendFile, fileProgress, incomingFile, receivedFiles, isConnected, isHost } = usePeer();
    const { uploadFileToCloud, isSaving, savedCode, setSavedCode, cloudError } = useCloud();
    const fileInputRef = useRef(null);
    const [mode, setMode] = useState('p2p'); // 'p2p' or 'cloud'
    const [copied, setCopied] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (mode === 'p2p') {
            if (!isConnected) {
                alert("No peer connected. Wait for someone to join with your PIN.");
                return;
            }
            sendFile(file);
        } else {
            // Cloud Upload
            await uploadFileToCloud(file);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(savedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Mode Toggle */}
            <div className="flex p-1 bg-black/20 rounded-lg">
                <button
                    onClick={() => { setMode('p2p'); setSavedCode(''); }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'p2p' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Users size={14} /> P2P Direct
                </button>
                <button
                    onClick={() => setMode('cloud')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'cloud' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Cloud size={14} /> Cloud Send
                </button>
            </div>

            {mode === 'p2p' ? (
                <>
                    {/* Connection Status Banner */}
                    <div className={`px-4 py-2 rounded-lg text-center text-sm font-medium ${isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {isConnected
                            ? '✓ Connected - Ready to send files!'
                            : isHost
                                ? '⏳ Waiting for peer to join with your PIN...'
                                : '⚠️ Not connected'}
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`flex-1 glass-panel rounded-xl border-dashed border-2 flex flex-col items-center justify-center p-6 transition-colors ${isConnected
                            ? 'border-emerald-500/30 hover:bg-emerald-500/5 cursor-pointer'
                            : 'border-white/10 opacity-50 cursor-not-allowed'
                            } group`}
                        onClick={() => isConnected && fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div className={`p-4 rounded-full mb-3 transition-transform ${isConnected ? 'bg-emerald-500/20 text-emerald-400 group-hover:scale-110' : 'bg-slate-500/20 text-slate-500'}`}>
                            <Upload size={28} />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Send a File</h3>
                        <p className="text-xs text-slate-400">
                            {isConnected ? 'Click to browse or drag & drop' : 'Connect with a peer first'}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* Cloud Upload Area */}
                    {!savedCode ? (
                        <div
                            className={`flex-1 glass-panel rounded-xl border-dashed border-2 border-indigo-500/30 flex flex-col items-center justify-center p-6 transition-colors hover:bg-indigo-500/5 cursor-pointer group`}
                            onClick={() => !isSaving && fileInputRef.current.click()}
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={isSaving}
                            />
                            {isSaving ? (
                                <div className="text-center">
                                    <Loader2 size={32} className="text-indigo-400 animate-spin mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold mb-1">Uploading...</h3>
                                    <p className="text-xs text-slate-400">Please wait</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-full mb-3 bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Cloud size={28} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">Upload to Cloud</h3>
                                    <p className="text-xs text-slate-400">
                                        Get a code to download anywhere (24h)
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-emerald-500/20 rounded-full mb-4">
                                <Check size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">File Uploaded!</h3>
                            <p className="text-slate-400 text-sm mb-6">Share this code to download the file.</p>

                            <div className="flex items-center justify-center gap-2 bg-slate-900 rounded-lg p-3 mb-6 w-full">
                                <span className="text-3xl font-mono font-bold tracking-widest text-white">{savedCode}</span>
                                <button
                                    onClick={handleCopyCode}
                                    className="p-2 hover:bg-white/10 rounded transition-colors"
                                    title="Copy Code"
                                >
                                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-slate-400" />}
                                </button>
                            </div>

                            <button
                                onClick={() => setSavedCode('')}
                                className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
                            >
                                Upload Another
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Error Display */}
            {cloudError && mode === 'cloud' && (
                <div className="p-2 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-xs text-center">
                    {cloudError}
                </div>
            )}

            {/* Transfers List (Only for P2P for now, or cloud history if needed) */}
            <div className="flex-1 glass-panel rounded-xl p-4 flex flex-col overflow-hidden min-h-[0]">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
                    {mode === 'p2p' ? 'Direct Transfers' : 'Cloud Status'}
                </h3>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {/* Incoming/Uploading Progress (P2P) */}
                    <AnimatePresence>
                        {incomingFile && mode === 'p2p' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded">
                                        <File size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="truncate font-medium">{incomingFile.name}</span>
                                            <span className="text-slate-400">{Math.round(fileProgress)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-300"
                                                style={{ width: `${fileProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Received Files (P2P) */}
                    {mode === 'p2p' && receivedFiles.map((file, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-lg border border-emerald-500/20 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded">
                                    <Check size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                    <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                                </div>
                                <a
                                    href={file.url}
                                    download={file.name}
                                    className="p-2 hover:bg-emerald-500/20 rounded-full text-emerald-400 transition-colors"
                                    title="Download"
                                >
                                    <Download size={18} />
                                </a>
                            </div>
                        </motion.div>
                    ))}

                    {mode === 'p2p' && receivedFiles.length === 0 && !incomingFile && (
                        <div className="h-20 flex flex-col items-center justify-center text-slate-600">
                            <p className="text-xs">No active transfers</p>
                        </div>
                    )}

                    {mode === 'cloud' && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                            <p className="text-xs">Files uploaded to cloud are available for 24 hours.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileShare;
