import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import ApiContext from '../ApiContext';
import config from '../config';
import "./App.css";
import { promised } from 'q';

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  componentDidMount() {
    Promise.all([
    fetch(`${config.API_ENDPOINT}/notes`),
    fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
       if(!notesRes.ok)
        return notesRes.json().then(e=>Promise.reject(e));
      if(!foldersRes.ok)
        return foldersRes.son().then(e=>Promise.reject(e));
        return Promise.all([notesRes.json(), foldersRes.sjon()]);
      })
      .then(([notes, folders]) => {
        this.setState({notes, folders});
      })
      .catch(error => {
        console.log({error});
      })
    }

    handleDeleteNote = noteID => {
      this.setState({
        notes: this.state.notes.filter(note => note.id !== noteId)
      })
    };

  renderNavRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListNav}
            />
        ))}
        <Route path ="/note/:noteId" component={NotePageNav} />
        <Route path ="/add-folder" component={NotePageNav} />
        <Route path ="/add-note" component={NotePageNav} />
            render={routeProps => (
              <NoteListNav folders={folders} notes={notes} {...routeProps} />
            )}
          />
        ))}
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
            />
        ))}
        <Route
          path="/note/:noteId"
          component={NoteListMain} />;
          }}
        />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote
    };
    return (
      <ApiContext.Provider value={value}>
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link>{" "}
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
      </ApiContext.Provider>
    );
  }
}

export default App;