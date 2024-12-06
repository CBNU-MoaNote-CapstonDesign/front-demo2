import React from "react";
import { useState, useRef, useEffect } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import Markdown from 'react-markdown'


function Navbar({ handleAddTextBlock, pushToDB, pullFromDB, handleAddGraphBlock, handlePrintButtonClick }) {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "#9B2C5D", // 배경색 지정 (이미지의 주요 색상)
        color: "white",
        width: "100%"
      }}
    >
      <div className="container-fluid navbar">
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
            className="btn btn-light"
            style={{ backgroundColor: "#355395", color: "white" }}
            type="button"
            onClick={pushToDB}
          >
            DB에 저장
          </button>
          <button
            className="btn btn-light"
            style={{ backgroundColor: "#355395", color: "white" }}
            type="button"
            onClick={pullFromDB}
          >
            DB에서 불러오기
          </button>
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

function TextBlock({ id, initialContents, hookContentsUpdate, removeBlock }) {
  const [contents, setContents] = useState(initialContents);
  const [isEditible, setIsEditible] = useState(true);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleContentsUpdate = (e) => {
    setContents(e.target.value);
    hookContentsUpdate(id, e.target.value, true);
  };

  useEffect(() => {
    if (isEditible) {
      adjustHeight();
    }
  }, [isEditible, contents]);

  return (
    <div className="doc-block" id={id}>
      {/* 삭제 버튼 */}
      <button
        className="btn content-box-button delete"
        onClick={() => removeBlock(id)}
      >
        삭제
      </button>

      {/* 편집 버튼 */}
      <button
        className="btn content-box-button editible"
        onClick={() => setIsEditible(!isEditible)}
      >
        수정
      </button>

      {/* 내용 */}
      {isEditible ? (
        <textarea
          name="editible"
          ref={textareaRef}
          type="text"
          className="content-box"
          value={contents}
          onChange={handleContentsUpdate}
        />
      ) : (
        <Markdown className="content-box">{contents}</Markdown>
      )}
    </div>
  );
}

function GraphBlock({ id, initialContents, hookContentsUpdate }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [contents, setContents] = useState(initialContents); // JSON 콘텐츠

  function updateInitialContents() {
    if ((initialContents && initialContents !== '')) {
      return JSON.parse(initialContents);
    } else {
      return null;
    }
  }

  function handleContentsUpdate(excalidrawElements, appState, files) {
    const documentRawText = serializeAsJSON(excalidrawElements, appState, files);
    setContents(documentRawText);
    hookContentsUpdate(id, documentRawText, false);
  }

  return (
    <>
      <div id={id} style={{ width: "70vw", height: "100vh" }}>
        <Excalidraw
          initialData={updateInitialContents()}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          onChange={handleContentsUpdate}
        />
      </div>
    </>
  )
}

function Editor() {
  let [docBlocks, setDocBlocks] = useState([]);

  let docBlocksContents = [];

  const pushToDB = () => {
    const allContents = {};
    docBlocksContents.forEach((content, index) => {
      allContents[index] = content;
    });
    const rawText = JSON.stringify(allContents);
    localStorage.setItem("test", rawText);
  };

  const pullFromDB = () => {
    const rawText = localStorage.getItem("test");
    importContents(rawText);
  };

  function addTextBlock(contents) {
    const newDocBlocks = [...docBlocks];
    newDocBlocks.push({
      isTextBlock: true,
      id: newDocBlocks.length,
      initialContents: contents,
    });
    docBlocksContents.push('');
    setDocBlocks(newDocBlocks);
  };

  function removeBlock(id) {
    const updatedDocBlocks = docBlocks.filter((block) => block.id !== id);
    setDocBlocks(updatedDocBlocks);
    docBlocksContents.splice(id, 1); // 콘텐츠 목록에서 해당 블록 삭제
  };

  function addGraphBlock(contents) {
    const newDocBlocks = [...docBlocks];
    newDocBlocks.push({
      isTextBlock: false,
      id: newDocBlocks.length,
      initialContents: contents,
    });
    docBlocksContents.push('');
    setDocBlocks(newDocBlocks);
  };

  const updateContents = (idx, contents, isTextBlock) => {
    docBlocksContents[idx] = { isTextBlock, contents };
  };
  
  function printContents() {
    const allContents = {};
    docBlocksContents.forEach((content, index) => {
      allContents[index] = content;
    });
    console.log(allContents);
  }

  function importContents(documentRawText) {
    let newDocBlocks = [];
    docBlocksContents = {};
    let allContents = JSON.parse(documentRawText);
    for (const [key, value] of Object.entries(allContents)) {
      if (value.isTextBlock) {
        newDocBlocks.push(
          {
            isTextBlock: true,
            id: key,
            initialContents: value.contents,
          }
        );
        docBlocksContents.push(value.contents);
      } else {
        newDocBlocks.push(
          {
            isTextBlock: false,
            id: key,
            initialContents: value.contents,
          }
        );
        docBlocksContents.push(value.contents);
      }
    }
  }

  return (
    <>
      <Navbar
        handleAddTextBlock={() => addTextBlock('')}
        handleAddGraphBlock={() => addGraphBlock('')}
        handlePrintButtonClick={printContents}
        pushToDB={pushToDB}
        pullFromDB={pullFromDB}
      />
      {docBlocks.map((docBlock) =>
        docBlock.isTextBlock ? (
          <TextBlock
            key={docBlock.id}
            id={docBlock.id}
            initialContents={docBlock.initialContents}
            hookContentsUpdate={updateContents}
            removeBlock={removeBlock} // 삭제 함수 전달
          />
        ) : (
          <GraphBlock
            key={docBlock.id}
            id={docBlock.id}
            initialContents={docBlock.initialContents}
            hookContentsUpdate={updateContents}
          />
        )
      )}
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
