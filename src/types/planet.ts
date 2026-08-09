export interface PlanetData {
  id: string;
  name: string;
  itemCount: number;
  size: number;
  top: number;
  left: number;
  coreColor: string;
  midColor: string;
  shadowColor: string;
  glowColor: string;
  ringColor?: string;
  hasRing?: boolean;
  hasMoon?: boolean;
  moonOffset?: number;
  labelPosition?: 'below' | 'right';
  faded?: boolean;
}

export interface NavItem {
  id: string;
  icon: 'home' | 'planet' | 'nova' | 'profile';
  label: string;
}