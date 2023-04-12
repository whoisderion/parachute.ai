require('dotenv').config()
import express, { Request, Response } from 'express'
import { Configuration, OpenAIApi } from "openai"
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from "path"
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import multer, { diskStorage } from 'multer'
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const https = require('https');
import axios from 'axios'
import { Stream } from 'stream'
const request = require('request');

// import url from 'url'
// import OpenAI from 'openai-api'
// import FormData from "form-data"

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'https://api.openai.com'],
    methods: ['POST', 'GET']
}
dotenv.config({ path: __dirname + '/.env' });

const app = express()
app.set('json spaces', 4)
app.use(cors(corsOptions))
app.use(express.json())

const OpenaiApiKey = process.env.OPENAI_API_KEY
const OpenaiConfiguration = new Configuration({ apiKey: OpenaiApiKey });
const openai = new OpenAIApi(OpenaiConfiguration);

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'parachute/recordings',
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage })

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello world')
})

let transcription: string = ""

app.post('/upload', upload.single("audio"), async (req: Request, res: Response) => {
    const cloudinaryURL: string = String(req?.file?.path)
    const cloudinaryID: string = path.parse(cloudinaryURL).name
    const recording = await prisma.recording.create({
        data: {
            cloudinaryID: cloudinaryID,
            cloudinaryURL: cloudinaryURL,
            name: 'test file',
            userId: 'clgcqxt3h0000ztfqy7wjmzpf',
        }
    })
    console.log(recording)
    return res.json({ audio: cloudinaryURL });
})

app.get('/db/:cloudinary_ID', async (req: Request, res: Response) => {
    const id = req.params.cloudinary_ID
    const file = await prisma.recording.findFirst({
        where: { cloudinaryID: id }
    })
    res.send(file)
})

app.delete('/db/:file_name', async (req: Request, res: Response) => {
    const fileName = req.params.file_name
    const id = await prisma.recording.findFirst({
        where: { name: fileName }
    })
    await prisma.recording.delete({
        where: { cloudinaryID: id?.cloudinaryID }
    })
})

app.get('/openai/test', async (req: Request, res: Response) => {
    const response = await openai.listModels();
    res.send(response.data)
})

app.get('/openai/transcribe', async (req: Request, res: Response) => {
    const model: string = 'whisper-1'
    const prompt: string = 'The transcript is from a customer calling a moving company with a salesman named Dave.'

    const filePath = path.join(__dirname, "./recordings/file.mp3")

    let fileURL = await axios.get('http://127.0.0.1:8080/db/lnsbxgb0xhpuqrjivzq4')
    fileURL = fileURL.data.cloudinaryURL

    // await request(fileURL).pipe(fs.createWriteStream(filePath))

    await request
        .get(fileURL)
        .on('error', (err: Error) => {
            console.log(err)
        })
        .pipe(fs.createWriteStream(filePath))

    try {
        const response = await openai.createTranscription(
            fs.createReadStream(filePath) as any,
            model
        );

        transcription = response.data.text
        res.send(response.data.text)

    } catch (error) {
        console.log('ERROR IS:', error)
    }

    // const filePath = path.join(__dirname, "/recordings/2022_08_03_10_19AM.mp3")

    // const response = await openai.createTranscription(
    //     fs.createReadStream(filePath) as any,
    //     model
    // );
    // transcription = response.data.text
    // res.send(response.data.text)
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