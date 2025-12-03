'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/form/progress";
import { InputField } from "@/components/form/input-field";
import { ConfirmationDisplay } from "@/components/form/confirmation-display";
import { FormNavigation } from "@/components/form/form-navigation";
import { TwitterShareView } from "@/components/form/twitter-share-view";
import { Confetti } from "@/components/confetti";
import { useToast } from "@/components/toast-provider";
import {
    EnvelopeIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    UserIcon,
    GlobeAltIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";
import { validateEmail, validateTelegram, validateTwitter } from "@/lib/utils";

// Country to region mapping
const countryToRegion: Record<string, string> = {
    // USA
    'United States': 'USA',
    // Europe
    'Albania': 'Europe', 'Andorra': 'Europe', 'Austria': 'Europe', 'Belarus': 'Europe',
    'Belgium': 'Europe', 'Bosnia and Herzegovina': 'Europe', 'Bulgaria': 'Europe',
    'Croatia': 'Europe', 'Cyprus': 'Europe', 'Czech Republic': 'Europe', 'Denmark': 'Europe',
    'Estonia': 'Europe', 'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
    'Greece': 'Europe', 'Hungary': 'Europe', 'Iceland': 'Europe', 'Ireland': 'Europe',
    'Italy': 'Europe', 'Latvia': 'Europe', 'Liechtenstein': 'Europe', 'Lithuania': 'Europe',
    'Luxembourg': 'Europe', 'Malta': 'Europe', 'Moldova': 'Europe', 'Monaco': 'Europe',
    'Montenegro': 'Europe', 'Netherlands': 'Europe', 'North Macedonia': 'Europe',
    'Norway': 'Europe', 'Poland': 'Europe', 'Portugal': 'Europe', 'Romania': 'Europe',
    'Russia': 'Europe', 'San Marino': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe',
    'Slovenia': 'Europe', 'Spain': 'Europe', 'Sweden': 'Europe', 'Switzerland': 'Europe',
    'Ukraine': 'Europe', 'United Kingdom': 'Europe', 'Vatican City': 'Europe',
    // UAE
    'United Arab Emirates': 'UAE', 'Saudi Arabia': 'UAE', 'Qatar': 'UAE', 'Kuwait': 'UAE',
    'Bahrain': 'UAE', 'Oman': 'UAE',
    // LATAM
    'Argentina': 'LATAM', 'Bolivia': 'LATAM', 'Brazil': 'LATAM', 'Chile': 'LATAM',
    'Colombia': 'LATAM', 'Costa Rica': 'LATAM', 'Cuba': 'LATAM', 'Dominican Republic': 'LATAM',
    'Ecuador': 'LATAM', 'El Salvador': 'LATAM', 'Guatemala': 'LATAM', 'Honduras': 'LATAM',
    'Mexico': 'LATAM', 'Nicaragua': 'LATAM', 'Panama': 'LATAM', 'Paraguay': 'LATAM',
    'Peru': 'LATAM', 'Uruguay': 'LATAM', 'Venezuela': 'LATAM',
    // APAC
    'Afghanistan': 'APAC', 'Australia': 'APAC', 'Bangladesh': 'APAC', 'Bhutan': 'APAC',
    'Brunei': 'APAC', 'Cambodia': 'APAC', 'China': 'APAC', 'Fiji': 'APAC',
    'India': 'APAC', 'Indonesia': 'APAC', 'Japan': 'APAC', 'Laos': 'APAC',
    'Malaysia': 'APAC', 'Maldives': 'APAC', 'Myanmar': 'APAC', 'Nepal': 'APAC',
    'New Zealand': 'APAC', 'North Korea': 'APAC', 'Pakistan': 'APAC', 'Papua New Guinea': 'APAC',
    'Philippines': 'APAC', 'Singapore': 'APAC', 'South Korea': 'APAC', 'Sri Lanka': 'APAC',
    'Taiwan': 'APAC', 'Thailand': 'APAC', 'Vietnam': 'APAC',
};

// List of all countries sorted alphabetically
const countries = Object.keys(countryToRegion).sort();

export const stepConfigs = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
        name: "Twitter",
        title: "Enter your X (Twitter) handle",
        description: "We'll use this to generate a banner image you can share on X (Twitter).",
        icon: UserIcon,
        inputType: "text",
        inputName: "twitter",
        inputId: "twitter",
        placeholder: "@yourhandle"
    },
    {
        id: 4,
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
        id: 5,
        name: "Region",
        title: "Your region",
        description: "Your region is automatically determined based on your country selection.",
        icon: GlobeAltIcon,
        inputType: "select",
        inputName: "region",
        inputId: "region",
        placeholder: "Region will be auto-populated",
        options: [
            { value: "USA", label: "USA" },
            { value: "Europe", label: "Europe" },
            { value: "UAE", label: "UAE" },
            { value: "LATAM", label: "LATAM" },
            { value: "APAC", label: "APAC" }
        ]
    },
    {
        id: 6,
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
        case 'twitter':
            return validateTwitter(value);
        default:
            return null;
    }
};

export const Form = ({ initialStep = 1 }: { initialStep?: number }) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [formData, setFormData] = useState({
        email: '',
        telegram: '',
        twitter: '',
        region: '',
        country: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Add state to track successfully submitted emails
    const [successfullySubmittedEmail, setSuccessfullySubmittedEmail] = useState<string | null>(null);
    const { showToast } = useToast();
    // Add state to track if form is completed
    const [isFormCompleted, setIsFormCompleted] = useState(false);
    // Add state to trigger confetti
    const [showConfetti, setShowConfetti] = useState(false);

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
        if (currentStep === 6) return true;

        const fieldName = currentConfig.inputName;
        
        const error: string | null = null;

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

    const handleComplete = () => {
        // Handle form completion logic here
        console.log('Form completed!', formData);
        setShowConfetti(true);
        // Delay setting form completed to allow confetti to show
        setTimeout(() => {
            setIsFormCompleted(true);
        }, 1000);
    };

    const isCurrentFieldValid = currentStep === 6 || !validateField(
        currentConfig.inputName,
        formData[currentConfig.inputName as keyof typeof formData]
    );

    // If form is completed, show the TwitterShareView
    if (isFormCompleted) {
        return (
            <>
                <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
                <section className="mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mb-22">
                    <TwitterShareView formData={formData} />
                </section>
            </>
        );
    }

    return (
        <>
            <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
            <section className="mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mb-22">
                <Progress currentStep={currentStep} />

                <div className="p-8 mt-6 rounded-lg shadow-md outline-1 outline-gray-100">
                    <AnimatePresence mode="wait">
                        {currentStep === 6 ? (
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
                                disabled={currentConfig.inputName === 'region'}
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
                        Early access will be granted at Project 0&apos;s discretion.
                        You will be notified via email if your early access application is approved.
                        We will never ask for your secret key or seed phrase.
                    </p>
                </div>
            </section>
        </>
    );
};