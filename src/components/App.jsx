import React from "react";
import { useState, useRef, useEffect } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import Markdown from 'react-markdown'


function Navbar({handleAddTextBlock, handleAddGraphBlock, handlePrintButtonClick}) {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#9B2C5D", // 배경색 지정 (이미지의 주요 색상)
        color: "white",
      }}
    >
      <div className="container-fluid">
        {/* 왼쪽 로고 및 텍스트 */}
        <a className="navbar-brand text-white" href="#" style={{ fontWeight: "bold" }}>
          {
            /*
              <img
              src="https://via.placeholder.com/40" // 로고 이미지 (예제 URL)
              alt="logo"
              style={{ marginRight: "10px", borderRadius: "50%" }}
              />
            */
          }
          MOANOTE
        </a>

        {/* 오른쪽 버튼 */}
        <div className="d-flex">
        <button
            className="btn btn-light me-2"
            style={{ backgroundColor: "#355395", color: "white" }}
            type="button"
            onClick={handlePrintButtonClick}
          >
            전체 내용 출력
          </button>
          <button
            className="btn btn-light me-2"
            style={{ backgroundColor: "#355395", color: "white" }}
            type="button"
            onClick={handleAddTextBlock}
          >
            텍스트 블록 추가
          </button>
          <button
            className="btn btn-light"
            style={{ backgroundColor: "#355395", color: "white" }}
            type="button"
            onClick={handleAddGraphBlock}
          >
            그래프 블록 추가
          </button>
        </div>
      </div>
    </nav>
  );
}

function TextBlock({id, initialContents, hookContentsUpdate}) {
  const [contents, setContents] = useState(initialContents);
  const [isEditible, setIsEditible] = useState(true);
  const textareaRef = useRef(null);

  const adjustHeight = (event) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";  // CSS 높이를 초기화
      textarea.style.height = `${textarea.scrollHeight}px`;  // 컨텐츠 높이에 맞게 조정
    }
  };


  function handleContentsUpdate(e) {
    setContents(e.target.value);
    hookContentsUpdate(id, e.target.value);
  }

  useEffect(() => {
    if (isEditible) {
      adjustHeight();
    }
  }, [isEditible, contents]);

  return (
    <div className="doc-block">
      <button
        className="btn content-box-button editible"
        onClick={() => {
          setIsEditible(!isEditible);
        }}
      >
        Change!
      </button>
      {
        isEditible ?
          <textarea
            name="editible"
            ref={textareaRef}
            type="text"
            className="content-box"
            id={id}
            value={contents}
            onChange={handleContentsUpdate}
          /> :
          <Markdown className="content-box">
            {contents}
          </Markdown>
      }
    </div>
  )
}

function GraphBlock({ id, initialContents, hookContentsUpdate }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [contents, setContents] = useState(initialContents); // JSON 콘텐츠

  function createScene(elements, state) {
    return ({
      elements: elements,
      appState: state
    });
  }

  function handleContentsUpdate(excalidrawElements, appState, files) {
    const scene = createScene(excalidrawElements, appState);
    const contents = JSON.stringify(scene);
    setContents(contents);
    hookContentsUpdate(id, contents);
  }

  return (
    <>
      <div id={id} style={{ width: "100vw", height: "100vh" }}>
        <Excalidraw excalidrawAPI={
          (api) => {
            setExcalidrawAPI(api);
            try {
              let scene = JSON.parse(contents);
              api.updateScene(scene);
            } catch (e) { }
          }
        } onChange={handleContentsUpdate}
        />
      </div>
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
            <TextBlock id={docBlock.id} initialContents={docBlock.initialContents} hookContentsUpdate={updateContents} />
            : <GraphBlock id={docBlock.id} initialContents={docBlock.initialContents} hookContentsUpdate={updateContents} />
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
