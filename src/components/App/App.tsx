import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import s from './App.scss';
import { ImageFit } from '../ImageFit/ImageFit';

/* <-- To remove demo stuff just copy-paste:
  \{?/\*\s?<--([\n\n]|.)*?-->\s?\*\/\}?
  to your search input with RegExp enabled and remove everything matched.
--> */

interface AppProps extends InjectedTranslateProps {}

class App extends React.Component<AppProps> {
  state = {};

  async componentDidMount() {}

  render() {
    return (
      <div className={s.root}>
        <div
          style={{
            paddingTop: '20%',
            width: '400px',
            height: '200px',
            overflow: 'hidden',
          }}
        >
          <ImageFit
            image={
              'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/80516462_10212745794399171_2472339718545604608_n.jpg?_nc_cat=106&_nc_oc=AQknCsLjkPMZQ22CmcD48b_Y0NbiQgf7HPdFX-0l-6Z9EAnKsxGuUP0LYB7FKSEE3Yk&_nc_ht=scontent-waw1-1.xx&oh=22426fda1897485aeba656393c39b786&oe=5ED6F83A'
            }
            onSave={position => {
              console.log('Save position', position);
            }}
          />
        </div>
      </div>
    );
  }
}

export default translate()(App);
