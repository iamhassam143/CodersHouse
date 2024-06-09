import './Menu.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, logout } from '../../http';
import MenuOption from '../shared/MenuOption/MenuOption';
import { setAuth } from '../../store/authSlice';

const Menu = ({hideMenu}) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);

	const logoutUser = async () => {
		try {
			const { data } = await logout();
            dispatch(setAuth(data));
			hideMenu();
            // window.location.replace('http://localhost:3000')
        } catch (err) {
			console.log(err);
        }
    };
	
	const deleteAccount = async () => {
		try {
			const { data } = await deleteUser({userId: user.id});
			await logoutUser();
		} catch (err) {
			console.log(err);
		}
	};


	return (
		<>
			<div className='menu-container'>
				<div className='traingle'></div>
				<ul>
					<li> <MenuOption name='Delete Account' onClick={deleteAccount}/> </li>
					<li> <MenuOption name='Logout' onClick={logoutUser}/> </li>
				</ul>
			</div>
		</>
	)
};

export default Menu;