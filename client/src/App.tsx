import './App.css'

function App() {

  return (
    <div className="App">
      <div className='upload-file'>
        <h3>Upload a recording</h3>
        <button>Upload</button>
      </div>
      <div className='options mt-4'>
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
      <div className='result inline-flex mt-10'>
        <div className='transcript mr-4'>
          <h3>Transcript</h3>
          <div className='openAI-response w-96 h-44 p-4 border-2 border-slate-200'>
          </div>
        </div>
        <div className='response ml-4'>
          <h3>Response</h3>
          <div className='openAI-response w-96 h-44 p-4 border-2 border-slate-200'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
