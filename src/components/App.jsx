import React from "react";
import { useState, useRef } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import "bootstrap/dist/css/bootstrap.min.css";

function TextBlock({id, initialContents, hookContentsUpdate}) {
  const [contents, setContents] = useState(initialContents);
  const textareaRef = useRef(null);

  const handleInput = (event) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";  // CSS 높이를 초기화
      textarea.style.height = `${textarea.scrollHeight}px`;  // 컨텐츠 높이에 맞게 조정
    }
    setContents(event.target.value);  // 상태 업데이트
  };


  function handleContentsUpdate(e) {
    setContents(e.target.value);
    hookContentsUpdate(id, e.target.value);
  }

  return (
    <>
      <textarea 
        ref={textareaRef}
        type="text"
        className="form-control"
        id={id} 
        value={contents} 
        onChange={handleContentsUpdate}
        onInput={handleInput}
      />
    </>
  )
}
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
