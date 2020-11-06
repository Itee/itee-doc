/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

require( 'babel-register' )( {
    presets: [ 'react' ]
} )

const path           = require( 'path' )
const fs             = require( 'fs' )
const { v4: uuidv4 } = require( 'uuid' )

const React          = require( 'react' )
const ReactDOMServer = require( 'react-dom/server' )
const Page           = require( './components/Page' )
const LoremIpsum     = require( './components/LoremIpsum' )

const env    = require( 'jsdoc/env' )
const helper = require( 'jsdoc/util/templateHelper' )
const logger = require( 'jsdoc/util/logger' )

const linkRegex        = RegExp( '@link' )
const squaredLinkRegex = RegExp( '\\[(.*)\\]{@link (.*)}' )
const pipedLinkRegex   = RegExp( '{@link (.*)\\|(.*)}' )
const spacedLinkRegex  = RegExp( '{@link ([^ ]*) (.*)}' )
const simpleLinkRegex  = RegExp( '{@link ([^ ]*)}' )
const langRegex        = RegExp( '{@lang (.*)}' )

// VALIDATORS

function isDefined ( value ) {
    return value !== undefined && value !== null
}

function isNotDefined ( value ) {
    return value === undefined || value === null
}

function isLink ( string ) {
    return linkRegex.test( string )
}

// HELPERS

// todo: Who is the faster between { a: true, b: true... }[key] and [a,b,...].includes(key)
const usedFileNames = []

