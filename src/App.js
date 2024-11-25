import React from "react";
import { useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";

function TextBlock({id, body}) {
    return (
      <>
        <div id={id}>
            {body}
        </div>
      </>
    )
}

function GraphBlock({id, jsonBody}) {
  return (
    <>
      <div id={id} style={{ width: "100vw", height: "100vh" }}>
        <Excalidraw />
      </div>
    </>
  )
}

function Editor() {
  let docBlocks = [];
  
  function addBlock(isText) {
    if(isText) {
      docBlocks.push((<GraphBlock id={1} jsonBody={'json {}'}/>));
    }
  }
  
  return (
    <>
      {docBlocks}
    </>
  );
}

function App() {
  return (
    <>
      <Navbar/>
      <Editor/>
      <Footer/>
    </>
  )
}

export default App;
