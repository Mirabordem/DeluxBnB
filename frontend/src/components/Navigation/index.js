import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-container'>
        <NavLink exact to="/">
            <img className="Luxe-logo" alt="" src='https://image.jimcdn.com/app/cms/image/transf/none/path/sd0536822daf447dd/image/ib3083eef0696f55f/version/1695578534/image.png'></img>
        </NavLink>
      {isLoaded && (
        <div className='nav-profile'>
            {sessionUser ? (
                <NavLink className='new-spot' to='/spots/new'>
                    Create New LuxeBnB
                </NavLink>
            ) : null}
          <ProfileButton user={sessionUser} />
          </div>
      )}
      </div>
  );
}

export default Navigation;
