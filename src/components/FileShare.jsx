import React, { useRef } from 'react';
import { usePeer } from '../context/PeerContext';
import { Upload, File, Download, X, Box, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileShare = () => {
    const { sendFile, fileProgress, incomingFile, receivedFiles, isConnected } = usePeer();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (!isConnected) {
            alert("No peer connected. Wait for someone to join.");
            return;
        }
        const file = e.target.files[0];
        if (file) {
            sendFile(file);
        }
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
        <div className="h-full flex flex-col gap-6">
            {/* Upload Area */}
            <div
                className="flex-1 glass-panel rounded-xl border-dashed border-2 border-white/20 flex flex-col items-center justify-center p-8 hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform mb-4">
                    <Upload size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Send a File</h3>
                <p className="text-sm text-slate-400">Click to browse or drag & drop</p>
            </div>

            {/* Transfers */}
            <div className="flex-1 glass-panel rounded-xl p-4 flex flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Transfers</h3>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {/* Incoming/Uploading Progress */}
                    <AnimatePresence>
                        {incomingFile && (
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

                    {/* Received Files */}
                    {receivedFiles.map((file, idx) => (
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

                    {receivedFiles.length === 0 && !incomingFile && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <Box size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">No files shared yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileShare;
