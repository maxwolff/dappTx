const { Pool } = require('pg')

module.exports = insert;

const env = {
  user: 'maxwolff',
  host: 'tx1.cfjwnlpute0x.us-east-1.rds.amazonaws.com',
  database: 'tx1',
  password: 'A3jamaican',
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