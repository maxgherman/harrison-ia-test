import pg from 'pg'
import { databaseServer } from '../utils/environment'

const Pool = pg.Pool
export const pool = new Pool(databaseServer)
