const React        = require( 'react' )
const PropTypes    = require( 'prop-types' )
const LabeledList  = require( '../Commons/LabeledList' )
const { isString } = require( '../../scripts/utils' )

/**
 * @class
 * @classdesc The InheritsList component allow to display authors as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class InheritList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <LabeledList className="inherits-list" label="Inherit:" values={ this._computeValues() }></LabeledList>
        )

    }

    _computeValues () {

        return this.props.values.map( inherit => {

            let renderedValue

            if ( isString( inherit ) ) {

                renderedValue = inherit

            } else if ( inherit.link ) {

                renderedValue = <a href={ inherit.link } target="_blank" rel="noreferrer">{ inherit.description }</a>

            } else {

                renderedValue = `Unmanaged Inherit value: ${ inherit }`

            }

            return renderedValue

        } )

    }

}

InheritList.propTypes = {
    values: PropTypes.array
}

InheritList.defaultProps = {
    values: []
}

module.exports = InheritList
