const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

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
            <div className="labeled-list">
                <h6 className="label">{ this.props.label }</h6>
                <ul className="list" style={ this.props.style }>
                    { this._renderValues() }
                </ul>
            </div>
        )

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
    values: PropTypes.array,
    label:  PropTypes.string,
    style:  PropTypes.object
}

/**
 *
 * @type {{values: Array<*>, label: string}}
 */
LabeledList.defaultProps = {
    /**
     * {String} label - The label of the list
     */
    label:  '',
    /**
     * {Array<*>} values - The lsit values
     */
    values: [],
    style:  { listStyleType: 'none' }
}

module.exports = LabeledList
