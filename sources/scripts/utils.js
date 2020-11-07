const path = require( 'path' )
const fs   = require( 'fs' )

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */


/**
 * Check if given data is a string
 *
 * @param {*} data - The data to check against the string type
 * @returns {boolean} true if data is a string, false otherwise.
 */
function isString ( data ) {
    return ( typeof data === 'string' || data instanceof String )
}

/**
 * Check if given data is defined (not undefined and not null)
 *
 * @param {*} value - The data to check against the definition
 * @returns {boolean} true if data is defined, false otherwise.
 */
function isDefined ( value ) {
    return value !== undefined && value !== null
}

/**
 * Check if given data is not defined (is undefined or is null)
 *
 * @param {*} value - The data to check against the undefinition
 * @returns {boolean} true if data is not defined, false otherwise.
 */
function isNotDefined ( value ) {
    return value === undefined || value === null
}

/**
 * Get all files in given directory path, and sub-folder if recursive is true
 * @param {String} directoryPath - The path where search for files
 * @param {Boolean} recursive - A boolean to indicate if the search need to be recursive
 * @returns {Array<String>}
 */
function getFilesInDirectory ( directoryPath, recursive = true ) {

    const dirResults = fs.readdirSync( directoryPath )
    const files      = []

    for ( let dirResult of dirResults ) {

        const elementPath = path.join( directoryPath, dirResult )
        const stat        = fs.statSync( elementPath )

        if ( stat.isFile() ) {
            files.push( elementPath )
        } else if ( stat.isDirectory() && recursive ) {
            files.push( ...getFilesInDirectory( elementPath ) )
        }

    }

    return files

}


module.exports = {
    isString,
    isDefined,
    isNotDefined,
    getFilesInDirectory
}
