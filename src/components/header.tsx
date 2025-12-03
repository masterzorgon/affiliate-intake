'use client'

import { Nodes } from "@/components/nodes";
import { GradientText } from "@/components/gradient-text";
import EtherfiLogo from "@/images/logos/etherfi.svg";
import Image from "next/image";
import { BanknotesIcon } from "@heroicons/react/24/solid";

export function Header() {
    return (
        <div className="relative">
            <div className="mx-auto w-full max-w-[var(--p0-container-width)] px-4 md:px-6">
                <header className="mx-auto flex w-full items-center justify-center pt-9 md:pt-18">
                    <div className="relative">
                        <div className="bg-background absolute top-1/2 left-1/2 h-[160px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-lg blur-[40px] sm:w-[350px] md:w-[400px] lg:h-[244px] lg:w-[555px]"></div>
                        <div className="relative flex flex-col items-center justify-center space-y-2 md:space-y-4">
                            <Image src="/images/logos/etherfi-icon.png" alt="Ether.fi" className="w-[50px] h-[50px]" width={50} height={50} />
                            <GradientText className="text-center font-semibold text-4xl md:text-5xl lg:text-7xl">
                                Affiliate <br/> Intake Form
                            </GradientText>

                            {/* <img src="/images/logos/P0.png" alt="Project 0 Logo" className="w-1/3 h-1/3" /> */}

                            <div className="flex fixed top-6 sm:top-0 left-0 right-0 z-50 relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 rounded-lg shadow-sm">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <p className="text-xs/4 sm:text-sm/6 text-gray-900 flex items-center gap-x-1">
                                        <strong className="text-md font-semibold">Become an Ether.fi Affiliate and earn rewards</strong>
                                        <BanknotesIcon className="h-5 w-5 inline-block" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    )
}
