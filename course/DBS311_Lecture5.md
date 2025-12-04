# DBS311 Lecture 5 Notes | DBS311讲座5笔记

## Server-Side Application Logic | 服务器端应用逻辑

### Overview | 概述
- **Server-side application logic**: Components executing locally on database server | 服务器端应用逻辑：在数据库服务器本地执行的组件
- **Benefits** | 优势：
  - Minimize data movement between client and server | 最小化客户端和服务器之间的数据移动
  - Massive performance benefits | 巨大的性能优势
  - Leverage database server optimizations | 利用数据库服务器优化
  - Parallelization and shared-memory capabilities | 并行化和共享内存能力
  - Can be used by any application | 可被任何应用程序使用

### Types of Server-Side Objects | 服务器端对象类型
1. **Stored Procedures**: Application modules that perform functions | 存储过程：执行功能的应用程序模块
   - `EXECUTE <Procedure>` | 执行存储过程
   - `CALL <Procedure>` | 调用存储过程
2. **User Defined Functions**: Functions callable from SQL | 用户定义函数：可从SQL调用的函数
   - `SELECT FUNC(expression) FROM ...` | 从SELECT语句中调用函数
3. **Triggers**: Code executing on INSERT, UPDATE, DELETE | 触发器：在INSERT、UPDATE、DELETE时执行的代码
   - `CREATE TRIGGER ON ...` | 创建触发器

### Development Languages | 开发语言
- General programming languages (C, Java, etc.) | 通用编程语言（C、Java等）
- Database-specific languages | 数据库专用语言：
  - Oracle: PL/SQL | Oracle：PL/SQL
  - DB2: SQL/PL | DB2：SQL/PL
  - Microsoft SQL Server: Transact-SQL | Microsoft SQL Server：Transact-SQL

## PL/SQL Overview

### PL/SQL Characteristics
- Procedural constructs integrated with SQL
- Executes in the database
- Used to create: Procedures, Functions, Packages

### Program Unit Structure
```sql
Header AS
[declaration statements]
BEGIN
    -- executable statements
[EXCEPTION
    -- exception handling]
END;
```

### Basic Block Components
1. **Declarative** (optional): Variables and constants (`DECLARE`)
2. **Executable** (mandatory): Application logic (`BEGIN ... END`)
3. **Exception handling** (optional): Error conditions (`EXCEPTION`)

## Creating Procedures/Functions

### Syntax
```sql
-- Procedure
CREATE OR REPLACE PROCEDURE schema.procedure_name
(arg1 data_type, ...) AS
BEGIN
    -- procedure body
END procedure_name;

-- Function
CREATE OR REPLACE FUNCTION schema.function_name
(arg1 data_type, ...) RETURN return_type AS
BEGIN
    -- function body
    RETURN value;
END function_name;
```

### Example Procedure
```sql
CREATE OR REPLACE PROCEDURE welcome_message AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('Welcome to DBS311!');
END;
```

### Viewing Output
- Enable output: `SET SERVEROUTPUT ON;`
- Execute: Place cursor on block and press Ctrl+Enter

## Parameters in Procedures/Functions

### Parameter Types
1. **IN**: Procedure receives a value (default)
2. **OUT**: Procedure passes value back to calling program
3. **IN OUT**: Both receives and passes back a value

### Parameter Syntax
```sql
CREATE OR REPLACE PROCEDURE procedure_name(
    arg1 IN data_type,
    arg2 OUT data_type,
    arg3 IN OUT data_type
) AS
BEGIN
    -- procedure body
END;
```

### Examples

#### IN Parameter
```sql
CREATE PROCEDURE RemoveStaff(ID IN NUMBER) AS
BEGIN
    DELETE FROM STAFF WHERE STAFF.ID = RemoveStaff.ID;
END;
```

#### OUT Parameter (DB2)
```sql
CREATE PROCEDURE count_staff(staff_count OUT NUMBER) AS
BEGIN
    SELECT COUNT(*) INTO staff_count FROM staff;
END;
```

