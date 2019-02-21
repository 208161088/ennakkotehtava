import React from 'react'
import no_image_available from '../no_image_available.webp'


const Film = ({classname, displayedFilms, imageLoad = ()=>null, imageLoadError }) => {
  return(
    <ul className={classname}>
      {displayedFilms.map(film => 
        <li className='film' key={film.imdbID}>
          <img
          src={film.Poster==='N/A' ? no_image_available : film.Poster}
          onLoad={() => imageLoad()}
          onError={(e) => imageLoadError(e, film.imdbID)}
          alt={film.Title}
          />
          <div className='film-year'>{film.Year}</div>
          <div className='film-title'>{film.Title}</div>
        </li>
      )}
    </ul>
  )
}
export default Film