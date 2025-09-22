// New State and Village Data with Land Use Conditions
export const newStateVillageData = {
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    center: [78.6569, 23.2599],
    zoom: 7,
    districts: {
      Bhind: {
        name: "Bhind",
        center: [78.7831, 26.5647],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 45.2,
            forest: 38.7,
            residential: 12.8,
            waterBodies: 3.3,
          },
          new: {
            agriculture: 52.1,
            forest: 31.4,
            residential: 13.9,
            waterBodies: 2.6,
          },
        },
      },
      Satna: {
        name: "Satna",
        center: [80.8318, 24.5718],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 42.8,
            forest: 41.5,
            residential: 11.2,
            waterBodies: 4.5,
          },
          new: {
            agriculture: 48.3,
            forest: 36.8,
            residential: 12.7,
            waterBodies: 2.2,
          },
        },
      },
    },
  },
  Tripura: {
    name: "Tripura",
    center: [91.9882, 23.9408],
    zoom: 8,
    districts: {
      Nidaya: {
        name: "Nidaya",
        center: [92.3372, 24.3259],
        zoom: 11,
        conditions: {
          old: {
            agriculture: 35.6,
            forest: 52.3,
            residential: 8.9,
            waterBodies: 3.2,
          },
          new: {
            agriculture: 41.2,
            forest: 46.7,
            residential: 10.1,
            waterBodies: 2.0,
          },
        },
      },
      Agartala: {
        name: "Agartala",
        center: [91.2868, 23.8315],
        zoom: 11,
        conditions: {
          old: {
            agriculture: 38.9,
            forest: 48.4,
            residential: 9.8,
            waterBodies: 2.9,
          },
          new: {
            agriculture: 43.7,
            forest: 42.1,
            residential: 12.3,
            waterBodies: 1.9,
          },
        },
      },
    },
  },
  Odisha: {
    name: "Odisha",
    center: [85.0985, 20.9517],
    zoom: 7,
    districts: {
      Jagatsinghpur: {
        name: "Jagatsinghpur",
        center: [86.1711, 20.2543],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 47.3,
            forest: 34.2,
            residential: 10.5,
            waterBodies: 8.0,
          },
          new: {
            agriculture: 53.8,
            forest: 28.9,
            residential: 12.1,
            waterBodies: 5.2,
          },
        },
      },
      Kalahandi: {
        name: "Kalahandi",
        center: [83.1656, 19.9151],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 41.7,
            forest: 43.8,
            residential: 9.2,
            waterBodies: 5.3,
          },
          new: {
            agriculture: 46.9,
            forest: 38.4,
            residential: 11.8,
            waterBodies: 2.9,
          },
        },
      },
    },
  },
  Telangana: {
    name: "Telangana",
    center: [79.0193, 18.1124],
    zoom: 7,
    districts: {
      Narayanpet: {
        name: "Narayanpet",
        center: [77.491, 16.7454],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 49.6,
            forest: 32.1,
            residential: 14.2,
            waterBodies: 4.1,
          },
          new: {
            agriculture: 55.3,
            forest: 26.8,
            residential: 16.1,
            waterBodies: 1.8,
          },
        },
      },
      Venkatapur: {
        name: "Venkatapur",
        center: [79.5941, 19.2183],
        zoom: 10,
        conditions: {
          old: {
            agriculture: 44.8,
            forest: 39.7,
            residential: 12.3,
            waterBodies: 3.2,
          },
          new: {
            agriculture: 51.2,
            forest: 33.9,
            residential: 13.7,
            waterBodies: 1.2,
          },
        },
      },
    },
  },
};

// Helper function to get all states
export const getStates = () => {
  return Object.keys(newStateVillageData);
};

// Helper function to get districts for a state
export const getDistricts = (state) => {
  return newStateVillageData[state]
    ? Object.keys(newStateVillageData[state].districts)
    : [];
};

// Helper function to get condition data for a district
export const getConditionData = (state, district, condition) => {
  return (
    newStateVillageData[state]?.districts[district]?.conditions[condition] ||
    null
  );
};

// Helper function to calculate land use changes
export const calculateLandUseChange = (state, district) => {
  const oldData = getConditionData(state, district, "old");
  const newData = getConditionData(state, district, "new");

  if (!oldData || !newData) return null;

  return {
    agriculture: +(newData.agriculture - oldData.agriculture).toFixed(2),
    forest: +(newData.forest - oldData.forest).toFixed(2),
    residential: +(newData.residential - oldData.residential).toFixed(2),
    waterBodies: +(newData.waterBodies - oldData.waterBodies).toFixed(2),
  };
};

export default newStateVillageData;
