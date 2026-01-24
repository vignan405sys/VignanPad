import React, { createContext, useContext, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

const CloudContext = createContext();

export const useCloud = () => useContext(CloudContext);

// Generate a random 6-character alphanumeric code
const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0, O, 1, I
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const CloudProvider = ({ children }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cloudError, setCloudError] = useState('');
    const [savedCode, setSavedCode] = useState('');

    // Save code to Firestore with 72-hour expiry
    const saveToCloud = async (content, language = 'javascript') => {
        setIsSaving(true);
        setCloudError('');
        setSavedCode('');

        try {
            const code = generateCode();
            const expiresAt = Timestamp.fromDate(new Date(Date.now() + 72 * 60 * 60 * 1000)); // 72 hours

            await setDoc(doc(db, 'snippets', code), {
                content,
                language,
                createdAt: Timestamp.now(),
                expiresAt,
            });

            setSavedCode(code);
            setIsSaving(false);
            return code;
        } catch (error) {
            console.error('Error saving to cloud:', error);
            setCloudError('Failed to save. Check Firebase config.');
            setIsSaving(false);
            return null;
        }
    };

    // Load code from Firestore by code
    const loadFromCloud = async (code) => {
        setIsLoading(true);
        setCloudError('');

        try {
            const docRef = doc(db, 'snippets', code.toUpperCase());
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setCloudError('Code not found.');
                setIsLoading(false);
                return null;
            }

            const data = docSnap.data();
            const now = new Date();
            const expiresAt = data.expiresAt.toDate();

            if (now > expiresAt) {
                setCloudError('This code has expired.');
                setIsLoading(false);
                return null;
            }

            setIsLoading(false);
            return data.content;
        } catch (error) {
            console.error('Error loading from cloud:', error);
            setCloudError('Failed to load. Check your connection.');
            setIsLoading(false);
            return null;
        }
    };

    return (
        <CloudContext.Provider value={{
            saveToCloud,
            loadFromCloud,
            isSaving,
            isLoading,
            cloudError,
            savedCode,
            setSavedCode,
        }}>
            {children}
        </CloudContext.Provider>
    );
};
