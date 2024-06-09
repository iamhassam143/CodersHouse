import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoom } from '../../http';
import Compiler from '../../components/shared/Compiler/Compiler';

import styles from './Room.module.css';

const Room = () => {
    const user = useSelector((state) => state.auth.user);
    const { id: roomId } = useParams();
    const [room, setRoom] = useState(null);

    const { clients, provideRef, socket, handleMute } = useWebRTC(roomId, user);

    const navigate = useNavigate();

    const [isMuted, setMuted] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            console.log(data);
            setRoom((prev) => data);
        };

        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        handleMute(isMuted, user.id);
    }, [isMuted]);

    const handManualLeave = () => {
        navigate('/rooms');
    };

    const handleMuteClick = (clientId) => {
        if (clientId !== user.id) {
            return;
        }
        setMuted((prev) => !prev);
    };

    console.log(room);
    return (room) && (
        <div className={styles.roomContainer}>
            {/* Action buttons */}
            <div className={styles.actionsContainer}>
                {/* <button onClick={handManualLeave} className={styles.goBack}>
                    <img src="/images/arrow-left.png" alt="arrow-left" />
                    <span>All voice rooms</span>
                </button> */}

                <div className={styles.actions}>
                    <button className={styles.actionBtn}>
                        <img src="/images/palm.png" alt="palm-icon" />
                    </button>
                
                    <button onClick={handManualLeave} className={`${styles.actionBtn} ${styles.leaveBtn}`}>
                        <span>Leave Room</span>
                    </button>
                </div>
            </div>


            <div className={styles.panelContainer}>
                <div className={styles.clientsWrap}>
                    <div className={styles.header}>
                        {room && <h1 className={styles.topic}>{room.topic}</h1>}
                    </div>

                    <h3>Speakers</h3>
                    <hr />
                    <div className={styles.clientsList}>
                        {clients.map((client) => {
                            return (client.id===room.ownerId) && (
                                <div className={styles.client} key={client.id}>
                                    <div className={styles.userHead}>
                                        <img
                                            className={styles.userAvatar}
                                            src={client.avatar}
                                            alt=""
                                        />
                                        <audio
                                            autoPlay
                                            ref={(instance) => {
                                                provideRef(instance, client.id);
                                            }}
                                        />
                                        <button
                                            onClick={() => handleMuteClick(client.id)}
                                            className={styles.micBtn}
                                        >
                                            {client.muted ? (
                                                <img
                                                    className={styles.mic}
                                                    src="/images/mic-mute.png"
                                                    alt="mic"
                                                />
                                            ) : (
                                                <img
                                                    className={styles.micImg}
                                                    src="/images/mic.png"
                                                    alt="mic"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    <h4 className={(client.id===user.id) && styles.clientBorderBottom}>{client.username}</h4>
                                </div>
                            );
                        })}
                    </div>

                    <h3>Audience</h3>
                    <hr />
                    <div className={styles.clientsList}>
                    {clients.map((client) => {
                            return (client.id!==room.ownerId) && (
                                <div className={styles.client} key={client.id}>
                                    <div className={styles.userHead}>
                                        <img
                                            className={styles.userAvatar}
                                            src={client.avatar}
                                            alt=""
                                        />
                                        <audio
                                            autoPlay
                                            ref={(instance) => {
                                                provideRef(instance, client.id);
                                            }}
                                        />
                                        <button
                                            onClick={() => handleMuteClick(client.id)}
                                            className={styles.micBtn}
                                        >
                                            {client.muted ? (
                                                <img
                                                    className={styles.mic}
                                                    src="/images/mic-mute.png"
                                                    alt="mic"
                                                />
                                            ) : (
                                                <img
                                                    className={styles.micImg}
                                                    src="/images/mic.png"
                                                    alt="mic"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    <h4 className={(client.id===user.id) && styles.clientBorderBottom}>{client.username}</h4>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Compiler socket={socket} roomId={roomId}/>
            </div>
        </div>
    );
};

export default Room;
