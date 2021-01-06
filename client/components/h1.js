import React from 'react';

export default function H1(props){
    return (
        <h1 className={props.className}>
            {props.children}
        </h1>
    );
}