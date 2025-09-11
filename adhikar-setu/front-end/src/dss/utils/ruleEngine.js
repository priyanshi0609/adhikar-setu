// src/utils/ruleEngine.js

/**
 * checkEligibility(scheme, beneficiary)
 * - scheme: object from ruleset.json (should include scheme.rule)
 * - beneficiary: object from beneficiaries.json
 *
 * Returns:
 * { id, name, eligible, reasons: [], notes: [], benefit }
 */

export function checkEligibility(scheme, beneficiary) {
  const rule = scheme.rule || {};
  const result = {
    id: scheme.id || scheme.name,
    name: scheme.name || scheme.id,
    eligible: true,
    reasons: [], // why NOT eligible
    notes: [],   // helpful notes (e.g., extra days, minor info)
    benefit: scheme.benefits || null,
  };

  // Helper: mark not eligible
  const fail = (msg) => {
    result.eligible = false;
    result.reasons.push(msg);
  };

  // 1) landSizeMax
  if (rule.landSizeMax !== undefined) {
    const v = beneficiary.landSize;
    if (v === undefined || v === null) {
      fail("Land size missing");
    } else if (Number(v) > Number(rule.landSizeMax)) {
      fail(`Land size (${v} ha) > allowed max ${rule.landSizeMax} ha`);
    }
  }

  // 2) requiresFRA
  if (rule.requiresFRA) {
    if (!beneficiary.hasFRA) fail("FRA Patta not present");
  }

  // 3) requiresJobCard
  if (rule.requiresJobCard) {
    if (!beneficiary.hasJobCard) fail("Job card missing");
  }

  // 4) extraDaysIfFRA (MGNREGA note - not an eligibility block)
  if (rule.extraDaysIfFRA) {
    if (beneficiary.hasFRA) result.notes.push("Eligible for 150 days under MGNREGA (FRA holder)");
    else result.notes.push("Eligible for 100 days under MGNREGA");
  }

  // 5) requiresNoHouse (PMAY) - beneficiary.houseStatus expected string like 'pucca'/'kutcha'/'semi'
  if (rule.requiresNoHouse) {
    const hs = (beneficiary.houseStatus || "").toString().toLowerCase();
    if (hs === "pucca") fail("House already pucca");
    // consider 'semi' or 'kutcha' as eligible
  }

  // 6) requiresCommunityFRA
  if (rule.requiresCommunityFRA) {
    if (!beneficiary.hasCommunityFRA) fail("Community FRA patta not present for the village");
  }

  // 7) requiresWaterSurvey -> interpret as village-level tap coverage check:
  //   treat as: eligible when hasTapWater === false (i.e., village lacks household tap)
  if (rule.requiresWaterSurvey) {
    // If beneficiary.hasTapWater is boolean: false -> eligible, true -> not eligible
    if (beneficiary.hasTapWater === undefined) {
      // unknown - warn but do not auto-fail; better to require survey
      result.notes.push("Village water coverage unknown — run survey");
      // You may choose to fail instead: fail("Tap water coverage unknown")
    } else if (beneficiary.hasTapWater === true) {
      fail("Household already has tap water connection");
    } else {
      // hasTapWater === false -> eligible for JJM; no action
    }
  }

  // 8) minPopulation
  if (rule.minPopulation !== undefined) {
    const p = Number(beneficiary.population || 0);
    if (p < Number(rule.minPopulation)) {
      fail(`Village population ${p} < required ${rule.minPopulation}`);
    }
  }

  // 9) minSTPercent
  if (rule.minSTPercent !== undefined) {
    const sp = Number(beneficiary.stPercent || 0);
    if (sp < Number(rule.minSTPercent)) {
      fail(`ST % (${sp}%) < required ${rule.minSTPercent}%`);
    }
  }

  // 10) requiresBelowPovertyLine
  if (rule.requiresBelowPovertyLine) {
    if (!beneficiary.isBPL) fail("Household not BPL / SECC-deprived");
  }

  // 11) generic boolean rules mapping (for any adhoc keys)
  // e.g., you might have rule keys like "requiresX": true. We handled most common ones above.
  // If a rule key remains and is boolean, try to evaluate generically:
  Object.keys(rule).forEach((rk) => {
    if (
      [
        "landSizeMax",
        "requiresFRA",
        "requiresJobCard",
        "extraDaysIfFRA",
        "requiresNoHouse",
        "requiresCommunityFRA",
        "requiresWaterSurvey",
        "minPopulation",
        "minSTPercent",
        "requiresBelowPovertyLine",
      ].includes(rk)
    ) {
      // already processed
      return;
    }

    // generic handling: if rule[rk] === true, check beneficiary[rk] truthiness
    if (rule[rk] === true) {
      const val = beneficiary[rk];
      if (!val) {
        // create a readable message (convert camelCase -> words)
        const pretty = rk.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
        fail(`${pretty} required but not present`);
      }
    }

    // numeric comparisons if provided as object like { min: 50 }
    const rVal = rule[rk];
    if (typeof rVal === "object" && rVal !== null) {
      if (rVal.min !== undefined) {
        const val = Number(beneficiary[rk] || 0);
        if (val < Number(rVal.min)) fail(`${rk} (${val}) < required min ${rVal.min}`);
      }
      if (rVal.max !== undefined) {
        const val = Number(beneficiary[rk] || 0);
        if (val > Number(rVal.max)) fail(`${rk} (${val}) > allowed max ${rVal.max}`);
      }
    }
  });

  return result;
}

/**
 * Convenience: evaluate all schemes against a beneficiary
 */
export function evaluateAll(schemes, beneficiary) {
  return schemes.map((s) => checkEligibility(s, beneficiary));
}
