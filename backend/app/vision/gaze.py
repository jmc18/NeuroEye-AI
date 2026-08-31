"""Geometric gaze estimation from compact iris / eye-corner landmarks.

The browser runs MediaPipe Face Landmarker and sends a small subset of
normalized coordinates (0–1). This module converts those landmarks into a
screen-normalized gaze point without running MediaPipe on the server.
"""

from __future__ import annotations

from typing import Any


def _point(payload: Any) -> tuple[float, float] | None:
    if not isinstance(payload, dict):
        return None
    try:
        return float(payload["x"]), float(payload["y"])
    except (KeyError, TypeError, ValueError):
        return None


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def _midpoint(
    left: tuple[float, float] | None,
    right: tuple[float, float] | None,
) -> tuple[float, float] | None:
    if left and right:
        return (left[0] + right[0]) / 2.0, (left[1] + right[1]) / 2.0
    return left or right


def gaze_from_landmarks(
    *,
    face_detected: bool,
    iris_l: Any = None,
    iris_r: Any = None,
    eye_corners: Any = None,
) -> tuple[float, float, bool, float]:
    """Return ``(x_norm, y_norm, eye_detected, quality)``.

    ``eye_corners`` may be ``{left_outer, left_inner, right_inner, right_outer}``
    each as ``{x, y}``. Quality is 1 when both irises are present, 0.5 for one.
    """
    if not face_detected:
        return 0.5, 0.5, False, 0.0

    left_iris = _point(iris_l)
    right_iris = _point(iris_r)
    gaze = _midpoint(left_iris, right_iris)

    corners = eye_corners if isinstance(eye_corners, dict) else {}
    left_outer = _point(corners.get("left_outer"))
    right_outer = _point(corners.get("right_outer"))

    if gaze is None:
        gaze = _midpoint(left_outer, right_outer)

    if gaze is None:
        return 0.5, 0.5, False, 0.0

    x_norm, y_norm = _clamp01(gaze[0]), _clamp01(gaze[1])
    quality = 1.0 if left_iris and right_iris else 0.5
    return x_norm, y_norm, True, quality
