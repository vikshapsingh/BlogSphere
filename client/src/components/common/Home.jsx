import {useContext,useEffect,useState} from 'react'
import {useUser} from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/userAuthorContext';
import axios from 'axios';
import { FaHeart, FaComments, FaShareAlt, FaBookOpen } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
function Home() {
  const {currentUser,setCurrentUser}=useContext(userAuthorContextObj)
  const {isSignedIn,user,isLoaded}=useUser()
  const [error,setError]=useState("");
  const navigate=useNavigate();

  async function onSelectRole(e){
      //clear error property
      setError('')
      const selectedRole=e.target.value;
      currentUser.role=selectedRole;
      let res=null;

      if(selectedRole==='author')
      {
         res=await axios.post('http://localhost:3000/author-api/author',currentUser)
         let {message,payload}=res.data;
         if(message==='author')
         {
          setCurrentUser({...currentUser,...payload})
         }
         else{
          setError(message);
        }
         console.log(currentUser)
      }
      if(selectedRole==='user')
      {
        res=await axios.post('http://localhost:3000/user-api/user',currentUser)
         let {message,payload}=res.data;
         if(message==='user')
         {
          setCurrentUser({...currentUser,...payload})
         }
         else{
          setError(message);
        }
      }
    }

  useEffect(()=>{
    if(isSignedIn===true){
    setCurrentUser({
      ...currentUser,
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.emailAddresses[0].emailAddress,
      profileImageUrl:user.imageUrl
    })
  }
  },[isLoaded]
  )

  useEffect(()=>{
    if(currentUser?.role==='user'  && error.length===0)
    {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if(currentUser?.role==='author' && error.length===0)
    {
      navigate(`/author-profile/${currentUser.email}`);
    }
  },[currentUser?.role])

  return (
    <div className=''>
    <div className='container bg-'>
      {
        isSignedIn===false  &&
        <div className='d-flex justify-content-around align-items-center p-5'
        style={{
          background: "linear-gradient(to right, #1e3c72, #2a5298)",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)"
        }}>
  
      {/* Left Section - Image */}
      <div className='fade-in'>
        <img src="https://miro.medium.com/v2/resize:fit:1024/1*yBt65HhmARbqZDDJ1McFDg.png" 
            width="400px" className='img2 me-5 rounded shadow-lg' alt="Blog Illustration" />
      </div>
  
      {/* Right Section - Text with Icons */}
      <div className='ms-4 mt-5 text-light fade-in'>
        <h2 className="fw-bold mb-3"><FaBookOpen className="me-2"/> Welcome to the Blog</h2>
        <p className="lead pst"><FaBookOpen className="me-2 text-warning"/> This platform allows users to create, share, and explore articles on various topics.</p>
        <p className="lead pst"><FaHeart className="me-2 text-danger"/> Users can interact with posts by liking, commenting, and sharing their favorite articles.</p>
        <p className="lead pst"><FaComments className="me-2 text-success"/> Engage with the community by leaving your thoughts on inspiring posts.</p>
        <p className="lead pst"><FaShareAlt className="me-2 text-primary"/> Easily share valuable content with friends and social networks.</p>
      </div>
  
    </div>

    

      }
      {
        isSignedIn===true && 
        <div>
        <div className='d-flex justify-content-evenly align-items-center bl p-3'>
          <img src={user.imageUrl} width="140px" className='rounded-circle' alt="" />
          <p className="display-6 fw-semibold">{user.firstName}</p>
          </div>
          {/* role selection*/}
          <p className="lead mt-3 text-primary fs-3 fw-semibold text-center">*Please choose your role</p>
          { error.length!==0  &&  (
            <p className="text-danger fs-5"  style={{fontFamily:"sans-serif"}}> 
              {error}
            </p>
          )}
            <div className='d-flex justify-content-center role-radio bg-secondary py-3 '>
              <div className="form-check me-4">
                <input type="radio" name="role" value="author" id="author" className="form-check-input" onChange={onSelectRole} />
                <label htmlFor="author" className="form-check-label fw-semibold">Author</label>
              </div>
              <div className="form-check">
                <input type="radio" name="role" value="user" id="user" className="form-check-input" onChange={onSelectRole} />
                <label htmlFor="author" className="form-check-label fw-semibold">User</label>
              </div>
            </div>

          </div>
      }
      </div>
      </div>


  )
}

export default Home
