import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {ACTIONS} from '../../../actions';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import "./Editor.css";
import { getRoom } from '../../../http';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const user = useSelector((state) => state.auth.user);
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            const response = await getRoom(roomId);
            const room = response.data;

            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'c++', json: true },
                    theme: 'dracula',
                    indentUnit: 4,
                    autocorrect: true,
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    readOnly: user.id!==room.ownerId
                }
            );
                
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);

                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor" className="code-editor"></textarea> 
};

export default Editor;
