"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// import OpenAI from 'openai-api'
// import FormData from "form-data"
// import axios from 'axios'
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'https://api.openai.com'],
    methods: ['POST', 'GET']
};
dotenv.config({ path: __dirname + '/.env' });
const app = (0, express_1.default)();
app.set('json spaces', 4);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const OpenaiApiKey = process.env.OPENAI_API_KEY;
const OpenaiConfiguration = new openai_1.Configuration({ apiKey: OpenaiApiKey });
const openai = new openai_1.OpenAIApi(OpenaiConfiguration);
const prisma = new client_1.PrismaClient();
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
//  storage: multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'server/Recs')
//     },
//     filename: (req, file, callback) => {
//         console.log(file)
//         callback(null, String(Date.now()) + path.extname(file.originalname))
//     }
// })
const upload = (0, multer_1.default)({ storage: storage });
app.get('/', (req, res) => {
    return res.send('Hello world');
});
let transcription = "";
app.post('/upload', upload.single("audio"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cloudinaryURL = String((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path);
    const cloudinaryID = path_1.default.parse(cloudinaryURL).name;
    const recording = yield prisma.recording.create({
        data: {
            cloudinaryID: cloudinaryID,
            cloudinaryURL: cloudinaryURL,
            name: 'test file',
            userId: 'clgcqxt3h0000ztfqy7wjmzpf',
        }
    });
    console.log(recording);
    return res.json({ audio: cloudinaryURL });
}));
app.get('/:file_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.file_name;
    const file = yield prisma.recording.findFirst({
        where: { name: fileName }
    });
}));
app.delete('/:file_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.file_name;
    const id = yield prisma.recording.findFirst({
        where: { name: fileName }
    });
    yield prisma.recording.delete({
        where: { cloudinaryID: id === null || id === void 0 ? void 0 : id.cloudinaryID }
    });
}));
app.get('/openai/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.listModels();
    res.send(response.data);
}));
app.get('/openai/transcribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = 'whisper-1';
    const prompt = 'The transcript is from a customer calling a moving company with a salesman named Dave.';
    const filePath = path_1.default.join(__dirname, "/recordings/2022_08_03_10_19AM.mp3");
    const response = yield openai.createTranscription(fs_1.default.createReadStream(filePath), "whisper-1");
    transcription = response.data.text;
    res.send(response.data.text);
}));
app.get('/openai/analyze', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = 'gpt-3.5-turbo';
    const prompt = 'What happened in the following call transcription? what is the sentiment of the caller? if the sentiment is generally negative end your response with a "<Negative>". what mistake if any was made by a worker?' + transcription;
    const completion = yield openai.createChatCompletion({
        model: model,
        messages: [{
                role: "user",
                content: prompt
            }],
        n: 4
    });
    res.send(completion.data.choices);
}));
app.listen(8080, () => {
    console.log(`Application listening at http://127.0.0.1:8080/`);
});
