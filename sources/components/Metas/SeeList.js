const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Authors component allow to display authors as link or simple text list
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class SeeList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="see-list" label="See:"  values={ this._computeValues() }></LabeledList>

    }

    _computeValues () {

        return this.props.sees.map( see => {

            return <a href={ see.link } target="_blank">{ see.description }</a>

        } )

    }

}

SeeList.defaultProps = {
    sees: []
}


module.exports = SeeList
