

// import React from 'react';

// const InstagramPosts = ({ posts = [], username = '' }) => {
//   // ✅ VALIDACIÓN DEFENSIVA - ASEGURAR QUE POSTS SEA UN ARRAY
//   const safePosts = Array.isArray(posts) ? posts : [];
  
//   // 🐛 DEBUG: Log para verificar qué se está recibiendo
//   console.log('🏠 [INSTAGRAM POSTS] Props recibidos:', { posts, username });
//   console.log('🏠 [INSTAGRAM POSTS] Tipo de posts:', typeof posts);
//   console.log('🏠 [INSTAGRAM POSTS] Es array?', Array.isArray(posts));
//   console.log('🏠 [INSTAGRAM POSTS] Posts seguros:', safePosts);
//   console.log('🏠 [INSTAGRAM POSTS] Cantidad:', safePosts.length);

//   // ✅ VERIFICAR SI HAY POSTS PARA MOSTRAR
//   if (!safePosts || safePosts.length === 0) {
//     return (
//       <div className="instagram-posts-container">
//         <h3>📸 Posts de Instagram</h3>
//         <p className="no-posts">No hay posts disponibles para @{username}</p>
//       </div>
//     );
//   }

//   // ✅ FUNCIÓN PARA FORMATEAR NÚMEROS (likes, comentarios)
//   const formatNumber = (num) => {
//     if (!num || num === 0) return '0';
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   // ✅ FUNCIÓN PARA FORMATEAR FECHA
//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'Fecha desconocida';
//     try {
//       const date = new Date(timestamp * 1000); // Instagram usa timestamps en segundos
//       return date.toLocaleDateString('es-ES', {
//         day: 'numeric',
//         month: 'short'
//       });
//     } catch (error) {
//       return 'Fecha inválida';
//     }
//   };

//   // ✅ FUNCIÓN PARA TRUNCAR CAPTION
//   const truncateCaption = (caption, maxLength = 100) => {
//     if (!caption) return '';
//     if (caption.length <= maxLength) return caption;
//     return caption.substring(0, maxLength) + '...';
//   };

//   // ✅ FILTRAR POSTS VÁLIDOS (por si acaso)
//   const validPosts = safePosts.filter(post => 
//     post && 
//     post.id && 
//     post.shortcode && 
//     post.url
//   );

//   if (validPosts.length === 0) {
//     return (
//       <div className="instagram-posts-container">
//         <h3>📸 Posts de Instagram</h3>
//         <p className="no-posts">Posts inválidos para @{username}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="instagram-posts-container">
//       <h3>📸 Posts de Instagram (@{username})</h3>
      
//       <div className="instagram-posts-grid">
//         {validPosts.map((post, index) => (
//           <div key={post.id || index} className="instagram-post-card">
            
//             {/* ✅ IMAGEN DEL POST */}
//             <div className="post-image-container">
//               <img 
//                 src={post.display_url || 'https://via.placeholder.com/400x400?text=No+Image'} 
//                 alt={`Post de ${username}`}
//                 className="post-image"
//                 onError={(e) => {
//                   e.target.src = 'https://via.placeholder.com/400x400?text=Error+Loading';
//                 }}
//               />
              
//               {/* ✅ INDICADOR DE TIPO DE POST */}
//               <div className="post-type-badge">
//                 {post.type === 'VIDEO' && '🎬'}
//                 {post.type === 'CAROUSEL' && '🖼️'}
//                 {post.type === 'PHOTO' && '📸'}
//               </div>

//               {/* ✅ OVERLAY CON STATS */}
//               <div className="post-overlay">
//                 <div className="post-stats">
//                   <span className="stat">
//                     ❤️ {formatNumber(post.like_count)}
//                   </span>
//                   <span className="stat">
//                     💬 {formatNumber(post.comment_count)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* ✅ INFORMACIÓN DEL POST */}
//             <div className="post-info">
              
//               {/* ✅ CAPTION */}
//               <p className="post-caption">
//                 {truncateCaption(post.caption)}
//               </p>

