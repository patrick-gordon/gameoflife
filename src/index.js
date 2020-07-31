import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.cols)
  }
  render(){
    return(
      <div
      className={this.props.boxClass}
      id={this.props.id}
      onClick={this.selectBox}
      />
    )
  }
}

class Grid extends React.Component {
  render(){
    const width = (this.props.cols * 16) + 1;
    var rowsArr = [];

    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box 
          boxClass={boxClass}
          key={boxId}
          boxId={boxId}
          row={i}
          cols={j}
          selectBox={this.props.selectBox}
          />
        );
      }
    }
    return(
      <div className='grid' style={{width: width}}>
        {rowsArr}
      </div>
    )
  }
}


class Buttons extends React.Component {
  render(){
    return(
      <div>
        <button onClick={this.props.playButton}>Play</button>
        <button  onClick={this.props.pauseButton}>Pause</button>
        <button  onClick={this.props.fast}>Fast</button>
        <button  onClick={this.props.slow}>Slow</button>
        <button  onClick={this.props.clear}>Clear</button>
        <button  onClick={this.props.seed}>Seed</button>
        <button  onClick={this.props.gridSize}>Grid Size</button>
        
      </div>
    )
  }
}





class Main extends React.Component {
  constructor(){
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generations: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    })
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for(let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    })
  }

  playButton = () => {
    clearInterval(this.intervalID)
    this.intervalID = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalID)
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        // check if neighbor is occupied
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if(g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if(g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if(g[i][j + 1]) count++;
        if (j > 0 ) if(g[i][j - 1]) count++;
        if (i < this.rows - 1) if(g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if(g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && this.cols - 1) if(g[i + 1][j + 1]) count++;
        // cell lives or dies
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generations: this.state.generations + 1
    });
  }

  componentDidMount(){
    this.seed();
    this.playButton();
  }

  render(){
    return(
      <div>
        <h1>Game of Life</h1>
        <Buttons
        playButton={this.playButton}
        pauseButton={this.pauseButton}
        slow={this.slow}
        fast={this.fast}
        clear={this.clear}
        seed={this.seed}
        gridSize={this.gridSize}
        />

        <Grid 
        gridFull={this.state.gridFull}
        rows={this.rows}
        cols={this.cols}
        selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generations}</h2>
      </div>
    )
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr))
}

ReactDOM.render(<Main />, document.getElementById('root'));