import { Pool } from 'pg';
import { databaseConfig } from "../configs/database.config";

const pool = new Pool( databaseConfig );

export default pool;