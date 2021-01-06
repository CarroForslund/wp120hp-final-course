import React from 'react';

export default function translationsContainer(props){
    return (
        <div className={props.className}>
            {props.children}
        </div>
    );
}