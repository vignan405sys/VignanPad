import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Peer } from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const [conn, setConn] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [incomingFile, setIncomingFile] = useState(null);
    const [fileProgress, setFileProgress] = useState(0);
    const [receivedFiles, setReceivedFiles] = useState([]);
    const [codeState, setCodeState] = useState('// Start typing your code here...');
    const codeRef = useRef(codeState); // Keep track for callbacks

    // Function to set initial code (e.g., from cloud load)
    const setInitialCode = (content) => {
        setCodeState(content);
    };

    // Update ref when state changes
    useEffect(() => {
        codeRef.current = codeState;
    }, [codeState]);

    // Helper to strictly format ID
    const getPeerId = (pin) => `vignan-pad-${pin}`;

    const createSession = () => {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const id = getPeerId(pin);

        // Clean up old peer if exists
        if (peer) peer.destroy();

        const newPeer = new Peer(id, {
            debug: 2,
        });

        setPeer(newPeer);
        setMyId(pin); // User sees the PIN, not the full ID
        setIsHost(true);

        newPeer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        newPeer.on('connection', (connection) => {
            console.log('Incoming connection:', connection.peer);
            handleConnection(connection);
        });

        newPeer.on('error', (err) => {
            console.error(err);
            setError('Connection error: ' + err.type);
        });

        return pin;
    };

    const joinSession = (pin) => {
        if (!pin || pin.length !== 6) {
            setError('Invalid PIN');
            return;
        }

        if (peer) peer.destroy();

        // Guest connects with a random ID
        const newPeer = new Peer({
            debug: 2,
        });

        setPeer(newPeer);
        setIsHost(false);

        newPeer.on('open', () => {
            const targetId = getPeerId(pin);
            console.log('Connecting to:', targetId);
            const connection = newPeer.connect(targetId, {
                serialization: 'binary',
                reliable: true
            });
            handleConnection(connection);
        });

        newPeer.on('error', (err) => {
            console.error(err);
            setError('Could not connect. Check PIN.');
        });
    };

    const handleConnection = (connection) => {
        connection.on('open', () => {
            setConn(connection);
            setIsConnected(true);
            setError('');

            // Send initial state if we have content
            if (codeRef.current) {
                connection.send({ type: 'CODE_UPDATE', code: codeRef.current });
            }
        });

        connection.on('data', (data) => {
            handleData(data, connection);
        });

        connection.on('close', () => {
            setIsConnected(false);
            setConn(null);
            alert('Peer disconnected');
        });
    };

    const handleData = (data, connection) => {
        if (data.type === 'CODE_UPDATE') {
            setCodeState(data.code);
        } else if (data.type === 'FILE_META') {
            setIncomingFile({
                name: data.name,
                size: data.size,
                type: data.mime,
                chunks: [],
                receivedSize: 0,
            });
            setFileProgress(0);
        } else if (data.type === 'FILE_CHUNK') {
            setIncomingFile(prev => {
                if (!prev) return null;
                const newChunks = [...prev.chunks, data.chunk];
                const newReceivedSize = prev.receivedSize + data.chunk.byteLength;
                const progress = (newReceivedSize / prev.size) * 100;

                setFileProgress(progress);

                if (newReceivedSize >= prev.size) {
                    // File complete
                    const blob = new Blob(newChunks, { type: prev.type });
                    const url = URL.createObjectURL(blob);
                    setReceivedFiles(current => [...current, { name: prev.name, url, size: prev.size }]);
                    return null; // Reset incoming
                }

                return {
                    ...prev,
                    chunks: newChunks,
                    receivedSize: newReceivedSize
                };
            });
        }
    };

    const handleCodeUpdate = (newCode) => {
        setCodeState(newCode);
        if (conn) {
            conn.send({ type: 'CODE_UPDATE', code: newCode });
        }
    };

    const sendFile = (file) => {
        if (!conn) {
            console.error('No connection, cannot send file');
            return;
        }
        console.log('Sending file:', file.name, 'Size:', file.size);

        // Send meta
        conn.send({
            type: 'FILE_META',
            name: file.name,
            size: file.size,
            mime: file.type
        });

        const CHUNK_SIZE = 16384; // 16KB
        const reader = new FileReader();
        let offset = 0;

        reader.onload = (e) => {
            if (conn) {
                conn.send({
                    type: 'FILE_CHUNK',
                    chunk: e.target.result
                });

                offset += e.target.result.byteLength;

                if (offset < file.size) {
                    readSlice(offset);
                } else {
                    // Done
                }
            }
        };

        const readSlice = (o) => {
            const slice = file.slice(o, o + CHUNK_SIZE);
            reader.readAsArrayBuffer(slice);
        };

        readSlice(0);
    };

    return (
        <PeerContext.Provider value={{
            createSession,
            joinSession,
            isConnected,
            myId,
            error,
            isHost,
            updateCode: handleCodeUpdate,
            sendFile,
            code: codeState,
            fileProgress,
            incomingFile,
            receivedFiles,
            peer,
            setInitialCode
        }}>
            {children}
        </PeerContext.Provider>
    );
};
