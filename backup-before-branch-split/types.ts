
export enum AppStage {
  HERO = 'HERO',
  JOURNEY = 'JOURNEY',
  AUDIO = 'AUDIO',
  DESCENT = 'DESCENT'
}

export interface JourneyStop {
  title: string;
  description: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}
