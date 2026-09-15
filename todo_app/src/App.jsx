import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import pic1 from "./884961ae28123f088a4a16c84449c73d-removebg-preview.png";
import pic2 from "./download.png";
import pic7 from "./a682572a4daec7218f92df8b4df6db1d-removebg-preview.png";
import pic8 from "./a682572a4daec7218f92df8b4df6db1d.jpg";
import pic9 from "./0f3b480da13ed1866f13b658fecd270e.jpg";
import pic10 from "./1f4d7742f6ad75cbd1bcb6571bfbd9b4.png";


function App() {

  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState(''); 
  const [backendAvailable, setBackendAvailable] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:3000');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setTodo(data);
      setBackendAvailable(true);
    } catch (error) {
      setBackendAvailable(false);
      const savedTodos = localStorage.getItem('todos');
      setTodo(savedTodos ? JSON.parse(savedTodos) : []);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!backendAvailable) {
      localStorage.setItem('todos', JSON.stringify(todo));
    }
  }, [todo, backendAvailable]);

  const addTodo = async () => {
    if (!title.trim()) return;
    
    if (backendAvailable) {
      try {
        await fetch('http://localhost:3000', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        setTitle('');
        fetchTodos();
        return;
      } catch (e) {
        setBackendAvailable(false);
      }
    }
    
    const newTodo = { id: Date.now().toString(), title, completed: false };
    setTodo([...todo, newTodo]);
    setTitle('');
  };

  const updateTodo = async (item) => {
    if (backendAvailable) {
      try {
        await fetch(`http://localhost:3000/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: item.title, completed: !item.completed })
        });
        fetchTodos();
        return;
      } catch (e) {
        setBackendAvailable(false);
      }
    }
    
    setTodo(todo.map((t) => (t.id === item.id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = async (id) => {
    if (backendAvailable) {
      try {
        await fetch(`http://localhost:3000/${id}`, {
          method: 'DELETE'
        });
        fetchTodos();
        return;
      } catch (e) {
        setBackendAvailable(false);
      }
    }
    
    setTodo(todo.filter((t) => t.id !== id));
  };


  return (
    <>

   <main>

  <section id="section1">
    <img  src={pic7} alt="Decoration" />
    {/* <img src={pic8} alt="Decoration" /> */}
  <br></br><br></br><br></br><br></br><br></br><br></br>
    <img src={pic10} alt="Decoration" />
  </section>

  <section id="section2">
    <div>
      <h1>My To Do List</h1>

      <label>Add To Do:</label>
      <input type='text'  placeholder="Add new todo" value={title}  onChange={(e) => setTitle(e.target.value)}  />

      <button onClick={addTodo}>Add</button>
    </div> 

     <ul>
      {todo.map((item) => (
        <li key={item.id}>
          <span
            style={{
              textDecoration: item.completed ? "line-through" : "none", "padding-right":"15px", fontSize:"25px"
            }}
          >
            {item.title}  { }
          </span>
          

          <button onClick={() => updateTodo(item)}>Toggle</button>
          <button onClick={() => deleteTodo(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </section>

  <section id="section3">
    <img style={{
              height:"400px"
            }} src={pic1} alt="Decoration" />
    <br></br><br></br><br></br><br></br>
    <img src={pic2} alt="Decoration" />
  </section>

</main>

    </>
  )};


export default App
