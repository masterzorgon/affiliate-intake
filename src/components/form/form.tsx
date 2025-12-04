'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/form/progress";
import { InputField } from "@/components/form/input-field";
import { ConfirmationDisplay } from "@/components/form/confirmation-display";
import { FormNavigation } from "@/components/form/form-navigation";
import { useToast } from "@/components/toast-provider";
import {
    EnvelopeIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    UserIcon,
    GlobeAltIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";
import { validateEmail, validateTelegram, validateUrl } from "@/lib/utils";
import { countryToRegion, countries } from "@/lib/constants";

export const stepConfigs = [
    {
        id: 1,
        name: "Name",
        title: "Enter your name",
        description: "Please provide your full name.",
        icon: UserIcon,
        inputType: "text",
        inputName: "name",
        inputId: "name",
        placeholder: "John Doe"
    },
    {
        id: 2,
        name: "Email",
        title: "Enter your email address",
        description: "We'll sign you up for our newsletter and contact you if you're accepted for early access.",
        icon: EnvelopeIcon,
        inputType: "email",
        inputName: "email",
        inputId: "email",
        placeholder: "example@email.com"
    },
    {
        id: 3,
        name: "Telegram",
        title: "Enter your Telegram username",
        description: "We'll use this to contact you about exclusive opportunities.",
        icon: ChatBubbleLeftRightIcon,
        inputType: "text",
        inputName: "telegram",
        inputId: "telegram",
        placeholder: "@yourusername"
    },
    {
        id: 4,
        name: "Platform",
        title: "Share your main social platform",
        description: "Select your platform and provide a link to your profile.",
        icon: UserIcon,
        inputType: "social-platform",
        inputName: "socialPlatform",
        inputId: "socialPlatform",
        placeholder: "Select platform",
        options: [
            { value: "Twitter", label: "Twitter/X" },
            { value: "LinkedIn", label: "LinkedIn" },
            { value: "Instagram", label: "Instagram" },
            { value: "TikTok", label: "TikTok" },
            { value: "YouTube", label: "YouTube" },
            { value: "Other", label: "Other" }
        ]
    },
    {
        id: 5,
        name: "Method",
        title: "Select your preferred contact method",
        description: "How would you like us to contact you?",
        icon: ChatBubbleLeftRightIcon,
        inputType: "select",
        inputName: "preferredContactMethod",
        inputId: "preferredContactMethod",
        placeholder: "Select contact method",
        options: [
            { value: "Email", label: "Email" },
            { value: "Telegram", label: "Telegram" }
        ]
    },
    {
        id: 6,
        name: "Country",
        title: "Select your country",
        description: "Choose the country you're located in.",
        icon: MapPinIcon,
        inputType: "select",
        inputName: "country",
        inputId: "country",
        placeholder: "Select a country",
        options: countries.map(country => ({ value: country, label: country }))
    },
    {
        id: 7,
        name: "Confirmation",
        title: "Confirm your information",
        description: "We will never ask for your secret key or seed phrase.",
        icon: CheckCircleIcon,
        inputType: "text",
        inputName: "confirmation",
        inputId: "confirmation",
        placeholder: "All set!"
    }
];

const validateField = (fieldName: string, value: string): string | null => {
    switch (fieldName) {
        case 'email':
            return validateEmail(value);
        case 'telegram':
            return validateTelegram(value);
        case 'socialPlatformLink':
            return validateUrl(value);
        default:
            return null;
    }
};

export const Form = ({ initialStep = 1 }: { initialStep?: number }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telegram: '',
        socialPlatform: '',
        socialPlatformLink: '',
        preferredContactMethod: '',
        region: '',
        country: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const currentConfig = stepConfigs[currentStep - 1];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Auto-populate region when country is selected
        if (name === 'country' && value) {
            const region = countryToRegion[value] || '';
            setFormData(prev => ({
                ...prev,
                country: value,
                region: region
            }));
        } else if (name === 'socialPlatform') {
            // Clear the link when platform changes
            setFormData(prev => ({
                ...prev,
                socialPlatform: value,
                socialPlatformLink: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateCurrentField = async (): Promise<boolean> => {
        // Confirmation step is always valid
        if (currentStep === stepConfigs.length) return true;

        const fieldName = currentConfig.inputName;
        
        // Special validation for social platform step
        if (currentConfig.inputType === 'social-platform') {
            if (!formData.socialPlatform) {
                setErrors(prev => ({
                    ...prev,
                    socialPlatform: 'Please select a social platform'
                }));
                return false;
            }
            if (!formData.socialPlatformLink) {
                setErrors(prev => ({
                    ...prev,
                    socialPlatformLink: 'Please enter your social platform link'
                }));
                return false;
            }
            const linkError = validateField('socialPlatformLink', formData.socialPlatformLink);
            if (linkError) {
                setErrors(prev => ({
                    ...prev,
                    socialPlatformLink: linkError
                }));
                return false;
            }
            return true;
        }
        
        const error = validateField(fieldName, formData[fieldName as keyof typeof formData] || '');

        if (error) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }));
            return false;
        }

        return true;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentField();
        if (!isValid) return;

        if (currentStep < stepConfigs.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Try to parse error response, but handle if it's not JSON
                let errorMessage = 'Failed to submit form. Please try again.';
                let helpfulMessage = '';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    helpfulMessage = errorData.helpfulMessage || '';
                } catch {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                // Show helpful message if available, otherwise show error message
                const messageToShow = helpfulMessage || errorMessage;
                showToast(messageToShow, 'error');
                return;
            }

            const result = await response.json();

            if (result.success) {
                showToast('Form submitted successfully!', 'success');
                // Redirect to confirmation page after successful submission
                router.push('/confirmation');
            } else {
                // Show helpful message if available, otherwise show error message
                const messageToShow = result.helpfulMessage || result.error || 'Failed to submit form. Please try again.';
                showToast(messageToShow, 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('Error submitting form. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEnter = async () => {
        if (isSubmitting) return;
        
        const isValid = await validateCurrentField();
        if (!isValid) return;

        if (currentStep < stepConfigs.length) {
            handleNext();
        } else {
            handleComplete();
        }
    };

    const isCurrentFieldValid = currentStep === stepConfigs.length || 
        (currentConfig.inputType === 'social-platform' 
            ? !!(formData.socialPlatform && formData.socialPlatformLink) && validateField('socialPlatformLink', formData.socialPlatformLink) === null
            : validateField(
                currentConfig.inputName,
                formData[currentConfig.inputName as keyof typeof formData]
            ) === null);

    return (
        <>
            <section className="mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mb-22">
                <Progress currentStep={currentStep} />

                <div className="md:p-8 mt-6 rounded-lg md:shadow-md md:outline-1 md:outline-gray-100">
                    <AnimatePresence mode="wait">
                        {currentStep === stepConfigs.length ? (
                            <motion.div
                                key="confirmation"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ 
                                    duration: 0.4,
                                    ease: "easeInOut"
                                }}
                            >
                                <ConfirmationDisplay formData={formData} />
                            </motion.div>
                        ) : currentConfig.inputType === 'social-platform' ? (
                            <motion.div
                                key={`step-${currentStep}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ 
                                    duration: 0.25,
                                    ease: "easeInOut"
                                }}
                            >
                                <motion.h3 
                                    className="text-lg leading-6 font-semibold text-gray-900"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                        duration: 0.2,
                                        delay: 0.05,
                                        ease: "easeOut"
                                    }}
                                >
                                    {currentConfig.title}
                                </motion.h3>
                                <motion.p 
                                    className="mt-1 text-sm font-medium mb-4 text-gray-500"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                        duration: 0.2,
                                        delay: 0.1,
                                        ease: "easeOut"
                                    }}
                                >
                                    {currentConfig.description}
                                </motion.p>
                                <div className="space-y-4">
                                    <motion.div 
                                        className="mt-4 relative rounded-md shadow-sm border-2"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ 
                                            duration: 0.2,
                                            delay: 0.15,
                                            ease: "easeOut"
                                        }}
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <currentConfig.icon className={`h-5 w-5 ${errors.socialPlatform ? 'text-red-400' : 'text-gray-400'}`} />
                                        </div>
                                        <select
                                            name="socialPlatform"
                                            id="socialPlatform"
                                            className={`py-4 block w-full pl-10 sm:text-sm rounded-md ${
                                                errors.socialPlatform 
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-gray-300 focus:ring-vangardPurple focus:border-vangardPurple'
                                            } text-gray-900`}
                                            value={formData.socialPlatform || ''}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !isSubmitting && formData.socialPlatform) {
                                                    e.preventDefault();
                                                    // Focus on the link input if platform is selected
                                                    const linkInput = document.getElementById('socialPlatformLink');
                                                    if (linkInput) {
                                                        linkInput.focus();
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="" disabled>{currentConfig.placeholder}</option>
                                            {(currentConfig as any).options.map((option: { value: string; label: string }) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>
                                    {errors.socialPlatform && (
                                        <motion.p 
                                            className="text-sm text-red-600"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {errors.socialPlatform}
                                        </motion.p>
                                    )}
                                    {formData.socialPlatform && (
                                        <motion.div 
                                            className="relative rounded-md shadow-sm border-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                duration: 0.2,
                                                delay: 0.2,
                                                ease: "easeOut"
                                            }}
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <GlobeAltIcon className={`h-5 w-5 ${errors.socialPlatformLink ? 'text-red-400' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                type="url"
                                                name="socialPlatformLink"
                                                id="socialPlatformLink"
                                                className={`py-4 block w-full pl-10 sm:text-sm rounded-md ${
                                                    errors.socialPlatformLink 
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                                        : 'border-gray-300 focus:ring-vangardPurple focus:border-vangardPurple'
                                                } text-gray-900`}
                                                placeholder={`Enter your ${formData.socialPlatform} profile link`}
                                                value={formData.socialPlatformLink || ''}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !isSubmitting) {
                                                        e.preventDefault();
                                                        handleEnter();
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                    {errors.socialPlatformLink && (
                                        <motion.p 
                                            className="text-sm text-red-600"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {errors.socialPlatformLink}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <InputField
                                key={`step-${currentStep}`}
                                title={currentConfig.title}
                                description={currentConfig.description}
                                icon={currentConfig.icon}
                                inputType={currentConfig.inputType}
                                inputName={currentConfig.inputName}
                                inputId={currentConfig.inputId}
                                placeholder={currentConfig.placeholder}
                                value={formData[currentConfig.inputName as keyof typeof formData] || ''}
                                onChange={handleInputChange}
                                error={errors[currentConfig.inputName]}
                                options={(currentConfig as any).options}
                                onEnter={handleEnter}
                            />
                        )}
                    </AnimatePresence>

                    <FormNavigation
                        currentStep={currentStep}
                        totalSteps={stepConfigs.length}
                        isCurrentFieldValid={isCurrentFieldValid}
                        isSubmitting={isSubmitting}
                        onBack={handleBack}
                        onNext={handleNext}
                        onComplete={handleComplete}
                    />
                </div>

                <div className="mt-6 text-sm text-center text-gray-400 max-w-sm sm:max-w-lg mx-auto">
                    <p>
                        Affiliates will be onboarded at Ether.fi's discretion.
                    </p>
                </div>
            </section>
        </>
    );
};