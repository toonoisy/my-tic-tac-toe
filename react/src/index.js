import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winnerIdx = calcWinner(this.props.squares);
    // 高亮连成一线的棋子
    const className = `square ${winnerIdx?.includes(i) ? 'highlight' : ''}`;
    return (
      <Square
        className={className}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // 3 行 3 列，索引 0～8
    let k = 0;
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let cells = [];
      for (let j = 0; j < 3; j++) {
        cells.push(this.renderSquare(k++));
      }
      rows.push(<div className="board-row" key={i}>{cells}</div>);
    }
    return (
      <>
        {rows}
      </>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 state
    this.state = {
      history: [
        { squares: Array(9).fill(null), lastLocation: '' }
      ],
      stepNo: 0, //步数
      xIsNext: true, // X 棋子先行
      isAscending: true, // 默认生序排列
    }
  }
  clickSquare(i) {
    // 取索引与当前步数一致的 history，方便回退后重新下子，丢弃之前保存的后续步数
    const history = this.state.history.slice(0, this.state.stepNo + 1);
    const current = history[history.length - 1];
    // 浅复制，维持数据的不可变性
    const squares = current.squares.slice();
    const winnerIdx = calcWinner(squares);
    // 已得出胜负或格子已被填充时退出
    if (winnerIdx || squares[i]) return;
    // 轮流落子
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // 在组件中调用 setState 时，react 会自动更新其子组件（只进行必要的更新）
    this.setState({
      history: history.concat([{ squares, lastLocation: this.getLocation(i) }]),
      stepNo: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpToMove(stepNo) {
    this.setState({
      stepNo,
      xIsNext: stepNo % 2 === 0
    })
  }
  getLocation(cellIdx) {
    const colNo = cellIdx % 3 + 1;
    const rowNo = Math.ceil((cellIdx + 1) / 3);
    return `(${colNo}, ${rowNo})`;
  }
  sortMoveList() {
    const { isAscending } = this.state;
    this.setState({
      isAscending: !isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const moves = [];
    // 升降排序处理
    let type = this.state.isAscending ? 'push' : 'unshift';
    for (let i = 0; i < history.length; i++) {
      const desc = i
        ? `Go to move #${i} ${history[i].lastLocation}`
        : 'Go to game start';
      moves[type](
        <li
          key={i}
          className={this.state.stepNo === i ? 'active' : ''}
        >
          <button
            onClick={() => this.jumpToMove(i)}>{desc}</button>
        </li>
      )
    }

    const current = history[this.state.stepNo];
    const winnerIdx = calcWinner(current.squares);
    let status;
    if (winnerIdx?.length) {
      const winner = current.squares[winnerIdx[0]];
      status = `Winner ${winner}`;
    } else {
      if (this.state.stepNo === 9) {
        // 平局
        status = 'Let\'s settle for a draw';
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.clickSquare(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            className='toggleButton'
            onClick={() => this.sortMoveList()}
          >
            Order toggle
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calcWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 返回连成一线的 3 颗棋子索引
      return lines[i];
    }
  }
  return null;
}
