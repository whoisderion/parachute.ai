require('dotenv').config()
import express, { Request, Response } from 'express'
//import OpenAI from 'openai-api'
import { Configuration, OpenAIApi } from "openai"
import dotenv from 'dotenv'
import axios from 'axios'

const app = express()

const OpenaiApiKey = "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"
const OpenaiOrgID = "org-PRuztropUTgrHaRBj8thsiy0"

const OpenaiConfiguration = new Configuration({
    organization: OpenaiOrgID,
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
    const response = await openai.listEngines()
    console.log(response)
    return res.sendStatus(200)
})

app.get('/openai/test2', async (req: Request, res: Response) => {
    axios.post("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OpenaiApiKey}`
        },
        data: {
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": "Say this is a test!" }],
            "temperature": 0.7
        }
    })
        .then(response => {
            res.send(response)
        })
        .catch(err => {
            res.send(err)
        })
})

app.listen(4444, () => {
    console.log(`Application listening at http://127.0.0.1:4444/`)
})