#### IN OUT Parameter
```sql
CREATE OR REPLACE PROCEDURE new_salary(salary IN OUT FLOAT) AS
BEGIN
    salary := salary * 1.20; -- 20% increase
END;
```

## Anonymous Blocks

### Definition
- Block without a name (not saved in database)
- Useful for testing purposes
- Can be saved as file on local machine

### Example
```sql
DECLARE
    salary_A FLOAT := 10000;
BEGIN
    new_salary(salary_A);
    DBMS_OUTPUT.PUT_LINE('New salary: ' || salary_A);
END;
```

### vs Named Procedures
- **Anonymous blocks**: Temporary, client-side files
- **Named procedures**: Permanent database objects

## Conditional Statements

### IF Statement (DB2 Example)
```sql
IF age < 18 THEN
    SET message = 'Minor';
ELSEIF age >= 18 AND age < 65 THEN
    SET message = 'Adult';
ELSE
    SET message = 'Senior';
END IF;
```

### CASE Statement (DB2 Example)
```sql
CASE
    WHEN age < 18 THEN
        SET message = 'Minor';
    WHEN age >= 18 AND age < 65 THEN
        SET message = 'Adult';
    ELSE
        SET message = 'Senior';
END CASE;
```

## SELECT INTO Statement

### Purpose
- Store data from single row fetch into variables
- Used in PL/SQL blocks

### Syntax
```sql
SELECT column_list
INTO variable_list
FROM table_name
WHERE condition(s);
```

### Exceptions
- **TOO_MANY_ROWS**: SELECT returns more than one row
- **NO_DATA_FOUND**: SELECT returns no data

### Example
```sql
DECLARE
    emp_name VARCHAR2(50);
    emp_salary NUMBER;
BEGIN
    SELECT first_name, salary
    INTO emp_name, emp_salary
    FROM employees
    WHERE employee_id = 100;
    
    DBMS_OUTPUT.PUT_LINE('Name: ' || emp_name || ', Salary: ' || emp_salary);
END;
```

## Exception Handling

### Purpose
- Handle errors during PL/SQL block execution
- Uses EXCEPTION section

### Example
```sql
DECLARE
    value_1 NUMBER := 20;
    value_2 NUMBER := 0;
    division NUMBER;
BEGIN
    division := value_1 / value_2; -- This will cause divide by zero error
    DBMS_OUTPUT.PUT_LINE('Division: ' || division);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error occurred!');
END;
```

## Course Timeline

### Upcoming Schedule
- **Lab 5**: Oracle procedures lab, due after break
- **Assignment 2**: Released this week
- **Midterm Test**: Week 6 in lab period
- **Break Week**: Week following midterm

### Lecture Topics
- **Current**: Stored Procedures (Lab 5)
- **Next**: Iteration and Triggers (Lab 6)
- **Following**: Cursors (Lab 7)
- **Later**: MongoDB

## Key Concepts Summary

### PL/SQL Components
- **Procedures**: No return value, perform actions
- **Functions**: Return a value, callable from SQL
- **Anonymous Blocks**: Temporary code blocks for testing

### Parameter Types
- **IN**: Input parameters (default)
- **OUT**: Output parameters
- **IN OUT**: Both input and output

### Control Structures
- **IF/ELSEIF/ELSE**: Conditional logic
- **CASE**: Multiple condition handling
- **SELECT INTO**: Data retrieval into variables

### Error Handling
- **EXCEPTION block**: Handle runtime errors
- **Built-in exceptions**: TOO_MANY_ROWS, NO_DATA_FOUND
- **Custom exceptions**: WHEN OTHERS for general error handling

### Best Practices
- Use SET SERVEROUTPUT ON to view DBMS_OUTPUT
- Qualify column names in procedures when ambiguous
- Handle exceptions to prevent unhandled errors
- Use appropriate parameter types for data flow
