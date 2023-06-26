import "./styles.css";
import * as React from "react";
import MindMap from "./MindMap";
import Editor from "@monaco-editor/react";
import { MindmapNode } from "./types";
import { load } from "./parse-data";

const INIT_VALUE = `- Front end tech
    - Compiler/Language
        - Elm
        - Svelte
        - ClojureScript
    - Reactive framework
        - React
        - Vue
        - Angular
    - packager
        - Webpack
        - Snowpack`;

export default function App() {
  const [data, setData] = React.useState<MindmapNode>(load(INIT_VALUE));

  const handleChange = React.useCallback((value) => {
    console.log(value);
    try {
      const obj = load(value);
      setData(obj);
    } catch (e) {
      // setError somewhere
      console.error(e);
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "30vw", height: "100vh" }}>
        <Editor
          height="100%"
          defaultLanguage="yaml"
          defaultValue={INIT_VALUE}
          onChange={handleChange}
          theme="vs-dark"
        />
      </div>

      <div style={{ width: "70vw", height: "100vh" }}>
        <MindMap data={data} />
      </div>
    </div>
  );
}
