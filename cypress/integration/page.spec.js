/* eslint-disable max-len */
const page = {
  resetAllButton: () => cy.byDataCy('ResetAllButton'),
  noMatchingMessage: () => cy.byDataCy('NoMatchingMessage'),
  productTable: () => cy.byDataCy('ProductTable'),
  products: () => cy.byDataCy('Product'),
  sortIcons: () => cy.byDataCy('SortIcon'),
};

const userFilter = {
  allLink: () => cy.byDataCy('FilterAllUsers'),
  users: () => cy.byDataCy('FilterUser'),
};

const nameFilter = {
  field: () => cy.byDataCy('SearchField'),
  clearButton: () => cy.byDataCy('ClearButton'),
};

const categoriesFilter = {
  categories: () => cy.byDataCy('Category'),
  allButton: () => cy.byDataCy('AllCategories'),
};

let failed = false;

Cypress.on('fail', e => {
  failed = true;
  throw e;
});

describe('', () => {
  beforeEach(() => {
    if (failed) {
      Cypress.runner.stop(); // stop testing after a first fail
    }

    cy.visit('/');
  });

  // If you want to skip some tests just add  after the describe

  describe('Page by default', () => {
    it('should show ProductTable', () => {
      page.productTable().should('exist');
    });

    it('should show all products', () => {
      page.products().should('have.length', 9);
    });

    it('should show products in the initial order', () => {
      page.products().eq(0).byDataCy('ProductName').should('have.text', 'Milk');

      page
        .products()
        .eq(1)
        .byDataCy('ProductName')
        .should('have.text', 'Bread');

      page
        .products()
        .eq(8)
        .byDataCy('ProductName')
        .should('have.text', 'Apples');
    });

    it('should show a category with Icon for each product', () => {
      page
        .products()
        .eq(0)
        .byDataCy('ProductCategory')
        .should('have.text', '🍺 - Drinks');

      page
        .products()
        .eq(1)
        .byDataCy('ProductCategory')
        .should('have.text', '🍞 - Grocery');
    });

    it('should have a user name of correct color', () => {
      page
        .products()
        .eq(0)
        .byDataCy('ProductUser')
        .should('have.text', 'Roma')
        .and('have.class', 'has-text-link');

      page
        .products()
        .eq(1)
        .byDataCy('ProductUser')
        .should('have.text', 'Anna')
        .and('have.class', 'has-text-danger');
    });
  });

  describe('Filter by owner', () => {
    it('should have a link per existing user', () => {
      userFilter.users().should('have.length', 4);

      userFilter.users().eq(0).should('have.text', 'Roma');
      userFilter.users().eq(1).should('have.text', 'Anna');
      userFilter.users().eq(2).should('have.text', 'Max');
      userFilter.users().eq(3).should('have.text', 'John');
    });

    it('should have All active by default', () => {
      userFilter.allLink().should('have.class', 'is-active');
    });

    it('should not have active users by default', () => {
      cy.get('[data-cy="FilterUser"].is-active').should('not.exist');
    });

    it('should allow to select a user', () => {
      userFilter.users().eq(0).click().should('have.class', 'is-active');
    });

    it('should highlight only selected user', () => {
      userFilter.users().eq(0).click();

      userFilter.allLink().should('not.have.class', 'is-active');

      cy.get('[data-cy="FilterUser"].is-active').should('have.length', 1);
    });

    it('should show products of a selected user', () => {
      userFilter.users().eq(0).click();

      page.products().should('have.length', 2);

      page.products().eq(0).byDataCy('ProductName').should('have.text', 'Milk');

      page.products().eq(1).byDataCy('ProductName').should('have.text', 'Beer');
    });

    it('should allow to select another user', () => {
      userFilter.users().eq(1).click();

      page.products().should('have.length', 5);

      page
        .products()
        .eq(0)
        .byDataCy('ProductName')
        .should('have.text', 'Bread');

      page
        .products()
        .eq(2)
        .byDataCy('ProductName')
        .should('have.text', 'Sugar');

      page
        .products()
        .eq(4)
        .byDataCy('ProductName')
        .should('have.text', 'Apples');
    });
  });

  describe('Filter by Product name', () => {
    it('should have an empty field by default', () => {
      nameFilter.field().should('have.value', '');
    });

    it('should not show the clear button', () => {
      nameFilter.clearButton().should('not.exist');
    });

    it('should allow to enter some text', () => {
      nameFilter.field().type('ck').should('have.value', 'ck');
    });

    it('should show products matching the input value', () => {
      nameFilter.field().type('ck');

      page.products().should('have.length', 2);

      page
        .products()
        .eq(0)
        .byDataCy('ProductName')
        .should('have.text', 'Jacket');

      page
        .products()
        .eq(1)
        .byDataCy('ProductName')
        .should('have.text', 'Socks');
    });

    it('should work case insensitively', () => {
      nameFilter.field().type('aPP');

      page.products().should('have.length', 1);

      page
        .products()
        .eq(0)
        .byDataCy('ProductName')
        .should('have.text', 'Apples');
    });

    it('should allow to change the input value', () => {
      nameFilter.field().type('k');

      page.products().should('have.length', 3);

      nameFilter.field().type('s'); // now ks

      page.products().should('have.length', 1);
    });

    it('should allow to show more products after the input value change', () => {
      nameFilter.field().type('ks');

      page.products().should('have.length', 1);

      nameFilter.field().type('{backspace}');

      page.products().should('have.length', 3);
    });

    it('should show clear button after entering a text', () => {
      nameFilter.field().type('a');

      nameFilter.clearButton().should('exist');
    });

    it('should allow to clear the input with the button', () => {
      nameFilter.field().type('app');
      nameFilter.clearButton().click();

      nameFilter.field().should('have.value', '');
    });

    it('should show the initial products after clearing the input', () => {
      nameFilter.field().type('app');
      nameFilter.clearButton().click();

      page.products().should('have.length', 9);
    });

    it('should filter products of a selected user', () => {
      nameFilter.field().type('a');
      page.products().should('have.length', 5);

      userFilter.users().eq(1).click();
      page.products().should('have.length', 4);
    });

    it('should not show products table if not matching results', () => {
      nameFilter.field().type('ab');
      page.productTable().should('not.exist');
    });

    it('should allow to change filters if no matching results', () => {
      nameFilter.field().type('ab');
      nameFilter.field().type('{backspace}');

      page.products().should('have.length', 5);
    });
  });

  describe('NoMatchingResults message', () => {
    it('should not be visible by default', () => {
      page.noMatchingMessage().should('not.exist');
    });

    it('should be shown for non matching input value', () => {
      nameFilter.field().type('hello');
      page.noMatchingMessage().should('exist');
    });

    it('should be shown for a user without products', () => {
      userFilter.users().eq(3).click();
      page.noMatchingMessage().should('exist');
    });

    it('should be shown if a selected user does not have products that match input value', () => {
      userFilter.users().eq(0).click();
      nameFilter.field().type('a');
      page.noMatchingMessage().should('exist');
    });
  });

  describe('Reset All Filters button', () => {
    it('should reset with user filter', () => {
      userFilter.users().eq(1).click();

      page.resetAllButton().click();

      page.products().should('have.length', 9);
      userFilter.allLink().should('have.class', 'is-active');
      cy.get('[data-cy="FilterUser"].is-active').should('not.exist');
    });

    it('should reset product name filter', () => {
      nameFilter.field().type('a');
      page.resetAllButton().click();

      nameFilter.field().should('have.value', '');
      page.products().should('have.length', 9);
      nameFilter.clearButton().should('not.exist');
    });

    it('should hide NoMatchingProducts message', () => {
      userFilter.users().eq(0).click();
      nameFilter.field().type('a');
      page.resetAllButton().click();

      page.noMatchingMessage().should('not.exist');
    });
  });

  // Categories tests are skiped by default
  describe.skip('Filter by categories', () => {
    it('should have All Categories Button active by default', () => {
      categoriesFilter.allButton().should('not.have.class', 'is-outlined');
    });

    it('should have buttons for all the loaded categories', () => {
      categoriesFilter.categories().should('have.length', 5);

      categoriesFilter.categories().eq(0).should('have.text', 'Grocery');
      categoriesFilter.categories().eq(1).should('have.text', 'Drinks');
      categoriesFilter.categories().eq(2).should('have.text', 'Fruits');
      categoriesFilter.categories().eq(3).should('have.text', 'Electronics');
      categoriesFilter.categories().eq(4).should('have.text', 'Clothes');
    });

    it('should not have active categories by default', () => {
      cy.get('[data-cy="Category"].is-info').should('not.exist');
    });

    it('should allow to select a category', () => {
      categoriesFilter
        .categories()
        .eq(0)
        .click()
        .should('have.class', 'is-info');
    });

    it('should show only products of a selected category', () => {
      categoriesFilter.categories().eq(0).click();

      page.products().should('have.length', 3);

      page
        .products()
        .eq(0)
        .byDataCy('ProductCategory')
        .should('have.text', '🍞 - Grocery');
      page
        .products()
        .eq(1)
        .byDataCy('ProductCategory')
        .should('have.text', '🍞 - Grocery');
      page
        .products()
        .eq(2)
        .byDataCy('ProductCategory')
        .should('have.text', '🍞 - Grocery');
    });

    it('should not have All Categories Button active is a category is selected', () => {
      categoriesFilter.categories().eq(0).click();

      categoriesFilter.allButton().should('have.class', 'is-outlined');
    });

    it('should allow to select several categories', () => {
      categoriesFilter.categories().eq(0).click();
      categoriesFilter.categories().eq(2).click();

      categoriesFilter.categories().eq(0).should('have.class', 'is-info');
      categoriesFilter.categories().eq(2).should('have.class', 'is-info');
    });

    it('should only products of all selected categories', () => {
      categoriesFilter.categories().eq(1).click();
      categoriesFilter.categories().eq(2).click();

      page.products().should('have.length', 4);

      page
        .products()
        .eq(0)
        .byDataCy('ProductCategory')
        .should('have.text', '🍺 - Drinks');
      page
        .products()
        .eq(1)
        .byDataCy('ProductCategory')
        .should('have.text', '🍏 - Fruits');
      page
        .products()
        .eq(2)
        .byDataCy('ProductCategory')
        .should('have.text', '🍺 - Drinks');
      page
        .products()
        .eq(3)
        .byDataCy('ProductCategory')
        .should('have.text', '🍏 - Fruits');
    });

    it('should allow to unselect a category directly', () => {
      categoriesFilter.categories().eq(0).click();
      categoriesFilter.categories().eq(2).click();

      categoriesFilter.categories().eq(2).click();

      categoriesFilter.categories().eq(2).should('not.have.class', 'is-info');
    });

    it('should make All Categories Button active after unselecting the last category', () => {
      categoriesFilter.categories().eq(0).click();
      categoriesFilter.categories().eq(2).click();

      categoriesFilter.categories().eq(2).click();
      categoriesFilter.categories().eq(0).click();

      categoriesFilter.allButton().should('not.have.class', 'is-outlined');
      page.products().should('have.length', 9);
    });

    it('should unselect all the categories after pressing All Categories Button', () => {
      categoriesFilter.categories().eq(0).click();
      categoriesFilter.categories().eq(2).click();
      categoriesFilter.categories().eq(4).click();

      categoriesFilter.allButton().click();

      categoriesFilter.categories().eq(0).should('not.have.class', 'is-info');
      categoriesFilter.categories().eq(2).should('not.have.class', 'is-info');
      categoriesFilter.categories().eq(4).should('not.have.class', 'is-info');
    });

    it('should make All Categories Button active after pressing it', () => {
      categoriesFilter.categories().eq(0).click();
      categoriesFilter.categories().eq(2).click();
      categoriesFilter.categories().eq(4).click();

      categoriesFilter.allButton().click();
      categoriesFilter.allButton().should('not.have.class', 'is-outlined');
    });

    it('should work together with selected user', () => {
      categoriesFilter.categories().eq(1).click();
      categoriesFilter.categories().eq(2).click();
      userFilter.users().eq(0).click();

      page.products().should('have.length', 2);

      page
        .products()
        .eq(0)
        .byDataCy('ProductCategory')
        .should('have.text', '🍺 - Drinks');
      page
        .products()
        .eq(1)
        .byDataCy('ProductCategory')
        .should('have.text', '🍺 - Drinks');

      page.products().eq(0).byDataCy('ProductUser').should('have.text', 'Roma');
      page.products().eq(1).byDataCy('ProductUser').should('have.text', 'Roma');
    });

    it('should work together with product name', () => {
      categoriesFilter.categories().eq(1).click();
      categoriesFilter.categories().eq(2).click();
      nameFilter.field().type('b');

      page.products().should('have.length', 2);

      page
        .products()
        .eq(0)
        .byDataCy('ProductName')
        .should('have.text', 'Banana');
      page.products().eq(1).byDataCy('ProductName').should('have.text', 'Beer');
    });

    it('should work together with selected user and product name', () => {
      categoriesFilter.categories().eq(1).click();
      categoriesFilter.categories().eq(2).click();
      nameFilter.field().type('b');
      userFilter.users().eq(1).click();

      page.products().should('have.length', 1);

      page
        .products()
        .eq(0)
        .byDataCy('ProductName')
        .should('have.text', 'Banana');
    });

    it('should be reset with ResetAllFilters button', () => {
      categoriesFilter.categories().eq(1).click();
      categoriesFilter.categories().eq(2).click();

      page.resetAllButton().click();

      page.products().should('have.length', 9);
      categoriesFilter.allButton().should('not.have.class', 'is-outlined');
      cy.get('[data-cy="Category"].is-info').should('not.exist');
    });
  });

  // Sorter tests are skiped by default
  describe.skip('Sorter', () => {
    it('should show all sort icons in default state', () => {
      cy.get('[data-cy="SortIcon"].fa-sort').should('have.length', 4);
      cy.get('[data-cy="SortIcon"].fa-sort-up').should('not.exist');
      cy.get('[data-cy="SortIcon"].fa-sort-down').should('not.exist');
    });

    describe('By ID', () => {
      it('should change the icon to sort-up after the first click', () => {
        page
          .sortIcons()
          .eq(0)
          .click()
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should sort products in the ascending order after the first click', () => {
        page.sortIcons().eq(0).click();

        page.products().should('have.length', 9);

        page.products().eq(0).byDataCy('ProductId').should('have.text', '1');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '2');
        page.products().eq(8).byDataCy('ProductId').should('have.text', '9');
      });

      it('should change the icon to sort-down after the second click', () => {
        page
          .sortIcons()
          .eq(0)
          .click()
          .click()
          .should('have.class', 'fa-sort-down')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-up');
      });

      it('should sort items in the descending order after the second click', () => {
        page.sortIcons().eq(0).click().click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '9');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '8');
        page.products().eq(8).byDataCy('ProductId').should('have.text', '1');
      });

      it('should change icon to the default one after the third click', () => {
        page
          .sortIcons()
          .eq(0)
          .click()
          .click()
          .click()
          .should('have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down')
          .and('not.have.class', 'fa-sort-up');
      });

      it('should reset the order after the third click', () => {
        page.sortIcons().eq(0).click().click().click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '1');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '2');
        page.products().eq(8).byDataCy('ProductId').should('have.text', '9');
      });

      it('should show sort-up icon if previously sorted by another column', () => {
        page.sortIcons().eq(1).click();
        page.sortIcons().eq(0).click();

        page
          .sortIcons()
          .eq(0)
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should show sort-up icon if previously sorted in the reversed order by another column', () => {
        page.sortIcons().eq(1).click().click();

        page.sortIcons().eq(0).click();

        page
          .sortIcons()
          .eq(0)
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should sort items in the ascending order if previously sorted in the reversed order by another column', () => {
        page.sortIcons().eq(1).click().click();

        page.sortIcons().eq(0).click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '1');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '2');
        page.products().eq(8).byDataCy('ProductId').should('have.text', '9');
      });

      it('should sort products of a selected user', () => {
        userFilter.users().eq(1).click();

        page.sortIcons().eq(0).click().click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '9');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '6');
        page.products().eq(2).byDataCy('ProductId').should('have.text', '5');
        page.products().eq(3).byDataCy('ProductId').should('have.text', '3');
        page.products().eq(4).byDataCy('ProductId').should('have.text', '2');
      });

      it('should sort products filtered by name', () => {
        nameFilter.field().type('k');

        page.sortIcons().eq(0).click().click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '8');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '4');
        page.products().eq(2).byDataCy('ProductId').should('have.text', '1');
      });

      it('should sort products of selected categories', () => {
        categoriesFilter.categories().eq(1).click();

        page.sortIcons().eq(0).click().click();

        categoriesFilter.categories().eq(2).click();
        categoriesFilter.categories().eq(4).click();

        page.products().eq(0).byDataCy('ProductId').should('have.text', '9');
        page.products().eq(1).byDataCy('ProductId').should('have.text', '8');
        page.products().eq(2).byDataCy('ProductId').should('have.text', '7');
        page.products().eq(3).byDataCy('ProductId').should('have.text', '6');
        page.products().eq(4).byDataCy('ProductId').should('have.text', '4');
        page.products().eq(5).byDataCy('ProductId').should('have.text', '1');
      });
    });

    describe('By product name', () => {
      it('should change the icon to sort-up after the first click', () => {
        page
          .sortIcons()
          .eq(1)
          .click()
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should sort products in the ascending order after the first click', () => {
        page.sortIcons().eq(1).click();

        page.products().should('have.length', 9);

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Banana');
        page
          .products()
          .eq(8)
          .byDataCy('ProductName')
          .should('have.text', 'Sugar');
      });

      it('should change the icon to sort-down after the second click', () => {
        page
          .sortIcons()
          .eq(1)
          .click()
          .click()
          .should('have.class', 'fa-sort-down')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-up');
      });

      it('should sort items in the descending order after the second click', () => {
        page.sortIcons().eq(1).click().click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Sugar');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Socks');
        page
          .products()
          .eq(8)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
      });

      it('should change icon to the default one after the third click', () => {
        page
          .sortIcons()
          .eq(1)
          .click()
          .click()
          .click()
          .should('have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down')
          .and('not.have.class', 'fa-sort-up');
      });

      it('should reset the order after the third click', () => {
        page.sortIcons().eq(1).click().click().click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Milk');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Bread');
        page
          .products()
          .eq(8)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
      });

      it('should show sort-up icon if previously sorted by another column', () => {
        page.sortIcons().eq(0).click();
        page.sortIcons().eq(1).click();

        page
          .sortIcons()
          .eq(1)
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should show sort-up icon if previously sorted in the reversed order by another column', () => {
        page.sortIcons().eq(0).click().click();

        page.sortIcons().eq(1).click();

        page
          .sortIcons()
          .eq(1)
          .should('have.class', 'fa-sort-up')
          .and('not.have.class', 'fa-sort')
          .and('not.have.class', 'fa-sort-down');
      });

      it('should sort items in the ascending order if previously sorted in the reversed order by another column', () => {
        page.sortIcons().eq(0).click().click();

        page.sortIcons().eq(1).click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Banana');
        page
          .products()
          .eq(8)
          .byDataCy('ProductName')
          .should('have.text', 'Sugar');
      });

      it('should sort products of a selected user', () => {
        userFilter.users().eq(1).click();

        page.sortIcons().eq(1).click().click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Sugar');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Eggs');
        page
          .products()
          .eq(2)
          .byDataCy('ProductName')
          .should('have.text', 'Bread');
        page
          .products()
          .eq(3)
          .byDataCy('ProductName')
          .should('have.text', 'Banana');
        page
          .products()
          .eq(4)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
      });

      it('should sort products filtered by name', () => {
        nameFilter.field().type('k');

        page.sortIcons().eq(1).click().click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Socks');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Milk');
        page
          .products()
          .eq(2)
          .byDataCy('ProductName')
          .should('have.text', 'Jacket');
      });

      it('should sort products of selected categories', () => {
        categoriesFilter.categories().eq(1).click();

        page.sortIcons().eq(1).click().click();

        categoriesFilter.categories().eq(2).click();
        categoriesFilter.categories().eq(4).click();

        page
          .products()
          .eq(0)
          .byDataCy('ProductName')
          .should('have.text', 'Socks');
        page
          .products()
          .eq(1)
          .byDataCy('ProductName')
          .should('have.text', 'Milk');
        page
          .products()
          .eq(2)
          .byDataCy('ProductName')
          .should('have.text', 'Jacket');
        page
          .products()
          .eq(3)
          .byDataCy('ProductName')
          .should('have.text', 'Beer');
        page
          .products()
          .eq(4)
          .byDataCy('ProductName')
          .should('have.text', 'Banana');
        page
          .products()
          .eq(5)
          .byDataCy('ProductName')
          .should('have.text', 'Apples');
      });
    });
  });
});
