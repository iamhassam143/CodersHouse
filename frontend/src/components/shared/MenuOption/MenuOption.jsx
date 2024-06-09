import './MenuOption.css'

const MenuOption = ({name, onClick}) => {
	return (
		<>
			<div className='menu-option-container' onClick={onClick}>
				<p>{name}</p>
			</div>
		</>
	)
};

export default MenuOption;