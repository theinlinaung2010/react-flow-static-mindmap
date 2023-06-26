import React, { memo } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

const DefaultNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom
}: NodeProps) => (
  <>
    <Handle
      type="target"
      position={targetPosition}
      isConnectable={isConnectable}
      style={{ visibility: "hidden" }}
    />
    {data.label}
    <Handle
      type="source"
      position={sourcePosition}
      isConnectable={isConnectable}
      style={{ visibility: "hidden" }}
    />
  </>
);

DefaultNode.displayName = "DefaultNode";

export default memo(DefaultNode);
