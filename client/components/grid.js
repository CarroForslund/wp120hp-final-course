import React from 'react';

export default function Button(props){
    return (
        <div className={props.className}>
            {props.children}
        </div>
    );
}