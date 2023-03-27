import './App.css'

function App() {

  return (
    <div className="App">
      <div className='upload-file'>
        <h3>Upload a recording</h3>
        <button>X</button>
      </div>
      <div className='options'>
        <div>
          <p>Summary</p>
          <input type="checkbox" />
        </div>
        <div>
          <p>Sentiment</p>
          <input type="checkbox" />
        </div>
        <div>
          <p>Flag</p>
          <input type="checkbox" />
        </div>
      </div>
      <div className='response'>
        <h3>Response</h3>
        <div className='openAI-response'>
        </div>
      </div>
    </div>
  )
}

export default App
