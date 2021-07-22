const path           = require( 'path' )
const fs             = require( 'fs' )
const { v4: uuidv4 } = require( 'uuid' )
const {
          getFilesInDirectory,
          isNotDefined
      }              = require( './utils' )
const logger         = require( '../../node_modules/jsdoc/lib/jsdoc/util/logger.js' )

const React          = require( 'react' )
const ReactDOMServer = require( 'react-dom/server' )
const Page           = require( '../components/Page' )
const Index          = require( '../components/Index' )
const Class          = require( '../components/Class/Class' )
const Package        = require( '../components/Packages/Package' )

/**
 * @class
 * @classdesc This renderer allow to to render React POJO descriptor into static html files
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Renderer {

    constructor ( options = {} ) {

        this.options = options

        this.availableCategories = [
            {
                key:       'class',
                label:     'Classes',
                component: Class
            },
            {
                key:       'external',
                label:     'Externals',
                component: Class
            },
            {
                key:       'file',
                label:     'Files',
                component: Class
            },
            {
                key:       'global',
                label:     'Globals',
                component: Class
            },
            {
                key:       'interface',
                label:     'Interfaces',
                component: Class
            },
            {
                key:       'mixin',
                label:     'Mixins',
                component: Class
            },
            {
                key:       'module',
                label:     'Modules',
                component: Class
            },
            {
                key:       'namespace',
                label:     'Namespaces',
                component: Class
            },
            {
                key:       'package',
                label:     'Packages',
                component: Package
            }
        ]

        /**
         * An array containing used file names to check collision and allow to generate some alternatives
         * @type {Array<String>}
         * @private
         */
        this._usedFileNames = []
        this._renderDatas = null

        /**
         *
         * @type {Map<string, string>}
         * @private
         */
        this._outputFilesNames = new Map()

    }


    /**
     *
     * @param longName
     * @returns {String}
     */
    getUniqueFilename ( longName ) {

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
        while ( this._usedFileNames.includes( fileName ) ) {
            fileName = `${ basename }_${ counter }.html`
            counter++
        }

        // Keep reference on it
        this._usedFileNames.push( fileName )

        return fileName

    }

    createDirectoryIfNotExist ( directoryPath ) {
        if ( !fs.existsSync( directoryPath ) ) {
            fs.mkdirSync( directoryPath )
        }
    }

    ///
    computeOutputPaths ( datas ) {

        datas.forEach( ( value, key ) => {

            const fileName = this.getUniqueFilename( value.longName )
            this._outputFilesNames.set( key, fileName )

        } )

    }

    computeRenderDatas ( datas ) {

        const navbar = {
            bg:      'dark',
            variant: 'dark',
            items:   []
        }

        const navbarBrand = {
            type:  'brand',
            link:  'index.html',
            label: 'Itee-Doc'
        }
        navbar.items.push( navbarBrand )

        const nav = {
            type:  'nav',
            align: 'right',
            items: []
        }
        navbar.items.push( nav )

        // Compute main categories list
        for ( let availableCategory of this.availableCategories ) {

            const categoryDropdown = this.computeCategoryList( availableCategory, datas[ availableCategory.key ] )
            if ( categoryDropdown ) { nav.items.push( categoryDropdown ) }

        }

        // Compute Tutorials list
        // Compute Graphics list

        this._renderDatas = {
            navbar:  navbar,
            content: {},
            footer:  {
                bg:      'dark',
                variant: 'dark',
                sticky:  true
            }
        }

    }

    computeCategoryList ( category, datas ) {
        if ( !datas ) { return null }

        const categoryDropdown = {
            type:  'dropdown',
            title: category.label,
            items: []
        }

        datas.forEach( ( value, key ) => {

            categoryDropdown.items.push( {
                type:  'item',
                href:  `${ category.key }\\${ this._outputFilesNames.get( value.uuid ) }`,
                label: key
            } )

        } )

        return categoryDropdown

    }

    ///

    outputStaticFiles ( outputPath ) {

        try {

            // Todo: finaly will be only __dirname/statics after bundling !
            const inputDirectory  = path.join( __dirname, '../..', 'builds', 'statics' )
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

        } catch ( error ) {
            logger.error( error )
        }

    }

    ///

    render ( datas, options ) {

        const outputPath = options.destination

        this.computeOutputPaths( datas.indexes )
        this.computeRenderDatas( datas )

        this.outputStaticFiles( outputPath )

        this.renderIndex( {
            uuid:   uuidv4(),
            readMe: this.options.readme
        }, outputPath )

        this.renderCategories( datas, outputPath )
        // Todo:       this.renderSources( outputPath )

    }

    renderIndex ( indexData, outputPath ) {

        // Avoid jsdoc warning on render even if there is only one rendered class per file
        indexData.key = indexData.uuid

        const filePath = path.join( outputPath, 'index.html' )
        const pageHtml = this.renderPage( this._renderDatas, [
            React.createElement( Index, indexData )
        ] )

        fs.writeFileSync( filePath, pageHtml )

    }

    renderCategories ( datas, outputPath ) {

        for ( let availableCategory of this.availableCategories ) {

            const dataMap = datas[ availableCategory.key ]
            if ( isNotDefined( dataMap ) ) { continue }

            const categoryOutputPath = path.join( outputPath, availableCategory.key )
            this.createDirectoryIfNotExist( categoryOutputPath )
            this.renderCategory( availableCategory, dataMap.values(), categoryOutputPath )

        }

    }

    renderCategory ( category, datas, outputPath ) {

        for ( const data of datas ) {

            // Avoid jsdoc warning on render even if there is only one rendered class per file
            data.key = data.uuid

            const fileName = data.fileName || this._outputFilesNames.get( data.uuid )
            const filePath = path.join( outputPath, fileName )

            this._renderDatas.base = '../'
            const pageHtml         = this.renderPage( this._renderDatas, [
                React.createElement( category.component, data )
            ] )

            fs.writeFileSync( filePath, pageHtml )

        }

    }

    renderPage ( props, children = [] ) {

        // Throws : FATAL: Unable to load template: Unexpected token '<'
        //    const html = ReactDOMServer.renderToStaticMarkup(<LoremIpsum name="Yougourt" />)
        const html = ReactDOMServer.renderToStaticMarkup(
            React.createElement( Page, props, children )
        )
        return `<!DOCTYPE html>${ html }`

    }

}

module.exports = Renderer
