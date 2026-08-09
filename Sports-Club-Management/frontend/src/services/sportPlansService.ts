export interface SportPlan {
  sport: string;
  monthlyPrice: number;
  halfYearPrice: number;
  description: string;
}

const STORAGE_KEY = 'sc_sport_plans';

const DEFAULT_PLANS: Record<string, SportPlan> = {
  Football: {
    sport: 'Football',
    monthlyPrice: 899,
    halfYearPrice: 4499,
    description: 'Includes main pitch access, team kit allocation, and weekly practice matches.',
  },
  Cricket: {
    sport: 'Cricket',
    monthlyPrice: 999,
    halfYearPrice: 4999,
    description: 'Includes nets practice, match gear reservation, and weekend bowling clinics.',
  },
  Tennis: {
    sport: 'Tennis',
    monthlyPrice: 1099,
    halfYearPrice: 5499,
    description: 'Includes court reservations, racket rentals, and specialized coaching sessions.',
  },
  Swimming: {
    sport: 'Swimming',
    monthlyPrice: 999,
    halfYearPrice: 4999,
    description: 'Includes Olympic pool lane access, endurance coaching, and locker facilities.',
  },
  Badminton: {
    sport: 'Badminton',
    monthlyPrice: 799,
    halfYearPrice: 3999,
    description: 'Includes indoor synthetic court access, shuttlecocks, and league tournament entry.',
  },
  Basketball: {
    sport: 'Basketball',
    monthlyPrice: 899,
    halfYearPrice: 4499,
    description: 'Includes indoor hardwood court sessions, ball equipment, and squad training.',
  },
};

export const sportPlansService = {
  getPlans(): Record<string, SportPlan> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PLANS };
      return { ...DEFAULT_PLANS, ...JSON.parse(stored) };
    } catch {
      return { ...DEFAULT_PLANS };
    }
  },

  getPlanList(): SportPlan[] {
    const plans = this.getPlans();
    return Object.values(plans);
  },

  getPlan(sportName: string): SportPlan {
    const plans = this.getPlans();
    return (
      plans[sportName] || {
        sport: sportName,
        monthlyPrice: 799,
        halfYearPrice: 3999,
        description: 'Includes full training facilities and session access.',
      }
    );
  },

  updatePlan(sportName: string, updates: Partial<SportPlan>): Record<string, SportPlan> {
    const current = this.getPlans();
    const existing = current[sportName] || {
      sport: sportName,
      monthlyPrice: 799,
      halfYearPrice: 3999,
      description: 'Includes full training facilities and session access.',
    };

    const updatedPlan: SportPlan = {
      ...existing,
      ...updates,
      sport: sportName,
    };

    current[sportName] = updatedPlan;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('sport_plans_updated'));
    return current;
  },
};

export default sportPlansService;
