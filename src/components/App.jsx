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

  function adjustHeight () {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  function handleContentsUpdate (e) {
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
  const [contents, setContents] = useState(initialContents);
  const initialDataRef = useRef(null);

  if (initialDataRef.current === null) {
    initialDataRef.current = (initialContents && initialContents !== '')
      ? JSON.parse(initialContents)
      : null;
  }

  function handleContentsUpdate(excalidrawElements, appState, files) {
    const documentRawText = serializeAsJSON(excalidrawElements, appState, files);
    if (documentRawText !== contents) {
      setContents(documentRawText);
      hookContentsUpdate(id, documentRawText, false);
    }
  };

  return (
    <>
      <div id={id} style={{ width: "70vw", height: "100vh" }}>
        <Excalidraw
          initialData={initialDataRef.current}
          onChange={handleContentsUpdate}
        />
      </div>
    </>
  )
}

function Editor() {
  const [docBlocks, setDocBlocks] = useState([]);

  function pushToDB () {
    // docBlocks 자체를 모두 저장
    const rawText = JSON.stringify(docBlocks);
    localStorage.setItem("test", rawText);
  };

  function pullFromDB () {
    const rawText = localStorage.getItem("test");
    if (rawText) {
      importContents(rawText);
    }
  };

  function addTextBlock(contents) {
    setDocBlocks((prev) => [...prev,
      {
        isTextBlock: true,
        id: prev.length,
        contents: contents,
      }
    ]);
  };

  function removeBlock(id) {
    setDocBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  function addGraphBlock(contents) {
    setDocBlocks((prev) => [
      ...prev,
      {
        isTextBlock: false,
        id: prev.length,
        contents: contents,
      }
    ]);
  };

  function updateContents (idx, contents, isTextBlock) {
    setDocBlocks((prev) => prev.map((block) => {
      if (block.id === idx) {
        return { ...block, contents: contents };
      }
      return block;
    }));
  };

  function printContents () {
    console.log(docBlocks);
  };

  function importContents(documentRawText) {
    const allContents = JSON.parse(documentRawText);
    setDocBlocks(allContents);
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
            initialContents={docBlock.contents}
            hookContentsUpdate={updateContents}
            removeBlock={removeBlock} // 삭제 함수 전달
          />
        ) : (
          <GraphBlock
            key={docBlock.id}
            id={docBlock.id}
            initialContents={docBlock.contents}
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
