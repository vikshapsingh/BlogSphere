import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';


function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Get all articles
  async function getArticles() {
    try {
      const token = await getToken();
      let res = await axios.get('http://localhost:3000/author-api/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'articles') {
        setArticles(res.data.payLoad || []);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles.');
    }
  }

  useEffect(() => {
    getArticles();
  }, []);

  // Navigate to specific article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  return (
    <div className="container my-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {error.length !== 0 && (
        <p className="display-6 text-center text-danger fw-bold">{error}</p>
      )}

      {articles?.length !== 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {articles.map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card h-100 shadow-lg border-0 rounded-4">
                <div className="card-body d-flex flex-column">
                  {/* Author details */}
                  <div className="d-flex align-items-center justify-content-end mb-3">
                    <img
                      src={articleObj.authorData.profileImageUrl}
                      width="40"
                      className="rounded-circle me-2"
                      alt="Author"
                    />
                    <p className="mb-0 text-dark fw-semibold">
                      <small>{articleObj.authorData.nameOfAuthor}</small>
                    </p>
                  </div>

                  {/* Article title */}
                  <h5 className="card-title text-dark fw-bold">{articleObj.title}</h5>

                  {/* Article content preview */}
                  <p className="card-text text-muted">
                    {articleObj.content.substring(0, 80)}...
                  </p>

                  {/* Read More button */}
                  <button
                    className="btn btn-secondary mt-auto w-100"
                    onClick={() => gotoArticleById(articleObj)}
                  >
                    Read more
                  </button>
                </div>

                {/* Footer with last updated date */}
                <div className="card-footer bg-light text-muted text-center">
                  <small>Last updated on {articleObj.dateOfModification}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-secondary mt-5 fs-4 fw-semibold">No articles found</p>
      )}
    </div>
  );
}

export default Articles;
