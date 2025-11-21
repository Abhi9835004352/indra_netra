declare module 'qrcode.react' {
  import * as React from 'react';
  export interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }
  export class QRCodeCanvas extends React.Component<QRCodeProps> {}
  export class QRCodeSVG extends React.Component<QRCodeProps> {}
}
