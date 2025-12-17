import express from "express";

const router = express.Router();

// Emission factors (kg CO2e per unit)
const TRANSPORT_FACTORS = {
  car: {
    small: { petrol: 0.171, diesel: 0.174, electric: 0.05, hybrid: 0.12 },
    medium: { petrol: 0.192, diesel: 0.200, electric: 0.06, hybrid: 0.13 },
    large: { petrol: 0.257, diesel: 0.270, electric: 0.08, hybrid: 0.16 },
  },
  motorcycle: { petrol: 0.103, diesel: 0.110, electric: 0.03, hybrid: 0.07 },
  bike: { human: 0 }, // Human powered
};

const HOME_FACTORS = {
  electricityPerKwh: 0.82, // kg CO2e per kWh (adjust per grid intensity)
  lpgPerKg: 3.0, // kg CO2e per kg of LPG
};

// Impact conversion helpers
const IMPACT_FACTORS = {
  treeSequestrationPerYear: 21.77, // kg CO2 absorbed per mature tree per year
  carPerKm: 0.192, // avg medium petrol car kg/km
  flightShortHaulPerKm: 0.15, // kg/km short haul
};

const clampNumber = (value, min = 0, max = 1e9) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, min), max);
};

const round = (value, decimals = 2) => {
  if (Number.isNaN(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const computeTransport = (transport = {}) => {
  const {
    mode = "car",
    subtype = "medium",
    fuel = "petrol",
    distanceKm = 0,
  } = transport;

  const dist = clampNumber(distanceKm);

  if (mode === "bike") {
    return { kgCO2: 0, breakdown: [] };
  }

  if (mode === "motorcycle") {
    const factor = TRANSPORT_FACTORS.motorcycle[fuel] ?? TRANSPORT_FACTORS.motorcycle.petrol;
    const kgCO2 = dist * factor;
    return {
      kgCO2,
      breakdown: [{ label: "Motorcycle", distanceKm: dist, factorKgPerKm: factor, kgCO2 }],
    };
  }

  // Car
  const factor =
    TRANSPORT_FACTORS.car[subtype]?.[fuel] ??
    TRANSPORT_FACTORS.car.medium.petrol;
  const kgCO2 = dist * factor;
  return {
    kgCO2,
    breakdown: [{ label: `Car (${subtype}, ${fuel})`, distanceKm: dist, factorKgPerKm: factor, kgCO2 }],
  };
};

const computeHome = (home = {}) => {
  const { electricityKwh = 0, lpgKg = 0 } = home;
  const kwh = clampNumber(electricityKwh);
  const lpg = clampNumber(lpgKg);

  const electricityKg = kwh * HOME_FACTORS.electricityPerKwh;
  const lpgKgCO2 = lpg * HOME_FACTORS.lpgPerKg;

  return {
    kgCO2: electricityKg + lpgKgCO2,
    breakdown: [
      { label: "Electricity", kwh, factorKgPerKwh: HOME_FACTORS.electricityPerKwh, kgCO2: electricityKg },
      { label: "LPG", kg: lpg, factorKgPerKg: HOME_FACTORS.lpgPerKg, kgCO2: lpgKgCO2 },
    ],
  };
};

const computeImpacts = (totalKg) => {
  const treesNeeded = totalKg / IMPACT_FACTORS.treeSequestrationPerYear;
  const carKmEquivalent = totalKg / IMPACT_FACTORS.carPerKm;
  const flightKmEquivalent = totalKg / IMPACT_FACTORS.flightShortHaulPerKm;

  return {
    treesNeeded: round(treesNeeded, 1),
    carKmEquivalent: round(carKmEquivalent, 0),
    flightKmEquivalent: round(flightKmEquivalent, 0),
  };
};

const buildMessages = (totalKg) => {
  const impacts = computeImpacts(totalKg);

  // Severity tiers for AI-like messaging
  let severity = "low";
  if (totalKg >= 2000) severity = "high";
  else if (totalKg >= 500) severity = "medium";

  const severityMessages = {
    low: {
      main: "Your carbon footprint is below average, but every reduction matters. Together, we can achieve carbon neutrality.",
      impact: "While your individual emissions are modest, scaling sustainable choices globally can transform our planet's future."
    },
    medium: {
      main: "Your carbon footprint is moderate. With targeted changes, you can significantly reduce your environmental impact.",
      impact: "If everyone with your footprint reduced by just 30%, we could offset emissions equivalent to taking millions of cars off the road."
    },
    high: {
      main: "Your carbon footprint is substantially above average. Immediate action is critical for our planet's future.",
      impact: "At this emission level, you're accelerating climate change at a rate that threatens ecosystems, wildlife, and future generations. The time to act is now."
    },
  };

  const eyeOpeners = [
    {
      icon: '🚗',
      label: 'Car Distance Equivalent',
      value: `${impacts.carKmEquivalent.toLocaleString()} km`,
      message: 'Equal to driving this distance in a typical petrol car'
    },
    {
      icon: '🌳',
      label: 'Trees Needed',
      value: `${Math.ceil(impacts.treesNeeded)}`,
      message: 'Mature trees required to absorb this CO₂ annually'
    },
    {
      icon: '✈️',
      label: 'Flight Equivalent',
      value: `${impacts.flightKmEquivalent.toLocaleString()} km`,
      message: 'Same as flying this distance in a short-haul flight'
    }
  ];

  const suggestions = [
    "Partner with us to plant trees that offset your emissions",
    "Support renewable energy projects through our conservation programs",
    "Join our corporate sustainability partnerships for measurable impact",
    "Invest in verified carbon offset programs with transparent tracking",
    "Collaborate on community-led environmental restoration initiatives",
    "Access our consultation services for comprehensive sustainability strategies"
  ];

  return { 
    eyeOpeners, 
    suggestions, 
    severity,
    mainMessage: severityMessages[severity].main,
    impactMessage: severityMessages[severity].impact
  };
};

// Pre-filled scenario presets to mimic AI quick estimates
const PRESETS = {
  transport: [
    { label: "Small petrol car, 15km/day", transport: { mode: "car", subtype: "small", fuel: "petrol", distanceKm: 15 * 365 } },
    { label: "Medium diesel car, 30km/day", transport: { mode: "car", subtype: "medium", fuel: "diesel", distanceKm: 30 * 365 } },
    { label: "Large electric car, 20km/day", transport: { mode: "car", subtype: "large", fuel: "electric", distanceKm: 20 * 365 } },
    { label: "Motorcycle petrol, 10km/day", transport: { mode: "motorcycle", fuel: "petrol", distanceKm: 10 * 365 } },
  ],
  home: [
    { label: "Apartment, low use", home: { electricityKwh: 1500, lpgKg: 0 } },
    { label: "Family home, average", home: { electricityKwh: 3500, lpgKg: 120 } },
    { label: "High usage home", home: { electricityKwh: 6000, lpgKg: 200 } },
  ]
};

// POST /api/carbon/calculate
router.post("/calculate", async (req, res) => {
  try {
    const { transport = {}, home = {} } = req.body || {};

    const transportResult = computeTransport(transport);
    const homeResult = computeHome(home);

    const totalKgCO2 = transportResult.kgCO2 + homeResult.kgCO2;
    const impacts = computeImpacts(totalKgCO2);
    const messages = buildMessages(totalKgCO2);

    res.json({
      inputs: {
        transport,
        home,
      },
      results: {
        totalKgCO2: round(totalKgCO2, 2),
        totalTonCO2: round(totalKgCO2 / 1000, 3),
        components: [
          { category: "transport", kgCO2: round(transportResult.kgCO2, 2), breakdown: transportResult.breakdown },
          { category: "home", kgCO2: round(homeResult.kgCO2, 2), breakdown: homeResult.breakdown },
        ],
      },
      impacts,
      messages: {
        main: messages.mainMessage,
        impact: messages.impactMessage,
        eyeOpeners: messages.eyeOpeners,
        suggestions: messages.suggestions,
        severity: messages.severity,
        callToAction: {
          contact: "/contact",
          donate: "/donate",
          partner: "/partner",
        },
      },
    });
  } catch (err) {
    console.error("Carbon calculation error:", err);
    res.status(500).json({ message: "Failed to calculate carbon footprint" });
  }
});

// GET /api/carbon/factors
router.get("/factors", (_req, res) => {
  res.json({
    transport: TRANSPORT_FACTORS,
    home: HOME_FACTORS,
    impacts: IMPACT_FACTORS,
    presets: PRESETS,
    units: {
      transport: "kg CO2e per km",
      electricity: "kg CO2e per kWh",
      lpg: "kg CO2e per kg",
    },
  });
});

export default router;

