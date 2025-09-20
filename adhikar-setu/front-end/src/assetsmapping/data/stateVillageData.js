// State and Village Data for Asset Mapping
export const stateVillageData = {
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    center: [78.6569, 23.2599],
    zoom: 7,
    districts: ["Bhind", "Satna"],
    villages: {
      "Bhind": ["Bhind", "Lahar", "Mehgaon"],
      "Satna": ["Satna", "Maihar", "Nagod"]
    },
    coordinates: {
      "Bhind": { center: [78.7831, 26.5647], zoom: 10 },
      "Satna": { center: [80.8318, 24.5718], zoom: 10 }
    }
  },
  "Tripura": {
    name: "Tripura",
    center: [91.9882, 23.9408],
    zoom: 8,
    districts: ["Nidaya", "Agartala"],
    villages: {
      "Nidaya": ["Nidaya", "Kailashahar", "Dharmanagar"],
      "Agartala": ["Agartala", "Udaipur", "Sonamura"]
    },
    coordinates: {
      "Nidaya": { center: [92.3372, 24.3259], zoom: 11 },
      "Agartala": { center: [91.2868, 23.8315], zoom: 11 }
    }
  },
  "Odisha": {
    name: "Odisha",
    center: [85.0985, 20.9517],
    zoom: 7,
    districts: ["Jagatsinghpur", "Kalahandi"],
    villages: {
      "Jagatsinghpur": ["Jagatsinghpur", "Paradeep", "Tirtol"],
      "Kalahandi": ["Bhawanipatna", "Dharamgarh", "Junagarh"]
    },
    coordinates: {
      "Jagatsinghpur": { center: [86.1711, 20.2543], zoom: 10 },
      "Kalahandi": { center: [83.1656, 19.9151], zoom: 10 }
    }
  },
  "Telangana": {
    name: "Telangana",
    center: [79.0193, 18.1124],
    zoom: 7,
    districts: ["Narayanpet", "Venkatapur"],
    villages: {
      "Narayanpet": ["Narayanpet", "Makthal", "Utkoor"],
      "Venkatapur": ["Venkatapur", "Asifabad", "Sirpur"]
    },
    coordinates: {
      "Narayanpet": { center: [77.491, 16.7454], zoom: 10 },
      "Venkatapur": { center: [79.5941, 19.2183], zoom: 10 }
    }
  }
};

// Analytics data for each state and village
export const analyticsData = {
  "Madhya Pradesh": {
    "Bhind": {
      totalClaims: 245,
      approvedClaims: 198,
      pendingClaims: 32,
      rejectedClaims: 15,
      totalArea: 1250.5,
      forestCover: 68.2,
      tribalPopulation: 12500,
      literacyRate: 72.3,
      avgProcessingTime: 18,
      successRate: 80.8
    },
    "Satna": {
      totalClaims: 189,
      approvedClaims: 156,
      pendingClaims: 23,
      rejectedClaims: 10,
      totalArea: 980.3,
      forestCover: 71.5,
      tribalPopulation: 9800,
      literacyRate: 75.1,
      avgProcessingTime: 16,
      successRate: 82.5
    }
  },
  "Tripura": {
    "Nidaya": {
      totalClaims: 156,
      approvedClaims: 134,
      pendingClaims: 18,
      rejectedClaims: 4,
      totalArea: 750.2,
      forestCover: 78.9,
      tribalPopulation: 8900,
      literacyRate: 68.7,
      avgProcessingTime: 14,
      successRate: 85.9
    },
    "Agartala": {
      totalClaims: 298,
      approvedClaims: 267,
      pendingClaims: 25,
      rejectedClaims: 6,
      totalArea: 1450.8,
      forestCover: 82.1,
      tribalPopulation: 15200,
      literacyRate: 71.4,
      avgProcessingTime: 12,
      successRate: 89.6
    }
  },
  "Odisha": {
    "Jagatsinghpur": {
      totalClaims: 178,
      approvedClaims: 145,
      pendingClaims: 28,
      rejectedClaims: 5,
      totalArea: 890.4,
      forestCover: 65.3,
      tribalPopulation: 11200,
      literacyRate: 69.8,
      avgProcessingTime: 20,
      successRate: 81.5
    },
    "Kalahandi": {
      totalClaims: 234,
      approvedClaims: 201,
      pendingClaims: 26,
      rejectedClaims: 7,
      totalArea: 1120.7,
      forestCover: 73.8,
      tribalPopulation: 13800,
      literacyRate: 66.2,
      avgProcessingTime: 17,
      successRate: 85.9
    }
  },
  "Telangana": {
    "Narayanpet": {
      totalClaims: 167,
      approvedClaims: 142,
      pendingClaims: 20,
      rejectedClaims: 5,
      totalArea: 820.6,
      forestCover: 69.4,
      tribalPopulation: 10500,
      literacyRate: 74.5,
      avgProcessingTime: 15,
      successRate: 85.0
    },
    "Venkatapur": {
      totalClaims: 201,
      approvedClaims: 178,
      pendingClaims: 19,
      rejectedClaims: 4,
      totalArea: 980.3,
      forestCover: 76.2,
      tribalPopulation: 12800,
      literacyRate: 77.8,
      avgProcessingTime: 13,
      successRate: 88.6
    }
  }
};

// Image mapping for each state and village
export const imageMapping = {
  "Madhya Pradesh": {
    "Bhind": [
      "bhind_forest_1.jpg",
      "bhind_village_1.jpg",
      "bhind_community_1.jpg"
    ],
    "Satna": [
      "satna_forest_1.jpg",
      "satna_village_1.jpg",
      "satna_community_1.jpg"
    ]
  },
  "Tripura": {
    "Nidaya": [
      "nidaya_forest_1.jpg",
      "nidaya_village_1.jpg",
      "nidaya_community_1.jpg"
    ],
    "Agartala": [
      "agartala_forest_1.jpg",
      "agartala_village_1.jpg",
      "agartala_community_1.jpg"
    ]
  },
  "Odisha": {
    "Jagatsinghpur": [
      "jagatsinghpur_forest_1.jpg",
      "jagatsinghpur_village_1.jpg",
      "jagatsinghpur_community_1.jpg"
    ],
    "Kalahandi": [
      "kalahandi_forest_1.jpg",
      "kalahandi_village_1.jpg",
      "kalahandi_community_1.jpg"
    ]
  },
  "Telangana": {
    "Narayanpet": [
      "narayanpet_forest_1.jpg",
      "narayanpet_village_1.jpg",
      "narayanpet_community_1.jpg"
    ],
    "Venkatapur": [
      "venkatapur_forest_1.jpg",
      "venkatapur_village_1.jpg",
      "venkatapur_community_1.jpg"
    ]
  }
};

export default { stateVillageData, analyticsData, imageMapping };
