import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {DAppProvider, ChainId} from "@usedapp/core";

ReactDOM.render(
    <React.StrictMode>
        <DAppProvider config={{
            supportedChains: [
                ChainId.Kovan, ChainId.Rinkeby
            ],
            notifications: {
                expirationPeriod: 1000,
                checkInterval: 1000
            }
        }}>
            <App/>
        </DAppProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
