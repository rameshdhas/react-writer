import React, { Component, Fragment } from 'react'
import OffCanvas from 'react-aria-offcanvas'
import EditorPage from './components/editor'
import './editor.css';
import HamburgerMenu from 'react-hamburger-menu'

const Navigation = () => (
  <nav id="menu">

  </nav>
)

const styles = {
  container: {

    /*textAlign: 'center',*/
    /*fontFamily: ' -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'*/
  },
  subtitle: {
    fontSize: '1.5rem',
  },
  github: {
    marginTop: '2.5rem',
  },
}

export default class App extends Component {
  state = {
    isOpen: false,
  }

  open = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  close = () => {
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <Fragment>



          <HamburgerMenu
          	isOpen={this.state.isOpen}
          	menuClicked={this.open}
          	width={23}
          	height={15}
          	strokeWidth={2}
          	rotate={0}
          	color='black'
          	borderRadius={0}
          	className="burgermenu"
          	animationDuration={0.5}
          />

        <div id="main" style={styles.container}>


           <EditorPage/>


        </div>
        <OffCanvas
          isOpen={this.state.isOpen}
          height="100%"
          mainContainerSelector="#main"
          onClose={this.close}
          labelledby="menu-button"
        >




          <Navigation />
        </OffCanvas>
      </Fragment>
    )
  }
}