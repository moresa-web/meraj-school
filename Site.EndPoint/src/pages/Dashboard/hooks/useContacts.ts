// hooks/useContacts.ts
import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import { Contact } from '../types';

export const useContacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/contact`);
                if (!response.ok) {
                    throw new Error('Failed to fetch contacts');
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    return { contacts, loading, error };
};
