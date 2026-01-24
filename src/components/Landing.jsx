import React, { useState } from 'react';
import { usePeer } from '../context/PeerContext';
import { useCloud } from '../context/CloudContext';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Shield, Zap, Cloud, Loader2 } from 'lucide-react';

const Landing = () => {
    const { createSession, joinSession, error, setInitialCode } = usePeer();
    const { loadFromCloud, isLoading, cloudError } = useCloud();
    const [pinInput, setPinInput] = useState('');
    const [cloudCodeInput, setCloudCodeInput] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [isLoadingCloud, setIsLoadingCloud] = useState(false);

    const handleCreate = () => {
        createSession();
    };

    const handleJoin = (e) => {
        e.preventDefault();
        joinSession(pinInput);
    };

    const handleLoadFromCloud = async (e) => {
        e.preventDefault();
        if (!cloudCodeInput || cloudCodeInput.length !== 6) return;

        const content = await loadFromCloud(cloudCodeInput);
        if (content) {
            // Pre-fill the code and then create a session
            setInitialCode(content);
            createSession();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full"
            >
                <div className="mb-8 flex justify-center">
                    <div className="p-3 glass-panel rounded-2xl bg-indigo-500/20 text-indigo-300">
                        <Box size={40} />
                    </div>
                </div>

                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    VignanPad
                </h1>
                <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
                    Share files and collaborate on code in real-time. No servers, no accounts. Just a PIN.
                </p>

                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Create Session */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={handleCreate}
                    >
                        <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-lg font-semibold">Start Session</h3>
                        <p className="text-xs text-slate-400">Generate a PIN for live collaboration.</p>
                    </motion.div>

                    {/* Join Session */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 ${isJoining ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => { setIsJoining(true); setIsLoadingCloud(false); }}
                    >
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                            <ArrowRight size={24} />
                        </div>
                        {!isJoining ? (
                            <>
                                <h3 className="text-lg font-semibold">Join Session</h3>
                                <p className="text-xs text-slate-400">Enter a 6-digit PIN to connect.</p>
                            </>
                        ) : (
                            <form onSubmit={handleJoin} className="w-full flex flex-col gap-2">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="glass-input w-full px-3 py-2 rounded-lg text-center text-lg tracking-widest"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button type="submit" className="btn-primary w-full py-2 rounded-lg font-medium text-sm" onClick={(e) => e.stopPropagation()}>
                                    Connect
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Load from Cloud */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 ${isLoadingCloud ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => { setIsLoadingCloud(true); setIsJoining(false); }}
                    >
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                            <Cloud size={24} />
                        </div>
                        {!isLoadingCloud ? (
                            <>
                                <h3 className="text-lg font-semibold">Load Saved</h3>
                                <p className="text-xs text-slate-400">Enter code to load saved content.</p>
                            </>
                        ) : (
                            <form onSubmit={handleLoadFromCloud} className="w-full flex flex-col gap-2">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="ABC123"
                                    className="glass-input w-full px-3 py-2 rounded-lg text-center text-lg tracking-widest"
                                    value={cloudCodeInput}
                                    onChange={(e) => setCloudCodeInput(e.target.value.toUpperCase())}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    type="submit"
                                    className="btn-primary w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Load Code
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {(error || cloudError) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg inline-block"
                    >
                        {error || cloudError}
                    </motion.div>
                )}

                <div className="mt-16 flex justify-center gap-8 text-slate-500 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                        <Shield size={16} /> End-to-End Encrypted
                    </div>
                    <div className="flex items-center gap-2">
                        <Box size={16} /> Serverless P2P
                    </div>
                    <div className="flex items-center gap-2">
                        <Cloud size={16} /> 72h Cloud Storage
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Landing;

