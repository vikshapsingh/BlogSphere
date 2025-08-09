import {useContext} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useClerk,useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/userAuthorContext'
function Header() {

  const {signOut}=useClerk()
  const {isSignedIn,user,isLoaded}=useUser()
  const {currentUser,setCurrentUser}=useContext(userAuthorContextObj)
  const navigate=useNavigate();
  //function to signout
  async function handleSignout()
  {
     await signOut();
     setCurrentUser(null);
     navigate('/')
  }

  return (
    <div >
       <nav className='header d-flex justify-content-between align-items-center pt-3'>
           <div className="d-flex justify-content-center">
            <Link to="/"><img src="https://cdn.dribbble.com/users/3512994/screenshots/6459452/bloggersunited_2x.jpg" alt="" className='img' /></Link>
           </div>
           <ul className="d-flex justify-content-around list-unstyled header-links ">
              {
                !isSignedIn ?
                <>
                  <li className='fs-5 cl'>
                <Link to=''>Home</Link>
              </li>
              <li className='fs-5 cl'>
                <Link to='signin'>Signin</Link>
              </li>
              <li className='fs-5 cl' >
                <Link to='signup'>Signup</Link>
              </li>
                </> :
                <div className='user-button d-flex align-items-center'>
                   <div style={{position:'relative'}} className='d-flex  align-items-center ' >
                    <img src={user.imageUrl} width='48px' className='rounded-circle' alt="" />
                   {/* <p className="role fw-semibold" >{currentUser.role}</p> */}
                   </div>
                   <div className='d-flex justify-content-evenly ms-2'>
                   <p className='mb-0 user-name fs-4 fw-semibold'>{user.firstName}</p>
                  <button className=" btn btn-danger signedout-btn ms-2 " onClick={handleSignout}>Signout</button>
                  </div>
                </div>
              
              }
              
           </ul>
       </nav>
    </div>
  )
}

export default Header