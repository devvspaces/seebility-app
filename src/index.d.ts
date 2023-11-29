declare module 'react-speech-kit';
declare global {
  interface Navigator {
    mediaDevices: {
      getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
    };
  }
}