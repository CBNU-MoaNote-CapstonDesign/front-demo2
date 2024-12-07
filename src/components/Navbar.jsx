import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/Navbar.css";
import {
    getDocumentNames,
    createDocument,
    readDocumentContents,
    updateDocumentContents,
    deleteDocument,
} from "./localStoragePrototype";

function Navbar({ handleAddTextBlock, setFileURL, pushToDB, pullFromDB, handleAddGraphBlock, handlePrintButtonClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [documentNames, setDocumentNames] = useState(getDocumentNames());
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    function toggleMenu () {
        setMenuOpen(!menuOpen);
    };

    function handleAddClick () {
        createDocument(inputValue);
        setDocumentNames(getDocumentNames());
        setInputValue("");
    };

    function handleClick(documentName) {
        setFileURL(documentName);
    }
    
    return (
        <>
            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#9B2C5D", // 배경색 지정 (이미지의 주요 색상)
                    color: "white",
                    width: "100%"
                }}
            >
                <div className="container-fluid navbar">
                    {/* 왼쪽 햄버거 버튼 (추가된 부분) */}
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        ☰
                    </button>

                    {/* 왼쪽 로고 및 텍스트 */}
                    <a className="navbar-brand text-white" href="#" style={{ fontWeight: "bold", textAlign: "center" }}>
                        MOANOTE
                    </a>

                </div>
            </nav>
            {/* 사이드 메뉴 */}
            <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                <div className="menu-content">
                    <ul>
                        <h4>문서 목록</h4>
                        {documentNames.map((item, index) => (
                            <li>
                                <button className="filelink"onClick={() => handleClick(item)}> {item} </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="menu-footer">
                    <input
                        type="text"
                        className="menu-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="문서 제목 입력"
                    />
                    <button className="menu-add-btn" onClick={handleAddClick}>
                        추가
                    </button>
                </div>
            </div>

            {/* 플로팅 버튼 */}
            <div className="floating-container">
                {/* 플로팅 버튼들 */}
                <div className="floating-buttons">
                    {/*
                    <button className="floating-action" onClick={pushToDB}>
                        <i className="bi bi-cloud-arrow-up"></i>
                        <span>DB 저장</span>
                    </button>
                    <button className="floating-action" onClick={pullFromDB}>
                        <i className="bi bi-cloud-arrow-down"></i>
                        <span>DB 불러오기</span>
                    </button>
                    <button className="floating-action" onClick={handlePrintButtonClick}>
                        <i className="bi bi-printer"></i>
                        <span>출력</span>
                    </button>
                    */}
                    <button className="floating-action" onClick={handleAddTextBlock}>
                        <i className="bi bi-fonts"></i>
                        <span>텍스트 블록</span>
                    </button>
                    <button className="floating-action" onClick={handleAddGraphBlock}>
                        <i className="bi bi-pencil-square"></i>
                        <span>그래프 블록</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Navbar;