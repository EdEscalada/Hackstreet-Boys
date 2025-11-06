import React, { useEffect, useRef, useState } from "react";
import CameraStream from "./CameraStream";
import { sharedPoseDetector } from "./PoseDetector";

// not yet applicable
function PoseMonitor() {
  const pauseTimerRef = useRef(null);
  const [lastPose, setLastPose] = useState({ head: true, shoulders: true, hands: true });
  const [hasStream, setHasStream] = useState(!!CameraStream.getCurrentStream());
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let intervalId = null;
    const pollMs = 250;

    const tick = () => {
      const s = CameraStream.getCurrentStream();
      setHasStream(!!s);

      if (!s) {
        // no camera: clear timers and hide overlay
        setLastPose({ head: false, shoulders: false, hands: false });
        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }
        setShowOverlay(false);
        return;
      }

      // if pose detection is disabled, do not apply monitoring
      if (!sharedPoseDetector.getEnabled()) {
        setLastPose({ head: true, shoulders: true, hands: true });
        setShowOverlay(false);
        return;
      }

      const det = sharedPoseDetector.getLatestDetection ? sharedPoseDetector.getLatestDetection() : sharedPoseDetector.latestDetection;
      if (det) setLastPose(det);

      const headVisible = !!(det && det.head);
      if (headVisible) {
        // cancel pending overlay
        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }
        setShowOverlay(false);
      } else {
        // start debounce to show overlay after 1200ms
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          if (CameraStream.getCurrentStream()) {
            setShowOverlay(true);
          }
        }, 1200);
      }
    };

    intervalId = setInterval(tick, pollMs);
    tick();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      setShowOverlay(false);
    };
  }, []);

  return (
    <>
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            zIndex: 2000,
            backdropFilter: "blur(2px)",
          }}
        >
          Please adjust your camera so your face is visible.
        </div>
      )}
    </>
  );
}

export default PoseMonitor;
