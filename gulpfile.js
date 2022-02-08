/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module Building
 *
 * @description The gulp tasks file. It allow to run some tasks from command line interface.<br>
 * The available tasks are:
 * <ul>
 * <li>help</li>
 * <li>patch</li>
 * <li>clean</li>
 * <li>lint</li>
 * <li>doc</li>
 * <li>unit</li>
 * <li>bench</li>
 * <li>test</li>
 * <li>build-test</li>
 * <li>build</li>
 * <li>release</li>
 * </ul>
 * You could find a complet explanation about these tasks using: <b>npm run help</b>.
 *
 * @requires {@link module: [gulp]{@link https://github.com/gulpjs/gulp}}
 * @requires {@link module: [gulp-jsdoc3]{@link https://github.com/mlucool/gulp-jsdoc3}}
 * @requires {@link module: [gulp-eslint]{@link https://github.com/adametry/gulp-eslint}}
 * @requires {@link module: [del]{@link https://github.com/sindresorhus/del}}
 * @requires {@link module: [minimist]{@link https://github.com/substack/minimist}}
 * @requires {@link module: [rollup]{@link https://github.com/rollup/rollup}}
 * @requires {@link module: [path]{@link https://nodejs.org/api/path.html}}
 * @requires {@link module: [karma]{@link https://github.com/karma-runner/karma}}
 * @requires {@link module: [fancy-log]{@link https://github.com/js-cli/fancy-log}}
 * @requires {@link module: [ansi-colors]{@link https://github.com/doowb/ansi-colors}}
 *
 *
 */

/* eslint-env node */

const packageInfos = require( './package.json' )
const gulp         = require( 'gulp' )
const jsdoc        = require( 'gulp-jsdoc3' )
const eslint       = require( 'gulp-eslint' )
const del          = require( 'del' )
const sass         = require( 'gulp-sass' )( require( 'sass' ) )
const cleanCss     = require( 'gulp-clean-css' )
const concat       = require( 'gulp-concat' )
const terser       = require( 'gulp-terser' )
const rename       = require( 'gulp-rename' )
const insert       = require( 'gulp-insert' )
const log          = require( 'fancy-log' )
const colors       = require( 'ansi-colors' )
const red          = colors.red
const green        = colors.green
const blue         = colors.blue
const cyan         = colors.cyan
const yellow       = colors.yellow
const magenta      = colors.magenta

/**
 * @method npm run help ( default )
 * @global
 * @description Will display the help in console
 */
gulp.task( 'help', ( done ) => {

    log( '' )
    log( '====================================================' )
    log( '|                      HELP                        |' )
    log( '|                Itee Plugin Three                 |' )
    log( `|                     v${ packageInfos.version }                       |` )
    log( '====================================================' )
    log( '' )
    log( 'Available commands are:' )
    log( '\t', blue( 'npm run' ), cyan( 'help' ), ' - Display this help.' )
    log( '\t', blue( 'npm run' ), cyan( 'patch' ), ' - Will apply some patch/replacements in dependencies.', red( '(Apply only once after run "npm install")' ) )
    log( '\t', blue( 'npm run' ), cyan( 'clean' ), ' - Will delete builds and temporary folders.' )
    log( '\t', blue( 'npm run' ), cyan( 'lint' ), ' - Will run the eslint in pedantic mode with auto fix when possible.' )
    log( '\t', blue( 'npm run' ), cyan( 'doc' ), ' - Will run jsdoc, and create documentation under `documentation` folder, using the docdash theme' )
    log( '\t', blue( 'npm run' ), cyan( 'test' ), ' - Will run the test framworks (unit and bench), and create reports under `documentation/report` folder, using the mochawesome theme' )
    log( '\t', blue( 'npm run' ), cyan( 'unit' ), ' - Will run the karma server for unit tests.' )
    log( '\t', blue( 'npm run' ), cyan( 'bench' ), ' - Will run the karma server for benchmarks.' )
    log( '\t', blue( 'npm run' ), cyan( 'build' ), yellow( '--' ), green( '<options>' ), ' - Will build the application for development and/or production environments.', yellow( 'Note: The two dash are only required if you provide options !' ) )
    log( '\t\t The available', green( '<options>' ), 'are:' )
    log( '\t\t\t', green( '-n' ), 'or', green( '--name' ), ' - The export name of the builded application', red( '(required for UMD module)' ), cyan( '[Default: ""]' ), '.' )
    log( '\t\t\t', green( '-i' ), 'or', green( '--input' ), ' - The main file path to build', cyan( '[Default: "sources/main.js"]' ), '.' )
    log( '\t\t\t', green( '-o' ), 'or', green( '--output' ), ' - The folder where output the build', cyan( '[Default: "builds"]' ), '.' )
    log( '\t\t\t', green( '-f:' ), magenta( '<format>' ), 'or', green( '--format:' ), magenta( '<format>' ), ' - to specify the output build type. Where format could be any of:', magenta( 'amd' ), magenta( 'cjs' ), magenta( 'es' ), magenta( 'iife' ), magenta( 'umd' ), cyan( '[Default: "amd,cjs,es,iife,umd"]' ), '.' )
    log( '\t\t\t', green( '-e:' ), magenta( '<env>' ), 'or', green( '--env:' ), magenta( '<env>' ), ' - to specify the build environment. Where env could be any of:', magenta( 'dev' ), magenta( 'prod' ), cyan( '[Default: "dev"]' ), '.' )
    log( '\t\t\t', green( '-s' ), 'or', green( '--sourcemap' ), ' - to build with related source map', cyan( '[Default: true]' ), '.' )
    log( '\t\t\t', green( '-t' ), 'or', green( '--treeshake' ), ' - allow to perform treeshaking when building', cyan( '[Default: true]' ), '.' )
    log( '\t', blue( 'npm run' ), cyan( 'release' ), ' - Will run all the lint, test stuff, and if succeed will build the application.' )
    log( '' )
    log( 'In case you have', blue( 'gulp' ), 'installed globally, you could use also:' )
    log( '\t', blue( 'gulp' ), cyan( 'command' ), ' - It will perform the command like using "npm run" but with less characters to type... Because you\'re a developer, right ?' )
    log( '' )

    done()

} )

/**
 * @method npm run patch
 * @global
 * @description Will apply some patch/replacements in dependencies
 */
gulp.task( 'patch', () => {

    const filesToPatch = [
        './node_modules/react-bootstrap/cjs/Col.js'
    ]

    return gulp.src( filesToPatch, { base: './' } )
               .pipe( insert.append( 'module.exports = exports.default;' ) )
               .pipe( gulp.dest( '.' ) )

} )

/**
 * @method npm run clean
 * @global
 * @description Will delete builds and temporary folders
 */
gulp.task( 'clean', () => {

    const filesToClean = [
        'builds',
        'docs',
        'tests/_results'
    ]

    return del( filesToClean )

} )

/**
 * @method npm run lint
 * @global
 * @description Will lint the sources files and try to fix the style when possible
 */
gulp.task( 'lint', () => {

    const filesToLint = [
        'gulpfile.js',
        'configs/**/*.js',
        'sources/**/*.js',
        'tests/**/*.js',
        '!tests/_results/**'
    ]

    return gulp.src( filesToLint, { base: './' } )
               .pipe( eslint( {
                   allowInlineConfig: true,
                   globals:           [],
                   fix:               true,
                   quiet:             false,
                   envs:              [],
                   configFile:        './configs/eslint.conf.js',
                   parserOptions:     {},
                   plugins:           [],
                   rules:             {},
                   useEslintrc:       false
               } ) )
               .pipe( eslint.format( 'stylish' ) )
               .pipe( gulp.dest( '.' ) )
               .pipe( eslint.failAfterError() )

} )

/**
 * @method npm run doc
 * @global
 * @description Will generate this documentation
 */
gulp.task( 'doc', ( done ) => {

    const config     = require( './configs/jsdoc.config' )
    const filesToDoc = [ './', '!./' ]

    gulp.src( filesToDoc, {
            read:       false,
            allowEmpty: true
        } )
        .pipe( jsdoc( config, done ) )

    //    const filesToDoc = [
    ////        'README.md',
    ////        'gulpfile.js',
    ////        './configs/*.js',
    ////        './sources/**/*.js',
    ////        './tests/**/*.js',
    //        './tests/itee-database.js',
    //    ]
    //
    //    gulp.src( filesToDoc, { read: false } )
    //        .pipe( jsdoc( config, done ) )

} )

gulp.task( 'test', ( done ) => {

    const config     = require( './tests/test.conf.json' )
    const filesToDoc = [ './', '!./' ]

    gulp.src( filesToDoc, {
            read:       false,
            allowEmpty: true
        } )
        .pipe( jsdoc( config, done ) )

} )

/**
 * @description Build less/sass files from assets, and concat them into one file by application
 */
gulp.task( 'build-style', () => {

    const styleFiles = [
        './sources/styles/style.scss',
        [
            './node_modules/@highlightjs/cdn-assets/styles/a11y-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/a11y-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/agate.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/an-old-hope.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/androidstudio.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/arduino-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/arta.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/ascetic.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/atom-one-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/atom-one-dark-reasonable.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/atom-one-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/brown-paper.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/codepen-embed.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/color-brewer.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/default.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/devibeans.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/docco.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/far.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/foundation.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/github.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/github-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/github-dark-dimmed.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/gml.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/googlecode.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/gradient-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/gradient-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/grayscale.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/hybrid.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/idea.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/ir-black.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/isbl-editor-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/isbl-editor-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/kimbie-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/kimbie-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/lightfair.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/lioshi.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/magula.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/mono-blue.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/monokai.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/monokai-sublime.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/night-owl.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/nnfx-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/nnfx-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/nord.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/obsidian.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/paraiso-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/paraiso-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/pojoaque.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/purebasic.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/qtcreator-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/qtcreator-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/rainbow.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/routeros.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/school-book.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/shades-of-purple.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/srcery.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/stackoverflow-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/stackoverflow-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/sunburst.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/tomorrow-night-blue.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/tomorrow-night-bright.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/vs.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/vs2015.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/xcode.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/xt256.min.css',

            './node_modules/@highlightjs/cdn-assets/styles/base16/3024.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/apathy.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/apprentice.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ashes.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-cave.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-cave-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-dune.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-dune-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-estuary.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-estuary-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-forest.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-forest-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-heath.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-heath-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-lakeside.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-lakeside-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-plateau.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-plateau-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-savanna.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-savanna-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-seaside.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-seaside-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-sulphurpool.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atelier-sulphurpool-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/atlas.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/bespin.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-bathory.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-burzum.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-dark-funeral.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-gorgoroth.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-immortal.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-khold.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-marduk.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-mayhem.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-nile.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/black-metal-venom.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/brewer.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/bright.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/brogrammer.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/brush-trees.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/brush-trees-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/chalk.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/circus.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/classic-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/classic-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/codeschool.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/colors.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/cupcake.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/cupertino.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/danqing.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/darcula.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/dark-violet.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/darkmoss.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/darktooth.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/decaf.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/default-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/default-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/dirtysea.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/dracula.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/edge-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/edge-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/eighties.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/embers.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/equilibrium-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/equilibrium-gray-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/equilibrium-gray-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/equilibrium-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/espresso.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/eva.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/eva-dim.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/flat.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/framer.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/fruit-soda.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gigavolt.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/github.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/google-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/google-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/grayscale-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/grayscale-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/green-screen.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-dark-hard.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-dark-medium.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-dark-pale.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-dark-soft.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-light-hard.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-light-medium.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/gruvbox-light-soft.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/hardcore.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/harmonic16-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/harmonic16-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/heetch-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/heetch-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/helios.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/hopscotch.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/horizon-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/horizon-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/humanoid-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/humanoid-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ia-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ia-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/icy-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ir-black.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/isotope.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/kimber.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/london-tube.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/macintosh.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/marrakesh.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/materia.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/material.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/material-darker.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/material-lighter.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/material-palenight.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/material-vivid.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/mellow-purple.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/mexico-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/mocha.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/monokai.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/nebula.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/nord.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/nova.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ocean.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/oceanicnext.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/one-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/onedark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/outrun-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/papercolor-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/papercolor-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/paraiso.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/pasque.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/phd.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/pico.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/pop.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/porple.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/qualia.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/railscasts.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/rebecca.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ros-pine.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ros-pine-dawn.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/ros-pine-moon.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/sagelight.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/sandcastle.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/seti-ui.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/shapeshifter.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/silk-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/silk-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/snazzy.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/solar-flare.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/solar-flare-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/solarized-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/solarized-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/spacemacs.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/summercamp.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/summerfruit-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/summerfruit-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/synth-midnight-terminal-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/synth-midnight-terminal-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/tango.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/tender.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/tomorrow.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/tomorrow-night.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/twilight.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/unikitty-dark.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/unikitty-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/vulcan.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-10.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-10-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-95.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-95-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-high-contrast.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-high-contrast-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-nt.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/windows-nt-light.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/woodland.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/xcode-dusk.min.css',
            './node_modules/@highlightjs/cdn-assets/styles/base16/zenburn.min.css'
        ][ 10 ] // 1, 10 ok
    ]

    // Todo: need to be params
    const outputFolder       = './builds/statics/styles/'
    const fileName           = 'style.css'
    const fileNameMinimified = 'style.min.css'

    return gulp.src( styleFiles )
               .pipe( sass() )
               .pipe( concat( fileName ) )
               .pipe( gulp.dest( outputFolder ) )
               .pipe( concat( fileNameMinimified ) )
               .pipe( cleanCss() )
               .pipe( gulp.dest( outputFolder ) )

} )

gulp.task( 'copy-publish', () => {

    return gulp.src( './sources/scripts/publish.js' )
               .pipe( gulp.dest( './builds' ) )

} )

gulp.task( 'bundle-scripts', () => {

    const scriptsToBundle   = [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        './node_modules/@highlightjs/cdn-assets/highlight.js',
        './sources/scripts/client.js'
    ]
    const outputFileName    = 'itee-doc.js'
    const outputMinFileName = 'itee-doc.min.js'
    const outputDirectory   = './builds/statics/scripts'

    return gulp.src( scriptsToBundle )
               .pipe( concat( outputFileName ) )
               .pipe( insert.append( 'hljs.highlightAll();' ) )
               .pipe( gulp.dest( outputDirectory ) )
               .pipe( rename( outputMinFileName ) )
               .pipe( terser() )
               .pipe( gulp.dest( outputDirectory ) )
} )

gulp.task( 'build-script', gulp.parallel( 'copy-publish', 'bundle-scripts' ) )

/**
 * @method npm run build
 * @global
 * @description Will build itee client module using optional arguments. See help to further informations.
 */
gulp.task( 'build', gulp.series( 'build-style', 'build-script' ) )

/**
 * @method npm run release
 * @global
 * @description Will perform a complet release of the library including 'clean', 'lint', 'doc', 'build-test', 'test' and finally 'build'.
 */
gulp.task( 'release', gulp.series( 'clean', 'lint', 'build', 'test', 'doc' ) )

//---------

gulp.task( 'default', gulp.series( 'help' ) )
