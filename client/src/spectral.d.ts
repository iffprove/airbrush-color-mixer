declare module 'spectral.js' {
  export class Color {
    constructor(arg: string | number[]);
    sRGB: [number, number, number];
    lRGB: [number, number, number];
    R: number[];
    XYZ: [number, number, number];
    readonly OKLab: [number, number, number];
    readonly OKLCh: [number, number, number];
    readonly KS: number[];
    readonly luminance: number;
    tintingStrength: number;
    toHex(): string;
    toCSS(): string;
  }

  export function mix(...colors: [Color, number][]): Color;
  export function palette(a: Color, b: Color, size: number): Color[];
  export function gradient(t: number, ...colors: [Color, number][]): Color;
}
