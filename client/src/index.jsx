import ReactDOM from 'react-dom';
import App from './App.jsx';
// import exitIntent from 'exit-intent';

// Initialise
// const removeExitIntent = exitIntent({
//     threshold: 50,
//     maxDisplays: 2,
//     eventThrottle: 100,
//     onExitIntent: () => {
//         window.open('localhost:3333', "_blank");
//     }
// });

// Destroy

ReactDOM.render(<App />, document.getElementById('root'));

// removeExitIntent();