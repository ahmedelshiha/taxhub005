import { useState, useCallback, useEffect } from 'react'
import { useSetupWizard } from '../core/SetupContext'
import { LicenseNumberField, BusinessNameField } from '../fields'
import { licenseService } from '../services'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DEPARTMENTS = [
    "Finance",
    "Human Resources",
    "IT",
    "Legal",
    "Operations",
    "Sales",
    "Marketing"
]

export default function LicenseVerificationStep() {
    const { formData, actions } = useSetupWizard()
    const [isLooking, setIsLooking] = useState(false)
    const [lookupResult, setLookupResult] = useState<any>(null)

    const isExisting = formData.businessType === 'existing'
    const isNew = formData.businessType === 'new'
    const isIndividual = formData.businessType === 'individual'

    useEffect(() => {
        // Validation logic
        let isValid = false

        if (isExisting) {
            isValid = !!formData.licenseNumber && !!formData.businessName && !!formData.department
        } else if (isIndividual) {
            isValid = !!formData.passportNumber && !!formData.businessName && !!formData.dateOfBirth
        } else {
            // New Startup
            isValid = !!formData.businessName && !!formData.department
        }

        if (isValid) {
            actions.clearValidationErrors()
            actions.markStepComplete(3)
        }
    }, [formData.licenseNumber, formData.businessName, formData.department, formData.passportNumber, formData.dateOfBirth, isExisting, isIndividual, actions])

    const handleLicenseLookup = useCallback(async () => {
        if (!formData.licenseNumber || !formData.country) return

        setIsLooking(true)
        try {
            const result = await licenseService.lookupLicense(
                formData.licenseNumber,
                formData.country as 'AE' | 'SA' | 'EG'
            )

            if (result.found && result.data) {
                setLookupResult(result.data)
                actions.updateFormData({
                    businessName: result.data.name,
                    licenseExpiry: result.data.expiry,
                    activities: result.data.activities
                })
                toast.success('License verified! Details auto-filled.')
            } else {
                throw new Error(result.error || 'License not found')
            }
        } catch (error) {
            toast.error('License not found. You can continue with manual entry.')
            setLookupResult(null)
        } finally {
            setIsLooking(false)
        }
    }, [formData.licenseNumber, formData.country, actions])

    const getBusinessNameLabel = () => {
        if (isIndividual) return "Name"
        if (isNew) return "Proposed Business Name"
        return "Business Name"
    }

    const getBusinessNamePlaceholder = () => {
        if (isIndividual) return "Enter your full name"
        if (isNew) return "Proposed Business Name"
        return "Business Name"
    }

    return (
        <div className="space-y-6 py-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">
                    {isExisting ? 'Verify Your License' : (isIndividual ? 'Individual Details' : 'Business Details')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {isExisting
                        ? 'Enter your trade license number to verify your business.'
                        : (isIndividual ? 'Enter your personal details.' : 'Enter your proposed business name.')}
                </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
                {isExisting && (
                    <LicenseNumberField
                        value={formData.licenseNumber}
                        onChange={(val) => actions.updateFormData({ licenseNumber: val })}
                        onLookup={handleLicenseLookup}
                        isLookingUp={isLooking}
                    />
                )}

                {isIndividual && (
                    <div className="space-y-2">
                        <Label htmlFor="passport">PAN/Passport Number</Label>
                        <Input
                            id="passport"
                            placeholder="PAN/Passport Number"
                            value={formData.passportNumber || ''}
                            onChange={(e) => actions.updateFormData({ passportNumber: e.target.value })}
                        />
                    </div>
                )}

                <BusinessNameField
                    value={formData.businessName}
                    onChange={(val) => actions.updateFormData({ businessName: val })}
                    disabled={!!lookupResult}
                    label={getBusinessNameLabel()}
                    placeholder={getBusinessNamePlaceholder()}
                />

                {isIndividual && (
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth (dd-mm-yyyy)</Label>
                        <Input
                            id="dob"
                            type="date"
                            placeholder="Date of Birth"
                            value={formData.dateOfBirth || ''}
                            onChange={(e) => actions.updateFormData({ dateOfBirth: e.target.value })}
                        />
                    </div>
                )}

                {!isIndividual && (
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Select
                            value={formData.department}
                            onValueChange={(val) => actions.updateFormData({ department: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEPARTMENTS.map(dept => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {lookupResult && (
                    <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <CardContent className="pt-6">
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Verified Details</h4>
                            <dl className="grid grid-cols-2 gap-2 text-sm">
                                <dt className="text-gray-500">Expiry:</dt>
                                <dd className="font-medium">{lookupResult.expiry}</dd>
                                <dt className="text-gray-500">Type:</dt>
                                <dd className="font-medium">{lookupResult.type}</dd>
                                <dt className="text-gray-500">Activities:</dt>
                                <dd className="font-medium col-span-2">
                                    {lookupResult.activities.join(', ')}
                                </dd>
                            </dl>
                        </CardContent>
                    </Card>
                )}

                {!isExisting && !isIndividual && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                        <p>
                            <strong>Note:</strong> Since you&apos;re setting up a new business,
                            we&apos;ll verify your name availability in the next steps.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
