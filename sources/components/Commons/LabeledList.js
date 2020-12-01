const React = require( 'react' )

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

        const values = this.props.values
        if ( !values || values.length === 0 ) {
            return null
        }

        return (
            <div className="labeled-list">
                <h6 className="label">{ this.props.label }</h6>
                <ul className="list">
                    { this._renderValues( this.props.values ) }
                </ul>
            </div>
        )

    }

    /**
     *
     * @param values
     * @returns {*}
     * @private
     */
    _renderValues ( values ) {

        return values.map( ( value, index ) => {

            if ( !value ) {
                return null
            } else {
                return (
                    <li key={ index } className="list-item">
                        { value }
                    </li>
                )
            }

        } )

    }

}

/**
 *
 * @type {{values: [], label: string}}
 */
LabeledList.defaultProps = {
    /**
     * {String} label - The label of the list
     */
    label:  'Meta',
    /**
     * {Array<*>} values - The lsit values
     */
    values: []
}

module.exports = LabeledList
