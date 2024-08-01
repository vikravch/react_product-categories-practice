# React Product Categories Practice

> Here is [the working version](https://mate-academy.github.io/react_product-categories-practice/)

You are given a markup for a table of products and 3 arrays. 
Implement as many options below as you can:

1. Render products in a table with id, name, category, and owner (user).
    - category should render its icon before the title;
    - owner names should be colored with `has-text-link` for men and `has-text-danger` for women.
1. Implement the ability to filter products by owner:
    - If a user is selected it should be highlighted with the `is-active` class;
    - Show only products of a selected user;
    - Select `All` to see all the products.
1. Use the `input` to filter products by name.
    - Show only products having the input value in their name ignoring the case;
    - The `x` button should appear only when the value is not empty;
    - Clear the value after the `x` button click.
1. Show a `No results` message if there are no products matching the current criteria
    - `Reset All Filters` button should clear all the filters.
1. (*) Allow to select several categories:
    - Add `is-info` class to selected categories;
    - Show only products of selected categories;
    - `All` button should clear the selection;
    - Remove the `is-outlined` class from the `All` button if no categories are selected.
1. (*) Add the ability to sort products by all the columns:
    - a column should have a title with the `fa-sort` icon by default;
    - the first click sorts products by the given column ascending and use the `fa-sort-up` icon;
    - the second click sorts products in descending order and uses the `fa-sort-down` icon;
    - the third click disables sorting;
    - products are sorted by 1 column at a time (reset the column title when clicking on the other one)

## Instructions
- Fork, clone, and run `npm i`
- fix the DEMO LINK below (use your GitHub username and the repo name)
  - [DEMO LINK](https://<your-account>.github.io/<your-repo-name>)
- implement tasks one by one (You can do it in the `App.jsx`)
- `commit`, `push`, and `deploy` after each task
- Send a link to your `App.jsx` file to your personal Slack channel (for example #fe_apr22_misha_hrynko)
- Send a message about solving the next step after each `push` and `deploy` (e.g. Task 3 is done)
- If you are done with the required tasks please proceed with solving the optional once
- Stop when the time is over (typically 2.5 hours from the start)
