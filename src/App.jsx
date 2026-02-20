import React, { lazy, Suspense } from 'react';
import { usePeer } from './context/PeerContext';
import Landing from './components/Landing';
import { motion, AnimatePresence } from 'framer-motion';

const Session = lazy(() => import('./components/Session'));

function App() {
    const { isHost, isConnected, myId, peer } = usePeer();

    // If we have initialized a peer, we are either hosting or joining.
    // Host has myId immediately. Guest has peer immediately.
    const inSession = !!peer;

    return (
        <div className="min-h-screen text-white font-sans">
            <AnimatePresence mode="wait">
                {!inSession ? (
                    <motion.div
                        key="landing"
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Landing />
                    </motion.div>
                ) : (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Suspense fallback={
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="animate-pulse text-white/70">Loading editor...</div>
                            </div>
                        }>
                            <Session />
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
