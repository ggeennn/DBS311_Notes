# DBS311语法速记总汇

## SQL保留字 | Reserved Words
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
JOIN
INNER JOIN
LEFT JOIN
RIGHT JOIN
FULL JOIN
FULL OUTER JOIN
UNION
UNION ALL
INTERSECT
INTERSECT ALL
EXCEPT
EXCEPT ALL
MINUS
MINUS ALL
CREATE
INSERT
UPDATE
DELETE
ALTER
DROP
WITH
AS
ON
USING
FETCH FIRST
ROWS ONLY

## 函数 | Functions

### 单行函数 | Single Row Functions
NVL(column, replacement)
NULLIF(expression1, expression2)
SUBSTR(string, start, length)
INSTR(string, substring)
CAST(column AS datatype)
ROUND(number, decimals)
TRUNC(number, decimals)
UPPER(string)
LOWER(string)
INITCAP(string)
LENGTH(string)
TRIM(string)
REPLACE(string, old, new)
CONCAT(string1, string2)
LPAD(string, length, pad)
RPAD(string, length, pad)
TO_CHAR(date/number, format)
TO_DATE(string, format)
COALESCE(expr1, expr2, expr3)
SYSDATE
CURRENT_DATE
CURRENT_TIMESTAMP

### 多行函数 | Multi Row Functions
COUNT(*)
COUNT(column)
COUNT(DISTINCT column)
SUM(column)
AVG(column)
MAX(column)
MIN(column)
STDDEV(column)
VARIANCE(column)

## 操作符 | Operators
LIKE '%patt_rn%'
IN (value1, value2, ...)
BETWEEN value1 AND value2
IS NULL
IS NOT NULL
EXISTS (subquery)
ANY (subquery)
ALL (subquery)
= > < >= <= <>
!=

## 控制结构 | Control Structures
CASE
  WHEN condition THEN result
  WHEN condition THEN result
  ELSE result
END
IF condition THEN
  statements
ELSEIF condition THEN
  statements
ELSE
  statements
END IF

## 子查询操作符 | Subquery Operators
IN (SELECT ...)
ANY (SELECT ...)
ALL (SELECT ...)
EXISTS (SELECT ...)
= (SELECT ...)
> (SELECT ...)
< (SELECT ...)

## 数据类型 | Data Types
NUMBER(n,m)
VARCHAR2(n)
CHAR(n)
DATE
TIMESTAMP
DECIMAL(p,s)
FLOAT
INTEGER
BOOLEAN

## 约束 | Constraints
PRIMARY KEY
FOREIGN KEY (column) REFERENCES table(column)
NOT NULL
UNIQUE
CHECK (condition)
DEFAULT value

## 集合运算符 | Set Operators
UNION
UNION ALL
INTERSECT
INTERSECT ALL
EXCEPT (DB2)
EXCEPT ALL
MINUS (Oracle)
MINUS ALL

## 常用语法模式 | Common Patterns

### 表创建 | CREATE TABLE
CREATE TABLE table_name(
  column_name datatype PRIMARY KEY,
  column_name datatype NOT NULL,
  column_name datatype REFERENCES other_table(id)
);

### 插入数据 | INSERT
INSERT INTO table VALUES (val1, val2, ...);
INSERT INTO table (col1, col2) VALUES (val1, val2);
INSERT ALL
  INTO table1 VALUES (val1, val2)
  INTO table2 VALUES (val3, val4)
SELECT * FROM DUAL;
INSERT INTO table (col1, col2) SELECT c1, c2 FROM src_table;


### 更新数据 | UPDATE
UPDATE table SET col1=val1, col2=val2 WHERE condition;
ALTER TABLE table_name ADD column VARCHAR2(50) DEFAULT 'Default Value';
### 删除数据 | DELETE
DELETE FROM table WHERE condition;

### 查询模式 | SELECT Patterns
SELECT DISTINCT columns FROM table WHERE condition;
SELECT columns FROM table1 JOIN table2 ON condition;
SELECT columns FROM table1 INNER JOIN table2 ON condition;
SELECT columns FROM table1 LEFT JOIN table2 ON condition;
SELECT columns FROM table1 RIGHT JOIN table2 ON condition;
SELECT columns FROM table1 FULL OUTER JOIN table2 ON condition;
SELECT columns FROM table GROUP BY columns HAVING condition;
SELECT columns FROM table ORDER BY columns;
SELECT columns FROM table WHERE col IN (SELECT ...);
SELECT columns FROM table LIMIT n;
SELECT columns FROM table FETCH FIRST n ROWS ONLY;
SELECT TOP n columns FROM table;

### 视图 | Views
CREATE VIEW view_name AS SELECT ... FROM ... WHERE ...;

### 索引 | Indexes
CREATE INDEX idx_name ON table(column);
CREATE UNIQUE INDEX idx_name ON table(column);

### 别名 | Aliases
SELECT column AS alias FROM table;
SELECT t1.col FROM table1 t1 JOIN table2 t2 ON condition;

### 分组过滤 | GROUP BY & HAVING
SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 5000;

### 子查询位置 | Subquery Locations
SELECT * FROM table WHERE col = (SELECT ...);
SELECT * FROM table WHERE col IN (SELECT ...);
SELECT * FROM (SELECT ... FROM ...) subquery;
SELECT * FROM table WHERE EXISTS (SELECT ...);

### 集合操作 | Set Operations
SELECT * FROM table1 UNION SELECT * FROM table2;
SELECT * FROM table1 UNION ALL SELECT * FROM table2;
SELECT * FROM table1 INTERSECT SELECT * FROM table2;
SELECT * FROM table1 EXCEPT SELECT * FROM table2;

### 公用表表达式 | Common Table Expressions (CTE)
WITH cte_name AS (
  SELECT columns FROM table WHERE condition
)
SELECT * FROM cte_name;

WITH SalesTotal AS (
  SELECT dept, SUM(salary) total FROM emp GROUP BY dept
),
DeptAvg AS (
  SELECT dept, AVG(salary) avg_sal FROM emp GROUP BY dept
)
SELECT * FROM SalesTotal st JOIN DeptAvg da ON st.dept = da.dept;

### 条件表达式 | Conditional Expressions
CASE WHEN condition THEN 'result1' ELSE 'result2' END
NVL(column, 'default_value')
NULLIF(expr1, expr2)
COALESCE(col1, col2, col3)

### 字符串操作 | String Operations
column1 || column2 || 'literal'
CONCAT(column1, column2)
SUBSTR(column, start, length)
LENGTH(column)
TRIM(column)
UPPER(column)
LOWER(column)
REPLACE(column, 'old', 'new')
INSTR(string,substr)

### 数值计算 | Numeric Calculations
column1 + column2
column1 - column2
column1 * column2
column1 / column2
ROUND(column, decimals)
TRUNC(column, decimals)
MOD(column1, column2)

### 表复制 | Table Copy
CREATE TABLE new_table AS SELECT * FROM old_table;
CREATE TABLE new_table AS SELECT col1, col2 FROM old_table WHERE condition;
