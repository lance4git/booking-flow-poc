export enum ViewState {
  HOME = 'HOME',
  TRACKING = 'TRACKING',
  SERVICES = 'SERVICES',
  SUSTAINABILITY = 'SUSTAINABILITY',
  BOOKING = 'BOOKING'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
  icon: 'ship' | 'truck' | 'check' | 'alert';
}

export interface ShipmentData {
  id: string;
  origin: string;
  destination: string;
  eta: string;
  status: 'In Transit' | 'Delivered' | 'Exception' | 'Booked';
  progress: number; // 0 to 100
  events: TrackingEvent[];
}