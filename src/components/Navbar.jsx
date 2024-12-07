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

export default Navbar;