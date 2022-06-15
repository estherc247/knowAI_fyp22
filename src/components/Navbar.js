import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css';
import {Button} from './Button';

function Navbar() {

  const [click, setClick] = useState(false); /*open sidebar*/
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click); /*close sidebar*/
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if(window.innerWidth <= 960){
      setButton(false);
    }else{
      setButton(true);
    }
  };

  /*hides button even after refresh*/
  useEffect(() => {
    showButton()
  },[])

  window.addEventListener('resize', showButton);

  return(
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            KnowAI
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/about'
                className='nav-links'
                onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/experiments'
                className='nav-links'
                onClick={closeMobileMenu}>
                Experiments
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>+Details</Button>}
        </div>
      </nav>
    </>
  );

}

export default Navbar
