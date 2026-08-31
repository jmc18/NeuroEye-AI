"""Gaze estimation helpers used by the eyetracking WebSocket service."""

from app.vision.gaze import gaze_from_landmarks

__all__ = ["gaze_from_landmarks"]
