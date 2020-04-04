import React from 'react';
import { Table } from 'react-bootstrap';
import './App.css';

interface IProps {
}

interface IState {
  names: string[];
  inputName: string | null;
  shuffleOrder: number[];
  shuffleIndex: number;
  randomName: string;
}

export default class App extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { names: [], inputName: null, shuffleOrder: [], shuffleIndex: 0, randomName: "" }
  }

  ///
  /// Event Handlers
  ///
  handleSubmitName = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.submitName();
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = event.target.value;
    this.changeInputName(name);
  }

  handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.submitName();
    }
  }

  handleRemoveUserByIndex = (index: number) => {
    this.removeNameByIndex(index);
  }

  handleNextShuffledName = () => {
    const randomName = this.getShuffledName();
    const nextShuffleIndex = (this.state.shuffleIndex + 1) % this.state.shuffleOrder.length;
    this.setState({ shuffleIndex: nextShuffleIndex, randomName: randomName })
  }

  handleNamesListUpdated = () => {
    this.updateShuffleOrder();
  }

  ///
  /// Accessors
  ///
  getNameInputValue = (): string => {
    if (!this.state.inputName) {
      return "";
    } else {
      return this.state.inputName;
    }
  }

  getShuffledName = () => {
    if (this.state.names.length > 0) {
      const shuffleIndex = this.state.shuffleIndex;
      const listIndex = this.state.shuffleOrder[shuffleIndex];
      const name = this.state.names[listIndex];
      return name;
    } else {
      return "";
    }
  }

  /// 
  /// Behaviour
  ///
  changeInputName = (name: string) => {
    this.setState({inputName: name});
  }

  submitName = () => {
    const name = this.state.inputName;
    if (name) {
      const names = this.state.names;
      names.push(name);
      this.setState({ inputName: null, names: names, randomName: "" }, this.handleNamesListUpdated);
    }
  }

  removeNameByIndex = (index: number) => {
    const names = this.state.names.filter((item, j) => index !== j);
    this.setState({ names: names }, this.handleNamesListUpdated);
  }

  updateShuffleOrder = () => {
    const listLength = this.state.names.length;
    const unshuffledIndexes = Array.from(Array(listLength).keys());
    const shuffledIndexes = unshuffledIndexes
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    const resetShuffleIndex = 0;
    this.setState({ shuffleOrder: shuffledIndexes, shuffleIndex: resetShuffleIndex })
  }

  ///
  /// Render
  ///
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Name Picker</h1>
          <hr />
        </header>
        <section>
          <h3>Add Name</h3>
          <input className="textbox" type="text" placeholder="e.g. Michael" onChange={this.handleNameChange} onKeyDown={this.handleNameKeyDown} value={this.getNameInputValue()} />
          <button onClick={this.handleSubmitName}>Submit</button>
        </section>
        <section>
          <h3>Random Name</h3>
          <div className="random-container">
            <div className="textbox">{this.state.randomName}</div>
            <button onClick={this.handleNextShuffledName}>Random!</button>
          </div>
        </section>
        <section>
          <h3>Names</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.names.map((name, index) => {
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{name}</td>
                      <td><button onClick={() => this.handleRemoveUserByIndex(index)}>Delete</button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </section>
      </div>
    );
  }
}
