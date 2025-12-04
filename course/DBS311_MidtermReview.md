# DBS311 Midterm Review Notes | DBS311期中考试复习笔记

## Set Operators | 集合运算符

### Available Set Operators | 可用的集合运算符
- `UNION` | 并集
- `UNION ALL` | 全并集（包含重复）
- `INTERSECT` | 交集
- `MINUS` (Oracle) | 差集（Oracle）
- `EXCEPT` (DB2) | 差集（DB2）

### Set Operator Examples

#### PROVINCES Table Operations
- **PROVINCES** contains: ONTARIO, MANITOBA, QUEBEC
- **Separate tables**: ONTARIO, QUEBEC (without province column)
- **Subtract ONTARIO and QUEBEC from PROVINCES**:
  ```sql
  SELECT * FROM PROVINCES
  MINUS
  SELECT * FROM ONTARIO
  MINUS
  SELECT * FROM QUEBEC;
  ```

### Set Operator Rules | 集合运算符规则
- **SELECT lists must match in** | SELECT列表必须匹配：
  - Number of columns | 列数
  - Order of columns | 列的顺序
  - Data types of columns | 列的数据类型
- **Column names**: Don't need to match (first query names used) | 列名：不需要匹配（使用第一个查询的列名）
- **Parentheses**: Alter sequence of execution | 括号：改变执行顺序
- **ORDER BY**: Only at very end of statement | ORDER BY：只能在语句末尾
- **Duplicate handling**: Automatically eliminated except in `UNION ALL` | 重复处理：自动消除，除UNION ALL外

## SQL Fundamentals Review | SQL基础回顾

### Comparison Operators | 比较运算符
- **Not equal**: `<>`, `!=` | 不等于：`<>`、`!=`
- **Other operators**: `>`, `<=`, `>=`, `=`, `<` | 其他运算符：`>`、`<=`、`>=`、`=`、`<`

### Function Categories | 函数分类

#### Single Row Functions | 单行函数
- **Character Functions**: `LOWER()`, `UPPER()`, `INITCAP()`, `SUBSTR()`, `INSTR()`, `REPLACE()` | 字符函数：小写、大写、首字母大写、子字符串、位置查找、替换函数
- **Numeric Functions**: `ROUND()`, `TRUNC()`, `MOD()` | 数值函数：四舍五入、截断、取模函数
- **DateTime Functions**: Oracle (`SYSDATE`), DB2 (`CURRENT DATE`, `CURRENT TIMESTAMP`) | 日期时间函数：Oracle（当前日期时间）、DB2（当前日期、当前时间戳）
- **Conversion Functions**: `CAST()` | 转换函数：`CAST()`用于数据类型转换

#### Multi Row Functions (Aggregate Functions) | 多行函数（聚合函数）
- `AVG()`, `COUNT()`, `MAX()`, `MIN()`, `SUM()` | 平均值、计数、最大值、最小值、求和函数
- **Single Row vs Multi Row** | 单行vs多行：
  - Single Row: One result per row (Scaler functions) | 单行：每行一个结果（标量函数）
  - Multi Row: One result per group (Aggregate functions) | 多行：每组一个结果（聚合函数）

### GROUP BY and HAVING Clauses | GROUP BY和HAVING子句
- **WHERE**: Filters individual rows | WHERE：过滤单个行
- **HAVING**: Filters groups | HAVING：过滤组
- **GROUP BY**: Creates groups for aggregation | GROUP BY：为聚合创建组

## Subqueries | 子查询

### Subquery Locations | 子查询位置
- `SELECT` statement | SELECT语句
- `WHERE` clause | WHERE子句
- `HAVING` clause | HAVING子句
- `FROM` clause | FROM子句
- `CREATE` statement | CREATE语句
- `INSERT` statement | INSERT语句
- `DELETE` statement | DELETE语句

### Subquery Types | 子查询类型
1. **Single Row Subqueries**: Returns one row | 单行子查询：返回一行
2. **Multi Row Subqueries**: Returns multiple rows | 多行子查询：返回多行
3. **Multi-column Subqueries**: Returns multiple columns | 多列子查询：返回多列

## Complex Query Examples

### AUDBOOKS Table Operations

#### Reverse Genre with Backslash
```sql
UPDATE AUDBOOKS
SET GENRE = CASE
    WHEN INSTR(GENRE, '/') > 1 THEN
        TRIM(SUBSTR(GENRE, INSTR(GENRE, '/') + 1)) ||
        '/' || SUBSTR(GENRE, 1, INSTR(GENRE, '/') - 1)
    WHEN INSTR(GENRE, '/') = 0 THEN GENRE
END;
```

