import React from 'react';

function PlaylistListItem({ id, name, onSelectedPlaylist }) {
    return (
        <li onClick={() => {onSelectedPlaylist(id)}}>
            {name}
        </li>
    );
}

export default PlaylistListItem;