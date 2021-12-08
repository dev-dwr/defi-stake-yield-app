import React from 'react';
import {Header} from "./components/Header"
import {Container} from "@material-ui/core"
import {Main} from "./components/Main"

function App() {
  return (
      <Container maxWidth="md">
      <Header/>
          <Main/>
    </Container>
  );
}

export default App;
