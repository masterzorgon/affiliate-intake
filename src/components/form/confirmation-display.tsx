import { ComponentType } from 'react';
import {
    EnvelopeIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    UserIcon,
    GlobeAltIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";

interface FormData {
    email: string;
    telegram: string;
    twitter: string;
    region: string;
    country: string;
}

interface ConfirmationItem {
    id: string;
    label: string;
    value: string;
    icon: ComponentType<{ className?: string }>;
    displayFormat?: (value: string) => string;
}

interface ConfirmationDisplayProps {
    formData: FormData;
    title?: string;
    description?: string;
}

const ConfirmationItem = ({ item }: { item: ConfirmationItem }) => {
    const displayValue = item.displayFormat ? item.displayFormat(item.value) : item.value;
    
    return (
        <div className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    <item.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {item.label}
                    </div>
                    <div className="text-base text-gray-900 font-medium truncate" title={displayValue}>
                        {displayValue}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 ml-4">
                <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
            </div>
        </div>
    );
};

export const ConfirmationDisplay = ({ 
    formData, 
    title = "Confirm your information",
    description = "Confirm your information before submitting. We will never ask for your secret key or seed phrase."
}: ConfirmationDisplayProps) => {
    const confirmationItems: ConfirmationItem[] = [
        { 
            id: 'email',
            label: "Email", 
            value: formData.email, 
            icon: EnvelopeIcon 
        },
        { 
            id: 'telegram',
            label: "Telegram", 
            value: formData.telegram, 
            icon: ChatBubbleLeftRightIcon,
            displayFormat: (value: string) => value.startsWith('@') ? value : `@${value}`
        },
        { 
            id: 'twitter',
            label: "Twitter", 
            value: formData.twitter, 
            icon: UserIcon,
            displayFormat: (value: string) => value.startsWith('@') ? value : `@${value}`
        },
        { 
            id: 'region',
            label: "Region", 
            value: formData.region, 
            icon: GlobeAltIcon
        },
        { 
            id: 'country',
            label: "Country", 
            value: formData.country, 
            icon: MapPinIcon
        },
    ].filter(item => item.value && item.value.trim() !== '');

    if (confirmationItems.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-sm">
                    No information to confirm
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                    {description}
                </p>
            </div>
            
            <div className="space-y-3">
                {confirmationItems.map((item) => (
                    <ConfirmationItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};
