/**
 * Analytics Events for Business Setup
 * 
 * Structured event tracking for monitoring user flow and engagement.
 * Compatible with any analytics provider (Segment, Mixpanel, GA4, etc.)
 */

export type AnalyticsEvent = {
    name: string
    properties?: Record<string, unknown>
    timestamp?: string
}

/**
 * Business Setup Analytics Events
 */
export const BusinessSetupEvents = {
    // Modal Events
    MODAL_OPENED: 'business_setup_modal_opened',
    MODAL_CLOSED: 'business_setup_modal_closed',

    // Tab Events
    TAB_SWITCHED: 'business_setup_tab_switched',

    // Country Selection
    COUNTRY_SELECTED: 'business_setup_country_selected',

    // Department Search
    DEPARTMENT_SEARCHED: 'business_setup_department_searched',
    DEPARTMENT_SELECTED: 'business_setup_department_selected',

    // License Lookup
    LICENSE_LOOKUP_STARTED: 'business_setup_license_lookup_started',
    LICENSE_LOOKUP_SUCCEEDED: 'business_setup_license_lookup_succeeded',
    LICENSE_LOOKUP_FAILED: 'business_setup_license_lookup_failed',

    // Form Validation
    VALIDATION_FAILED: 'business_setup_validation_failed',

    // Submission
    FORM_SUBMITTED: 'business_setup_form_submitted',
    SETUP_COMPLETED: 'business_setup_completed',
    SETUP_FAILED: 'business_setup_failed',

    // Abandonment
    FLOW_ABANDONED: 'business_setup_flow_abandoned',
} as const

export type BusinessSetupEventName = typeof BusinessSetupEvents[keyof typeof BusinessSetupEvents]

/**
 * Analytics tracker interface
 * Implement this to connect to your analytics provider
 */
export interface AnalyticsTracker {
    track(event: AnalyticsEvent): void
    identify(userId: string, traits?: Record<string, unknown>): void
}

/**
 * Console logger for development
 */
const consoleTracker: AnalyticsTracker = {
    track(event) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics]', event.name, event.properties)
        }
    },
    identify(userId, traits) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics] Identify:', userId, traits)
        }
    },
}

// Default to console in development
let tracker: AnalyticsTracker = consoleTracker

/**
 * Set custom analytics tracker
 */
export function setAnalyticsTracker(customTracker: AnalyticsTracker): void {
    tracker = customTracker
}

/**
 * Track a business setup event
 */
export function trackBusinessSetupEvent(
    event: BusinessSetupEventName,
    properties?: Record<string, unknown>
): void {
    tracker.track({
        name: event,
        properties: {
            ...properties,
            source: 'business_setup',
        },
        timestamp: new Date().toISOString(),
    })
}

/**
 * Helper functions for common events
 */
export const analytics = {
    // Modal opened from dashboard
    modalOpened(source: 'dashboard' | 'url' = 'dashboard') {
        trackBusinessSetupEvent(BusinessSetupEvents.MODAL_OPENED, { source })
    },

    // Tab switched
    tabSwitched(tab: 'existing' | 'new') {
        trackBusinessSetupEvent(BusinessSetupEvents.TAB_SWITCHED, { tab })
    },

    // Country selected
    countrySelected(country: string) {
        trackBusinessSetupEvent(BusinessSetupEvents.COUNTRY_SELECTED, { country })
    },

    // Department searched
    departmentSearched(query: string, resultsCount: number) {
        trackBusinessSetupEvent(BusinessSetupEvents.DEPARTMENT_SEARCHED, {
            query_length: query.length,
            results_count: resultsCount,
        })
    },

    // License lookup
    licenseLookupStarted(country: string) {
        trackBusinessSetupEvent(BusinessSetupEvents.LICENSE_LOOKUP_STARTED, { country })
    },

    licenseLookupSucceeded(durationMs: number, autoFilled: boolean) {
        trackBusinessSetupEvent(BusinessSetupEvents.LICENSE_LOOKUP_SUCCEEDED, {
            duration_ms: durationMs,
            auto_filled: autoFilled,
        })
    },

    licenseLookupFailed(errorCode: string) {
        trackBusinessSetupEvent(BusinessSetupEvents.LICENSE_LOOKUP_FAILED, {
            error_code: errorCode,
        })
    },

    // Validation failed
    validationFailed(fieldNames: string[]) {
        trackBusinessSetupEvent(BusinessSetupEvents.VALIDATION_FAILED, {
            field_names: fieldNames,
            field_count: fieldNames.length,
        })
    },

    // Setup completed
    setupCompleted(businessType: string, country: string, durationSeconds: number) {
        trackBusinessSetupEvent(BusinessSetupEvents.SETUP_COMPLETED, {
            business_type: businessType,
            country,
            duration_seconds: durationSeconds,
        })
    },

    // Setup failed
    setupFailed(errorCode: string, errorMessage: string) {
        trackBusinessSetupEvent(BusinessSetupEvents.SETUP_FAILED, {
            error_code: errorCode,
            error_message: errorMessage,
        })
    },

    // Flow abandoned
    flowAbandoned(lastInteraction: string, timeSpentSeconds: number) {
        trackBusinessSetupEvent(BusinessSetupEvents.FLOW_ABANDONED, {
            last_interaction: lastInteraction,
            time_spent_seconds: timeSpentSeconds,
        })
    },
}

export default analytics
