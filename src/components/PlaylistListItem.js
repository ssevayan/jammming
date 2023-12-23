import React from 'react';
import styles from '../css/PlaylistListItem.module.css';

function PlaylistListItem({ name }) {
    return (
        <li className={styles.li}>
            {name}
        </li>
    );
}

export default PlaylistListItem;