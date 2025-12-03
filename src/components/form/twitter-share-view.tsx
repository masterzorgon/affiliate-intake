'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/button";
import { useToast } from "@/components/toast-provider";
import { getTwitterProfileImage } from "@/lib/utils";
import { ArrowDownTrayIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/16/solid";

interface TwitterShareViewProps {
    formData: {
        email: string;
        telegram: string;
        twitter: string;
        region: string;
        country: string;
    };
}

interface BannerResponse {
    success: boolean;
    image: string;
    imageId: string;
    shareableUrl: string;
    profileImage: string;
    username: string;
}

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const TwitterShareView = ({ formData }: TwitterShareViewProps) => {
    const { showToast } = useToast();
    const router = useRouter();

    const [bannerImage, setBannerImage] = useState<string>('');
    const [isGeneratingBanner, setIsGeneratingBanner] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [tweetUrl, setTweetUrl] = useState('');
    const [isSubmittingProof, setIsSubmittingProof] = useState(false);
    const [urlError, setUrlError] = useState<string>('');

    // Generate a simple referral code based on email address
    const referralCode = `0dotxyz.com/waitlist?ref=${formData.email.split('@')[0].slice(-8)}`;

    const generateBanner = async () => {
        try {
            setIsGeneratingBanner(true);
            const response = await fetch('/api/banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.twitter.replace('@', ''),
                    email: formData.email,
                    mutual: false
                }),
            });

            const result: BannerResponse = await response.json();

            if (result.success) {
                setBannerImage(`data:image/png;base64,${result.image}`);
            } else {
                showToast('Failed to generate banner image', 'error');
            }
        } catch (error) {
            console.error('Error generating banner:', error);
            showToast('Error generating banner image', 'error');
        } finally {
            setIsGeneratingBanner(false);
        }
    };

    const handleShareOnTwitter = () => {
        const tweetText = `Just applied for the new @0dotxyz rollout. Join me: ${referralCode}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        setIsSharing(true);
        window.open(twitterUrl, '_blank');

        // Reset sharing state after a short delay
        setTimeout(() => {
            setIsSharing(false);
        }, 1000);
    };

    const validateTweetUrl = (url: string): { isValid: boolean; error?: string } => {
        if (!url.trim()) {
            return { isValid: false, error: 'Please enter a tweet URL' };
        }

        try {
            // Basic URL validation
            new URL(url);
        } catch {
            return { isValid: false, error: 'Please enter a valid URL' };
        }

        // Twitter/X URL pattern validation
        const twitterUrlPattern = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+$/;
        if (!twitterUrlPattern.test(url)) {
            return {
                isValid: false,
                error: 'Please enter a valid Twitter/X tweet URL (e.g., https://x.com/username/status/1234567890)'
            };
        }

        return { isValid: true };
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTweetUrl(value);

        // Clear error when user starts typing
        if (urlError) {
            setUrlError('');
        }

        // Validate on blur or when user stops typing
        if (value.trim()) {
            const validation = validateTweetUrl(value);
            if (!validation.isValid) {
                setUrlError(validation.error || '');
            }
        }
    };

    const handleUrlBlur = () => {
        if (tweetUrl.trim()) {
            const validation = validateTweetUrl(tweetUrl);
            if (!validation.isValid) {
                setUrlError(validation.error || '');
            } else {
                setUrlError('');
            }
        }
    };

    const handleSubmitProof = async () => {
        const validation = validateTweetUrl(tweetUrl);
        if (!validation.isValid) {
            setUrlError(validation.error || '');
            showToast(validation.error || 'Please enter a valid tweet URL', 'error');
            return;
        }

        try {
            // setIsSubmittingProof(true);

            // Here you would typically submit the tweet URL to your backend
            // For now, we'll just show a success message
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            showToast('Tweet proof submitted successfully!', 'success');

            router.push('/confirmation');

            // You can add additional logic here, such as:
            // - Submit to your backend API
            // - Redirect to a success page
            // - Update the UI state

        } catch (error) {
            console.error('Error submitting proof:', error);
            showToast('Error submitting tweet proof', 'error');
        } finally {
            setIsSubmittingProof(false);
        }
    };

    const handleDownloadBanner = () => {
        if (!bannerImage) return;

        try {
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = bannerImage;
            link.download = `project-0-banner-${formData.twitter.replace('@', '')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Banner downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading banner:', error);
            showToast('Error downloading banner', 'error');
        }
    };

    useEffect(() => {
        generateBanner();
    }, []);

    const profileImage = getTwitterProfileImage(formData.twitter);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Spread the word!
                </h2>
                <p className="text-gray-600">
                    Announce your application and earn referral rewards.<br />Submit your tweet link for proof.
                </p>
            </div>

            {/* Twitter UI Mockup */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
                {/* Twitter Header */}
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hidden">
                            <span className="text-white font-bold text-sm">
                                {formData.twitter.charAt(1).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="flex items-center">
                            <span className="font-bold text-gray-900">{formData.twitter}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-900 leading-relaxed">
                        Just applied for the new <span className="text-blue-500">@0dotxyz</span> rollout. Join me: <span className="text-blue-500">{referralCode}</span>
                    </p>
                </div>

                <div className={`rounded-xl overflow-hidden bg-gray-100 relative ${isGeneratingBanner && 'animate-pulse'}`}>
                    {isGeneratingBanner ? (
                        <div className="h-48 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-2"></div>
                                <p className="text-gray-500 text-sm">Generating banner...</p>
                            </div>
                        </div>
                    ) : bannerImage ? (
                        <>
                            <img
                                src={bannerImage}
                                alt="Project 0 Banner"
                                className="w-full h-auto"
                            />
                            <button
                                onClick={handleDownloadBanner}
                                className="cursor-pointer absolute bottom-3 left-3 p-2 bg-black bg-opacity-50 rounded-full"
                                title="Download banner"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                            </button>
                        </>
                    ) : (
                        <div className="h-48 flex items-center justify-center">
                            <p className="text-gray-500">Banner not available</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Button
                        variant="secondary"
                        onClick={generateBanner}
                        disabled={isGeneratingBanner}
                        loading={isGeneratingBanner}
                    >
                        Regenerate
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleShareOnTwitter}
                        disabled={isSharing}
                        className="flex items-center gap-1"
                    >
                        Share on
                        <XIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <div className="relative rounded-md shadow-sm outline outline-1 outline-gray-200 bg-white">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        {urlError ? (
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                        ) : tweetUrl.trim() && !urlError ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        ) : (
                            <CheckIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <input
                        type="url"
                        id="tweet-url"
                        className={`py-4 block w-full pl-10 sm:text-sm rounded-md text-gray-900 bg-white border-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 ${urlError ? 'outline-red-500 outline-2' : ''
                            }`}
                        placeholder="https://x.com/username/status/1234386091818959039"
                        value={tweetUrl}
                        onChange={handleUrlChange}
                        onBlur={handleUrlBlur}
                    />
                </div>
                {urlError && (
                    <p className="mt-2 text-sm text-red-600">{urlError}</p>
                )}
            </div>

            <Button
                className="w-full py-3 mt-4"
                onClick={handleSubmitProof}
                loading={isSubmittingProof}
                disabled={!tweetUrl.trim() || isSubmittingProof || !!urlError}
            >
                Submit Tweet Proof
            </Button>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                    We only consider applications with proof of tweet.
                </p>
            </div>
        </motion.div>
    );
};