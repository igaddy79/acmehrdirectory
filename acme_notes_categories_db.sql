        --Drop
            DROP TABLE IF EXISTS employees;
            DROP TABLE IF EXISTS department;
            CREATE TABLE department(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            );
        --Table
            CREATE TABLE employees(
                id SERIAL PRIMARY KEY,    
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now(),
                ranking INTEGER DEFAULT 3 NOT NULL,
                txt VARCHAR(255) NOT NULL,
                employees_id INTEGER REFERENCES department(id) NOT NULL
            );
        --seed the database with some data
           
                INSERT INTO department(name) VALUES('Goku');
                INSERT INTO department(name) VALUES('Gotens');
                INSERT INTO department(name) VALUES('Trunks');
                INSERT INTO employees(txt, ranking, employees_id) VALUES('Master_SuperSayian3', 5, (SELECT id FROM categories WHERE name='Goku'));
                INSERT INTO employees(txt, ranking, employees_id) VALUES('Master_SuperSayian', 5, (SELECT id FROM categories WHERE name='Gotens'));
                INSERT INTO employees(txt, ranking, employees_id) VALUES('Teach_Fusion_Technique', 4, (SELECT id FROM categories WHERE name='Goku'));
                INSERT INTO employees(txt, ranking, employees_id) VALUES('Master_SuperSayian2', 4, (SELECT id FROM categories WHERE name='Trunks'));
                INSERT INTO employees(txt, ranking, employees_id) VALUES('Master_Fusion_with_Gotens', 2, (SELECT id FROM categories WHERE name='Trunks'));
           