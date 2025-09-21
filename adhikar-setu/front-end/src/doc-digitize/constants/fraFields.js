// constants/fraFields.js

export const FRA_FORM_TYPES = {
    FORM_A: 'FORM_A',
    FORM_B: 'FORM_B',
    FORM_C: 'FORM_C'
};

export const CLAIM_STATUS = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    VERIFIED: 'VERIFIED',
    HEARING: 'HEARING',
    FINAL: 'FINAL',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
};

export const CLAIMANT_TYPES = {
    FDST: 'Forest Dwelling Scheduled Tribes',
    OTFD: 'Other Traditional Forest Dwellers'
};

export const FORM_A_FIELDS = [
    { key: 'claimantName', label: 'Name of Claimant(s)', required: true },
    { key: 'spouseName', label: 'Name of Spouse', required: false },
    { key: 'fatherMotherName', label: 'Name of Father/Mother', required: true },
    { key: 'address', label: 'Address', required: true },
    { key: 'village', label: 'Village', required: true },
    { key: 'gramPanchayat', label: 'Gram Panchayat', required: true },
    { key: 'tehsil', label: 'Tehsil/Taluka', required: true },
    { key: 'district', label: 'District', required: true },
    { key: 'isScheduledTribe', label: 'Scheduled Tribe (Yes/No)', required: true },
    { key: 'isOTFD', label: 'Other Traditional Forest Dweller (Yes/No)', required: true },
    { key: 'familyMembers', label: 'Family Members with Age', required: false },
    { key: 'extentForHabitation', label: 'Extent of Forest Land for Habitation', required: false },
    { key: 'extentForCultivation', label: 'Extent of Forest Land for Self-Cultivation', required: false },
    { key: 'disputedLands', label: 'Disputed Lands', required: false },
    { key: 'pattasLeases', label: 'Pattas/Leases/Grants', required: false },
    { key: 'rehabilitationLand', label: 'Land for In-Situ Rehabilitation', required: false },
    { key: 'displacedLand', label: 'Land from where Displaced', required: false },
    { key: 'forestVillageLand', label: 'Extent of Land in Forest Villages', required: false },
    { key: 'otherRights', label: 'Any Other Traditional Right', required: false },
    { key: 'evidence', label: 'Evidence in Support', required: true },
    { key: 'additionalInfo', label: 'Any Other Information', required: false }
];

export const FORM_B_FIELDS = [
    { key: 'claimantCommunity', label: 'Name of Claimant Community', required: true },
    { key: 'isFDSTCommunity', label: 'FDST Community (Yes/No)', required: true },
    { key: 'isOTFDCommunity', label: 'OTFD Community (Yes/No)', required: true },
    { key: 'village', label: 'Village', required: true },
    { key: 'gramPanchayat', label: 'Gram Panchayat', required: true },
    { key: 'tehsil', label: 'Tehsil/Taluka', required: true },
    { key: 'district', label: 'District', required: true },
    { key: 'nistariRights', label: 'Community Rights such as Nistar', required: false },
    { key: 'mfpRights', label: 'Rights over Minor Forest Produce', required: false },
    { key: 'fishWaterRights', label: 'Uses/Entitlements (Fish, Water Bodies)', required: false },
    { key: 'grazingRights', label: 'Grazing Rights', required: false },
    { key: 'nomadPastoralistRights', label: 'Traditional Resource Access for Nomadic/Pastoralist', required: false },
    { key: 'habitatRights', label: 'Community Tenures of Habitat for PTGs', required: false },
    { key: 'biodiversityRights', label: 'Right to Access Biodiversity/IP/Traditional Knowledge', required: false },
    { key: 'otherTraditionalRights', label: 'Other Traditional Rights', required: false },
    { key: 'evidence', label: 'Evidence in Support', required: true },
    { key: 'additionalInfo', label: 'Any Other Information', required: false }
];

export const FORM_C_FIELDS = [
    { key: 'village', label: 'Village/Gram Sabha', required: true },
    { key: 'gramPanchayat', label: 'Gram Panchayat', required: true },
    { key: 'tehsil', label: 'Tehsil/Taluka', required: true },
    { key: 'district', label: 'District', required: true },
    { key: 'gramSabhaMembers', label: 'Names of Gram Sabha Members', required: true },
    { key: 'khasraNumbers', label: 'Khasra/Compartment Numbers', required: false },
    { key: 'borderingVillages', label: 'Bordering Villages', required: false },
    { key: 'evidence', label: 'List of Evidence in Support', required: true }
];

export const RULE_13_EVIDENCE_TYPES = {
    PUBLIC_DOCUMENTS: 'Public Documents & Government Records',
    GOVT_AUTHORIZED: 'Government Authorized Documents',
    PHYSICAL_ATTRIBUTES: 'Physical Attributes',
    JUDICIAL_RECORDS: 'Quasi-judicial and Judicial Records',
    RESEARCH_STUDIES: 'Research Studies & Documentation',
    HISTORICAL_RECORDS: 'Historical Records from Princely States',
    TRADITIONAL_STRUCTURES: 'Traditional Structures',
    GENEALOGY: 'Genealogy Records',
    ELDER_STATEMENTS: 'Statements of Elders'
};

export const IDENTITY_DOCUMENTS = [
    'Voter Identity Card',
    'Aadhaar Card',
    'Ration Card',
    'Passport',
    'Domicile Certificate',
    'House Tax Receipts'
];

export const CUTOFF_DATE = new Date('2005-12-13');
export const ACT_COMMENCEMENT_DATE = new Date('2008-01-01');