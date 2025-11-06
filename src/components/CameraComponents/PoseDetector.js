// Simple class-based PoseDetector that attaches to a provided video and canvas element.
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import CameraStream from "./CameraStream";

export default class PoseDetector {
  constructor(videoElement, canvasElement, onResultCallback) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.pose = null;
    this.camera = null;
    this.onResult = onResultCallback;
    this.active = false;
    this.latestLandmarks = null;
    // last simple detection summary { head, shoulders, hands }
    this.latestDetection = { head: false, shoulders: false, hands: false };
    // default to enabled so detection/logging is active unless explicitly turned off
    this.enabled = false;
    this.enabledPoints = {
      nose: true,
      leftEye: false,
      rightEye: false,
      leftShoulder: true,
      rightShoulder: true,
      leftWrist: false,
      rightWrist: false,
    };
  }

  async init() {
    this.pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    this.pose.onResults((results) => {
      this.handleResults(results);
    });
  }
  // Draw landmarks helper as an instance method so callers can access it via the detector

  drawPose(ctx, landmarks) {
    if (!ctx || !landmarks ) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const pointRadius = 5;
    ctx.lineWidth = 2;

    const drawPoint = (x, y, radius = pointRadius, color = "lime") => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const toXY = (kp) => ({ x: (kp.x || 0) * w, y: (kp.y || 0) * h, v: kp.visibility || 0 });

    const idx = {
      nose: 0,
      leftEye: 2,
      rightEye: 5,
      leftShoulder: 11,
      rightShoulder: 12,
      leftWrist: 15,
      rightWrist: 16,
    };

    const points = {};
    for (const [name, i] of Object.entries(idx)) {
      if (!this.enabledPoints[name]) continue; // skip disabled points
      if (landmarks[i]) points[name] = toXY(landmarks[i]);
    }

    if (points.leftShoulder && points.rightShoulder && points.leftShoulder.v > 0.2 && points.rightShoulder.v > 0.2) {
      ctx.strokeStyle = "rgba(255,200,0,0.9)";
      ctx.beginPath();
      ctx.moveTo(points.leftShoulder.x, points.leftShoulder.y);
      ctx.lineTo(points.rightShoulder.x, points.rightShoulder.y);
      ctx.stroke();
    }

    const drawLimb = (from, to, color = "rgba(0,200,255,0.9)") => {
      if (!from || !to) return;
      if (from.v <= 0.15 || to.v <= 0.15) return;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    };

    if (this.enabledPoints.leftShoulder && this.enabledPoints.leftWrist) drawLimb(points.leftShoulder, points.leftWrist, "rgba(0,200,255,0.9)");
    if (this.enabledPoints.rightShoulder && this.enabledPoints.rightWrist) drawLimb(points.rightShoulder, points.rightWrist, "rgba(0,200,255,0.9)");

    for (const [name, p] of Object.entries(points)) {
      if (!p || p.v <= 0.15) continue;
      const color = name.includes("Wrist") ? "cyan" : name.includes("Shoulder") ? "yellow" : "lime";
      drawPoint(p.x, p.y, pointRadius + 1, color);
    }
  }

  start() {
    if (!this.enabled) {
      console.log("PoseDetector: start called but detector is disabled");
      return;
    }

    if (!this.videoElement) {
      const s = CameraStream.getCurrentStream();
      if (!s) {
        console.error("PoseDetector: No video element attached and no CameraStream available.");
        return;
      }
      // create an internal video element (not appended to DOM)
      this.videoElement = document.createElement('video');
      this.videoElement.muted = true;
      this.videoElement.playsInline = true;
      this.videoElement.srcObject = s;
    }
    this.active = true;
    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.active && this.pose) {
          await this.pose.send({ image: this.videoElement });
        }
      },
      width: 480,
      height: 360,
    });
    this.camera.start();
  }

  // start detector directly from the currently active CameraStream (if any)
  async startFromCameraStream() {
    if (!this.enabled) return false;
    const s = CameraStream.getCurrentStream();
    if (!s) return false;
    if (!this.videoElement) {
      this.videoElement = document.createElement('video');
      this.videoElement.muted = true;
      this.videoElement.playsInline = true;
    }
    this.videoElement.srcObject = s;
    this.start();
    return true;
  }

  stop() {
    this.active = false;
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
  }

  handleResults(results) {
    if (!this.enabled) return;
    if (!results.poseLandmarks) return;
    const lm = results.poseLandmarks;
    this.latestLandmarks = lm;

    // Pose visibility checks
    const nose = lm[0]?.visibility > 0.5;
    const leftEye = lm[2]?.visibility > 0.5;
    const rightEye = lm[5]?.visibility > 0.5;
    const leftShoulder = lm[11]?.visibility > 0.5;
    const rightShoulder = lm[12]?.visibility > 0.5;
    const leftWrist = lm[15]?.visibility > 0.5;
    const rightWrist = lm[16]?.visibility > 0.5;

    // head detection: consider only enabled head points; if none enabled, treat as detected
    const headPoints = [];
    if (this.enabledPoints.nose) headPoints.push(!!nose);
    if (this.enabledPoints.leftEye) headPoints.push(!!leftEye);
    if (this.enabledPoints.rightEye) headPoints.push(!!rightEye);
    const head = headPoints.length === 0 ? true : headPoints.some(Boolean);

    // shoulders detection: require both shoulders if they are enabled; if neither enabled, treat as detected
    const shoulderPointsEnabled = (this.enabledPoints.leftShoulder ? 1 : 0) + (this.enabledPoints.rightShoulder ? 1 : 0);
    let shoulders = true;
    if (shoulderPointsEnabled > 0) {
      const leftOK = this.enabledPoints.leftShoulder ? !!leftShoulder : true;
      const rightOK = this.enabledPoints.rightShoulder ? !!rightShoulder : true;
      shoulders = leftOK && rightOK;
    }

    // hands detection: require both wrists if enabled; if neither enabled, treat as detected
    const handPointsEnabled = (this.enabledPoints.leftWrist ? 1 : 0) + (this.enabledPoints.rightWrist ? 1 : 0);
    let hands = true;
    if (handPointsEnabled > 0) {
      const leftOK = this.enabledPoints.leftWrist ? !!leftWrist : true;
      const rightOK = this.enabledPoints.rightWrist ? !!rightWrist : true;
      hands = leftOK && rightOK;
    }

    const detection = { head, shoulders, hands };
    // store latest detection for import-based consumers
    this.latestDetection = detection;
    if (this.onResult) this.onResult(detection);
  }

  // enable/disable detector at runtime
  setEnabled(enabled) {
    this.enabled = !!enabled;
    console.log(`PoseDetector: ${this.enabled ? 'ENABLED' : 'DISABLED'}`);
    if (!this.enabled) {
      // stop any active processing and clear state
      try { this.stop(); } catch (e) {}
      this.latestLandmarks = null;
      this.latestDetection = { head: false, shoulders: false, hands: false };
    }
  }

  getEnabled() {
    return !!this.enabled;
  }

  // simple getter so other modules can read latest detection without events
  getLatestDetection() {
    return this.latestDetection;
  }

  // enable/disable individual points (e.g. 'leftWrist', 'nose')
  setPointEnabled(pointName, enabled) {
    if (typeof this.enabledPoints[pointName] === 'undefined') return false;
    this.enabledPoints[pointName] = !!enabled;
    console.log(`PoseDetector: point ${pointName} ${this.enabledPoints[pointName] ? 'ENABLED' : 'DISABLED'}`);
    return true;
  }

  // set multiple points from a map { nose: true, leftWrist: false }
  setEnabledPointsMap(map) {
    if (!map || typeof map !== 'object') return false;
    for (const k of Object.keys(this.enabledPoints)) {
      if (typeof map[k] !== 'undefined') this.enabledPoints[k] = !!map[k];
    }
    console.log('PoseDetector: enabledPoints updated', this.enabledPoints);
    return true;
  }

  getEnabledPoints() {
    return { ...this.enabledPoints };
  }
}

// shared, importable detector instance (preferred simple wiring)
export const sharedPoseDetector = new PoseDetector();
// log initial state so it's visible in the browser console
try {
  console.log(`PoseDetector initial state: ${sharedPoseDetector.getEnabled() ? 'ENABLED' : 'DISABLED'}`);
} catch (e) {}

