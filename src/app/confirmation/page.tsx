'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { Header } from '@/components/header'
import { Confetti } from '@/components/confetti'
import { TwitterIcon, LinkedInIcon, ArrowIcon } from '@/components/icons'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'

export default function ThankYouPage() {
    const router = useRouter()
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        // Trigger confetti when page loads
        setShowConfetti(true)
    }, [])

    const socialLinks = [
        {
            name: 'Twitter',
            url: 'https://x.com/ether_fi',
            icon: TwitterIcon,
            color: 'hover:text-blue-400'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/etherfi/posts/?feedView=all',
            icon: LinkedInIcon,
            color: 'hover:text-blue-400'
        }
    ]

    const bulletPoints = [
        "Affiliates will be selected at Ether.fi's discretion.",
        "Affiliates will notified of approval viaemail or Telegram.",
        "We will never ask for your secret key or seed phrase.",
        "Only one application per user."
    ]

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
            <Header />
            <div className="flex flex-col items-center justify-center mt-14">
                <div className="text-center max-w-2xl mx-auto">

                    <div className="p-6 md:p-8 mb-8">
                        <h1 className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold text-gray-900 mb-6">
                            <CheckBadgeIcon className="size-8 fill-green-500" />
                            Application Recieved
                        </h1>
                        <div className="space-y-4"> 
                            {bulletPoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3 group text-sm md:text-base">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 transition-colors flex items-center justify-center">
                                            <ArrowIcon className="size-4 text-gray-700" />
                                        </div>
                                    </div>
                                    <p className="text-start text-gray-700 leading-relaxed flex-1">
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="primary"
                            className="w-full mt-10"
                            onClick={() => window.open('https://ether.fi', '_blank')}
                        >
                            Create Ether.fi Account
                        </Button>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-gray-500 mb-4">
                            Stay connected with us for updates and announcements:
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-400 ${social.color} transition-colors`}
                                    >
                                        <IconComponent className="w-6 h-6" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}