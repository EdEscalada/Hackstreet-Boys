// CameraStream.js
export default class CameraStream {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.stream = null;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = stream;
      CameraStream._currentStream = stream;
      if (this.videoElement) {
        this.videoElement.srcObject = stream;
        console.log("Camera started");
      }
      // CameraStream keeps the current stream available via CameraStream.getCurrentStream()
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
      CameraStream._currentStream = null;
      console.log("Camera stopped");
      // stream cleared; consumers should check CameraStream.getCurrentStream()
    }
  }

  getStream() {
    return this.stream;
  }

  // helper to check if a stream exists (static)
  static getCurrentStream() {
    return CameraStream._currentStream || null;
  }
}

// static holder
CameraStream._currentStream = null;
