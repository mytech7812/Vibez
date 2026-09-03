declare module 'react-qr-scanner' {
  import { Component } from 'react';
  
  export interface QrScannerProps {
    onResult: (result: { text: string } | null) => void;
    constraints?: MediaTrackConstraints;
    containerStyle?: React.CSSProperties;
    className?: string;
  }
  
  export class QrScanner extends Component<QrScannerProps> {}
}