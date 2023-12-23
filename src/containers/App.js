import React, { useState, useEffect } from 'react';
import Spotify from '../Spotify';
import styles from '../css/App.module.css';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Playlist from '../components/Playlist';
import PlaylistList from '../components/PlaylistList';

function App() {
  //Hooks
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState('');

  const [tracksToRemove, setTracksToRemove] = useState([]);

  useEffect(() => {
    // On component mount, attempt to get the access token
    Spotify.getAccessToken();
  }, []);

  
  useEffect(() => {
    //Call the Spotify API to get user playlists
    Spotify.getUserPlaylists().then((userPlaylists) => {
      setPlaylists(userPlaylists);
    })

  }, []);

  // SearchBar
  const searchBarChangeHandler = (e) => setSearchTerm(e.target.value);  
  
  //SearchResults
  const handleSearch = async () => {
    try {
      const response = await Spotify.search(searchTerm);
      
      // Extract relevant data from the Spotify API response
      const tracks = response.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        artist: item.artists.map((artist) => artist.name).join(', '),
        album: item.album.name,
        uri: item.uri,
      }));

      //Filter out tracks that are already in the playlist 
      const newTracks = tracks.filter(
        (track) => !playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
      );

      // Update the searchResults state with the obtained tracks
      setSearchResults(newTracks);

    } catch (error) {
      console.error('Error searching for tracks:', error.message);

    } 
  };  

  //Playlist
  const playlistNameChangeHandler = (e) => setPlaylistName(e.target.value);

  const addTrackToPlaylist = (track) => {
    //check if the track is already in the playlist
    const isTrackInPlaylist = playlistTracks.some((playlistTrack) => playlistTrack.id === track.id);

    if(!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track])
    };
  };

  const removeTrackFromPlaylist = (track) => {
    
    setTracksToRemove([...tracksToRemove, track]);
  
    // Update the playlist state with the new playlist after removing the track
    const updatedPlaylist = playlistTracks.filter((playlistTrack) => playlistTrack.id !== track.id);
    setPlaylistTracks(updatedPlaylist);

    console.log('Track added to removal list:', track);
  };
  
  const savePlaylist = async () => {
    try {
      // Check if the playlist name is empty
      if (!playlistName.trim()) {
        alert('Please enter your playlist name.');
        return;
      }
  
      // Check if there are no tracks in the playlist
      if (playlistTracks.length === 0) {
        alert('Please add at least one song to your playlist before saving.');
        return;
      }
  
      console.log('Attempting to save playlist...');
  
      // Check for unique tracks based on track ID
      const uniqueTracks = Array.from(new Set(playlistTracks.map((track) => track.id)))
        .map((id) => playlistTracks.find((track) => track.id === id));
  
      // Generate an array of Spotify URI values for each track in the playlist
      const trackURIs = uniqueTracks.map((track) => `spotify:track:${track.id}`);
  
      // Save the playlist, including the tracks to remove
      await Spotify.savePlaylist(
        playlistName,
        trackURIs,
        playlistId,
        setPlaylistName,
        setPlaylistId,
        playlistTracks,
        tracksToRemove
      );
  
      console.log('Playlist saved successfully!');
  
      // Reset the playlist in the web app (you might want to clear the state or perform other actions)
      setPlaylistId(null);
      setPlaylistTracks([]);
      setPlaylistName('');
      setTracksToRemove([]);
    } catch (error) {
      console.error('Error saving playlist:', error.message);
    }
  };
  //Selected Playlists
  const handleSelectPlaylist = async (playlistId) => {
    try {
      console.log('Selected Playlist ID:', playlistId);
  
      // Call Spotify.getPlaylist() with the provided playlist ID
      const playlist = await Spotify.getPlaylist(playlistId);
  
      // Log the playlist object to understand its structure
      console.log('Selected Playlist (API data):', playlist);
    
      // Update the playlistId, playlistName, and playlistTracks on App's state
      setPlaylistId(playlistId);
      setPlaylistName(playlist.name); 
      setPlaylistTracks(playlist.tracks);
    } catch (error) {
      console.error('Error selecting playlist:', error.message);
    }
  };

  const handleCreateNewPlaylist = () => {
    // Clear the current playlist information
    setPlaylistId(null);
    setPlaylistName('');
    setPlaylistTracks([]);
  };

  return (
    <div>
      <h1 className={styles.h1}>‪‪❤︎‬ Jammming ‪‪❤︎‬</h1>

      <div>
        <SearchBar 
          searchTerm={searchTerm} 
          searchBarChangeHandler={searchBarChangeHandler} 
          handleSearch={handleSearch}
        />

        <PlaylistList 
          playlists={playlists} 
          onSelectedPlaylist={handleSelectPlaylist} 
          handleCreateNewPlaylist={handleCreateNewPlaylist}
        />
      </div>


      <div className={styles.list}>
        <SearchResults 
          searchResults={searchResults} 
          onAddTrack={addTrackToPlaylist}
        />

        <Playlist 
          playlistName={playlistName} 
          playlistTracks={playlistTracks} 
          playlistNameChangeHandler={playlistNameChangeHandler}
          onRemoveTrack={removeTrackFromPlaylist}
          savePlaylist={savePlaylist}
        />
      </div>

    </div>
  );
}

export default App;
