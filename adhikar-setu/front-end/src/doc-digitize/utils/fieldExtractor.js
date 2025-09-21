// utils/fieldExtractor.js
import { FORM_A_FIELDS, FORM_B_FIELDS, FORM_C_FIELDS, FRA_FORM_TYPES } from '../constants/fraFields.js';

export class FieldExtractor {

    static detectFormType(ocrText) {
        const text = ocrText.toLowerCase();

        if (text.includes('form a') || text.includes('claim form for rights to forest land')) {
            return FRA_FORM_TYPES.FORM_A;
        } else if (text.includes('form b') || text.includes('claim form for community rights')) {
            return FRA_FORM_TYPES.FORM_B;
        } else if (text.includes('form c') || text.includes('claim form for rights to community forest resource')) {
            return FRA_FORM_TYPES.FORM_C;
        }

        // Fallback detection based on content patterns
        if (text.includes('extent of forest land') && text.includes('self-cultivation')) {
            return FRA_FORM_TYPES.FORM_A;
        } else if (text.includes('community rights') && text.includes('nistar')) {
            return FRA_FORM_TYPES.FORM_B;
        } else if (text.includes('gram sabha') && text.includes('community forest resource')) {
            return FRA_FORM_TYPES.FORM_C;
        }

        return FRA_FORM_TYPES.FORM_A; // Default to Form A
    }

    static extractFieldsFromOCR(ocrText, formType) {
        const extractedFields = {};
        const text = ocrText.toLowerCase();
        const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let fieldsTemplate;
        switch (formType) {
            case FRA_FORM_TYPES.FORM_A:
                fieldsTemplate = FORM_A_FIELDS;
                break;
            case FRA_FORM_TYPES.FORM_B:
                fieldsTemplate = FORM_B_FIELDS;
                break;
            case FRA_FORM_TYPES.FORM_C:
                fieldsTemplate = FORM_C_FIELDS;
                break;
            default:
                fieldsTemplate = FORM_A_FIELDS;
        }

        // Initialize all fields as empty
        fieldsTemplate.forEach(field => {
            extractedFields[field.key] = '';
        });

        // Extract common fields
        this.extractCommonFields(lines, extractedFields);

        // Extract form-specific fields
        switch (formType) {
            case FRA_FORM_TYPES.FORM_A:
                this.extractFormAFields(lines, extractedFields);
                break;
            case FRA_FORM_TYPES.FORM_B:
                this.extractFormBFields(lines, extractedFields);
                break;
            case FRA_FORM_TYPES.FORM_C:
                this.extractFormCFields(lines, extractedFields);
                break;
        }

        return extractedFields;
    }

    static extractCommonFields(lines, extractedFields) {
        const commonPatterns = {
            claimantName: [
                /(?:name of (?:the )?claimant|claimant name|नाम)[\s:]*(.+)/i,
                /(?:1\.?\s*name)[\s:]*(.+)/i
            ],
            spouseName: [
                /(?:name of (?:the )?spouse|spouse name|पति\/पत्नी)[\s:]*(.+)/i,
                /(?:2\.?\s*name of spouse)[\s:]*(.+)/i
            ],
            fatherMotherName: [
                /(?:name of father\/mother|father\/mother|पिता\/माता)[\s:]*(.+)/i,
                /(?:3\.?\s*name of father)[\s:]*(.+)/i
            ],
            address: [
                /(?:address|पता)[\s:]*(.+)/i,
                /(?:4\.?\s*address)[\s:]*(.+)/i
            ],
            village: [
                /(?:village|गांव|ग्राम)[\s:]*(.+)/i,
                /(?:5\.?\s*village)[\s:]*(.+)/i
            ],
            gramPanchayat: [
                /(?:gram panchayat|ग्राम पंचायत)[\s:]*(.+)/i,
                /(?:6\.?\s*gram panchayat)[\s:]*(.+)/i
            ],
            tehsil: [
                /(?:tehsil|taluka|तहसील)[\s:]*(.+)/i,
                /(?:7\.?\s*tehsil)[\s:]*(.+)/i
            ],
            district: [
                /(?:district|जिला)[\s:]*(.+)/i,
                /(?:8\.?\s*district)[\s:]*(.+)/i
            ],
            isScheduledTribe: [
                /(?:scheduled tribe|अनुसूचित जनजाति)[\s:]*(.+)/i,
                /(?:9\.?\s*\(?a\)?\s*scheduled tribe)[\s:]*(.+)/i
            ],
            isOTFD: [
                /(?:other traditional forest dweller|otfd)[\s:]*(.+)/i,
                /(?:9\.?\s*\(?b\)?\s*other traditional)[\s:]*(.+)/i
            ]
        };

        lines.forEach(line => {
            Object.entries(commonPatterns).forEach(([fieldKey, patterns]) => {
                if (!extractedFields[fieldKey]) {
                    patterns.forEach(pattern => {
                        const match = line.match(pattern);
                        if (match && match[1] && match[1].trim().length > 0) {
                            extractedFields[fieldKey] = match[1].trim();
                        }
                    });
                }
            });
        });
    }

