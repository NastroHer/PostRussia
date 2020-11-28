
import session from 'express-session';
import express, {Express, Request, Response} from 'express';
// Server middleware
import bodyParser from 'body-parser';

import cors from 'cors';

const app: Express = express();
const port: number = 8000;

const corsOptions = {
  origin: (origin: any, callback: any) => callback(null, true)
}

app.use( cors(corsOptions) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );


app.listen(port, () => {
  console.log('loog')
});