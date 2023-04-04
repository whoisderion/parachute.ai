import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [fileName, setFileName] = useState('')
  const [summary, setSummary] = useState(false)
  const [sentiment, setSentiment] = useState(false)
  const [flag, setFlag] = useState(false)
  const [callerQuestion, setCallerQuestion] = useState(false)
  const [employeeQuestion, setEmployeeQuestion] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')

  const toggleSummary = () => {
    setSummary(!summary)
  }

  const toggleSentiment = () => {
    setSentiment(!sentiment)
  }

  const toggleFlag = () => {
    setFlag(!flag)
  }

  const toggleCallerQuestion = () => {
    setCallerQuestion(!callerQuestion)
  }

  const toggleEmployeeQuestion = () => {
    setEmployeeQuestion(!employeeQuestion)
  }

  const handleSubmit = async () => {
    await getTranscript()
    await getAnalysis()

  }

  type GetTextResponse = {
    data: '';
  }

  const getTranscript = () => {
    let prompt = ''
    if (summary) {
      prompt = prompt + 'What happened in the following call transcription?'
    }
    if (sentiment) {
      prompt = prompt + 'What is the sentiment of the caller in this transcription?'
    }
    if (flag) {
      prompt = prompt + 'If the sentiment is generally negative end your response with a "<Negative>", otherwise end your response with a "<Not Negative>".'
    }
    if (callerQuestion) {
      prompt = prompt + 'What questions did the caller ask the employee?'
    }
    if (employeeQuestion) {
      prompt = prompt + 'What questions did the employee ask the caller?'
    }

    axios.get<GetTextResponse>('http://127.0.0.1:8080/openai/transcribe', { data: { data: prompt } })
      .then(res => setTranscript(res))
  }

  const getAnalysis = () => {
    axios.get<GetTextResponse>('http://127.0.0.1:8080/openai/analyze', { data: { transcript: transcript } })
      .then(res => setResponse(res))
  }

  return (
    <div className="App">
      <div className='upload-file'>
        <h3>Upload a recording</h3>
        <p>File: {`${fileName}`}</p>
        <form encType='multipart/form-data'>
          <input type="file" name="audio"></input>
          <input type='submit'>Submit</input>
        </form>
        <button>Upload</button>
      </div>
      <div className='options mt-4'>
        <div className='summary block'>
          <p className='inline-flex mr-2'>Summary {`${summary}`}</p>
          <input type="checkbox" onChange={toggleSummary} />
        </div>
        <div className='sentiment block'>
          <p className='inline-flex mr-2'>Sentiment {`${sentiment}`}</p>
          <input type="checkbox" onChange={toggleSentiment} />
        </div>
        <div className='flag block'>
          <p className='inline-flex mr-2'>Flag {`${flag}`}</p>
          <input type="checkbox" onChange={toggleFlag} />
        </div>
        <div className='customer-question block'>
          <p className='inline-flex mr-2'>Caller Question {`${callerQuestion}`}</p>
          <input type="checkbox" onChange={toggleCallerQuestion} />
        </div>
        <div className='customer-question block'>
          <p className='inline-flex mr-2'>Employee Question {`${employeeQuestion}`}</p>
          <input type="checkbox" onChange={toggleEmployeeQuestion} />
        </div>
        <button className='mt-4' onClick={handleSubmit}>Submit for analysis</button>
      </div>
      <div className='result inline-flex mt-10'>
        <div className='transcript mr-4'>
          <h3>Transcript</h3>
          <div className='openAI-response w-96 h-44 p-4 border-2 border-slate-200'>
            <p>{`${transcript}`}</p>
          </div>
        </div>
        <div className='response ml-4'>
          <h3>Response</h3>
          <div className='openAI-response w-96 h-44 p-4 border-2 border-slate-200'>
            <p>{`${response}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