    static extractFormAFields(lines, extractedFields) {
        const formAPatterns = {
            familyMembers: [
                /(?:family members|members in the family)[\s:]*(.+)/i,
                /(?:10\.?\s*name of other members)[\s:]*(.+)/i
            ],
            extentForHabitation: [
                /(?:extent.*habitation|for habitation)[\s:]*([0-9.]+)/i,
                /(?:1\.?\s*\(?a\)?\s*for habitation)[\s:]*([0-9.]+)/i
            ],
            extentForCultivation: [
                /(?:extent.*cultivation|self.cultivation)[\s:]*([0-9.]+)/i,
                /(?:1\.?\s*\(?b\)?\s*for self.cultivation)[\s:]*([0-9.]+)/i
            ],
            disputedLands: [
                /(?:disputed lands?)[\s:]*(.+)/i,
                /(?:2\.?\s*disputed lands)[\s:]*(.+)/i
            ],
            pattasLeases: [
                /(?:pattas?\/leases?\/grants?)[\s:]*(.+)/i,
                /(?:3\.?\s*pattas)[\s:]*(.+)/i
            ],
            evidence: [
                /(?:evidence in support|evidence)[\s:]*(.+)/i,
                /(?:8\.?\s*evidence)[\s:]*(.+)/i
            ]
        };

        lines.forEach(line => {
            Object.entries(formAPatterns).forEach(([fieldKey, patterns]) => {
                if (!extractedFields[fieldKey]) {
                    patterns.forEach(pattern => {
                        const match = line.match(pattern);
                        if (match && match[1] && match[1].trim().length > 0) {
                            extractedFields[fieldKey] = match[1].trim();
                        }
                    });
                }
            });
        });
    }

    static extractFormBFields(lines, extractedFields) {
        const formBPatterns = {
            claimantCommunity: [
                /(?:name of.*claimant.*community)[\s:]*(.+)/i,
                /(?:1\.?\s*name of.*claimant)[\s:]*(.+)/i
            ],
            isFDSTCommunity: [
                /(?:fdst community|forest dwelling)[\s:]*(.+)/i,
                /(?:1\.?\s*\(?a\)?\s*fdst)[\s:]*(.+)/i
            ],
            isOTFDCommunity: [
                /(?:otfd community)[\s:]*(.+)/i,
                /(?:1\.?\s*\(?b\)?\s*otfd)[\s:]*(.+)/i
            ],
            nistariRights: [
                /(?:nistar|community rights)[\s:]*(.+)/i,
                /(?:1\.?\s*community rights.*nistar)[\s:]*(.+)/i
            ],
            mfpRights: [
                /(?:minor forest produce|mfp)[\s:]*(.+)/i,
                /(?:2\.?\s*rights over minor)[\s:]*(.+)/i
            ]
        };

        lines.forEach(line => {
            Object.entries(formBPatterns).forEach(([fieldKey, patterns]) => {
                if (!extractedFields[fieldKey]) {
                    patterns.forEach(pattern => {
                        const match = line.match(pattern);
                        if (match && match[1] && match[1].trim().length > 0) {
                            extractedFields[fieldKey] = match[1].trim();
                        }
                    });
                }
            });
        });
    }

    static extractFormCFields(lines, extractedFields) {
        const formCPatterns = {
            gramSabhaMembers: [
                /(?:members of.*gram sabha)[\s:]*(.+)/i,
                /(?:5\.?\s*name.*members)[\s:]*(.+)/i
            ],
            khasraNumbers: [
                /(?:khasra|compartment)[\s:]*(.+)/i,
                /(?:6\.?\s*khasra)[\s:]*(.+)/i
            ],
            borderingVillages: [
                /(?:bordering villages?)[\s:]*(.+)/i,
                /(?:7\.?\s*bordering)[\s:]*(.+)/i
            ]
        };

        lines.forEach(line => {
            Object.entries(formCPatterns).forEach(([fieldKey, patterns]) => {
                if (!extractedFields[fieldKey]) {
                    patterns.forEach(pattern => {
                        const match = line.match(pattern);
                        if (match && match[1] && match[1].trim().length > 0) {
                            extractedFields[fieldKey] = match[1].trim();
                        }
                    });
                }
            });
        });
    }

    static validateExtractedFields(fields, formType) {
        const validationErrors = [];
        let requiredFields;

        switch (formType) {
            case FRA_FORM_TYPES.FORM_A:
                requiredFields = FORM_A_FIELDS.filter(field => field.required);
                break;
            case FRA_FORM_TYPES.FORM_B:
                requiredFields = FORM_B_FIELDS.filter(field => field.required);
                break;
            case FRA_FORM_TYPES.FORM_C:
                requiredFields = FORM_C_FIELDS.filter(field => field.required);
                break;
            default:
                requiredFields = [];
        }

        requiredFields.forEach(field => {
            if (!fields[field.key] || fields[field.key].trim() === '') {
                validationErrors.push(`${field.label} is required but not found`);
            }
        });

        return {
            isValid: validationErrors.length === 0,
            errors: validationErrors
        };
    }
}