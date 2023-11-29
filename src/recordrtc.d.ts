declare module 'recordrtc' {
  export default class RecordRTC {
    constructor(stream: MediaStream, options?: RecordRTCOptions);

    startRecording(): void;
    stopRecording(callback: (blob: Blob) => void): void;
    // Add other methods and properties as needed
  }

  interface RecordRTCOptions {
    type?: 'video' | 'audio';
    mimeType?: string;
    // Add other options if needed
  }
}
