/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import './App.scss';

// импортируем данные
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategoryIcon = categoryName => {
  switch (categoryName) {
    case 'Drinks':
      return '🍺';
    case 'Grocery':
      return '🍞';
    case 'Electronics':
      return '💻';
    case 'Clothes':
      return '👚';
    case 'Fruits':
      return '🍏';
    default:
      return '';
  }
};

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const toggleCategorySelection = categoryId => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId],
    );
  };

  const clearFilters = () => {
    setSelectedUser(null);
    setSelectedCategories([]);
    setSearchTerm('');
    setSortColumn(null);
    setSortDirection(null);
  };

  const handleSort = column => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filterProducts = () => {
    return productsFromServer.filter(product => {
      const category = categoriesFromServer.find(
        cat => cat.id === product.categoryId,
      );
      const user = usersFromServer.find(usr => usr.id === category.ownerId);

      if (selectedUser && user.id !== selectedUser) {
        return false;
      }

      if (
        selectedCategories.length &&
        !selectedCategories.includes(category.id)
      ) {
        return false;
      }

      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const sortProducts = products => {
    if (!sortColumn) {
      return products;
    }

    return [...products].sort((a, b) => {
      const categoryA = categoriesFromServer.find(
        cat => cat.id === a.categoryId,
      );
      const userA = usersFromServer.find(usr => usr.id === categoryA.ownerId);
      const categoryB = categoriesFromServer.find(
        cat => cat.id === b.categoryId,
      );
      const userB = usersFromServer.find(usr => usr.id === categoryB.ownerId);

      let valueA, valueB;

      if (sortColumn === 'category') {
        valueA = categoryA.name;
        valueB = categoryB.name;
      } else if (sortColumn === 'user') {
        valueA = userA.name;
        valueB = userB.name;
      } else {
        valueA = a[sortColumn];
        valueB = b[sortColumn];
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      }

      return valueA < valueB ? 1 : -1;
    });
  };

  const filteredProducts = filterProducts();
  const sortedProducts = sortProducts(filteredProducts);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(null)}
                className={!selectedUser ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUser(user.id)}
                  className={selectedUser === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchTerm && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${selectedCategories.length ? '' : 'is-outlined'}`}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => toggleCategorySelection(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!sortedProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span
                      className="is-flex is-flex-wrap-nowrap"
                      onClick={() => handleSort('id')}
                    >
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas fa-sort${sortColumn === 'id' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span
                      className="is-flex is-flex-wrap-nowrap"
                      onClick={() => handleSort('name')}
                    >
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas fa-sort${sortColumn === 'name' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span
                      className="is-flex is-flex-wrap-nowrap"
                      onClick={() => handleSort('category')}
                    >
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas fa-sort${(() => {
                              if (sortColumn === 'category') {
                                if (sortDirection === 'asc') {
                                  return '-up';
                                }

                                return '-down';
                              }

                              return '';
                            })()}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span
                      className="is-flex is-flex-wrap-nowrap"
                      onClick={() => handleSort('user')}
                    >
                      User
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas fa-sort${sortColumn === 'user' ? (sortDirection === 'asc' ? '-up' : '-down') : ''}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => {
                  const category = categoriesFromServer.find(
                    cat => cat.id === product.categoryId,
                  );
                  const user = usersFromServer.find(
                    usr => usr.id === category.ownerId,
                  );
                  const userClass =
                    user.sex === 'm' ? 'has-text-link' : 'has-text-danger';

                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>
                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {getCategoryIcon(category.title)} - {category.title}
                      </td>
                      <td data-cy="ProductUser" className={userClass}>
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
