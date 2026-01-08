import React, { useState } from 'react';
import { usePeer } from '../context/PeerContext';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Shield, Zap } from 'lucide-react';

const Landing = () => {
    const { createSession, joinSession, error } = usePeer();
    const [pinInput, setPinInput] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    const handleCreate = () => {
        createSession();
    };

    const handleJoin = (e) => {
        e.preventDefault();
        joinSession(pinInput);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
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

                <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
                    {/* Create Session */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={handleCreate}
                    >
                        <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-semibold">Start Session</h3>
                        <p className="text-sm text-slate-400">Generate a PIN and invite others to join directly.</p>
                    </motion.div>

                    {/* Join Session */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 ${isJoining ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => setIsJoining(true)}
                    >
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                            <ArrowRight size={24} />
                        </div>
                        {!isJoining ? (
                            <>
                                <h3 className="text-xl font-semibold">Join Session</h3>
                                <p className="text-sm text-slate-400">Enter a 6-digit PIN to connect to a peer.</p>
                            </>
                        ) : (
                            <form onSubmit={handleJoin} className="w-full flex flex-col gap-3">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000 000"
                                    className="glass-input w-full px-4 py-2 rounded-lg text-center text-xl tracking-widest"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button type="submit" className="btn-primary w-full py-2 rounded-lg font-medium" onClick={(e) => e.stopPropagation()}>
                                    Connect
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg inline-block"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="mt-16 flex justify-center gap-8 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                        <Shield size={16} /> End-to-End Encrypted
                    </div>
                    <div className="flex items-center gap-2">
                        <Box size={16} /> Serverless P2P
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Landing;
