require('dotenv').config()
import express, { Request, response, Response } from 'express'
//import OpenAI from 'openai-api'
import { Configuration, OpenAIApi } from "openai"
import * as dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import path from "path"
import FormData from "form-data"

dotenv.config({ path: __dirname + '/.env' })

const app = express()

const OpenaiApiKey = process.env.OPENAI_API_KEY
const OpenaiOrgID = process.env.OPENAI_ORG_ID

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

app.get('vonage/test', async (req: Request, res: Response) => {

})

app.post('vonage/answer', (req: Request, res: Response) => {

})

app.post('vonage/event', (req: Request, res: Response) => {

})

app.post('vonage/fallback', (req: Request, res: Response) => {

})

app.get('/openai/test', async (req: Request, res: Response) => {
    const response = await openai.listModels();
    res.send(response.data)
})

let transcription = ""

app.get('/openai/transcribe', async (req: Request, res: Response) => {
    const model: string = 'whisper-1'
    const prompt: string = 'The transcript is from a customer calling a moving company with a salesman named Dave.'

    const filePath = path.join(__dirname, "/recordings/2022_08_03_10_19AM.mp3")

    const response = await openai.createTranscription(
        fs.createReadStream(filePath) as any,
        "whisper-1"
    );
    transcription = response.data.text
    res.send(response.data.text)
})

app.get('/openai/analyze', async (req: Request, res: Response) => {
    const model: string = 'gpt-3.5-turbo';
    const prompt: string = 'What happened in the following call transcription? what is the sentiment of the caller? if the sentiment is generally negative end your response with a "<Negative>". what mistake if any was made by a worker?' + transcription;
    const completion = await openai.createChatCompletion({
        model: model,
        messages: [{
            role: "user",
            content: prompt
        }],
        n: 4
    })
    res.send(completion.data.choices)
})

app.listen(8080, () => {
    console.log(`Application listening at http://127.0.0.1:8080/`)
})