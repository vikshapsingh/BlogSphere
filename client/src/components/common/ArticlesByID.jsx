
import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'


function ArticleByID() {

  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setCommentStatus]=useState('')
  //console.log(state)

  //to enable edit of article
  function enableEdit() {
    setEditArticleStatus(true)
  }


  //to save modified article
  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle }
    const token = await getToken()
    const currentDate = new Date();
    //add date of modification
    articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

    //make http post req
    let res = await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    if (res.data.message === 'article modified') {
      //change edit article status to false
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload })
    }


  }


  //add comment by user
  async function addComment(commentObj){
    //add name of user to comment obj
    commentObj.nameOfUser=currentUser.firstName;
    console.log(commentObj)
    //http put
    let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj);
    if(res.data.message==='comment added'){
      setCommentStatus(res.data.message)
    }
  }


  //delete article
  async function deleteArticle(){
    state.isArticleActive=false;
    let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
    if(res.data.message==='article deleted or restored'){
      setCurrentArticle(res.data.payload)
  }
  }
  //restore article
  async function restoreArticle(){
    state.isArticleActive=true;
    let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
    if(res.data.message==='article deleted or restored'){
        setCurrentArticle(res.data.payload)
    }
  }

  return (
    <div className='container'>
  {editArticleStatus === false ? (
    <>
      {/* Print full article */}
      <div className="article-header d-flex justify-content-between align-items-center mb-5 p-4 rounded-3 shadow-sm">
        <div>
          <h1 className="display-4 fw-bold mb-3">{state.title}</h1>
          <div className="text-muted mb-2">
            <small className="me-4">
              <i className="fas fa-calendar-alt me-2"></i>
              Created on: {state.dateOfCreation}
            </small>
            <small>
              <i className="fas fa-edit me-2"></i>
              Modified on: {state.dateOfModification}
            </small>
          </div>
        </div>
        {/* Author details */}
        <div className="author-details text-center">
          <img
            src={state.authorData.profileImageUrl}
            width='80px'
            className='rounded-circle border border-3 border-primary'
            alt={state.authorData.nameOfAuthor}
          />
          <p className="mt-2 fw-bold">{state.authorData.nameOfAuthor}</p>
        </div>
      </div>

      {/* Edit & Delete buttons */}
      {currentUser.role === 'author' && (
        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-outline-warning me-2" onClick={enableEdit}>
            <FaEdit className='me-2' />
            Edit
          </button>
          {state.isArticleActive ? (
            <button className="btn btn-outline-danger" onClick={deleteArticle}>
              <MdDelete className='me-2' />
              Delete
            </button>
          ) : (
            <button className="btn btn-outline-info" onClick={restoreArticle}>
              <MdRestore className='me-2' />
              Restore
            </button>
          )}
        </div>
      )}

      {/* Article content */}
      <div className="article-content mb-5 p-4 bg-light rounded-3 shadow-sm">
        <p className="lead fw-semibold" style={{ whiteSpace: "pre-line" }}>
          {state.content}
        </p>
      </div>

      {/* User comments */}
      <div className="comments-section mb-5 p-4 bg-light rounded-3 shadow-sm">
        <h3 className="mb-4 fw-bold">Comments</h3>
        {state.comments.length === 0 ? (
          <p className="text-muted">No comments yet...</p>
        ) : (
          state.comments.map(commentObj => (
            <div key={commentObj._id} className="comment mb-3 p-3 bg-white rounded-3 shadow-sm">
              <p className="user-name fw-bold mb-1">{commentObj?.nameOfUser}</p>
              <p className="comment-text mb-0">{commentObj?.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Comment form */}
      {currentUser.role === 'user' && (
        <div className="comment-form mb-5 p-4 bg-light rounded-3 shadow-sm">
          <h6 className="mb-3 fw-bold">{commentStatus}</h6>
          <form onSubmit={handleSubmit(addComment)}>
            <input
              type="text"
              {...register("comment")}
              className="form-control mb-3"
              placeholder="Write a comment..."
            />
            <button className="btn btn-success">
              <i className="fas fa-comment me-2"></i>
              Add a comment
            </button>
          </form>
        </div>
      )}
    </>
  ) : (
    <form onSubmit={handleSubmit(onSave)} className="edit-form p-4 bg-light rounded-3 shadow-sm">
      <div className="mb-4">
        <label htmlFor="title" className="form-label fw-bold">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          defaultValue={state.title}
          {...register("title")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="form-label fw-bold">
          Select a category
        </label>
        <select
          {...register("category")}
          id="category"
          className="form-select"
          defaultValue={state.category}
        >
          <option value="programming">Programming</option>
          <option value="AI&ML">AI & ML</option>
          <option value="database">Database</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="form-label fw-bold">
          Content
        </label>
        <textarea
          {...register("content")}
          className="form-control"
          id="content"
          rows="10"
          defaultValue={state.content}
        ></textarea>
      </div>

      <div className="text-end">
        <button type="submit" className="btn btn-success">
          <i className="fas fa-save me-2"></i>
          Save
        </button>
      </div>
    </form>
  )}
</div>
  )
}

export default ArticleByID