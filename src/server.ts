import express, {Express, Request, Response} from 'express';
import {PDFNet} from '@pdftron/pdfnet-node';
import path from 'path';
import mimeType from './modules/mimeType';
import fs from 'fs';
// @ts-ignore
import libre from 'libreoffice-convert';

import bodyParser from 'body-parser';

import cors from 'cors';

const app: Express = express();
const port: number = 8000;
const filesPath = './files';
const corsOptions = {
  origin: (origin: any, callback: any) => callback(null, true)
}

app.use( cors(corsOptions) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

const PDFNetEndpoint = (main: any, pathname: any, res: any) => {
  // console.log('pathname', pathname);
  PDFNet.runWithCleanup(main) // you can add the key to PDFNet.runWithCleanup(main, process.env.PDFTRONKEY)
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500;
          // res.end(`Error getting the file: ${err}.`);
          res.send({error: `Error getting the file: ${err}.`});
        } else {
          const ext = path.parse(pathname).ext;
          // @ts-ignore
          res.setHeader('Content-type', mimeType[ext] || 'text/plain');
          // res.end(data);
          res.send({data})
        }
      });
    })
    .catch(error => {
      console.log('error', error.message);
      res.statusCode = 500;
      // res.end(error);
      res.send({error: true});
    });
};

app.get('/files', (req: Request, res: Response) => {
  const inputPath = path.resolve(__dirname, filesPath);

  fs.readdir(inputPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    res.setHeader('Content-type', mimeType['.json']);
    res.end(JSON.stringify(files));
  });
});

app.get('/files/:filename', (req, res) => {
  const inputPath = path.resolve(__dirname, filesPath, req.params.filename);
  fs.readFile(inputPath, function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      const ext = path.parse(inputPath).ext;
      // @ts-ignore
      res.setHeader('Content-type', mimeType[ext] || 'text/plain');
      res.end(data);
    }
  });
});

app.get('/convert/:filename', async (req, res) => {
  // await PDFNet.initialize();
  // const filename = req.params.filename;
  // let ext = path.parse(filename).ext;

  // const inputPath = path.resolve(__dirname, filesPath, filename);
  // const outputPath = path.resolve(__dirname, filesPath, `${filename}.pdf`);

  const extend = '.pdf'
  const enterPath = path.join(__dirname, './files/f.docx');
  const outputPath = path.join(__dirname, `./files/f${extend}`)

  // Read file
  const file = fs.readFileSync(enterPath);

  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  // await libre.convert(file, extend, undefined, (err: any, done: any) => {
  //   if (err) {
  //     console.log(`Error converting file: ${err}`);
  //   }
  //
  //   // Here in done you have pdf file which you can save or transfer in another stream
  //   fs.writeFileSync(outputPath, done)
  //   console.log('outputPath', outputPath);
  // });

  await libre.convert(file, extend);

  // if (ext === '.pdf') {
  //   res.statusCode = 500;
  //   res.end(`File is already PDF.`);
  //   return;
  // }
  //
  // const main = async () => {
  //   const pdfdoc = await PDFNet.PDFDoc.create();
  //   await pdfdoc.initSecurityHandler();
  //   await PDFNet.Convert.toPdf(pdfdoc, inputPath);
  //   await pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  // };
  //
  // PDFNetEndpoint(main, outputPath, res);
});

app.listen(port, () => {
  console.log('loog')
});