//               {/* ✅ METADATA */}
//               <div className="post-metadata">
//                 <span className="post-date">
//                   {formatDate(post.timestamp)}
//                 </span>
                
//                 {/* ✅ BOTÓN PARA VER EN INSTAGRAM */}
//                 <a 
//                   href={post.url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="view-on-instagram-btn"
//                 >
//                   Ver en Instagram
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ FOOTER CON ESTADÍSTICAS */}
//       <div className="instagram-footer">
//         <p className="posts-summary">
//           Mostrando {validPosts.length} posts de @{username}
//         </p>
//       </div>

//       {/* ✅ ESTILOS CSS INLINE (temporal) */}
//       <style jsx>{`
//         .instagram-posts-container {
//           margin: 20px 0;
//           padding: 20px;
//           background: #fafafa;
//           border-radius: 12px;
//           border: 1px solid #e1e8ed;
//         }

//         .instagram-posts-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 20px;
//           margin: 20px 0;
//         }

//         .instagram-post-card {
//           background: white;
//           border-radius: 12px;
//           overflow: hidden;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           transition: transform 0.2s;
//         }

//         .instagram-post-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//         }

//         .post-image-container {
//           position: relative;
//           aspect-ratio: 1;
//           overflow: hidden;
//         }

//         .post-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .post-type-badge {
//           position: absolute;
//           top: 10px;
//           left: 10px;
//           background: rgba(0,0,0,0.7);
//           color: white;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//         }

//         .post-overlay {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           background: linear-gradient(transparent, rgba(0,0,0,0.7));
//           padding: 20px 15px 15px;
//           opacity: 0;
//           transition: opacity 0.2s;
//         }

//         .instagram-post-card:hover .post-overlay {
//           opacity: 1;
//         }

//         .post-stats {
//           display: flex;
//           gap: 15px;
//         }

//         .stat {
//           color: white;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .post-info {
//           padding: 15px;
//         }

//         .post-caption {
//           font-size: 14px;
//           line-height: 1.4;
//           margin: 0 0 10px 0;
//           color: #333;
//         }

//         .post-metadata {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           font-size: 12px;
//           color: #666;
//         }

//         .view-on-instagram-btn {
//           background: #E4405F;
//           color: white;
//           padding: 6px 12px;
//           border-radius: 6px;
//           text-decoration: none;
//           font-size: 12px;
//           font-weight: 600;
//           transition: background 0.2s;
//         }

//         .view-on-instagram-btn:hover {
//           background: #d63384;
//         }

//         .instagram-footer {
//           text-align: center;
//           margin-top: 20px;
//           padding-top: 15px;
//           border-top: 1px solid #e1e8ed;
//         }

//         .posts-summary {
//           color: #666;
//           font-size: 14px;
//           margin: 0;
//         }

//         .no-posts {
//           text-align: center;
//           color: #666;
//           font-style: italic;
//           padding: 40px 20px;
//         }

//         h3 {
//           margin: 0 0 15px 0;
//           color: #1DA1F2;
//           font-size: 20px;
//           font-weight: 600;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InstagramPosts;

import React from 'react';

