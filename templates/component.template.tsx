'use client'

import { ReactNode } from 'react'
import { usePermissions } from '@/lib/use-permissions'

/**
 * Props for {{ComponentName}} component
 */
interface {{ComponentName}}Props {
  /**
   * Component variant for different display modes
   * @default 'default'
   */
  variant?: 'portal' | 'admin' | 'default'

  /**
   * CSS class name for custom styling
   */
  className?: string

  /**
   * Loading state indicator
   * @default false
   */
  loading?: boolean

  /**
   * Error state and message
   */
  error?: string | null

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean

  /**
   * Child elements to render
   */
  children?: ReactNode

  /**
   * Callback when component is interacted with
   */
  onInteract?: () => void
}

/**
 * {{ComponentDescription}}
 *
 * This component is part of the shared component library and can be used in both
 * portal and admin areas. Use the `variant` prop to customize behavior for different contexts.
 *
 * @example Portal usage
 * ```tsx
 * <{{ComponentName}} variant="portal" />
 * ```
 *
 * @example Admin usage
 * ```tsx
 * <{{ComponentName}} variant="admin" onInteract={() => console.log('Clicked')} />
 * ```
 *
 * @example With loading state
 * ```tsx
 * <{{ComponentName}} loading={isLoading} error={errorMessage} />
 * ```
 */
export function {{ComponentName}}({
  variant = 'default',
  className = '',
  loading = false,
  error = null,
  disabled = false,
  children,
  onInteract,
}: {{ComponentName}}Props) {
  const { can } = usePermissions()

  // Show loading state
  if (loading) {
    return (
      <div className={`${className} opacity-50`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin">Loading...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`${className} p-4 bg-red-50 border border-red-200 rounded-md`}>
        <p className="text-red-800 text-sm font-medium">Error</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    )
  }

  // Portal variant (limited functionality)
  if (variant === 'portal' && !can('resource:interact')) {
    return (
      <div className={`${className} p-4 bg-gray-50 border border-gray-200 rounded-md`}>
        <p className="text-gray-600 text-sm">You don't have permission to interact with this component</p>
      </div>
    )
  }

  return (
    <div
      className={`${className} {{component-base-class}}`}
      onClick={onInteract}
      role="{{component-role}}"
      aria-label="{{component-name}}"
    >
      {variant === 'admin' && (
        <div className="admin-section">
          {/* Admin-only content */}
        </div>
      )}

      {variant === 'portal' && (
        <div className="portal-section">
          {/* Portal-specific content */}
        </div>
      )}

      {variant === 'default' && (
        <div className="default-section">
          {/* Default content */}
        </div>
      )}

      {children}
    </div>
  )
}

export default {{ComponentName}}