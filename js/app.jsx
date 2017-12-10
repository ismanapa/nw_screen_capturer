import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-diff-logger';
import { Provider } from 'react-redux';
import App from './Containers/App';
import { appReducer } from './Reducers';
import DevTools from './Components/DevTools';
import Capturer from './Service/Capturer.js';
import Dom from './Service/Capturer/Dom';
import Fsys from './Service/Capturer/Fsys.js';

const capturer = new Capturer(new Fsys(), new Dom());

const storeEnhancer = compose(
    applyMiddleware(logger),
    DevTools.instrument(),
);

const store = createStore(appReducer, storeEnhancer);

render(
    <Provider store={store}>
        <div>
            <App capturer={capturer} />
            <DevTools />
        </div>
    </Provider>
    , document.querySelector('root')); 