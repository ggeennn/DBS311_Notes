# DBS311 - Week 1: Database Design and SQL Review

## 1. SQL Review from DBS211

### Suggested Reading Materials
- [DBS211 website](http://dbs211.ca)
- [Database Design Textbook](https://opentextbc.ca/dbdesign01/)
- [W3Schools SQL Tutorials](https://www.w3schools.com/sql/)
- [Oracle 12c SQL Reference](https://docs.oracle.com/database/121/SQLRF/title.htm)

---

## 2. Course Introduction
**Advanced Database Systems** builds on DBS211 concepts:
- Transactions and aggregation
- Set operators and sub-queries
- PL/SQL programming
- NoSQL with MongoDB

### Week 1 Objectives
- Differentiate DML vs DDL
- Write basic SQL with sorting/filtering
- Implement referential integrity
- Create/alter tables with constraints
- Perform ANSI-92 joins (INNER, OUTER, FULL)
- Create and manage views
- Control access with GRANT/REVOKE
- Manage transactions in SQL Developer

---

## 3. SQL Fundamentals
### What is SQL?
- Structured Query Language
- ANSI/ISO standardized since 1986/1987
- Used for database access and manipulation

### SQL Capabilities
- Execute queries
- Retrieve/insert/update/delete data
- Create databases/tables/procedures/views
- Set permissions

### SQL Variations
While standardized, DBMSs have proprietary extensions. This course uses Oracle but focuses on portable SQL.

---

## 4. SQL Sub-Languages
| Type | Purpose | Key Commands |
|------|---------|--------------|
| **DML** | Data manipulation | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DDL** | Schema definition | `CREATE`, `ALTER`, `DROP` |
| **TCL** | Transaction control | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |
| **PL/SQL** | Procedural extensions | Oracle-specific programming |

---

## 5. DML Core Concepts
### SELECT Statement
```sql
SELECT column1, column2 
FROM table_name
WHERE condition
ORDER BY column1;
```

### Asterisk Usage
```sql
SELECT *
FROM employees
WHERE department_id = 10
ORDER BY last_name;
```
*Use sparingly - specify columns in production systems*

### Quotes in SQL
```sql
SELECT first_name AS "First Name",
       last_name AS "Last Name"
FROM employees
WHERE first_name = 'John';
```

### DISTINCT Keyword
```sql
SELECT DISTINCT city
FROM customers
ORDER BY city;
```

---

## 6. CRUD Operations
### INSERT Statements
**Standard form:**
```sql
INSERT INTO offices (officecode, phone, city)
VALUES (8, '+1-905-555-1212', 'Toronto');
```

**Shortcut form:**
```sql
INSERT INTO offices 
VALUES (8, 'Toronto', '+1-905-555-1212', '123 Main St', NULL, 'ON', 'Canada', 'M1V1A1', 'NA');
```

**Multi-row insert:**
```sql
INSERT ALL
  INTO offices VALUES (9, 'Oshawa', '+1-905-555-2222', '456 King St', NULL, 'ON', 'Canada', 'L1H1B2', 'NA')
  INTO offices VALUES (10, 'Montreal', '+1-514-555-3333', '789 Rue Saint', NULL, 'QC', 'Canada', 'H3A1B4', 'NA')
SELECT 1 FROM dual;
```

### UPDATE Statements
```sql
UPDATE employees
SET last_name = 'Smith', salary = salary * 1.05
WHERE employee_id = 101;
```
*Always use WHERE clause with primary key*

### DELETE Statements
```sql
DELETE FROM employees
WHERE employee_id = 205;
```
*Use primary key in WHERE to avoid mass deletion*

---

## 7. SQL Joins
### Join Types with Examples
**Inner Join** (Matches only):
```sql
SELECT p.firstname, p.lastname, t.teamName
FROM players p
INNER JOIN teams t ON p.teamid = t.teamID;
```

**Left Join** (All left + matches):
```sql
SELECT p.firstname, p.lastname, t.teamName
FROM players p
LEFT JOIN teams t ON p.teamid = t.teamID;
```

**Right Join** (All right + matches):
```sql
SELECT p.firstname, p.lastname, t.teamName
FROM players p
RIGHT JOIN teams t ON p.teamid = t.teamID;
```

**Full Join** (All records):
```sql
SELECT p.firstname, p.lastname, t.teamName
FROM players p
FULL JOIN teams t ON p.teamid = t.teamID;
```

### Join Results Summary
| Join Type | Returns |
|-----------|---------|
| INNER | Matching rows only |
| LEFT | All left table + matches |
| RIGHT | All right table + matches |
| FULL | All records from both tables |
