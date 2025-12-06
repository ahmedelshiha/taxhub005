'use client'

/**
 * WelcomeEmptyState - Premium Empty State Component
 * 
 * A visually stunning welcome screen for new portal users.
 * Features gradient background, feature highlights, and animated CTA.
 * Matches LEDGERS premium design aesthetic.
 */

import { Plus, FileText, Shield, TrendingUp, Building2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeEmptyStateProps {
    title?: string
    onAddBusiness?: () => void
}

export function WelcomeEmptyState({
    title = 'Your Businesses',
    onAddBusiness
}: WelcomeEmptyStateProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>

            {/* Premium Empty State Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient orbs */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                    {/* Left: Illustration */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
                            {/* Icon container */}
                            <div className="relative w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
                                <Building2 className="w-16 h-16 text-white" />
                                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                            Welcome to TaxHub Portal
                        </h3>
                        <p className="text-lg text-blue-100 mb-6 max-w-lg">
                            Add your first business to unlock powerful tax management, compliance tracking, and financial tools.
                        </p>

                        {/* Feature Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <FeatureHighlight
                                icon={FileText}
                                title="Tax Management"
                                description="Automated filings"
                            />
                            <FeatureHighlight
                                icon={Shield}
                                title="Compliance"
                                description="Never miss deadlines"
                            />
                            <FeatureHighlight
                                icon={TrendingUp}
                                title="Financial Insights"
                                description="Real-time analytics"
                            />
                        </div>

                        {/* CTA Button */}
                        {onAddBusiness && (
                            <Button
                                onClick={onAddBusiness}
                                size="lg"
                                className="
                                    bg-white text-indigo-700 hover:bg-blue-50 
                                    font-semibold px-8 py-6 text-lg
                                    shadow-xl hover:shadow-2xl
                                    transform hover:scale-[1.02] transition-all duration-200
                                    group
                                "
                            >
                                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                Add Your First Business
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Feature Highlight Card
 */
function FeatureHighlight({
    icon: Icon,
    title,
    description
}: {
    icon: React.ElementType
    title: string
    description: string
}) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-blue-200">{description}</div>
            </div>
        </div>
    )
}

export default WelcomeEmptyState
