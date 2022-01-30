import React from 'react'
import './_Title.scss'

function Title(props) {
    return (
        <h2 className="title">{props.text}</h2>
    )
}

export default Title