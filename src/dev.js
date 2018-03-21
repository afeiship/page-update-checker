import './dev.scss';
import ReactAntSideToggle from './main';

/*===example start===*/

// install: npm install afeiship/react-ant-side-toggle --save
// import : import ReactAntSideToggle from 'react-ant-side-toggle'

class App extends React.Component{
  state = {

  };

  constructor(props){
    super(props);
    window.demo = this;
    window.refs = this.refs;
    window.rc = this.refs.rc;
  }

  render(){
    return (
      <div className="hello-react-ant-side-toggle">
        <ReactAntSideToggle ref='rc' />
      </div>
    );
  }
}
/*===example end===*/

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
