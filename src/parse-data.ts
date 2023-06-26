import { MindmapNode } from "./types";

export function load(data: string): MindmapNode {
  let root: MindmapNode | null = null;

  const stack: MindmapNode[] = [];
  const lines = data.split("\n");

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const currentIntent = line.indexOf("-");

    if (currentIntent < 0) {
      continue;
    }

    const value = line.slice(currentIntent + 1).trim();

    if (currentIntent === stack.length * 4) {
      if (!root) {
        root = [value, []];
        stack.push(root);
      } else {
        const last = stack.pop();
        if (!last) {
          break;
        }

        const curr = [value, []] as MindmapNode;

        last[1].push(curr);
        stack.push(last);
        stack.push(curr);
      }
      index++;
    } else {
      let diff = stack.length * 4 - currentIntent;

      while (diff > 0) {
        stack.pop();
        diff = diff - 4;
      }
    }
  }

  return root || ["root", []];
}
