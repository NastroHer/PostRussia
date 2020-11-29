import express, {Express, Request, Response} from 'express';
import {PDFNet} from '@pdftron/pdfnet-node';
import path from 'path';
import mimeType from './modules/mimeType';
import fs from 'fs';
// @ts-ignore
import libre from 'libreoffice-convert';
// @ts-ignore
import docxConverter from 'docx-pdf';

import bodyParser from 'body-parser';

import cors from 'cors';

const app: Express = express();
const port: number = 7000;
import multer  from "multer";
import pool from './database/database';
const corsOptions = {
  origin: (origin: any, callback: any) => callback(null, true)
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "./src/files");
  },
  filename: (req, file, cb) =>{
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storageConfig })

app.use( cors(corsOptions) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const {referenceNumber, theLeader} = await req.body;

    docxConverter(`./src/files/${file.filename}`,'./src/files/f.pdf', async (err: any, result: any) => {
      await pool.query('INSERT INTO files (created, referenceNumber, theLeader, docFile, pdfFile) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
        new Date(),
        referenceNumber,
        theLeader,
        `./src/files/${file.filename}`,
        `./src/files/${file.filename}.pdf`
      ]);

      return res.send({success: true});
    });
  } catch (e) {
    return res.send({success: false});
  }
});

app.listen(port, () => {
  console.log('loog');
});