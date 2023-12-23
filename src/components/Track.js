import React from 'react';
import styles from '../css/Track.module.css';

function Track({ track, inSearchResults, onAddTrack, onRemoveTrack }) {
    return(
        <div className={styles.track}>
            <div>
                <h3 className={styles.h3}>{track.name}</h3>
                <p className={styles.p}>
                    {track.artist} | {track.album}  
                </p>
            </div>

            {inSearchResults ? (
                <button className={styles.button} onClick={() => onAddTrack(track)}>
                    +
                </button>
            ) : (
                <button className={styles.button} onClick={() => onRemoveTrack(track)}>
                    -
                </button>
            )}
        </div>
    );
};

export default Track;