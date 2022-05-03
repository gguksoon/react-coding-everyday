import './App.css';
import {useState} from 'react';

function Header(props) {
	return <header>
		<h1><a href="/" onClick={(event) => {
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
	</header>
}

function Nav(props) {
  console.log(props);
  return <nav>
    <ol>
      {props.topics.map((topics) => {
        return <li key={topics.id}>
          <a id={topics.id} href={'/read/' + topics.id} onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}>{topics.title}</a>
        </li>;
      })}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event => {
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id: 1, title: 'html', body: 'html is ...'},
    {id: 2, title: 'css', body: 'css is ...'},
    {id: 3, title: 'javascript', body: 'javascript is ...'},
  ]);
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if(mode === 'READ') {
    let title, body = null;
    topics.map(topic => {
      if(topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
      return null;
    });
    content = <Article title={title} body={body}></Article>;
    contextControl = <>
      <li><a href={"/update/" + id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>UPDATE</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = [];
        topics.map((topic) => {
          if(topic.id !== id) {
            newTopics.push(topic);
          }
          return null;
        })
        setTopics(newTopics);
        setMode('WELCOME');
      }}/></li>
    </>
  } else if(mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = {id: nextId, title, body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>;
  } else if(mode === 'UPDATE') {
    let title, body = null;
    topics.map(topic => {
      if(topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
      return null;
    });
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = [...topics];
      newTopics.map(topic => {
        if(topic.id === id) {
          topic.title = title;
          topic.body = body;
        }
        return null;
      });
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={event => {
            event.preventDefault();
            setMode('CREATE');
          }}>CREATE</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
