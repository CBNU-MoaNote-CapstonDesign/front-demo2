import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/Navbar.css";

function Navbar({ handleAddTextBlock, pushToDB, pullFromDB, handleAddGraphBlock, handlePrintButtonClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    function toggleMenu () {
        setMenuOpen(!menuOpen);
    };

    const handleAddClick = () => {
        console.log("추가 버튼 클릭됨:", inputValue);
        setInputValue("");
    };

    
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
            {/* 사이드 메뉴 */}
            <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                <div className="menu-content">
                    <h3>디렉토리</h3>
                    <ul>
                        <li>폴더 1</li>
                        <li>폴더 2</li>
                        <li>폴더 3</li>
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
        </>
    );
}

export default Navbar;