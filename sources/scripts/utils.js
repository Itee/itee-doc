/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */


/**
 * Check if given data is a string
 *
 * @param data {*} The data to check against the string type
 * @returns {boolean} true if data is a string, false otherwise.
 */
function isString ( data ) {
    return ( typeof data === 'string' || data instanceof String )
}

module.exports = isString
