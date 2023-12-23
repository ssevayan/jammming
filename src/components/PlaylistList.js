import React from 'react';
import PlaylistListItem from './PlaylistListItem';
import styles from '../css/PlaylistList.module.css';

function PlaylistList({ playlists }) {
  // Use a Set to keep track of unique identifiers
  const uniqueIdentifiers = new Set();

  // Filter out duplicate playlists
  const uniquePlaylists = playlists.filter((playlist) => {
    const identifier = playlist.uniqueIdentifier || playlist.id;

    if (uniqueIdentifiers.has(identifier)) {
      // Duplicate found, skip this playlist
      return false;
    }

    // Add the identifier to the Set to mark it as seen
    uniqueIdentifiers.add(identifier);

    // Include the playlist in the result
    return true;
  });

  return (
    <div className={styles.PlaylistList}>
      <h2 className={styles.h2}>--- Your Playlists ---</h2>
      <ul className={styles.list}>
        {uniquePlaylists.map((playlist) => (
          <PlaylistListItem
            key={playlist.uniqueIdentifier || playlist.id}
            name={playlist.name}
          />
        ))}
      </ul>
    </div>
  );
}

export default PlaylistList;

  
