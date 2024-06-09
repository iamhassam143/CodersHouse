import React, { useState, useRef, useEffect } from 'react';
import axios from "axios"
import './Compiler.css'; 
import { useWebRTC } from '../../../hooks/useWebRTC';
import Editor from '../Editor/Editor';
import { ACTIONS } from '../../../actions';

function Compiler({ socket, roomId }) {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState("Python");
    const [status, setStatus] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(25);

    const codeRef = useRef(null);
    const outputRef = useRef(null);
    outputRef.current = document.getElementById('output');
    const [err, setErr] = useState('');

    let pollInterval;

    const handleClear = () => {
        setCode('');
        setOutput('');
    };

    const handleIncrease = () => {
        setFontSize(prevSize => prevSize + 2); // Increase font size by 2px
        setLineHeight(prevSize => prevSize + 2); // Increase font size by 2px
    };

    const handleDecrease = () => {
        setFontSize(prevSize => Math.max(prevSize - 2, 8)); // Decrease font size by 2px, but ensure it doesn't go below 8px
        setLineHeight(prevSize => Math.max(prevSize - 2, 8)); // Decrease font size by 2px, but ensure it doesn't go below 8px
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        // alert("Code copied to clipboard!");
    };

    const handleRun = async () => {
        const payload = {
            language,
            code
        };
        try {
            setOutput("");
            setStatus(null);
            setJobId(null);
            setJobDetails(null);
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/run-code`, payload);
            console.log(output);
            setOutput(data.output);
            setJobId(data.jobId);
            setStatus("Submitted.");
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                console.log("m in if loop");
                // console.log(error.response.data.error);
                console.log(error.response.data.error.stderr);
                
                setOutput(error.response.data.error.stderr);
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // if (error.response.data && error.response.data.err) {
                    //   const errMsg = error.response.data.err.stderr;
                    //   setOutput(errMsg);
            } else if (error.request) {
                // The request was made but no response was received
                setOutput("No response received from the server.");
            } else {
                // Something happened in setting up the request that triggered an error
                setOutput("An error occurred. Please retry submitting.");
            }
        }
    };
        
    useEffect(() => {
        if(socket.current) {
            socket.current.emit(ACTIONS.OUTPUT_CHANGE, { roomId, output});
        }
        return () => {
            socket.current.off(ACTIONS.OUTPUT_CHANGE)
        }
    }, [output])
    
    useEffect(() => {
        if (socket.current) {
            socket.current.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
                if(outputRef.current){
                    outputRef.current.innerText = output;
                }
            });
        }

        return () => {
            socket.current.off(ACTIONS.OUTPUT_CHANGE);
        };
    }, [socket.current]);

    const codeEditorPlaceholder = `Type your ${language} code here...`;

    return (
        <>
            <div className="codebox-container">
                <div className='editor-container'>
                    <div className='editor-buttons-container'>
                        <div className="select-container">
                            <select className="select-language" value={language} onChange={(e) => { setLanguage(e.target.value); }}>
                                <option value="C++" > C++ </option>
                                <option value="Python" > Python </option>
                            </select>
                        </div>

                        <div className='utils-container'>
                            <button className="util run-btn" onClick={handleRun}>Run</button>
                            <button className="util" onClick={handleIncrease}>+</button>
                            <button className="util" onClick={handleDecrease}>-</button>
                            <button className="util" onClick={handleCopy}>Copy</button>
                            <button className="util" onClick={handleClear}>Clear</button>
                        </div>
                    </div>

                    {/* <textarea className="code-editor" value={code} onChange={(e) => { setCode(e.target.value); }}
                        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
                        placeholder={codeEditorPlaceholder}>
                    </textarea> */}
                    <Editor
                        socketRef={socket}
                        roomId={roomId}
                        onChange={(e) => { setCode(e.target.value)}}
                        onCodeChange={(newCode) => {
                            codeRef.current = newCode;
                            setCode(codeRef.current)
                        }}
                    />
                </div>

                <div className='output-container'>
                    <label className='output-label'>Output: <br></br><label id='output' className='output-text'>{output}</label></label>
                </div>
            </div>

        </>
    );
}

export default Compiler;
