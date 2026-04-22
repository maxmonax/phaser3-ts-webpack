const GW = 2400;
const GH = 1080;
const GW_SAFE = 1440;
const GH_SAFE = 1080;

export const Config = {
  // 20:9
  GW,
  GH,
  GW_HALF: GW / 2,
  GH_HALF: GH / 2,
  GW_SAFE,
  GH_SAFE,

  ORIENTATION: {
    check: true,
    inLandscape: true,
    ar: GW_SAFE / GH_SAFE,
  },

  PRELOADER: {
    BAR: true,
    TAP_TO_START: true,
    DRAW_DEBUG_BORDER: false,
  },
} as const;
