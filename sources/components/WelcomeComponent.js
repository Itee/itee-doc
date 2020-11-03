/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

var React = require( 'react' )

class Welcome extends React.Component {
    render () {
        return (
            <h1>Bonjour, { this.props.name }</h1>
        )
    }
}

module.exports = Welcome

/*
import React from 'react'

exports.Welcome = class Welcome extends React.Component {
    render () {
        return (
            <h1>Bonjour, { this.props.name }</h1>
        )
    }
}
*/
