import React from 'react';
import styles from './RoomCard.module.css';
import { useNavigate } from 'react-router-dom';
import { deleteRoom } from '../../http';
import { useSelector } from 'react-redux';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    
    console.log(room)
    const handleRoomDelete = async (roomId) => {
        await deleteRoom(roomId);
        window.location.reload();
    }

    console.log(room.speakers);
    return (
        <>
            <div
                className={styles.card}
                >
                <div className={styles.roomCardTop}>
                    <h3 
                        onClick={() => {
                            navigate(`/room/${room.id}`);
                        }}
                        >{room.topic}</h3>

                    {(user.id===room.ownerId.id) && <img onClick={() => handleRoomDelete(room.id)} src="images/trash.png" alt=""/>}
                </div>

                <div
                    className={`${styles.speakers} ${
                        room.speakers.length === 1 ? styles.singleSpeaker : ''
                    }`}
                >
                    <div className={styles.avatars}>
                        {room.speakers.map((speaker) => (
                            <img
                                key={speaker.id}
                                src={speaker.avatar}
                                alt="speaker-avatar"
                            />
                        ))}
                    </div>

                    <div className={styles.spekersNames}>
                        {room.speakers.map((speaker) => (
                            <div key={speaker.id} className={styles.nameWrapper}>
                                <span>{speaker.username}</span>
                                <img
                                    src="/images/chat-bubble.png"
                                    alt="chat-bubble"
                                />
                            </div>
                        ))}
                    </div>

                </div>

                <div className={styles.peopleCount}>
                    <span>{room.totalPeople}</span>
                    <img src="/images/user-icon.png" alt="user-icon" />
                </div>

            </div>

        </>    
    );
};

export default RoomCard;
