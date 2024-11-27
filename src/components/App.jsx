import React from "react";
import { useState, useRef } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import "bootstrap/dist/css/bootstrap.min.css";


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

//https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api#getfiles
function GraphBlock({ id, jsonBody }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);


  // @TODO 테스트용 함수, 나중에 삭제 될 예정
  const initializeGlobalFunctions = (api) => {
    if (!api) return;

    // Excalidraw 상태를 JSON으로 변환하는 전역 함수
    window.serializeExcalidraw = () => {
      console.log(api)
      let elements = api.getSceneElements();
      let appState = api.getAppState();

      let sceneData = {
        elements : api.getSceneElements(),
        appState: appState
      }

      api.updateScene(sceneData); 
      //console.log(json); //Redacted Function
    };

    // JSON 데이터를 Excalidraw에 로드하는 전역 함수
    window.loadExcalidraw = (jsonString) => {
      try {
        const parsedData = JSON.parse(jsonString);
        api.updateScene(parsedData);
        console.log("Loaded JSON into Excalidraw:", parsedData);
      } catch (error) {
        console.error("Failed to parse JSON string:", error);
      }
    };

    console.log("Excalidraw global functions initialized.");
  };

  return (
    <>
      <div id={id} style={{ width: "100vw", height: "100vh" }}>
        <Excalidraw excalidrawAPI={
          (api) => {
            setExcalidrawAPI(api);
            initializeGlobalFunctions(api);
          }
        } />
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
