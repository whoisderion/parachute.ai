require('dotenv').config()
import express, { Request, response, Response } from 'express'
//import OpenAI from 'openai-api'
import { Configuration, OpenAIApi } from "openai"
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'

const app = express()

const OpenaiApiKey = "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"
const OpenaiOrgID = "org-PRuztropUTgrHaRBj8thsiy0"

const OpenaiConfiguration = new Configuration({
    apiKey: OpenaiApiKey,
});

const openai = new OpenAIApi(OpenaiConfiguration)


app.use(express.json())
// only for parsing url encoded bodies
// app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello world')
})

app.get('/openai/test', async (req: Request, res: Response) => {
    const response = await openai.listModels();
    res.send(response.data)
})

app.get('/openai/transcribe', (req: Request, res: Response) => {
    const recording: string = 'server/recordings/2022_08_03_10_19AM.mp3'
    const model: string = 'whisper-1'
    const prompt: string = 'The transcript is from a customer calling a moving company with a salesman named Dave.'
    axios.post('https://api.openai.com/v1/audio/transcriptions', {
        'file': recording,
        'model': 'whisper-1',
        'prompt': prompt,
    }, {
        headers: {
            'Authorization': `Bearer ${OpenaiApiKey}`,
            'OpenAI-Organization': 'org-PRuztropUTgrHaRBj8thsiy0'

        }
    })
        .then(response => {
            fs.appendFile('server/output/whisperOutput.txt', JSON.stringify(response), (err) => {
                console.log('transcription successful for ', recording)
            })
            res.send(response.data)
        })
        .catch(error => {
            res.send(error)
        })
})

app.listen(4444, () => {
    console.log(`Application listening at http://127.0.0.1:4444/`)
})