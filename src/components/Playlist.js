import React from 'react';
import styles from '../css/Playlist.module.css';
import Tracklist from './Tracklist';


function Playlist({ playlistName, playlistTracks, playlistNameChangeHandler, onRemoveTrack, savePlaylist }) {
    return (
        <div className={styles.playlist}>
            <input 
                className={styles.playlistname}
                placeholder='Enter Your Playlist Name'
                type='text'
                value={playlistName}
                onChange={playlistNameChangeHandler}
            />
            <Tracklist tracks={playlistTracks} onRemoveTrack={onRemoveTrack} isRemovable={true}/>
            <button className={styles.button} onClick={savePlaylist} >Save To Spotify</button>
        </div>
    );
}

export default Playlist;