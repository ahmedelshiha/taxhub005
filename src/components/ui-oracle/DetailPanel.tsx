/**
 * DetailPanel Component
 * Side panel for detail views
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface DetailPanelProps {
    title?: string
    children: React.ReactNode
    className?: string
}

export function DetailPanel({ title, children, className }: DetailPanelProps) {
    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}
