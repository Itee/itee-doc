/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module config/jsdocConfiguration
 *
 * @description The configuration file of the jsdoc plugin
 *
 */

/**
 * Will create an appropriate configuration object for jsdoc
 *
 * @returns {object} The jsdoc configuration
 */
function CreateJsdocConfiguration () {

    const config = {
        tags:         {
            allowUnknownTags: false,
            dictionaries:     [ 'jsdoc', 'closure' ]
        },
        source:       {
            include:        [ './sources' ],
            includePattern: '.+\\.js(doc|x)?$',
            excludePattern: '(node_modules|documentation|builds)',
            exclude:        [ './sources/components/others' ]
        },
        sourceType:   'module',
        plugins:      [],
        recurseDepth: 5,
        opts:         {
            access:      'all',
            debug:       false,
            encoding:    'utf8',
            destination: 'docs',
            recurse:     true,
            verbose:     true,
            private:     true,
            //            'tutorials':   'documentation/tutorials',
            template:    './builds'
            //            'template':    'node_modules/ink-docstrap/template'
        },
        templates:    {
            default:           {
                staticFiles:       {
                    include:        [ './builds/statics' ],
                    includePattern: '',
                    excludePattern: '',
                    exclude:        [
                        'documentation/builds',
                        'documentation/template',
                        'documentation/tutorials'
                    ]
                },
                outputSourceFiles: true,
                includeDate:       true,
                useLongnameInNav:  false
            },
            cleverLinks:       false,
            monospaceLinks:    false,
            navType:           'inline',
            theme:             'darkly',
            syntaxTheme:       'dark',
            linenums:          true,
            collapseSymbols:   false,
            sort:              'longname, version, since',
            search:            true,
            systemName:        'realworld4D',
            footer:            '<img src="./img/bg_bottom.png">',
            copyright:         'Copyright © 2020 1Spatial',
            includeDate:       false,
            inverseNav:        false,
            outputSourceFiles: true,
            outputSourcePath:  true
            //            "dateFormat"            : "{string}",
        }
    }

    return config

}

module.exports = CreateJsdocConfiguration()
