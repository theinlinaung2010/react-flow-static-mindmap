import ReactFlow, { Elements } from "react-flow-renderer";
import { v4 as uuid } from "uuid";
import dagre from "dagre";
import * as React from "react";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";
import { MindmapNode } from "./types";

// maybe use some color generator function
const COLORS_CONFIG = [
  "#FF724A",
  "#F9D768",
  "#889943",
  "#4c7362",
  "#131911",
  "#f52cee",
  "#38250e"
];

const nodeSize = { width: 172, height: 36 };

const nodeStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff",
  background: "transparent",
  border: "none",
  borderRadius: "0px",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  ...nodeSize
};

const rootNodeStyle = {
  ...nodeStyle,
  border: "1px solid #ffffff",
  background: "#142214",
  alignItems: "center"
};

function useGraphLayout(root: MindmapNode): Elements {
  const _root = root; // WHY: there's eslint/ts error about this

  const elements = React.useMemo(() => {
    const colors = [...COLORS_CONFIG];
    const nodeConfigs: Record<
      string,
      {
        color: string;
        isRoot: boolean;
      }
    > = {};

    const g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: "LR" });
    g.setDefaultEdgeLabel(() => ({}));

    function walker(node: MindmapNode, color?: string): string {
      const isRoot = node === _root;

      if (isRoot) {
        color = "transparent";
      } else if (!color) {
        color = colors.pop();
      }

      const id = uuid();

      if (typeof node === "string") {
        nodeConfigs[id] = { color: color as string, isRoot };
        g.setNode(id, { label: node, ...nodeSize });
        return id;
      }

      const [root, children] = node;

      nodeConfigs[id] = { color: color as string, isRoot };
      g.setNode(id, { label: root, ...nodeSize });

      children
        .map((child) => walker(child, !isRoot ? color : undefined))
        .forEach((childId) => {
          g.setEdge(id, childId);
        });

      return id;
    }

    walker(_root);

    dagre.layout(g);

    return [
      ...g.nodes().map((v) => {
        const node = g.node(v);

        const config = nodeConfigs[v];

        return {
          id: v,
          type: "custom",
          data: {
            label: node.label
          },
          position: { x: node.x, y: node.y },

          sourcePosition: "right",
          targetPosition: "left",

          style: config.isRoot ? rootNodeStyle : nodeStyle,

          draggable: false,
          connectable: false,
          selectable: false
        };
      }),
      ...g.edges().map((e) => {
        const sourceNodeConfig = nodeConfigs[e.v];
        const targetNodeConfig = nodeConfigs[e.w];

        return {
          id: `${e.v}-${e.w}`,
          source: e.v,
          target: e.w,
          style: {
            stroke: targetNodeConfig?.color,
            strokeWidth: 5,
            strokeLinecap: "butt"
          },
          type: "custom",
          data: {
            fromRoot: sourceNodeConfig.isRoot
          },
          animated: false
        };
      })
    ] as Elements;
  }, [_root]);

  return elements;
}

const edgeTypes = {
  custom: CustomEdge
};

const nodeTypes = {
  custom: CustomNode
};

export default function MindMap({ data }: { data: MindmapNode }) {
  const elements = useGraphLayout(data);

  return (
    <ReactFlow
      elements={elements}
      style={{ background: "#142214" }}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
    />
  );
}
