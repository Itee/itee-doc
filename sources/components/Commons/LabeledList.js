const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )

/**
 * @class
 * @classdesc The LabeledList component allow to display some datas as list with a label
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class LabeledList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {
        if ( this.props.values.length === 0 ) { return null }

        return (
            <div id={ this.props.uuid } className="labeled-list">
                <h6 className="label">{ this.renderLabel( this.props.label, this.props.values.length ) }</h6>
                <ul className="list" style={ this.props.style }>
                    { this._renderValues() }
                </ul>
            </div>
        )

    }

    renderLabel ( label, numberOfValues ) {
        if ( !label ) { return null }
        if ( label.length === 0 ) { return null }

        return ( numberOfValues > 1 ) ? `${ label }s` : label
    }

    /**
     *
     * @returns {*}
     * @private
     */
    _renderValues () {

        return this.props.values.map( ( value, index ) => {
            if ( !value ) { return null }

            const uuid = value.uuid || index
            return (
                <li key={ uuid } className="list-item mb-3">
                    { this.renderValue( value ) }
                </li>
            )

        } )

    }

    renderValue ( value ) {
        return value
    }

}

LabeledList.propTypes = {
    label:  PropTypes.string,
    style:  PropTypes.object,
    uuid:   PropTypes.string,
    values: PropTypes.array
}

/**
 *
 * @type {{values: Array<*>, label: string}}
 */
LabeledList.defaultProps = {
    label:  '',
    style:  { listStyleType: 'none' },
    uuid:   uuidv4(),
    values: []
}

module.exports = LabeledList
