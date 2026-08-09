export type ReportType = "adult" | "child" | "adolescent";

export type PersonInput = {
  fullName: string;
  preferredName?: string;
  dateOfBirth: string; // DD/MM/YYYY
  gender?: string;
  purpose?: string;
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
  personal_year: string;
  personal_month: string;
};

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
    ruling_planet: string;
    destiny_ruling_planet: string;
    analysis: string;
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
    life_path: string;
    matrix: {
      partnerLifePath: number;
      romantic: string;
      business: string;
      friendship: string;
    }[];
    disclaimer: string;
  };
  strengths: string[];
  growth_opportunities: string[];
  age_guidance: {
    category: string;
    guidance: string;
  };
  personal_year: {
    number: string;
    theme: string;
    advice: string;
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
