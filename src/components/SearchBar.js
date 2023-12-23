import React from 'react';
import styles from '../css/SearchBar.module.css';

function SearchBar({ searchTerm, searchBarChangeHandler, handleSearch }) {

    return(
        <div className={styles.search}>
            <input 
                className={styles.input}
                placeholder='Enter A Song, Album, Artist'
                value={searchTerm}
                onChange={searchBarChangeHandler}
            />
            <button className={styles.button} onClick={handleSearch}>Search</button>
        </div>
    ); 
}

export default SearchBar;