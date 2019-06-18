import React from "react";
import config from "../config";
import CircleButton from "../CircleButton/CircleButton";
import { Link } from "react-router-dom";
import "./AddNote.css"
import moment from "moment";
import ApiContext from '../ApiContext'
import propTypes from 'prop-types'

class AddNote extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      id: "",
      modified: "",
      folderId: "",
      content: "",
    };
    console.log(props);
  }

  nameChanged(name) {
    this.setState({
      name
    });
  }

  contentChanged(content) {
    this.setState({
      content
    });
  }

  handleFolderSelect(folderId) {
    this.setState({
      folderId
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const modified = moment();
    const name = this.state.name;
    const folderId = this.state.folderId;
    const content = this.state.content;
    const url = `${config.API_ENDPOINT}/notes`;
    const options = {
      method: "POST",
      body: JSON.stringify({ name, content, modified, folderId }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong, please try again later");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          name: "",
          id: "",
          modified: "",
          folderId: "",
          content: ""
        });
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  }

  render() {
    // creating folder options here
    const options = this.context.folders.map((name, id) => (
      <option value={name.id} key={id}>
        {name.name}
      </option>
    ));
    // creating folder options above here
    const error = this.state.error ? (
      <div className="error">{this.state.error}</div>
    ) : (
      ""
    );
    return (
      <section className="addnote">
        <h2>Add Note</h2>
        {error}
        <form className="addnote__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="note_name">Note Name:</label>
          <input
            type="text"
            name="note-name"
            placeholder="Note"
            value={this.state.name}
            onChange={e => this.nameChanged(e.target.value)}
          />
          <br />
          <label htmlFor="folder_name">Which folder?</label>
          <select
           id="folders"
            name="folders"
            onChange={e => this.handleFolderSelect(e.target.value)}
          >
            <option value="None">Select one...</option>
            {options}
          </select>

          <br />
          <label htmlFor="notecontent">Note Content:</label>
          <textarea
            type="text"
            name="note-content"
            placeholder="Note content"
            value={this.state.content}
            className="note-content"
            onChange={e => this.contentChanged(e.target.value)}
          />

          <div className="addnote__buttons">
            {/*<button onClick={e => this.props.showForm(false)}>Cancel</button>*/}
            <button type="submit">Save</button>
          </div>
        </form>
        <CircleButton
          tag={Link}
          to="/"
          type="button"
          className="NoteListNav__add-folder-button"
        >
          {" "}
          Home
        </CircleButton>
      </section>
    );
  }
}


AddNote.propTypes = {
  folderId: propTypes.string.isRequired,
  content: (props, propName, componentName) => {
    // first get the value of the prop
    const prop = props[propName];
    // since we want to make this required let us check that first
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation Failed`);
    }
    // the prop has a value let's check the type
    if (typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }
  },
  name: (props, propName, componentName) => {
    // first get the value of the prop
    const prop = props[propName];
    // since we want to make this required let us check that first
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation Failed`);
    }
    // the prop has a value let's check the type
    if (typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }
  }
};


export default AddNote;