#### Genre Analysis Query
```sql
-- Books with more downloads than Biography genre
SELECT genre,
       MAX(downloads) as highest_downloads,
       MIN(downloads) as lowest_downloads,
       AVG(downloads) as average_downloads
FROM AUDBOOKS
GROUP BY genre
HAVING SUM(downloads) > (SELECT SUM(downloads) FROM AUDBOOKS WHERE genre = 'Biography');
```

#### Top-N Analysis
```sql
-- Next 4 books with fewer downloads than "Time's Eye" by Arthur C. Clarke (ID: 24)
SELECT *
FROM AUDBOOKS
WHERE downloads < (SELECT downloads FROM AUDBOOKS WHERE book_id = 24)
ORDER BY downloads DESC
FETCH FIRST 4 ROWS ONLY;
```

### Multiple Table Operations

#### SCIFI and FICTION Tables
- **SCIFI TABLE**: Science fiction books
- **FICTION TABLE**: General fiction books
- **MYGENRES TABLE**: Combined genres

#### Set Operations with Multiple Tables
```sql
-- Create MYGENRES from SCIFI and FICTION
SELECT * FROM SCIFI
UNION ALL
SELECT * FROM FICTION;

-- Subtract all SCIFI from MYGENRES
SELECT * FROM MYGENRES
EXCEPT
SELECT * FROM SCIFI;
```

### SENECATECH Table Operations
- **BONUS**: Null capable numeric field

#### Complex Query Example
```sql
SELECT column1,
       column2,
       CASE
           WHEN bonus > 1000 THEN 'High Bonus'
           WHEN bonus BETWEEN 500 AND 1000 THEN 'Medium Bonus'
           ELSE 'Low Bonus'
       END as bonus_category
FROM SENECATECH
WHERE condition;
```

### PATIENT6 Table Operations

#### Youngest Patient Analysis
```sql
-- Patients who paid less than lowest charge for youngest patient
SELECT patient_name, age, charge
FROM PATIENT6
WHERE charge < (SELECT MIN(charge) FROM PATIENT6 WHERE age = (SELECT MIN(age) FROM PATIENT6))
ORDER BY age, charge;
```

## Key Concepts Summary | 关键概念总结

### Set Operations | 集合运算
- **UNION**: Combines all rows, removes duplicates | UNION：合并所有行，删除重复
- **INTERSECT**: Common rows only | INTERSECT：仅公共行
- **EXCEPT/MINUS**: Rows in first table but not second | EXCEPT/MINUS：第一个表中有但第二个表中没有的行

### Functions | 函数
- **Single Row**: Process one row at a time | 单行：一次处理一行
- **Multi Row**: Process groups of rows | 多行：处理行组
- **Character**: Text manipulation | 字符：文本操作
- **Numeric**: Mathematical operations | 数值：数学运算
- **Conversion**: Data type changes | 转换：数据类型更改

### Subqueries | 子查询
- **Single Row**: Use `=`, `>`, `<`, etc. | 单行：使用`=`, `>`, `<`等
- **Multi Row**: Use `IN`, `ANY`, `ALL` | 多行：使用`IN`, `ANY`, `ALL`
- **Multi Column**: Return multiple columns | 多列：返回多列

### Best Practices | 最佳实践
- Use appropriate function types for different scenarios | 为不同场景使用适当的函数类型
- Match data types in set operations | 在集合运算中匹配数据类型
- Handle NULL values appropriately in functions | 在函数中适当处理NULL值
- Use subqueries to break complex problems into manageable parts | 使用子查询将复杂问题分解为可管理的部分

## Assignment Information | 作业信息
- **Assignment 1**: Due next week (Wednesday, Oct 8 at 9:00 AM) | 作业1：下周截止（周三，10月8日上午9:00）
- **Submission**: Text-based file by email | 提交：通过电子邮件发送文本文件
- **Group work**: One submission per group | 小组合作：每个小组一份提交
- **Late penalty**: After 9:01 AM considered late | 迟交处罚：9:01 AM后视为迟交

## Exam Preparation Tips | 考试准备提示
- Review all function types and their uses | 复习所有函数类型及其用途
- Practice set operations with different table combinations | 练习不同表组合的集合运算
- Understand when to use WHERE vs HAVING | 理解何时使用WHERE与HAVING
- Master subquery placement and execution order | 掌握子查询的位置和执行顺序
- Practice complex multi-table queries | 练习复杂的多表查询
