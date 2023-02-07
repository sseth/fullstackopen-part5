/* eslint-disable semi */
describe('Bloglist app', function() {
  beforeEach(function() {
    cy.resetDB()
    cy.createUser({
      name: 'Test User',
      username: 'testuser1234',
      password: 'abcd1234'
    })
  })

  describe('login form', function() {
    beforeEach(function() {
      cy.visit('')
    })

    it('is shown by default', function() {
      cy.contains('log in')
    })

    it('successfully logs in with correct credentials', function() {
      cy.get('#username').type('testuser1234')
      cy.get('#password').type('abcd1234')
      cy.get('#login').click()
      cy.contains('logged in as Test User')
    })

    it('fails to log in with incorrect credentials', function() {
      cy.get('#username').type('testuser1234')
      cy.get('#password').type('abcd123')
      cy.get('#login').click()
      cy.get('.notif.error')
        .should('contain', 'Login failed: incorrect password')
        .and('have.css', 'border', '2px solid rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'testuser1234',
        password: 'abcd1234'
      })
    })

    describe('new blog form', function() {
      it('should create a new blog', function() {
        cy.contains('create blog').click();
        cy.get('#title').type('a')
        cy.get('#author').type('b')
        cy.get('#url').type('c')
        cy.get('#add').click()
        cy.get('.notif')
          .should('have.css', 'border', '2px solid rgb(0, 128, 0)')
          .and('contain', 'New blog post \'a\' by b added')
        cy.get('.bloglist').contains('a by b')
      })
    })

    describe('blog post', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'a',
          author: 'b',
          url: 'c'
        })
        cy.contains('view').as('viewButton')
      })

      it('can be liked', function() {
        cy.get('@viewButton').click()
        cy.contains('like').as('likeButton')
        cy.get('@likeButton').click()
        cy.get('@likeButton').parent().should('contain', 'likes: 1')
      })

      it('can be deleted by the user who created it', function() {
        cy.get('@viewButton').click()
        cy.contains('remove').click()
        cy.contains('a by b').should('not.exist')
        cy.get('.notif')
          .should('contain', 'Deleted post')
          .and('have.css', 'border', '2px solid rgb(0, 128, 0)')
      })

      it('does not show the delete button for other users', function() {
        const username = 'user2'
        const password = 'abcd'
        cy.createUser({
          name: 'User 2',
          username,
          password,
        })
        localStorage.clear()
        cy.login({ username, password })
        cy.get('@viewButton').click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('blog list', function() {
      it('should be ordered by likes', function() {
        cy.createBlog({
          title: 'third',
          author: 'c',
          url: '...',
          likes: 3,
        })
        cy.createBlog({
          title: 'first',
          author: 'a',
          url: '...',
          likes: 1,
        })
        cy.createBlog({
          title: 'second',
          author: 'b',
          url: '...',
          likes: 2,
        })
        cy.get('.blog').eq(0).should('contain', 'first by a')
        cy.get('.blog').eq(1).should('contain', 'second by b')
        cy.get('.blog').eq(2).should('contain', 'third by c')
      })
    })
  })
})
