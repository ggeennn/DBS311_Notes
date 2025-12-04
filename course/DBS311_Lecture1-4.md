# DBS311 Lecture 1-4 Notes | DBS311讲座1-4笔记

## Lecture 1: Introduction to DBS311 | 讲座1：DBS311课程介绍

### Course Overview | 课程概述
- **DBS311**: Advanced Database Services | 高级数据库服务
- Oracle accounts supplied, some examples with DB2 | 提供Oracle账户，一些示例使用DB2
- Work done with Oracle | 工作使用Oracle完成
- Prerequisite for: DBT544, more advanced courses, Embedded SQL, Host variables, Dynamic & Static SQL, Commitment Control | 前置课程：DBT544、更高级课程、内嵌SQL、宿主变量、动态和静态SQL、事务控制

### Companies Using DB2 | 使用DB2的公司
- 6,585 companies with revenue > $1B | 年收入超过10亿美元的公司：6585家
- 1,915 companies with revenue $500M-$1B | 年收入5亿-10亿美元的公司：1915家
- 7,228 companies with revenue $50M-$500M | 年收入5000万-5亿美元的公司：7228家
- 23,382 companies with revenue $1M-$50M | 年收入100万-5000万美元的公司：23382家
- 2,680 companies with revenue < $1M | 年收入低于100万美元的公司：2680家

### Course Structure | 课程结构
- **Tests**: 2 tests | 测试：2次考试
- **Labs**: 10 labs, read first document in Labs Folder | 实验：10个实验，阅读实验文件夹中的第一份文档
- **Assignments**: 2 assignments (A1-5%, A2-15%), group work | 作业：2个作业（A1-5%，A2-15%），小组合作
- **Office Hours**: Teams for lectures, Zoom for office hours (Mon 8:55 AM, 10:45 AM; Thu 10:45 AM) | 办公时间：Teams用于讲座，Zoom用于办公时间（周一8:55 AM, 10:45 AM；周四10:45 AM）

### SQL Fundamentals | SQL基础知识
- **SQL**: Structured Query Language for database communication | SQL：结构化查询语言，用于数据库通信
- **Categories** | 分类：
  - DDL (Data Definition Language) | DDL（数据定义语言）
  - DML (Data Manipulation Language) | DML（数据操纵语言）
  - TCL (Transaction Control Language) | TCL（事务控制语言）

### Joins Examples
- Various JOIN examples (1-6) demonstrating different join scenarios
- Referential Integrity concepts

### Single Row Functions | 单行函数

#### Character Functions | 字符函数
- `LOWER()`, `UPPER()`, `INITCAP()` | 小写、大写、首字母大写函数
- `SUBSTR()`, `CONCAT()`, `LENGTH()`, `INSTR()` | 子字符串、连接、长度、位置查找函数
- `TRIM()`, `REPLACE()` | 修剪、替换函数

#### Numeric Functions | 数值函数
- `ROUND()`, `TRUNC()`, `MOD()` | 四舍五入、截断、取模函数

#### DateTime Functions | 日期时间函数
- Oracle: `SYSDATE` | Oracle：当前日期时间
- DB2: `CURRENT DATE`, `CURRENT TIMESTAMP` | DB2：当前日期、当前时间戳

#### Conversion Functions | 转换函数
- `CAST()` for data type conversion | `CAST()`用于数据类型转换

---

## Lecture 2: Advanced SQL Functions

### Single Row Functions Categories
- Character Functions
- Numeric Functions
- DateTime Functions
- Conversion Functions

### Character Function Examples
- Extract first name and initials from employee name
- Shorten column width using `SUBSTR` or `CAST`
- `NVL()` function for null value replacement

### Conversion Functions
- `CAST()` to change data types
- Bridge between SQL statements and applications

### Comparison Functions
- `>`, `<=`, `>=`, `=`, `!=`, `<>`
- `AND`, `OR`, `IN`, `BETWEEN`, `LIKE`, `IS`

### Group Functions (Multi-Row Functions)
- `AVG()`, `COUNT()`, `MAX()`, `MIN()`, `SUM()`
- `STDDEV()`, `VARIANCE()`
- Guidelines: `DISTINCT`, `ALL`, ignore null values

### GROUP BY and HAVING Clauses
- `GROUP BY` divides table into smaller groups
- `HAVING` filters groups (like `WHERE` for groups)
- Can group by multiple columns

### PATIENT3 and INSURANCE3 Examples
- Complex queries with multiple tables

---

## Lecture 3: Subqueries

### Subquery Definition
- SELECT statement embedded in another SELECT statement
- Used when condition depends on data from same or other tables
- **Order of Operation**: Subquery executes first, results fed to outer query

### Subquery Locations
- `WHERE` clause
- `FROM` clause
- `HAVING` clause

### Subquery Types
1. **Single Row Subqueries**: Returns one row
2. **Multi Row Subqueries**: Returns multiple rows
3. **Multi-column Subqueries**: Returns multiple columns

### Single Row Subquery Examples
- Who earns more than Wilson?
- Lowest salary for those who make more than Wilson

### Multi Row Subquery Operators
- `IN`: Equal to any member in list
- `ANY`: Compare value to each value returned
- `ALL`: Compare value to every value returned

### Multi-Column Subqueries
- Return multiple columns to outer query
- Used in `FROM`, `WHERE`, `HAVING` clauses

### PATIENT4 and INSURANCE4 Examples
- Complex queries with updated datasets

---

## Lecture 4: Set Operators and Advanced Queries

### Set Theory Operations
- **UNION**: All rows from both tables, excluding duplicates
- **UNION ALL**: All rows including duplicates
- **INTERSECT**: Common rows, excluding duplicates
- **EXCEPT/MINUS**: Rows unique to left table, excluding duplicates

### Set Operator Rules
- Same number of columns in each SELECT
- Compatible data types (use `CAST` if needed)
- `ORDER BY` only at end of statement
- Column names from first query appear in results

### Set vs Joins
- **Joins**: Combine records with common connections
- **Set Operators**: Combine results based on set theory

### Complex Examples
- Multiple table unions
- Province and customer data combinations
- Employee vs customer contact matching

### Midterm Review Preparation
- Review session next week
- Midterm test following week in lab period

## Key Concepts Summary

### Functions
- **Single Row**: Return one result per row (Scaler functions)
- **Multi Row**: Return one result per group (Aggregate functions)

### Clauses
- **WHERE**: Filters individual rows
- **HAVING**: Filters groups
- **GROUP BY**: Creates groups for aggregation

### Operators
- **Set Operators**: UNION, INTERSECT, EXCEPT/MINUS
- **Comparison Operators**: IN, ANY, ALL for subqueries

### Best Practices
- Subqueries on right side of comparison operators
- `ORDER BY` in subqueries only for TOP-N analysis
- Match data types in set operations
- Use appropriate function types for different scenarios
