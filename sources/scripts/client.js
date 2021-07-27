/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

/* global hljs $ */

( ( hljs ) => {

    hljs.highlightAll()

    $( 'div.example' ).on( 'mouseenter', ( event ) => {

        const target = $( event.target )
        let button = null
        if ( event.target.tagName === 'DIV' ) {
            button         = target.children( 'button.btn-copy' )[ 0 ]
            button.style.display = 'block'
        } else if ( event.target.tagName === 'PRE' ) {
            button         = target.parent().children( 'button.btn-copy' )[ 0 ]
            button.style.display = 'block'
        } else if ( event.target.tagName === 'CODE' ) {
            button         = target.parent().parent().children( 'button.btn-copy' )[ 0 ]
        } else {
            return
        }

        if ( !button ) { return }
        button.style.display = 'block'

    } )
    $( 'div.example' ).on( 'mouseleave', ( event ) => {

        const target = $( event.target )
        let button = null
        if ( event.target.tagName === 'DIV' ) {
            button         = target.children( 'button.btn-copy' )[ 0 ]
            button.style.display = 'block'
        } else if ( event.target.tagName === 'PRE' ) {
            button         = target.parent().children( 'button.btn-copy' )[ 0 ]
            button.style.display = 'block'
        } else if ( event.target.tagName === 'CODE' ) {
            button         = target.parent().parent().children( 'button.btn-copy' )[ 0 ]
        } else {
            return
        }

        if ( !button ) { return }
        button.style.display = 'none'

    } )

    $( '.btn-copy' ).on( 'click', ( event ) => { navigator.clipboard.writeText( event.target.dataset.code ) } )

} )( hljs )
