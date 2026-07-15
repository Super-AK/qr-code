// QR Code Types
export type QRType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'vcard' | 'wifi' | 'whatsapp' | 'calendar' | 'geo' | 'crypto' | 'social';

export type QRShape = 'square' | 'rounded' | 'circle';

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'stl' | '3mf' | 'obj';

export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// QR Type Configuration
export interface QRTypeConfig {
  label: string;
  icon: string;
  fields: QRField[];
}

export interface QRField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

// QR Configuration
export interface QRConfig {
  type: QRType;
  content: string;
  size: number;
  colorDark: string;
  colorLight: string;
  errorLevel: ErrorCorrectionLevel;
  shape: QRShape;
  gradient: {
    enabled: boolean;
    color: string;
    direction: GradientDirection;
  };
  border: {
    enabled: boolean;
    size: number;
    color: string;
  };
  labels: {
    top: { enabled: boolean; text: string; size: number; color: string; bold: boolean };
    bottom: { enabled: boolean; text: string; size: number; color: string; bold: boolean };
  };
  logo: {
    enabled: boolean;
    image: HTMLImageElement | null;
  };
}

// STL Export Config
export interface STLConfig {
  imageSize: number;
  qrHeight: number;
  baseThickness: number;
  moduleSize: number;
  withBase: boolean;
  filename: string;
  invert: boolean;
}

// 3MF Export Config
export interface ThreeMFConfig extends STLConfig {
  colorDark: string;
  colorLight: string;
}

// OBJ Export Config
export interface OBJConfig extends STLConfig {}

// History Item
export interface HistoryItem {
  content: string;
  type: QRType;
  timestamp: number;
}

// QR Matrix (for export)
export interface QRMatrix {
  grid: number[][];
  moduleSize: number;
  modules: number;
}

// 3D Scene State
export interface ThreeSceneState {
  scene: any;
  camera: any;
  renderer: any;
  controls: any;
  animId: number | null;
  resizeHandler: (() => void) | null;
}

// Export Result
export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  filename: string;
  error?: string;
}
