import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'

function TextBlock({ id, initialContents, hookContentsUpdate, removeBlock, insertGraphBlock }) {
    const [contents, setContents] = useState(initialContents);
    const [isEditible, setIsEditible] = useState(true);
    const textareaRef = useRef(null);

    function adjustHeight() {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    function focus() {
        const textarea = textareaRef.current;
        textarea.focus();
    };

    function handleContentsUpdate(e) {
        setContents(e.target.value);
        hookContentsUpdate(id, e.target.value, true);
    };

    useEffect(() => {
        if (isEditible) {
            adjustHeight();
            focus();
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

            {/* 내용 */}
            {isEditible ? (
                <textarea
                    name="editible"
                    ref={textareaRef}
                    type="text"
                    className="content-box"
                    value={contents}
                    onChange={handleContentsUpdate}
                    onBlur={() => setIsEditible(!isEditible)}
                />
            ) : (
                <div style={{padding:0, margin:0, width:"100%"}}
                        onClick={() => setIsEditible(!isEditible)}
                >
                    <Markdown className="content-box">{contents}</Markdown>
                </div>
            )}
        </div>
    );
}

export default TextBlock;