// utils/fraValidation.js
import { CUTOFF_DATE, ACT_COMMENCEMENT_DATE, IDENTITY_DOCUMENTS, RULE_13_EVIDENCE_TYPES } from '../constants/fraFields.js';

export class FRAValidation {

    static validateOccupationDate(dateString) {
        if (!dateString) return { valid: false, message: 'Date not provided' };

        const providedDate = new Date(dateString);
        if (isNaN(providedDate.getTime())) {
            return { valid: false, message: 'Invalid date format' };
        }

        if (providedDate > CUTOFF_DATE) {
            return {
                valid: false,
                message: `Occupation must be before ${CUTOFF_DATE.toDateString()}`,
                requiresManualReview: true
            };
        }

        return { valid: true, message: 'Date valid for FRA claim' };
    }

    static validateTwoEvidenceRule(evidenceList) {
        if (!evidenceList || evidenceList.length < 2) {
            return {
                valid: false,
                message: 'At least 2 evidences required as per Rule 13',
                missingCount: 2 - (evidenceList?.length || 0)
            };
        }

        // Check if at least one identity document is present
        const hasIdentityDoc = evidenceList.some(evidence =>
            IDENTITY_DOCUMENTS.some(idDoc =>
                evidence.toLowerCase().includes(idDoc.toLowerCase())
            )
        );

        if (!hasIdentityDoc) {
            return {
                valid: false,
                message: 'At least one identity document required (Voter ID/Aadhaar/Ration Card/Domicile Certificate)',
                identityDocMissing: true
            };
        }

        return { valid: true, message: 'Evidence requirement satisfied' };
    }

    static categorizeEvidence(evidenceText) {
        const evidence = evidenceText.toLowerCase();

        if (IDENTITY_DOCUMENTS.some(doc => evidence.includes(doc.toLowerCase()))) {
            return RULE_13_EVIDENCE_TYPES.GOVT_AUTHORIZED;
        }

        if (evidence.includes('census') || evidence.includes('survey') || evidence.includes('gazetteer')) {
            return RULE_13_EVIDENCE_TYPES.PUBLIC_DOCUMENTS;
        }

        if (evidence.includes('house') || evidence.includes('hut') || evidence.includes('improvement')) {
            return RULE_13_EVIDENCE_TYPES.PHYSICAL_ATTRIBUTES;
        }

        if (evidence.includes('court') || evidence.includes('judgment') || evidence.includes('order')) {
            return RULE_13_EVIDENCE_TYPES.JUDICIAL_RECORDS;
        }

        if (evidence.includes('well') || evidence.includes('burial') || evidence.includes('sacred')) {
            return RULE_13_EVIDENCE_TYPES.TRADITIONAL_STRUCTURES;
        }

        if (evidence.includes('elder') || evidence.includes('statement') || evidence.includes('witness')) {
            return RULE_13_EVIDENCE_TYPES.ELDER_STATEMENTS;
        }

        return RULE_13_EVIDENCE_TYPES.PUBLIC_DOCUMENTS; // Default category
    }

    static validateClaimantEligibility(claimantData) {
        const errors = [];

        // Must be either FDST or OTFD
        if (!claimantData.isScheduledTribe && !claimantData.isOTFD) {
            errors.push('Claimant must be either Forest Dwelling Scheduled Tribe or Other Traditional Forest Dweller');
        }

        // Check required fields
        const requiredFields = ['claimantName', 'village', 'district'];
        requiredFields.forEach(field => {
            if (!claimantData[field] || claimantData[field].trim() === '') {
                errors.push(`${field} is required`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    static validateLandArea(areaInHectares) {
        const maxArea = 4.0; // 4 hectare limit as per Section 4(6)

        if (!areaInHectares || isNaN(parseFloat(areaInHectares))) {
            return { valid: false, message: 'Area must be a valid number' };
        }

        const area = parseFloat(areaInHectares);

        if (area <= 0) {
            return { valid: false, message: 'Area must be greater than 0' };
        }

        if (area > maxArea) {
            return {
                valid: false,
                message: `Area cannot exceed ${maxArea} hectares as per Section 4(6) of FRA`,
                exceedsLimit: true
            };
        }

        return { valid: true, message: `Area within permissible limit of ${maxArea} hectares` };
    }

    static checkForPostCutoffEncroachment(evidenceList, occupationDates) {
        const flaggedItems = [];

        // Check if any evidence suggests occupation after cutoff date
        occupationDates.forEach(date => {
            const validation = this.validateOccupationDate(date);
            if (!validation.valid && validation.requiresManualReview) {
                flaggedItems.push({
                    type: 'date',
                    issue: validation.message,
                    requiresReview: true
                });
            }
        });

        // Check for suspicious evidence patterns
        const suspiciousPatterns = [
            'recent construction',
            'new settlement',
            '2006', '2007', '2008', '2009', '2010' // Years after cutoff
        ];

        evidenceList.forEach(evidence => {
            const evidenceText = evidence.toLowerCase();
            suspiciousPatterns.forEach(pattern => {
                if (evidenceText.includes(pattern)) {
                    flaggedItems.push({
                        type: 'evidence',
                        item: evidence,
                        issue: `Contains suspicious pattern: ${pattern}`,
                        requiresReview: true
                    });
                }
            });
        });

        return {
            flagged: flaggedItems.length > 0,
            items: flaggedItems,
            requiresManualReview: flaggedItems.some(item => item.requiresReview)
        };
    }

    static generateValidationReport(claimData) {
        const report = {
            overall: { valid: true, errors: [], warnings: [] },
            eligibility: null,
            evidence: null,
            dates: null,
            area: null
        };

        // Validate eligibility
        report.eligibility = this.validateClaimantEligibility(claimData);
        if (!report.eligibility.valid) {
            report.overall.valid = false;
            report.overall.errors.push(...report.eligibility.errors);
        }

        // Validate evidence
        if (claimData.evidenceList) {
            report.evidence = this.validateTwoEvidenceRule(claimData.evidenceList);
            if (!report.evidence.valid) {
                report.overall.valid = false;
                report.overall.errors.push(report.evidence.message);
            }
        }

        // Validate dates
        if (claimData.occupationDates && claimData.occupationDates.length > 0) {
            const dateValidations = claimData.occupationDates.map(date =>
                this.validateOccupationDate(date)
            );

            report.dates = {
                validDates: dateValidations.filter(v => v.valid).length,
                invalidDates: dateValidations.filter(v => !v.valid).length,
                details: dateValidations
            };

            const invalidDates = dateValidations.filter(v => !v.valid);
            if (invalidDates.length > 0) {
                report.overall.warnings.push(...invalidDates.map(v => v.message));
            }
        }

        // Validate area
        if (claimData.area) {
            report.area = this.validateLandArea(claimData.area);
            if (!report.area.valid) {
                if (report.area.exceedsLimit) {
                    report.overall.errors.push(report.area.message);
                    report.overall.valid = false;
                } else {
                    report.overall.warnings.push(report.area.message);
                }
            }
        }

        return report;
    }
}