import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import RoleSelection from './RoleSelection';
import LanguageSelection from './LanguageSelection';
import LocationSelection from './LocationSelection';
import AuthenticationForm from './AuthenticationForm';

type Role =
    | 'gram_sabha'
    | 'frc'
    | 'revenue_officer'
    | 'sdlc'
    | 'dlc'
    | 'slmc'
    | 'mota'
    | 'ngo'
    | 'researcher'
    | 'public'
    | null;

type Language = 'en' | 'hi';

interface FormData {
    role: Role;
    language: Language;
    state: string | null;
    district: string | null;
    village: string | null;
}

interface LoginContainerProps {
    onLogin: (formData: FormData) => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ onLogin }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        role: null,
        language: 'en',
        state: null,
        district: null,
        village: null,
    });

    function getTotalSteps(role: Role): number {
        if (!role) return 4;
        if (['slmc', 'mota', 'ngo', 'researcher'].includes(role)) return 3; // No location needed
        if (role === 'public') return 2; // No auth needed
        return 4; // Role + Language + Location + Auth
    }

    const totalSteps = getTotalSteps(formData.role);

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // ✅ Strongly typed updateFormData
    const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                return formData.role !== null;
            case 2:
                return true; // language is always 'en' | 'hi'
            case 3:
                if (formData.role && ['slmc', 'mota', 'ngo', 'researcher'].includes(formData.role)) return true;
                if (formData.role && ['gram_sabha', 'frc', 'revenue_officer'].includes(formData.role)) {
                    return !!(formData.state && formData.district && formData.village);
                }
                return !!(formData.state && formData.district);
            default:
                return true;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <RoleSelection
                        selectedRole={formData.role}
                        onRoleSelect={(role: Exclude<Role, null>) => updateFormData('role', role)}
                        language={formData.language}
                    />
                );
            case 2:
                return (
                    <LanguageSelection
                        selectedLanguage={formData.language}
                        onLanguageSelect={(lang: Language) => updateFormData('language', lang)}
                        role={formData.role}
                    />
                );
            case 3:
                if (
                    formData.role !== null &&
                    ['slmc', 'mota', 'ngo', 'researcher'].includes(formData.role)
                ) {
                    return <AuthenticationForm formData={formData} onLogin={onLogin} />;
                }
                return <LocationSelection formData={formData} updateFormData={updateFormData} />;
            case 4:
                return <AuthenticationForm formData={formData} onLogin={onLogin} />;
            default:
                return null;
        }
    };

    const isAuthStep = (): boolean => {
        return (
            currentStep === 4 ||
            (currentStep === 3 &&
                formData.role !== null &&
                ['slmc', 'mota', 'ngo', 'researcher'].includes(formData.role))
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">FRA Atlas DSS</h1>
                    <p className="text-green-100 mt-1 text-sm">
                        {formData.language === 'hi'
                            ? 'वन अधिकार अधिनियम डिजिटल सहायता प्रणाली'
                            : 'Forest Rights Act Digital Support System'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm text-gray-600">
                            {Math.round((currentStep / totalSteps) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">{renderStep()}</div>

                {/* Navigation */}
                {!isAuthStep() && (
                    <div className="px-8 pb-6">
                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formData.language === 'hi' ? 'पिछला' : 'Back'}
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <span>{formData.language === 'hi' ? 'आगे' : 'Next'}</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-600">
                    <p>
                        {formData.language === 'hi'
                            ? 'भारत सरकार • जनजातीय कार्य मंत्रालय'
                            : 'Government of India • Ministry of Tribal Affairs'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;
