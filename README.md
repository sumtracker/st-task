# Running this Application

Here are the steps to run and use this React app:

- First clone the github repository using the following command

```zsh
git clone git@github.com:prakharrichhariya/st-task.git
```

- Open a terminal inside the cloned folder and change directory to 'st-task' using the following command

```zsh
cd st-task
```

- Checkout to my feature branch using the following command

```zsh
git checkout feature/contact-filter-input
```

- Run the following command

```zsh
yarn install; yarn start
```

- The project will start running at http://localhost:3000.
- Open [http://localhost:3000](http://localhost:3000) to view the app in in your browser.
- Once the app is open you can see that the Contact Filter Input along with a Reset button has been implemented.
- You can start typing inside the Input area and will be able to see the contact search results accordingly.
- You can click on any Contact item, which will load the product results accordingly.
- Also an Infinite list has been implement for the contact search results, which will fetch more data once the user
  scrolls to the bottom of the list.
- The user can then hit the Reset button to reset the product list, the search bar URL and the input of Contact filter.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
