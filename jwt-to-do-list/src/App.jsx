
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TodoList from './components/TodoList';
import LogIn from './components/LogIn';

function App() {
  return (
    <div className="App">
      <section className="App-section">
        <TodoList />
        <LogIn />
     
      </section>
    </div>
  );
}

export default App;
