import QRCodeStyling from 'qr-code-styling';

export type DotStyle = 'square' | 'rounded' | 'dots' | 'extra-rounded' | 'classy';
export type EyeStyle = 'square' | 'rounded';

export interface QRDesignConfig {
  text: string;
  size: number;
  colorDark: string;
  colorLight: string;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  gradientEnabled: boolean;
  gradientColor: string;
  gradientType: 'linear' | 'radial';
  logoEnabled: boolean;
  logoImage: string | null;
}

let currentInstance: QRCodeStyling | null = null;

export function createStyledQR(config: QRDesignConfig, container: HTMLElement): void {
  // Clear previous
  container.innerHTML = '';

  const options: any = {
    width: config.size,
    height: config.size,
    type: 'svg',
    data: config.text,
    dotsOptions: {
      color: config.colorDark,
      type: config.dotStyle,
    },
    backgroundOptions: {
      color: config.colorLight,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 4,
    },
  };

  // Gradient
  if (config.gradientEnabled) {
    options.dotsOptions.color = {
      type: config.gradientType,
      rotation: config.gradientType === 'linear' ? 45 : 0,
      colorStops: [
        { offset: 0, color: config.colorDark },
        { offset: 1, color: config.gradientColor },
      ],
    };
  }

  // Eye colors (same as dots or separate)
  options.cornersSquareOptions = {
    type: config.eyeStyle === 'rounded' ? 'extra-rounded' : 'square',
    color: config.colorDark,
  };

  options.cornersDotOptions = {
    type: config.eyeStyle === 'rounded' ? 'rounded' : 'square',
    color: config.colorDark,
  };

  // Logo
  if (config.logoEnabled && config.logoImage) {
    options.image = config.logoImage;
  }

  currentInstance = new QRCodeStyling(options);
  currentInstance.append(container);
}

export function getStyledQRAsCanvas(config: QRDesignConfig): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    if (!currentInstance) {
      resolve(null);
      return;
    }
    currentInstance.getRawData('png').then((data) => {
      if (data instanceof HTMLCanvasElement) {
        resolve(data);
      } else {
        resolve(null);
      }
    }).catch(() => resolve(null));
  });
}

export function getStyledQRAsSVG(config: QRDesignConfig): Promise<string | null> {
  return new Promise((resolve) => {
    if (!currentInstance) {
      resolve(null);
      return;
    }
    currentInstance.getRawData('svg').then((data) => {
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(data);
      } else {
        resolve(null);
      }
    }).catch(() => resolve(null));
  });
}

export function getStyledQRAsDataURL(config: QRDesignConfig): Promise<string | null> {
  return new Promise((resolve) => {
    if (!currentInstance) {
      resolve(null);
      return;
    }
    currentInstance.getRawData('png').then((data) => {
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(data);
      } else {
        resolve(null);
      }
    }).catch(() => resolve(null));
  });
}