function getUniqueFilename ( longName ) {

    let basename = longName.replace( /[\\/?*:|'"<>]/g, '_' )// replace characters that can cause problems on some filesystems
                           .replace( /~/g, '-' )// use - instead of ~ to denote 'inner'
                           .replace( /#/g, '_' )// use _ instead of # to denote 'instance'
                           .replace( /\//g, '_' )// use _ instead of / (for example, in module names)
                           .replace( /\([\s\S]*\)$/, '' )// remove the variation, if any
                           .replace( /^[.-]/, '' ) // make sure we don't create hidden files, or files whose names start with a dash

    // in case we've now stripped the entire basename (uncommon, but possible):
    basename = ( basename.length ) ? basename : uuidv4()

    // Be sure it is unique
    let fileName = `${ basename }.html`
    let counter  = 0
    while ( usedFileNames.includes( fileName ) ) {
        fileName = `${ basename }_${ counter }.html`
        counter++
    }

    // Keep reference on it
    usedFileNames.push( fileName )

    return fileName

    //    const namespaces = dictionary.getNamespaces().join('|');
    //    let basename = (str || '')
    //        // use - instead of : in namespace prefixes
    //        .replace(new RegExp(`^(${namespaces}):`), '$1-')
    //        // replace characters that can cause problems on some filesystems
    //        .replace(/[\\/?*:|'"<>]/g, '_')
    //        // use - instead of ~ to denote 'inner'
    //        .replace(/~/g, '-')
    //        // use _ instead of # to denote 'instance'
    //        .replace(/#/g, '_')
    //        // use _ instead of / (for example, in module names)
    //        .replace(/\//g, '_')
    //        // remove the variation, if any
    //        .replace(/\([\s\S]*\)$/, '')
    //        // make sure we don't create hidden files, or files whose names start with a dash
    //        .replace(/^[.-]/, '');
    //
    //    // in case we've now stripped the entire basename (uncommon, but possible):
    //    basename = basename.length ? basename : '_';
    //
    //    return makeUniqueFilename(basename, str) + exports.fileExtension;
}

function getFilesInDirectory ( directoryPath, recursive = true ) {

    let files = []

    try {

        const dirResults = fs.readdirSync( directoryPath )

        for ( let dirResult of dirResults ) {

            const elementPath = path.join( directoryPath, dirResult )
            const stat        = fs.statSync( elementPath )

            if ( stat.isFile() ) {
                files.push( elementPath )
            } else if ( stat.isDirectory() && recursive ) {
                files.push( ...getFilesInDirectory( elementPath ) )
            }

        }

    } catch ( error ) {

        logger.error( error )

    }

    return files

}

// PARSERS

function parseTaffyDatas ( taffyData ) {
    const datas = {
        indexes:        new Map(),
        longNameToUuid: new Map(),

        classes:    new Map(),
        constants:  new Map(),
        externals:  new Map(),
        files:      new Map(),
        functions:  new Map(),
        globals:    new Map(),
        graphs:     new Map(),
        interfaces: new Map(),
        members:    new Map(),
        mixins:     new Map(),
        modules:    new Map(),
        namespaces: new Map(),
        packages:   new Map(),
        statics:    new Map(),
        tutorials:  new Map(),
        typedefs:   new Map()
    }

    taffyData().each( doclet => {

        let uuid = uuidv4()
        while ( datas.indexes.has( uuid ) ) {
            uuid = uuidv4()
        }

        // Parse doclet data
        const docletKind = doclet.kind
        const longName   = doclet.longname
        let docletData   = {
            uuid:        uuid,
            type:        docletKind,
            name:        doclet.name,
            longName:    doclet.longname,
            description: doclet.description || doclet.classdesc,
            scope:       doclet.scope,
            readOnly:    doclet.readonly,
            virtual:     doclet.virtual,
            contant:     doclet.contant,
            abstract:    doclet.abstract,
            augments:    doclet.augments,
            memberOf:    doclet.memberof,
            inherited:   doclet.inherited,
            inherits:    doclet.inherits,
            members:     doclet.members || [],
            see:         parseSee( doclet.see ),
            examples:    parseExamples( doclet.example ),
            license:     parseLicense( doclet.license ),
            requires:    parseRequires( doclet.requires ),
            parameters:  parseParameters( doclet.params ),
            exceptions:  parseExceptions( doclet.exceptions ),
            author:      parseAuthors( doclet.author ),
            source:      parseMeta( doclet.meta ),
            destination: {
                fileName: getUniqueFilename( longName )
            }
        }

        switch ( docletKind ) {

            case 'module':
                datas.modules.set( longName, docletData )
                break

            case 'class':
                datas.classes.set( longName, docletData )
                break

            case 'member':
                datas.members.set( longName, docletData )
                break

            case 'typedef':
                datas.typedefs.set( longName, docletData )
                break

            case 'file':
                datas.files.set( longName, docletData )
                break

            case 'namespace':
                datas.namespaces.set( longName, docletData )
                break

            case 'mixin':
                datas.mixins.set( longName, docletData )
                break

            case 'interface':
                datas.interfaces.set( longName, docletData )
                break

            case 'global':
                datas.globals.set( longName, docletData )
                break

            case 'package':
                datas.packages.set( longName, docletData )
                break

            case 'external':
                datas.externals.set( longName, docletData )
                break

            case 'constant':
                datas.constants.set( longName, docletData )
                break

            case 'function':
                datas.functions.set( longName, docletData )
                break

            default: //todo allow invalid tag ?
                throw new RangeError( `Invalid switch parameter: ${ docletKind }` )

        }

        // Keep reference of doclet
        datas.indexes.set( uuid, docletData )

        if ( datas.longNameToUuid.has( longName ) ) {
            logger.warn( '%s', `Long name collision on "${ longName }".` )
        }
        datas.longNameToUuid.set( longName, uuid )

    } )

    return datas
}

function parseLink ( link = '' ) {

    let linkMatchs    = null
    const squaredLink = link.match( squaredLinkRegex, 's' )
    if ( isNotDefined( squaredLink ) || squaredLink.length < 3 ) {

        const pipedLink = link.match( pipedLinkRegex, 's' )
        if ( isNotDefined( pipedLink ) || pipedLink.length < 3 ) {

            const spacedLink = link.match( spacedLinkRegex, 's' )
            if ( isNotDefined( spacedLink ) || spacedLink.length < 3 ) {

                const simpleLink = link.match( simpleLinkRegex, 's' )
                if ( isNotDefined( simpleLink ) || simpleLink.length < 2 ) {

                    logger.error( `Invalide link matching: ${ link }` )

                } else {
                    linkMatchs = {
                        type:  'link',
                        label: null,
                        url:   simpleLink[ 1 ]
                    }
                }
            } else {
                linkMatchs = {
                    type:  'link',
                    label: spacedLink[ 2 ],
                    url:   spacedLink[ 1 ]
                }
            }

        } else {
            linkMatchs = {
                type:  'link',
                label: pipedLink[ 2 ],
                url:   pipedLink[ 1 ]
            }
        }

    } else {
        linkMatchs = {
            type:  'link',
            label: squaredLink[ 1 ],
            url:   squaredLink[ 2 ]
        }
    }

    return linkMatchs

}

function parseLicense ( license = '' ) {
    let result = ''

    if ( isDefined( license ) ) {

        if ( isLink( license ) ) {
            result = parseLink( license )
        } else {
            result = license
        }

    }

    return result
}

function parseType ( type = {} ) {
    let result = []

    if ( isDefined( type.names ) ) {
        result = type.names
    } else if ( isDefined( type.parsedType ) ) {
        result = type.parsedType.name
    }

    return result
}

function parseSee ( sees = [] ) {
    const results   = []
    let link        = null
    let description = null

    for ( let see of sees ) {

        if ( isLink( see ) ) {
            link                    = parseLink( see )
            const descriptionMatchs = see.match( /{@link .*}(.*)/ )
            if ( descriptionMatchs ) {
                description = descriptionMatchs[ 1 ].trim()
            }
        } else {
            description = see
        }

        results.push( {
            link:        link,
            description: description
        } )

    }

    return results
}

function parseExamples ( examples = [] ) {
    const results = []
    let lang      = null
    let content   = null

    for ( let example of examples ) {

        const langMatchs = example.match( langRegex )
        if ( langMatchs ) {
            lang = langMatchs[ 1 ]

            const langTagLength = langMatchs[ 0 ].length
            content             = example.slice( langTagLength )
        } else {
            lang    = 'javascript'
            content = example
        }

        results.push( {
            lang:    lang,
            content: content
        } )

    }

    return results
}

function parseParameters ( parameters = [] ) {

    const result = []
    let target

    for ( let parameter of parameters ) {

        const parameterName = parameter.name
        target              = null

        if ( parameterName.includes( '.' ) ) {

            const parameterKeyPath  = parameterName.split( '.' )
            let currentPropertyName = null

            while ( parameterKeyPath.length > 0 ) {

                currentPropertyName = parameterKeyPath.shift()

                let propertyElement = null
                if ( target === null ) {
                    propertyElement = result.filter( ( prop ) => {
                        return ( prop.name === currentPropertyName )
                    } )
                } else {
                    propertyElement = target.properties.filter( ( prop ) => {
                        return ( prop.name === currentPropertyName )
                    } )
                }

                if ( propertyElement && propertyElement.length > 0 ) {
                    target = propertyElement[ 0 ]
                } else {
                    logger.error( `Intermediate property ${ currentPropertyName } does not exist in path: ${ parameterName }` )
                    break
                }

                if ( parameterKeyPath.length === 1 ) {

                    if ( !target.properties ) {
                        target.properties = []
                    }

                    const propertyName = parameterKeyPath[ 0 ]

                    target.properties.push( {
                        name:         propertyName,
                        optional:     parameter.optional,
                        defaultValue: parameter.defaultvalue,
                        description:  parameter.description,
                        type:         parseType( parameter.type ),
                        properties:   []
                    } )

                    break

                }

            }

        } else {

            result.push( {
                name:         parameter.name,
                optional:     parameter.optional,
                defaultValue: parameter.defaultvalue,
                description:  parameter.description,
                type:         parseType( parameter.type ),
                properties:   []
            } )

        }

    }

    return result

}

function parseRequires ( requires = [] ) {
    return requires.map( require => {
        return isLink( require ) ? parseLink( require ) : require
    } )
}

function parseAuthors ( authors = [] ) {
    return authors.map( author => {
        return isLink( author ) ? parseLink( author ) : author
    } )
}

function parseExceptions ( exceptions = [] ) {
    const results = []

    for ( let exception of exceptions ) {
        results.push( {
            type:        parseType( exception.type ),
            description: exception.description
        } )
    }

    return results
}

function parseMeta ( meta = {} ) {
    return {
        path:         meta.path || '',
        filename:     meta.filename || '',
        lineNumber:   meta.lineno || 0,
        columnNumber: meta.columnno || 0
    }
}

// BINDING

function processDatas ( datas ) {

    const templateDatas = {
        navbar:  {
            brand: 'Itee-Doc',
            menus: [ {
                align: 'left',
                items: [ 'foo', 'bar', 'baz' ]
            } ]
        },
        content: {},
        footer:  {
            bg:      'dark',
            variant: 'dark',
            sticky:  true
        }
    }

    // Affect members to parent
    for ( const member of datas.members.values() ) {

        const memberOf   = member.memberOf
        const parentUuid = datas.longNameToUuid.get( memberOf )
        const parent     = datas.indexes.get( parentUuid )
        if ( isNotDefined( parent ) ) {
            logger.warn( `Unable to bind member [${ member.name }] to ${ memberOf }. ${ memberOf } is not defined !` )
            continue
        }

        if ( isNotDefined( parent.members ) ) {
            parent.members = []
        }

        parent.members.push( member )

    }

    return templateDatas

}

// RENDERERS

function outputStaticFiles ( outputPath ) {

    // Todo: finaly will be only __dirname/statics after bundling !
    const inputDirectory  = path.join( __dirname, '..', 'builds', 'statics' )
    //    const inputDirectory  = path.join( __dirname, 'builds', 'statics' )
    const outputDirectory = path.resolve( outputPath )
    const files           = getFilesInDirectory( inputDirectory )

    for ( let inputFilePath of files ) {

        const relativeOutputFilePath  = inputFilePath.replace( inputDirectory, '' )
        const relativeOutputDirectory = path.dirname( relativeOutputFilePath )
        const finalOutputDirectory    = path.join( outputDirectory, relativeOutputDirectory )

        const directoryExist = fs.existsSync( finalOutputDirectory )
        if ( !directoryExist ) {

            const success = fs.mkdirSync( finalOutputDirectory, { recursive: true } )
            if ( isNotDefined( success ) ) {
                logger.error( `Unable to create directory structure: ${ finalOutputDirectory }` )
                continue
            }

        }

        const fileName       = path.basename( inputFilePath )
        const outputFilePath = path.join( finalOutputDirectory, fileName )
        fs.copyFileSync( inputFilePath, outputFilePath )
        logger.info( `Copying static file ${ inputFilePath } to ${ outputFilePath }` )

    }

    // Todo: user specified files

}

function renderPage ( props, children = [] ) {

    // Throws : FATAL: Unable to load template: Unexpected token '<'
    //    const html = ReactDOMServer.renderToStaticMarkup(<LoremIpsum name="Yougourt" />)
    const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement( Page, props, children )
    )
    return `<!DOCTYPE html>${ html }`

}

function renderClasses ( pageProps, classes, outputPath ) {

    for ( const classData of classes ) {

        const fileName = classData.destination.fileName
        const filePath = path.join( outputPath, fileName )
        const pageHtml = renderPage( pageProps, [
            React.createElement( LoremIpsum, classData )
        ] )

        fs.writeFileSync( filePath, pageHtml )

    }

}

function renderDoc ( pageProps, datas, options ) {

    const outputPath = options.destination

    outputStaticFiles( outputPath )
    renderClasses( pageProps, datas.classes.values(), outputPath )

}

exports.publish = function ( taffyData, jsdocOpts ) {

    const safeTaffyData = helper.prune( taffyData )
    const options       = {
        ...env.conf.templates,
        ...jsdocOpts
    }
    const datas         = parseTaffyDatas( safeTaffyData )
    const templateDatas = processDatas( datas )

    renderDoc( templateDatas, datas, options )

}
