import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../http';
import styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import Menu from '../../Menu/Menu';

const Navigation = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { isAuth, user } = useSelector((state) => state.auth);

    const brandStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center',
    };

    const logoText = {
        marginLeft: '10px',
    };
    

    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to="/">
                <img src="/images/logo.png" alt="logo" />
                <span style={logoText}>Codershouse</span>
            </Link>
            {isAuth && (
                <div className={styles.navRight}>
                    <h3>{user?.username}</h3>

                    <img
                        className={styles.avatar}
                        src={
                            user.avatar
                                ? user.avatar
                                : '/images/monkey-avatar.png'
                        }
                        width="40"
                        height="40"
                        alt="avatar"
                        onClick={() => setShowMenu(!showMenu)}
                    />

                    <div className={styles.profileMenuContainer}>
                        {(showMenu) && <Menu hideMenu={() => setShowMenu(false)} />}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
