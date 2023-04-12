"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("./App.css");
const axios_1 = __importDefault(require("axios"));
// import { UserAuth, AuthContextProvider } from "./AuthContext";
function App() {
    const [fileName, setFileName] = (0, react_1.useState)('');
    const [summary, setSummary] = (0, react_1.useState)(false);
    const [sentiment, setSentiment] = (0, react_1.useState)(false);
    const [flag, setFlag] = (0, react_1.useState)(false);
    const [callerQuestion, setCallerQuestion] = (0, react_1.useState)(false);
    const [employeeQuestion, setEmployeeQuestion] = (0, react_1.useState)(false);
    const [transcript, setTranscript] = (0, react_1.useState)('');
    const [response, setResponse] = (0, react_1.useState)('');
    const toggleSummary = () => {
        setSummary(!summary);
    };
    const toggleSentiment = () => {
        setSentiment(!sentiment);
    };
    const toggleFlag = () => {
        setFlag(!flag);
    };
    const toggleCallerQuestion = () => {
        setCallerQuestion(!callerQuestion);
    };
    const toggleEmployeeQuestion = () => {
        setEmployeeQuestion(!employeeQuestion);
    };
    const handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
        yield getTranscript();
        yield getAnalysis();
    });
    const getTranscript = () => {
        let prompt = '';
        if (summary) {
            prompt = prompt + 'What happened in the following call transcription?';
        }
        if (sentiment) {
            prompt = prompt + 'What is the sentiment of the caller in this transcription?';
        }
        if (flag) {
            prompt = prompt + 'If the sentiment is generally negative end your response with a "<Negative>", otherwise end your response with a "<Not Negative>".';
        }
        if (callerQuestion) {
            prompt = prompt + 'What questions did the caller ask the employee?';
        }
        if (employeeQuestion) {
            prompt = prompt + 'What questions did the employee ask the caller?';
        }
        axios_1.default.get('http://127.0.0.1:8080/openai/transcribe', { data: { data: prompt } })
            .then(res => {
            setTranscript(String(res.data));
        });
    };
    const getAnalysis = () => {
        axios_1.default.get('http://127.0.0.1:8080/openai/analyze', { data: { transcript: transcript } })
            .then(res => {
            setResponse(String(res.data[0].message.content));
        });
    };
    return (
    //<AuthContextProvider>
    <div className="App">
      <div className='upload-file'>
        <h3>Upload a recording</h3>
        <p>File: {`${fileName}`}</p>
        <form method='post' action="http://127.0.0.1:8080/upload" encType='multipart/form-data'>
          <input type="file" name="audio"></input>
          <input type='submit'></input>
        </form>
      </div>
      <div className='options mt-4'>
        <div className='summary block'>
          <p className='inline-flex mr-2'>Summary {`${summary}`}</p>
          <input type="checkbox" onChange={toggleSummary}/>
        </div>
        <div className='sentiment block'>
          <p className='inline-flex mr-2'>Sentiment {`${sentiment}`}</p>
          <input type="checkbox" onChange={toggleSentiment}/>
        </div>
        <div className='flag block'>
          <p className='inline-flex mr-2'>Flag {`${flag}`}</p>
          <input type="checkbox" onChange={toggleFlag}/>
        </div>
        <div className='customer-question block'>
          <p className='inline-flex mr-2'>Caller Question {`${callerQuestion}`}</p>
          <input type="checkbox" onChange={toggleCallerQuestion}/>
        </div>
        <div className='customer-question block'>
          <p className='inline-flex mr-2'>Employee Question {`${employeeQuestion}`}</p>
          <input type="checkbox" onChange={toggleEmployeeQuestion}/>
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
    //</AuthContextProvider>
    );
}
exports.default = App;
