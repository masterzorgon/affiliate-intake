import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateEmail(email: string) {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
};

export function validateTelegram(telegram: string) {
    if (!telegram.trim()) return "Telegram username is required";
    if (!telegram.startsWith('@')) return "Telegram username must start with @";
    if (telegram.length < 3) return "Telegram username must be at least 2 characters after @";
    return null;
};

export function validateTwitter(twitter: string) {
    if (!twitter.trim()) return "Twitter handle is required";
    if (!twitter.startsWith('@')) return "Twitter handle must start with @";
    if (twitter.length < 3) return "Twitter handle must be at least 2 characters after @";
    return null;
};

export function validateUrl(url: string) {
    if (!url.trim()) return "Social platform link is required";
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return "URL must start with http:// or https://";
        }
        return null;
    } catch {
        return "Please enter a valid URL (e.g., https://twitter.com/username)";
    }
};

export function validateWallet(wallet: string) {
    if (!wallet.trim()) return "Wallet address is required";
    if (wallet.startsWith('0x')) return "Wallet address should not start with 0x";
    if (wallet.length < 42 || wallet.length > 44) return "Wallet address must be 42-44 characters long";
    return null;
};

export async function validateTwitterExists(username: string): Promise<boolean> {
    try {
        // Remove @ if present and clean the username
        const cleanUsername = username.replace(/^@/, '').trim();
        
        // Check if profile image exists using unavatar
        const response = await fetch(`https://unavatar.io/twitter/${cleanUsername}`, {
            method: 'HEAD',
        });
        
        return response.ok;
    } catch (error) {
        console.warn('Could not validate Twitter username existence:', error);
        return true; // Assume valid if we can't check
    }
}

export function getTwitterProfileImage(username: string): string {
    const cleanUsername = username.replace(/^@/, '').trim();
    return `https://unavatar.io/twitter/${cleanUsername}`;
}