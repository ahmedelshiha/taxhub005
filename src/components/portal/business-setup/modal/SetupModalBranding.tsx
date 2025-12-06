'use client'

/**
 * SetupModalBranding - LEDGERS-style Left Panel
 * 
 * Premium branding panel for the Business Setup modal.
 * Matches the LEDGERS design with logo, tagline, and illustration.
 */

import { Building2, Sparkles } from 'lucide-react'

interface SetupModalBrandingProps {
    className?: string
}

export function SetupModalBranding({ className = '' }: SetupModalBrandingProps) {
    return (
        <div className={`
            hidden lg:flex lg:w-2/5 
            bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900
            p-8 flex-col justify-between
            relative overflow-hidden
            ${className}
        `}>
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            TaxHub
                        </h1>
                        <div className="text-xs text-blue-300 font-medium">
                            Business Platform
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div className="mb-12">
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Setup your <span className="text-white font-semibold">UAE entity</span> to access
                        invoicing, accounting, business tax filing and professional services.
                    </p>
                </div>

                {/* Illustration */}
                <div className="relative">
                    <div className="relative w-48 h-48 mx-auto">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-110" />
                        {/* Main illustration container */}
                        <div className="relative w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            <div className="relative">
                                <Building2 className="w-24 h-24 text-blue-400" />
                                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/30 rounded-lg animate-float" />
                        <div className="absolute -bottom-2 -right-6 w-6 h-6 bg-indigo-500/30 rounded-full animate-float-delayed" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 pt-8 border-t border-white/10">
                <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">
                        Support Partner: <span className="text-blue-400 hover:underline cursor-pointer">Filings Corporate Services L.L.C</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Have more questions? <span className="text-blue-400 hover:underline cursor-pointer">Chat</span>
                    </p>
                </div>
            </div>

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 3s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    )
}

export default SetupModalBranding
