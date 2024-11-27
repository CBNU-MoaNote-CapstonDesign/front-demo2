import React from "react";
import { useState, useRef } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import "bootstrap/dist/css/bootstrap.min.css";
function Editor() {
  let [docBlocks, setDocBlocks] = useState([]);

  let docBlocksContents = [];
  
  function addTextBlock() {
      let newDocBlocks = [...docBlocks];
      newDocBlocks.push(
        {
          isTextBlock : true,
          id          : newDocBlocks.length,
          initialContents        : '',
        }
      );
      docBlocksContents.push('');
    setDocBlocks(newDocBlocks);
    console.log("Text Block 생성");
  }

  function addGraphBlock() {
      let newDocBlocks = [...docBlocks];
      newDocBlocks.push(
        {
          isTextBlock : false,
          id          : newDocBlocks.length,
          initialContents: '',
        }
      );
      docBlocksContents.push('');
      setDocBlocks(newDocBlocks);
      console.log("Graph Block 생성");
  }

  function updateContents(idx, contents) {
    docBlocksContents[idx] = contents;
  }

  function printContents() {
    let allContents = '';
    for (let i in docBlocksContents) {
      allContents += docBlocksContents[i];
    }
    console.log(allContents);
  }
  
  return (
    <>
      <Navbar handleAddTextBlock={addTextBlock} handleAddGraphBlock={addGraphBlock} handlePrintButtonClick={printContents} />
      {
        docBlocks.map((docBlock) => 
          docBlock.isTextBlock ? 
          <TextBlock id={docBlock.id} initialContents={docBlock.initialContents} hookContentsUpdate = {updateContents}/>
          : <GraphBlock id={docBlock.id} />
        )
      }
    </>
  );
}

function App() {
  return (
    <>
      <Editor />
    </>
  )
}

export default App;
