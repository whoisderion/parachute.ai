import './App.css'

function App() {

  return (
    <div className="App">
      <div className='upload-file'>
        <h3>Upload a recording</h3>
        <button>Upload</button>
      </div>
      <div className='options'>
        <div className='summary block'>
          <p className='inline-flex mr-2'>Summary</p>
          <input type="checkbox" />
        </div>
        <div className='sentiment block'>
          <p className='inline-flex mr-2'>Sentiment</p>
          <input type="checkbox" />
        </div>
        <div className='flag block'>
          <p className='inline-flex mr-2'>Flag</p>
          <input type="checkbox" />
        </div>
      </div>
      <div className='response mt-10'>
        <h3>Response</h3>
        <div className='openAI-response w-96 h-32 border-2 border-slate-200'>
        </div>
      </div>
    </div>
  )
}

export default App
