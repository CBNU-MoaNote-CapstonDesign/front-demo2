import { useState, useRef } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw"

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

export default GraphBlock;