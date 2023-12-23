import React from 'react';
import styles from '../css/Tracklist.module.css';
import Track from './Track';
 
function Tracklist({ tracks, onAddTrack, onRemoveTrack, isRemovable }) {
    console.log('Tracks Array:', tracks);
    return (
        <div className={styles.tracklist}>
            {tracks.map((track) => (
                <Track 
                    key={track.id} // Fallback to index if id is not available or not unique
                    track={track} 
                    inSearchResults={!isRemovable}
                    onAddTrack={onAddTrack}
                    onRemoveTrack={onRemoveTrack}
                />
            ))}
        </div>
    );
}

export default Tracklist;