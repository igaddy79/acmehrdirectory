const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || process.env.DATABASE_URL || 'postgres://hewhoremains:hewhoremains@localhost:5432/hewhoremains');
const app = express();

app.use(express.json());
app.use(require('morgan')('dev'));
// Initialize database and start server
const init = async () => {
    try {
        await client.connect();
        console.log('im connected to acme_HR_db');

        //table
        let SQL = `
            DROP TABLE IF EXISTS employees;
            DROP TABLE IF EXISTS department;

            CREATE TABLE department(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            );

            CREATE TABLE employees(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),    
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now(),
                department_id INTEGER REFERENCES employees(id) NOT NULL
            );
            `;
            await client.query(SQL);
            console.log('tables created');

            //seed the database with some data
            SQL =`
                INSERT INTO department(name) VALUES('Goku');
                INSERT INTO department(name) VALUES('Gotens');
                INSERT INTO department(name) VALUES('Trunks');

                INSERT INTO employees(name, department_id) VALUES('Master_SuperSayian3', (SELECT id FROM department WHERE name='Goku'));
                INSERT INTO employees(name, department_id) VALUES('Master_SuperSayian', (SELECT id FROM department WHERE name='Gotens'));
                INSERT INTO employees(name, department_id) VALUES('Teach_Fusion_Technique', (SELECT id FROM department WHERE name='Goku'));
                INSERT INTO employees(name, department_id) VALUES('Master_SuperSayian2', (SELECT id FROM department WHERE name='Trunks'));
                INSERT INTO employees(name, department_id) VALUES('Master_Fusion_with_Gotens', (SELECT id FROM department WHERE name='Trunks'));
                `;
            await client.query(SQL);
            console.log('data seeded');

            //start server
            const port = process.env.PORT || 3000;


        app.listen(port, () => console.log(`listening on port ${port}`));
    } catch (error) {
        console.error('Failed to connect to acme_db', error);
    }
};

app.get('/api/employees', async (req, res, next) => {
    try {
      const SQL = `
        SELECT * from employees
      `
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  })
  
  app.get('/api/department', async (req, res, next) => {
    try {
      const SQL = `
        SELECT * from department ORDER BY created_at DESC;
      `
      const response = await client.query(SQL)
      res.send(response.rows)
    } catch (ex) {
      next(ex)
    }
  })
  
  app.post('/api/employees', async (req, res, next) => {
    try {
      const SQL = `
        INSERT INTO employees(name, department_id)
        VALUES($1, $2)
        RETURNING *
      `
      const response = await client.query(SQL, [req.body.txt, req.body.department_id])
      res.send(response.rows[0])
    } catch (ex) {
      next(ex)
    }
  })
  
  app.put('/api/employees/:id', async (req, res, next) => {
    try {
      const SQL = `
        UPDATE employees
        SET txt=$1, ranking=$2, employees_id=$3, updated_at= now()
        WHERE id=$4 RETURNING *
      `
      const response = await client.query(SQL, [
        req.body.txt,
        req.body.ranking,
        req.body.employees_id,
        req.params.id
      ])
      res.send(response.rows[0])
    } catch (ex) {
      next(ex)
    }
  })
  
  app.delete('/api/employees/:id', async (req, res, next) => {
    try {
      const SQL = `
        DELETE from employees
        WHERE id = $1
      `
      const response = await client.query(SQL, [req.params.id])
      res.sendStatus(204)
    } catch (ex) {
      next(ex)
    }
  });

init();