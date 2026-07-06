// Season-aware planting guide for Wadsworth / Northeast Ohio (USDA hardiness
// zone 6a). Season is derived from the calendar month so it renders correctly
// at build/prerender time (SSR-safe) and stays accurate year-round — no data
// fetch required. The live weather widget layers on top of this client-side.

export type SeasonKey = "spring" | "summer" | "fall" | "winter";

export interface Plant {
  name: string;
  note: string;
}

export interface SeasonGuide {
  key: SeasonKey;
  label: string;
  window: string;
  headline: string;
  intro: string;
  plants: Plant[];
  tie: string; // how it connects to Randolph's services
}

export const SEASON_GUIDES: Record<SeasonKey, SeasonGuide> = {
  spring: {
    key: "spring",
    label: "Spring",
    window: "March – May",
    headline: "Spring is prime planting season in Northeast Ohio",
    intro:
      "Once the soil warms and the last hard frost passes (usually mid-May around Wadsworth), it's the ideal window to establish perennials, trees, shrubs, and cool-season lawns before summer heat sets in.",
    plants: [
      { name: "Coneflower (Echinacea)", note: "Tough native perennial, pollinator magnet, thrives in zone 6a." },
      { name: "Black-Eyed Susan (Rudbeckia)", note: "Hardy, long-blooming, low-maintenance color." },
      { name: "Cool-season grass seed", note: "Fescue and Kentucky bluegrass establish best in spring's cool, moist soil." },
      { name: "Hydrangea", note: "Plant now for big summer blooms; loves our climate." },
      { name: "Pansies & snapdragons", note: "Cold-hardy annuals for instant early-season color." },
    ],
    tie: "Spring is the busiest window for new landscape beds, fresh sod, and lawn renovation. Book early — the calendar fills fast.",
  },
  summer: {
    key: "summer",
    label: "Summer",
    window: "June – August",
    headline: "Keep your landscape thriving through the heat",
    intro:
      "Summer is about maintaining established plantings and choosing heat-tolerant varieties. New sod and seed struggle in the heat, so summer is the perfect time to plan hardscaping and outdoor living projects that make your yard usable all season.",
    plants: [
      { name: "Russian Sage", note: "Drought-tolerant, silvery blue blooms that shrug off July heat." },
      { name: "Coreopsis", note: "Sun-loving, cheerful, and blooms all summer with little water." },
      { name: "Ornamental grasses", note: "Add movement and texture; virtually maintenance-free once established." },
      { name: "Daylilies", note: "Nearly indestructible color that handles heat and dry spells." },
      { name: "Petunias & marigolds", note: "Reliable annuals for containers and borders in full sun." },
    ],
    tie: "Too hot for new lawns? It's the ideal time to build the patio, fire pit, or retaining wall you'll enjoy this fall.",
  },
  fall: {
    key: "fall",
    label: "Fall",
    window: "September – November",
    headline: "Fall is the best-kept secret for planting",
    intro:
      "Cool air and warm soil make autumn the single best time to plant trees, shrubs, and perennials in Northeast Ohio — roots establish through fall and winter for a head start next spring. It's also the top window to lay sod and overseed tired lawns.",
    plants: [
      { name: "Trees & shrubs", note: "Cool soil means strong root growth before winter dormancy. Best planting window of the year." },
      { name: "Spring bulbs", note: "Tulips, daffodils, and crocus go in now for an early-spring show." },
      { name: "Mums & ornamental kale", note: "Classic fall color that handles the first frosts." },
      { name: "Sod & overseeding", note: "Cool, moist conditions give new turf its best possible start." },
      { name: "Divide perennials", note: "Split and replant hostas, daylilies, and grasses to fill out beds." },
    ],
    tie: "Fall is the smartest time to install new landscaping and lay sod — and to get concrete and hardscaping done before the freeze.",
  },
  winter: {
    key: "winter",
    label: "Winter",
    window: "December – February",
    headline: "Plan now, build now, plant come spring",
    intro:
      "The ground is dormant, but winter is the right time to design next season's landscape and take on hardscaping — patios, walls, and fire pits go in year-round. Booking your spring landscaping now means you're first on the schedule when the ground thaws.",
    plants: [
      { name: "Evergreens (protect)", note: "Shield arborvitae and boxwood from salt spray and drying winter wind." },
      { name: "Winterberry Holly", note: "Bare red berries add rare winter color to Ohio landscapes." },
      { name: "Plan your beds", note: "Winter is for design — map out the perennials and trees you'll plant in spring." },
      { name: "Hardscape projects", note: "Patios, retaining walls, and fire pits can be built through the off-season." },
      { name: "Book spring work", note: "Reserve your spot now; spring landscaping calendars fill by March." },
    ],
    tie: "Winter is design-and-build season. Lock in your spring landscaping and let us handle hardscaping while the yard rests.",
  },
};

// Month-based season — deterministic and prerender-safe.
export function seasonByMonth(date = new Date()): SeasonKey {
  const m = date.getMonth(); // 0-11
  if (m >= 2 && m <= 4) return "spring"; // Mar–May
  if (m >= 5 && m <= 7) return "summer"; // Jun–Aug
  if (m >= 8 && m <= 10) return "fall"; // Sep–Nov
  return "winter"; // Dec–Feb
}

export function currentSeasonGuide(date = new Date()): SeasonGuide {
  return SEASON_GUIDES[seasonByMonth(date)];
}
