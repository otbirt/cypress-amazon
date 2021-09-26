
describe('Home Test', () => {

    it('La barra de cookies se muestra y se oculta al aceptar', () => {
        cy.visit('https://www.amazon.es')
        cy.get('form[id="sp-cc"]').should('be.visible')
        cy.get('form[id="sp-cc"]').submit()
        cy.get('form[id="sp-cc"]').should('not.exist')
    })
    
    it('La imagen del banner se muestra y contiene un .jpg', () => {
        cy.get('div[id="desktop-banner"]').find('img').should('have.attr', 'src').and('contain', '.jpg')
    })

    it('Se muestra el menú todo y oscurece el fondo', () => {
        cy.get('a[id="nav-hamburger-menu"]').click()
        cy.get('div[id="hmenu-canvas"]').should('be.visible')
        cy.get('div[id="hmenu-canvas-background"]').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0.8)')
    }) 

    it('El footer tiene 4 columnas', () => {
        cy.get('div[class^="navFooterLinkCol"]').should('have.length', 4)
    })

})


describe('Buscar y ficha producto', () => {

    it('Busca un producto e intercepta la llamada de sugerencias', () => {
        cy.visit('https://www.amazon.es')
        cy.get('form[id="sp-cc"]').submit()
        cy.intercept('GET', '/suggestions*')
        cy.get('input[type="text"]').type('mp4')
        cy.get('form[id="nav-search-bar-form"]').submit()
    })

    it('Entra en un producto y contiene imagen .jpg', () => {
        cy.get('a[class="a-link-normal s-no-outline"]:first').click()
        cy.get('div[id="main-image-container"]').find('img').should('have.attr', 'src').and('contain', '.jpg')
    })

    it('Muestra el precio final de un producto', () => {
        cy.get('span[id^="priceblock"]').should('contain','€')
    })

    it('"Comprar ya" redirige a la página de login', () => {
        cy.get('span[id="submit.buy-now"]').click()
        cy.url().should('include', '/signin')
    })

})


describe('Formulario de registro', () => {

    it('Muestra error al enviar vacío', () => {
        cy.visit('https://www.amazon.es')
        cy.get('form[id="sp-cc"]').submit()
        cy.get('div[id="nav-flyout-accountList"]').invoke('show')
        cy.get('div[id="nav-flyout-ya-newCust"]').find('a').click()
        cy.get('form[id="ap_register_form"]').submit()
        cy.get('div[class*="a-alert-inline-error"]').find('i[class$="a-icon-alert"]').should('be.visible')
    })

    it('Muestra error al enviar email incorrecto', () => {
        cy.get('input[id="ap_customer_name"]').type('Nombre')
        cy.get('input[id="ap_email"]').type('email@email')
        cy.get('form[id="ap_register_form"]').submit()
        cy.get('div[id="auth-email-invalid-claim-alert"]').should('be.visible')
    })

    it('Muestra error si no coinciden las contraseñas', () => {
        cy.get('input[id="ap_email"]').type('.es')
        cy.get('input[id="ap_password"]').type('111111')
        cy.get('input[id="ap_password_check"]').type('222222')
        cy.get('form[id="ap_register_form"]').submit()
        cy.get('div[id="auth-password-mismatch-alert"]').should('be.visible')
    })

})