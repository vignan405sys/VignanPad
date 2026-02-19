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
            <header className="flex items-center justify-between glass-panel p-4 rounded-panel border-white/5">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold gradient-text tracking-tight">
                        VignanPad
                    </h1>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">PIN</span>
                        <span className="font-mono text-lg font-bold text-white tracking-widest">{myId}</span>
                        <button onClick={copyPin} className="p-1.5 rounded-md hover:bg-white/10 hover:text-indigo-400 transition-colors" title="Copy PIN">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="md:hidden font-mono font-bold text-lg">{myId}</div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={16} /> Exit
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 min-h-0 grid md:grid-cols-3 gap-4">
                {/* Mobile Tabs */}
                <div className="md:hidden col-span-1 flex gap-2 mb-2 p-1 bg-black/20 rounded-lg">
                    <button
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </button>
                    <button
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'files' ? 'bg-indigo-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'}`}
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
