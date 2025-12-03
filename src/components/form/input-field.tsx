'use client'

import { motion } from "framer-motion";
import { ComponentType } from "react";

interface InputFieldProps {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    inputType: string;
    inputName: string;
    inputId: string;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    error?: string;
    options?: { value: string; label: string }[];
    disabled?: boolean;
}

export const InputField = ({
    title,
    description,
    icon: IconComponent,
    inputType,
    inputName,
    inputId,
    placeholder,
    value,
    onChange,
    error,
    options,
    disabled = false
}: InputFieldProps) => {
    return (
        <motion.div 
            className=""
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
                {title}
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
                {description}
            </motion.p>
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
                    <IconComponent className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                {options ? (
                    <select
                        name={inputName}
                        id={inputId}
                        disabled={disabled}
                        className={`py-4 block w-full pl-10 sm:text-sm rounded-md ${
                            disabled 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                : 'text-gray-900'
                        } ${
                            error 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-vangardPurple focus:border-vangardPurple' 
                        }`}
                        value={value || ''}
                        onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    >
                        <option value="" disabled>{placeholder}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={inputType}
                        name={inputName}
                        id={inputId}
                        disabled={disabled}
                        className={`py-4 block w-full pl-10 sm:text-sm rounded-md ${
                            disabled 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                : 'text-gray-900'
                        } ${
                            error 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-vangardPurple focus:border-vangardPurple' 
                        }`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    />
                )}
            </motion.div>
            {error && (
                <motion.p 
                    className="mt-2 text-sm text-red-600"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ 
                        duration: 0.15,
                        ease: "easeOut"
                    }}
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
};
