// spotifyAPI.js

const Spotify = {
  accessToken: '',
  expiresIn: 0,

  //------Get Access Token------
  getAccessToken: async () => {
    if (Spotify.accessToken && Date.now() < Spotify.expiresIn) {
      return Spotify.accessToken;
    }

    // Extract the access token and expiration time from the URL
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      Spotify.accessToken = accessTokenMatch[1];
      Spotify.expiresIn = Date.now() + expiresInMatch[1] * 1000; // Convert seconds to milliseconds
      window.history.pushState('Access Token', null, '/'); // Clear parameters from the URL
      return Spotify.accessToken;
    } else {
      // Redirect the user to the Spotify authorization page
      const redirectUri = 'http://localhost:3000/'; // Replace with your actual redirect URI
      const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'; // Specify the scopes you need
      const clientId = 'fa87a752e7d349da9a66d794229f49a5'; // Replace with your actual client ID

      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`;
    }
  },

  // ------Searchbar------
  search: async (term) => {
    const accessToken = await Spotify.getAccessToken();

    // Make a request to the Spotify API using the access token
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      // Handle the response data as needed
      return jsonResponse;
    } else {
      throw new Error('Failed to fetch data from Spotify API');
    }
  },

  

// ------Save to playlist------
savePlaylist: async (playlistName, trackURIs, playlistId, setPlaylistName, setPlaylistId, playlistTracks, tracksToRemove) => {
  const accessToken = await Spotify.getAccessToken();

  try {
    // Check if playlistId is provided
    if (playlistId) {
      // Update an existing playlist
      // Remove tracks first, then add new tracks
      if (tracksToRemove.length > 0) {
        // Remove tracks from the playlist
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tracks: tracksToRemove.map((track) => ({ uri: `spotify:track:${track.id}` })),
          }),
        });

        // Log success message after removing tracks
        console.log('Tracks removed successfully from the playlist.');
      }

      // Add new tracks to the playlist
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackURIs,
        }),
      });

      // Update the state with the new playlist name and ID
      setPlaylistName(playlistName);
      setPlaylistId(playlistId);

      // Log success message after updating the playlist
      console.log('Playlist updated successfully!');
    } else {
      // Create a new playlist
      const responseCreatePlaylist = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'Custom playlist created by Jammming',
          public: true,
        }),
      });

      if (!responseCreatePlaylist.ok) {
        throw new Error('Failed to create a new playlist on Spotify');
      }

      // Parse the response to get the new playlist details
      const newPlaylist = await responseCreatePlaylist.json();

      // Add new tracks to the newly created playlist
      await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackURIs,
        }),
      });

      // Update the state with the new playlist name and ID
      setPlaylistName(playlistName);
      setPlaylistId(newPlaylist.id);

      // Log success message after creating a new playlist
      console.log('New playlist created successfully!');
    }
  } catch (error) {
    console.error('Error saving playlist:', error.message);
  }
},

// ------Get user playlists------
getUserPlaylists: async () => {
  const accessToken = await Spotify.getAccessToken();

  // Get user's ID
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user ID');
  }

  const jsonResponse = await response.json();
  const userId = jsonResponse.id;

  // Get playlists
  const responseGetPlaylists = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (responseGetPlaylists.ok) {
    const data = await responseGetPlaylists.json();
    const playlists = data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
    }));
    return playlists;
  } else {
    throw new Error('Failed to get user playlists');
  }
},

// ------Get Single Playlist by ID------
getPlaylist: async (playlistId) => {
  const accessToken = await Spotify.getAccessToken();

  // Fetch playlist details for the name
  const responsePlaylistDetails = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!responsePlaylistDetails.ok) {
    throw new Error('Failed to get playlist details from Spotify API');
  }

  const playlistDetails = await responsePlaylistDetails.json();
  const playlistName = playlistDetails.name;

  // Fetch tracks of the playlist
  const responseGetTracks = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!responseGetTracks.ok) {
    throw new Error('Failed to get playlist tracks from Spotify API');
  }

  const tracksData = await responseGetTracks.json();

  // Extract track details from tracksData
  const tracks = tracksData.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists.map((artist) => artist.name).join(', '),
    album: item.track.album.name,
    uri: item.track.uri,
  }));

  return {
    name: playlistName,
    tracks: tracks,
  };
},
};

export default Spotify;

