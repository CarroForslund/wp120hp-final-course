import React from 'react';

export default function Card(props){
    return (
        <a href={props.href} className={props.className}>
          <h3>{props.title}</h3>
          <p>{props.text}.</p>
        </a>
    );
}