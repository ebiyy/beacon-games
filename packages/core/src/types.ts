export interface Position {
  lat: number
  lng: number
}

export interface GameEvent {
  id: string
  type: string
  position: Position
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
  resolved: boolean
}

export interface Unit {
  id: string
  type: string
  position: Position
  status: 'idle' | 'dispatched' | 'busy' | 'returning'
  speed: number
}

export interface Player {
  id: string
  name: string
  score: number
}

export interface GameState {
  events: GameEvent[]
  units: Unit[]
  players: Player[]
  time: number
  paused: boolean
}