const InstagramPosts = ({ posts = [], username = '' }) => {
  // ✅ VALIDACIÓN DEFENSIVA - ASEGURAR QUE POSTS SEA UN ARRAY
  const safePosts = Array.isArray(posts) ? posts : [];
  
  // 🐛 DEBUG: Log para verificar qué se está recibiendo
  console.log('🏠 [INSTAGRAM POSTS] Props recibidos:', { posts, username });
  console.log('🏠 [INSTAGRAM POSTS] Tipo de posts:', typeof posts);
  console.log('🏠 [INSTAGRAM POSTS] Es array?', Array.isArray(posts));
  console.log('🏠 [INSTAGRAM POSTS] Posts seguros:', safePosts);
  console.log('🏠 [INSTAGRAM POSTS] Cantidad:', safePosts.length);

  // ✅ VERIFICAR SI HAY POSTS PARA MOSTRAR
  if (!safePosts || safePosts.length === 0) {
    return (
      <div className="instagram-posts-container">
        <h3>📸 Posts de Instagram</h3>
        <p className="no-posts">No hay posts disponibles para @{username}</p>
      </div>
    );
  }

  // ✅ FUNCIÓN PARA FORMATEAR NÚMEROS (likes, comentarios)
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // ✅ FUNCIÓN PARA FORMATEAR FECHA
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    try {
      const date = new Date(timestamp * 1000); // Instagram usa timestamps en segundos
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // ✅ FUNCIÓN PARA TRUNCAR CAPTION
  const truncateCaption = (caption, maxLength = 100) => {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  // ✅ FILTRAR POSTS VÁLIDOS (por si acaso)
  const validPosts = safePosts.filter(post => 
    post && 
    post.id && 
    post.shortcode && 
    post.url
  );

  if (validPosts.length === 0) {
    return (
      <div className="instagram-posts-container">
        <h3>📸 Posts de Instagram</h3>
        <p className="no-posts">Posts inválidos para @{username}</p>
      </div>
    );
  }

  return (
    <div className="instagram-posts-container">
      <h3>📸 Posts de Instagram (@{username})</h3>
      
      <div className="instagram-posts-grid">
        {validPosts.map((post, index) => (
          <div key={post.id || index} className="instagram-post-card">
            
            {/* ✅ IMAGEN DEL POST */}
            <div className="post-image-container">
              <img 
                src={post.display_url || 'https://via.placeholder.com/400x400?text=No+Image'} 
                alt={`Post de ${username}`}
                className="post-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Error+Loading';
                }}
              />
              
              {/* ✅ INDICADOR DE TIPO DE POST */}
              <div className="post-type-badge">
                {post.type === 'VIDEO' && '🎬'}
                {post.type === 'CAROUSEL' && '🖼️'}
                {post.type === 'PHOTO' && '📸'}
              </div>

              {/* ✅ OVERLAY CON STATS */}
              <div className="post-overlay">
                <div className="post-stats">
                  <span className="stat">
                    ❤️ {formatNumber(post.like_count)}
                  </span>
                  <span className="stat">
                    💬 {formatNumber(post.comment_count)}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ INFORMACIÓN DEL POST */}
            <div className="post-info">
              
              {/* ✅ CAPTION */}
              <p className="post-caption">
                {truncateCaption(post.caption)}
              </p>

              {/* ✅ METADATA */}
              <div className="post-metadata">
                <span className="post-date">
                  {formatDate(post.timestamp)}
                </span>
                
                {/* ✅ BOTÓN PARA VER EN INSTAGRAM */}
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-on-instagram-btn"
                >
                  Ver en Instagram
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ FOOTER CON ESTADÍSTICAS */}
      <div className="instagram-footer">
        <p className="posts-summary">
          Mostrando {validPosts.length} posts de @{username}
        </p>
      </div>

      {/* ✅ ESTILOS CSS INLINE (temporal) */}
      <style jsx>{`
        .instagram-posts-container {
          margin: 20px 0;
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
          border: 1px solid #e1e8ed;
        }

        .instagram-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .instagram-post-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .instagram-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .post-image-container {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .post-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .post-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 20px 15px 15px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .instagram-post-card:hover .post-overlay {
          opacity: 1;
        }

        .post-stats {
          display: flex;
          gap: 15px;
        }

        .stat {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .post-info {
          padding: 15px;
        }

        .post-caption {
          font-size: 14px;
          line-height: 1.4;
          margin: 0 0 10px 0;
          color: #333;
        }

        .post-metadata {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #666;
        }

        .view-on-instagram-btn {
          background: #E4405F;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .view-on-instagram-btn:hover {
          background: #d63384;
        }

        .instagram-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e1e8ed;
        }

        .posts-summary {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .no-posts {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 40px 20px;
        }

        h3 {
          margin: 0 0 15px 0;
          color: #1DA1F2;
          font-size: 20px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default InstagramPosts;