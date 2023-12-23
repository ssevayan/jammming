import React from 'react';
import PlaylistListItem from './PlaylistListItem';

function PlaylistList({ playlists, onSelectedPlaylist, handleCreateNewPlaylist }) {
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
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {uniquePlaylists.map((playlist) => (
          <PlaylistListItem
            key={playlist.uniqueIdentifier || playlist.id}
            id={playlist.id}
            name={playlist.name}
            onSelectedPlaylist={() => onSelectedPlaylist(playlist.id, playlist.name, playlist.tracks)}
          />
        ))}
      </ul>
      <button onClick={handleCreateNewPlaylist}>Create New Playlist</button>
    </div>
  );
}

export default PlaylistList;

  
