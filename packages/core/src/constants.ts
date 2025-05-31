export const GAME_CONSTANTS = {
  TICK_RATE: 60,
  MAX_EVENTS: 100,
  MAX_UNITS: 50,
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
} as const

export const EVENT_TYPES = {
  FIRE: 'fire',
  MEDICAL: 'medical',
  CRIME: 'crime',
  ACCIDENT: 'accident',
  NATURAL_DISASTER: 'natural_disaster',
} as const

export const UNIT_TYPES = {
  POLICE: 'police',
  FIRE_TRUCK: 'fire_truck',
  AMBULANCE: 'ambulance',
  HELICOPTER: 'helicopter',
} as const
