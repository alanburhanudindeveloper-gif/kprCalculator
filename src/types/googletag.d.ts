// TypeScript definitions for Google Publisher Tag (GPT) Web Rewarded Ads
export interface GptRewardedPayload {
  amount: number;
  type: string;
}

export interface GptRewardedSlotReadyEvent {
  slot: unknown;
  makeRewardedVisible: () => void;
}

export interface GptRewardedSlotGrantedEvent {
  slot: unknown;
  payload: GptRewardedPayload | null;
}

export interface GptSlotRenderEndedEvent {
  slot: unknown;
  isEmpty: boolean;
  size: number[] | string | null;
}

export interface GptSlot {
  addService: (service: unknown) => GptSlot;
  setTargeting: (key: string, value: string | string[]) => GptSlot;
}

export interface GptPubAdsService {
  addEventListener: {
    (eventType: 'rewardedSlotReady', listener: (event: GptRewardedSlotReadyEvent) => void): GptPubAdsService;
    (eventType: 'rewardedSlotGranted', listener: (event: GptRewardedSlotGrantedEvent) => void): GptPubAdsService;
    (eventType: 'rewardedSlotClosed', listener: (event: { slot: unknown }) => void): GptPubAdsService;
    (eventType: 'slotRenderEnded', listener: (event: GptSlotRenderEndedEvent) => void): GptPubAdsService;
    (eventType: string, listener: (event: unknown) => void): GptPubAdsService;
  };
  removeEventListener: (eventType: string, listener: unknown) => GptPubAdsService;
}

export interface Googletag {
  cmd: Array<() => void>;
  defineOutOfPageSlot: (adUnitPath: string, format: unknown) => GptSlot | null;
  enums: {
    OutOfPageFormat: {
      REWARDED: unknown;
    };
  };
  pubads: () => GptPubAdsService;
  enableServices: () => void;
  display: (slotOrId: unknown) => void;
  destroySlots: (slots?: unknown[]) => boolean;
}

declare global {
  interface Window {
    googletag?: Googletag;
  }
}
