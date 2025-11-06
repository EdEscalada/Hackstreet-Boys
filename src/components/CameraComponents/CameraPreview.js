import React, { Component, createRef } from "react";
  import CameraStream from "./CameraStream";
  import { sharedPoseDetector } from "./PoseDetector";

class CameraPreview extends Component {
  constructor(props) {
    super(props);
    this.videoRef = createRef();
    this.canvasRef = createRef();
    this.state = {
      visible: false,
      isStreaming: false,
      message: null, // can be updated by PoseDetector later
    };
    this.cameraStream = null;
  this._hiddenVideo = null;
  this._drawRaf = null;
  this._poseHandler = null;
  this._lastLandmarks = null;
  this._poseDetector = null;
  }

  componentDidUpdate(prevProps) {
    // respond to poseEnabled prop changes
    if (prevProps.poseEnabled !== this.props.poseEnabled) {
      try {
        sharedPoseDetector.setEnabled(!!this.props.poseEnabled);
      } catch (e) {}

      // if enabling and camera is active, start detector
      if (this.props.poseEnabled && this.cameraStream && CameraStream.getCurrentStream()) {
        if (!this._poseDetector) {
          this._poseDetector = sharedPoseDetector;
          this._poseDetector.videoElement = this._hiddenVideo;
          this._poseDetector.canvasElement = this.canvasRef.current;
          this._poseDetector.onResult = (det) => {
            if (this.props.onPoseResult) this.props.onPoseResult(det);
          };
          this._poseDetector.init().then(() => this._poseDetector.start()).catch(() => {});
        }
      }

      // if disabling, stop and detach
      if (!this.props.poseEnabled && this._poseDetector) {
        try { this._poseDetector.stop(); } catch (e) {}
        try { this._poseDetector.videoElement = null; } catch (e) {}
        try { this._poseDetector.canvasElement = null; } catch (e) {}
        this._poseDetector = null;
      }
    }
  }

  async startCamera() {
    if (!this.cameraStream) {
      this.cameraStream = new CameraStream(this.videoRef.current);
    }

    try {
  const s = await this.cameraStream.start();
      // call parent hook if provided
      if (this.props.onStreamReady) this.props.onStreamReady(s);
      this.setState({ isStreaming: true, message: null });
      this._ensureHiddenVideoAndLoop(s);

      // instantiate PoseDetector attached to the hidden video and visible canvas
      try {
        // attach detector only if pose detection enabled
        if (this.props.poseEnabled !== false && sharedPoseDetector.getEnabled()) {
          this._poseDetector = sharedPoseDetector;
          this._poseDetector.videoElement = this._hiddenVideo;
          this._poseDetector.canvasElement = this.canvasRef.current;
          this._poseDetector.onResult = (det) => {
            if (this.props.onPoseResult) this.props.onPoseResult(det);
          };
          // initialize and start the detector
          this._poseDetector.init().then(() => this._poseDetector.start()).catch(() => {});
        }
      } catch (err) {
        console.warn('PoseDetector failed to start', err);
      }
    } catch (err) {
      console.error(err);
      this.setState({ message: "Camera access denied or unavailable.", isStreaming: false });
    }
  }

  stopCamera() {
    try {
      // stop and remove pose detector
      if (this._poseDetector) {
        try { this._poseDetector.stop(); } catch (e) {}
        // detach video references but keep shared instance
        try { this._poseDetector.videoElement = null; } catch (e) {}
        try { this._poseDetector.canvasElement = null; } catch (e) {}
        this._poseDetector = null;
      }
      // stop draw loop
      if (this._drawRaf) {
        cancelAnimationFrame(this._drawRaf);
        this._drawRaf = null;
      }
      // stop hidden video
      if (this._hiddenVideo) {
        try { this._hiddenVideo.pause(); } catch (e) {}
        this._hiddenVideo.srcObject = null;
        this._hiddenVideo = null;
      }

      if (this.cameraStream) {
        this.cameraStream.stop();
      }
      this.setState({ isStreaming: false });
      // no global events — camera stream is centrally available via CameraStream.getCurrentStream()
    } catch (e) {
      console.warn(e);
    }
  }

  _ensureHiddenVideoAndLoop(stream) {
  if (!this.canvasRef.current) return;
    if (!this._hiddenVideo) {
      this._hiddenVideo = document.createElement('video');
      this._hiddenVideo.muted = true;
      this._hiddenVideo.playsInline = true;
      this._hiddenVideo.style.display = 'none';
      document.body.appendChild(this._hiddenVideo);
    }
    this._hiddenVideo.srcObject = stream;
    this._hiddenVideo.play().catch(() => {});

    const drawLoop = () => {
      const canvas = this.canvasRef.current;
      const ctx = canvas && canvas.getContext('2d');
      if (ctx && this._hiddenVideo && this._hiddenVideo.readyState >= 2) {
        // draw video frame to canvas (no mirror)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        try {
          ctx.drawImage(this._hiddenVideo, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          // ignore draw errors until ready
        }
        // draw pose overlay from shared detector's latest landmarks (if available and enabled)
        try {
          if (this.props.poseEnabled !== false && sharedPoseDetector.getEnabled()) {
            const lm = sharedPoseDetector.latestLandmarks;
            if (lm) sharedPoseDetector.drawPose(ctx, lm);
          }
        } catch (e) {
          // ignore draw errors
        }
      }
      this._drawRaf = requestAnimationFrame(drawLoop);
    };

    if (!this._drawRaf) this._drawRaf = requestAnimationFrame(drawLoop);
  }

  toggleVisibility = () => {
    this.setState((prev) => ({ visible: !prev.visible }));
  };

  componentWillUnmount() {
    this.stopCamera();
  }

  componentDidMount() {
    // if autoStart prop is set, start camera automatically
    if (this.props.autoStart) this.startCamera();
  }

  render() {
    const { visible, isStreaming, message } = this.state;

    return (
      <>
        {/* Camera container */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            height: "260px",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: visible ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "opacity 0.3s ease",
            opacity: visible ? 1 : 0,
          }}
        >
            {/* visible preview is now a canvas (video frames are drawn into it) */}
            <canvas
              ref={this.canvasRef}
              width={320}
              height={200}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "6px",
                display: 'block'
              }}
            />

          {/* Optional feedback text (controlled by PoseDetector) */}
          {message && (
            <div
              style={{
                color: "yellow",
                fontSize: "0.9em",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {message}
            </div>
          )}

          <div style={{ marginTop: "6px" }}>
            {!isStreaming ? (
              <button
                onClick={() => this.startCamera()}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                ▶ Start
              </button>
            ) : (
              <button
                onClick={() => this.stopCamera()}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                ■ Stop
              </button>
            )}
          </div>
        </div>

        {/* Floating toggle button */}
        <button
          onClick={this.toggleVisibility}
          style={{
            position: "fixed",
            bottom: "20px",
            right: visible ? "360px" : "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "20px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 1001,
            transition: "right 0.3s ease",
          }}
        >
          {visible ? "×" : "📷"}
        </button>
      </>
    );
  }
}

export default CameraPreview;
