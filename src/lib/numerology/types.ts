export type ReportType = "adult" | "child" | "adolescent";

export type PersonInput = {
  fullName: string;
  preferredName?: string;
  dateOfBirth: string; // DD/MM/YYYY
  gender?: string;
  purpose?: string;
  /** Later names from profile; natal spelling stays `fullName`. */
  nameHistory?: unknown;
};

export type NumberMeaning = {
  number: number | string;
  meaning: string;
};

export type NumerologySnapshot = {
  life_path: string;
  birth_day: string;
  expression_number: string;
  soul_urge_number: string;
  personality_number: string;
  maturity_number: string;
  chaldean_name_number: string;
  compound_number: string;
  vedic_psychic: string;
  vedic_destiny: string;
  vedic_name: string;
  /** Compound before reduction for Chaldean-aligned Vedic name */
  vedic_name_compound?: string;
  /** Unit System name number (dual with vedic_name) */
  unit_name?: string;
  unit_name_compound?: string;
  personal_year: string;
  personal_month: string;
  /** Pythagorean Personal Day as of report generation (views recompute). */
  personal_day?: string;
  balance_number?: string;
  hidden_passion?: string;
  /** Johari projected year digit for the current birthday cycle */
  projected_year?: string;
  projected_year_calendar?: string;
  /** Tropical sun sign id (aries…pisces), from DOB month/day */
  sun_sign?: string;
  sun_sign_label?: string;
  /** Current legal / in-force spelling when name history exists */
  operating_name?: string;
  /** Birth-certificate spelling when it differs from operating */
  natal_name?: string;
  name_era_label?: string;
  /** Current-name Expression (Minor Expression when it differs from natal). */
  minor_expression_number?: string;
  attitude_number?: string;
  subconscious_self?: string;
  natal_expression_number?: string;
  natal_soul_urge_number?: string;
  natal_personality_number?: string;
  natal_maturity_number?: string;
  natal_vedic_name?: string;
  natal_vedic_name_compound?: string;
  natal_chaldean_name_number?: string;
  natal_unit_name?: string;
  given_vedic_name?: string;
  natal_given_vedic_name?: string;
};

export type GrowthOrigin =
  | "lo-shu-missing"
  | "lo-shu-engine"
  | "life-path"
  | "expression"
  | "vedic"
  | "chaldean"
  | "name"
  | "bank";

export type LoShuResult = {
  present_numbers: number[];
  missing_numbers: number[];
  repeated_numbers: { number: number; count: number }[];
  mental_plane: string;
  emotional_plane: string;
  practical_plane: string;
  present_arrows: string[];
  missing_arrows: string[];
  analysis: string;
  grid: Record<number, number>;
  /** Birth number / Psychic (Moolank) placed into the grid. */
  birth_number?: number;
  /** Destiny number (Bhagyank) placed into the grid. */
  destiny_number?: number;
};

export type NumerologyReport = {
  person: {
    full_name: string;
    preferred_name: string;
    date_of_birth: string;
    age: number;
    report_type: ReportType;
    gender: string;
    purpose: string;
    operating_name?: string;
    name_era_label?: string;
  };
  numerology_snapshot: NumerologySnapshot;
  pythagorean: {
    life_path: NumberMeaning;
    birth_day: NumberMeaning;
    expression: NumberMeaning;
    soul_urge: NumberMeaning;
    personality: NumberMeaning;
    maturity: NumberMeaning;
    ruling_planets: {
      life_path: string;
      birth_day: string;
      expression: string;
    };
  };
  chaldean: {
    name_number: string;
    compound_number: string;
    reduced_number: string;
    analysis: string;
  };
  vedic: {
    psychic_number: NumberMeaning;
    destiny_number: NumberMeaning;
    name_number: NumberMeaning;
    unit_name_number?: NumberMeaning;
    unit_name_compound?: string;
    ruling_planet: string;
    destiny_ruling_planet: string;
    analysis: string;
    unitSystem?: {
      birth_day_note: string;
      birth_day_exalted: boolean;
      temperament_summary: string;
      doshas: string[];
      harmony_label: string;
      harmony_detail: string;
      harmony_tone: string;
      psychic_ease: string;
      destiny_ease: string;
      psychic_note: string;
      destiny_note: string;
      zero_note: string | null;
      compat_note: string;
    };
  };
  lo_shu: LoShuResult;
  personality: {
    core_personality: string;
    communication_style: string;
    relationship_style: string;
    career_style: string;
  };
  career_suggestions: {
    professions: string[];
    disclaimer: string;
  };
  compatibility: {
    /** @deprecated use pythagorean.raw_number — kept for older saved reports */
    life_path?: string;
    /** @deprecated use pythagorean.matrix */
    matrix?: {
      partnerLifePath: number;
      romantic: string;
      business: string;
      friendship: string;
    }[];
    disclaimer: string;
    pythagorean: {
      raw_number: string;
      matrix: {
        partnerLifePath: number;
        romantic: string;
        business: string;
        friendship: string;
      }[];
    };
    vedic: {
      moolank: {
        raw_number: string;
        matrix: {
          partnerLifePath: number;
          romantic: string;
          business: string;
          friendship: string;
        }[];
      };
      bhagyank: {
        raw_number: string;
        matrix: {
          partnerLifePath: number;
          romantic: string;
          business: string;
          friendship: string;
        }[];
      };
      namank: {
        raw_number: string;
        matrix: {
          partnerLifePath: number;
          romantic: string;
          business: string;
          friendship: string;
        }[];
      };
      /** @deprecated older saved reports — Destiny-only snapshot */
      raw_number?: string;
      /** @deprecated older saved reports */
      matrix?: {
        partnerLifePath: number;
        romantic: string;
        business: string;
        friendship: string;
      }[];
    };
  };
  strengths: string[];
  growth_opportunities: string[];
  /** Multi-chart synthesis cards for visual “areas to work on” */
  growth_areas?: {
    id: string;
    title: string;
    suggestion: string;
    sources: string[];
    actions?: string[];
    focusNumber?: number;
    origin?: GrowthOrigin;
    whyLine?: string;
    examples?: string[];
    reflectPrompt?: string;
  }[];
  age_guidance: {
    category: string;
    guidance: string;
  };
  personal_year: {
    number: string;
    theme: string;
    advice: string;
    nature?: string;
    land?: string;
    range_label?: string;
    pinnacle?: string;
    karmic?: string;
    resonance?: string;
    moment_note?: string;
  };
  /** Karmic debt totals 13/14/16/19 found in date and name positions. */
  karmic_debt?: {
    intro: string;
    none_note: string;
    name_note: string;
    items: {
      label: string;
      code: number;
      reduced: number;
      shows_up_as: string;
      work_on: string;
      fixed: boolean;
      positions: {
        source: string;
        label: string;
        meaning: string;
        spelling?: string;
        fixed: boolean;
      }[];
    }[];
  };
  projected_year?: {
    number: string;
    calendar_year: string;
    range_label?: string;
    planet: string;
    theme: string;
    advice: string;
    method_note: string;
  };
  personal_month: {
    number: string;
    theme: string;
    advice: string;
  };
  monthly_guidance: {
    career: string;
    relationships: string;
    finances: string;
    learning: string;
    wellbeing: string;
    focus_areas: string[];
    avoid: string[];
  };
  recommendations: string[];
  sections: ReportSection[];
  disclaimer: string;
  /** Extra legal/safety notices shown prominently in the UI */
  safety_notices: string[];
  recommendations_disclaimer: string;
};

export type ReportSection = {
  id: string;
  title: string;
  body: string;
};
