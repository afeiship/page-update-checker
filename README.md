# react-ant-side-toggle
> Side toggle button for ant.


## properties:
```javascript

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    template: PropTypes.func,
  };

  static defaultProps = {
    value: false,
    onChange: noop,
    template: noop
  };
  
```
## install
```bash
import ReactAntSideToggle from 'react-ant-side-toggle';
```

## usage:
```jsx

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

```

## customize style:
```scss
// customize your styles:
$react-ant-side-toggle-options:(
);

@import 'node_modules/react-ant-side-toggle/dist/style.scss';
```
