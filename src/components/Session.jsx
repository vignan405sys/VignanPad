import React, { useState } from 'react';
import { usePeer } from '../context/PeerContext';
import CodePad from './CodePad';
import FileShare from './FileShare';
import { Copy, LogOut } from 'lucide-react';

const Session = () => {
    const { myId, isHost } = usePeer();
    const [activeTab, setActiveTab] = useState('code'); // Mobile only

    const copyPin = () => {
        navigator.clipboard.writeText(myId);
        // Could add toast here
    };

    const handleLogout = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col h-screen p-4 gap-4">
            {/* Header */}
            <header className="flex items-center justify-between glass-panel p-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        VignanPad
                    </h1>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Session PIN</span>
                        <span className="font-mono text-lg font-bold text-white tracking-widest">{myId}</span>
                        <button onClick={copyPin} className="p-1 hover:text-indigo-400 transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile PIN display fallback if needed */}
                    <div className="md:hidden font-mono font-bold">{myId}</div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} /> Exit
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 min-h-0 grid md:grid-cols-3 gap-4">
                {/* Mobile Tabs */}
                <div className="md:hidden col-span-1 flex gap-2 mb-2">
                    <button
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'files' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
                        onClick={() => setActiveTab('files')}
                    >
                        Files
                    </button>
                </div>

                {/* Code Section */}
                <div className={`col-span-1 md:col-span-2 ${activeTab === 'code' ? 'block' : 'hidden md:block'} h-full min-h-0`}>
                    <CodePad />
                </div>

                {/* Files Section */}
                <div className={`col-span-1 ${activeTab === 'files' ? 'block' : 'hidden md:block'} h-full min-h-0`}>
                    <FileShare />
                </div>
            </div>
        </div>
    );
};

export default Session;
