import React from "react";
import {
  getBezierPath,
  getSmoothStepPath,
  getMarkerEnd,
  EdgeProps
} from "react-flow-renderer";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  arrowHeadType,
  markerEndId,
  data
}: EdgeProps) {
  const offsetY = 18 + 5;
  const offsetX = 4;

  const edgePath = getBezierPath({
    sourceX: sourceX - (data.fromRoot ? 60 : offsetX),
    sourceY: sourceY + (data.fromRoot ? 0 : offsetY),
    sourcePosition,
    targetX: targetX + offsetX,
    targetY: targetY + offsetY,
    targetPosition
  });

  const borderBottomPath = getSmoothStepPath({
    sourcePosition,
    sourceX: targetX + offsetX,
    sourceY: targetY + offsetY,
    targetX: targetX + offsetX + 172,
    targetY: targetY + offsetY,
    targetPosition
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath + borderBottomPath}
        markerEnd={markerEnd}
      />
    </>
  );
}
