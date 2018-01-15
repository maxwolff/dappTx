const { Pool } = require('pg')

module.exports = insert;

const env = {
  user: 'postgres',
  host: 'localhost',
  database: 'tx',
  password: null,
  port: 5432,
}

const pool = new Pool(env)

async function insert (data){
	try {
		const text = 'INSERT INTO transactions(blob) VALUES($1) RETURNING *'
		const values = [data]
	 	const res = await pool.query(text, values)
	 	console.log(res.rows[0])
	} catch(err) {
	  console.log(err.stack)
	}
}