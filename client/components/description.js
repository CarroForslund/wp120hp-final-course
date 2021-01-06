import React from 'react';

export default function Description(props){
    return (
        <p className={props.className}>
            {props.children}
        </p>
    );
}