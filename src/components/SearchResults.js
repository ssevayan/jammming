import React from 'react';
import styles from '../css/SearchResults.module.css';
import Tracklist from './Tracklist';

function SearchResults({ searchResults, onAddTrack }) {
    return (
        <div className={styles.result}>
            <h2 className={styles.h2}>Results</h2>
            <Tracklist tracks={searchResults} onAddTrack={onAddTrack}/>
        </div>
    );
}

export default SearchResults;