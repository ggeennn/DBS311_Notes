# SQL GROUP BY Requirement Summary

## 🧠 Core Rule
"`SELECT`中出现裸列，`GROUP BY`必须列"  
*(If naked columns appear in SELECT, GROUP BY must declare them)*  

## ✅ Correct Usage
```sql
-- Valid: Only aggregate functions
SELECT AVG(salary) FROM employees;

-- Valid: department_id in GROUP BY
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id;

-- Valid: Multiple columns in GROUP BY
SELECT department_id, job_id, COUNT(*)
FROM employees
GROUP BY department_id, job_id;
```

## ❌ Incorrect Usage
```sql
-- Error: department_id not in GROUP BY
SELECT department_id, AVG(salary)
FROM employees;

-- Error: job_id missing from GROUP BY
SELECT department_id, job_id, AVG(salary)
FROM employees
GROUP BY department_id;
```

## ⚡ Special Cases
```sql
-- Valid: No GROUP BY needed when all columns aggregated
SELECT MAX(salary), MIN(salary), AVG(salary) 
FROM employees;
```

## 📝 Memory Aids
1. **S.G.T. Principle**:
   - Select → Check for naked columns
   - Group By → Add all naked columns
   - Think → "What to show per group?"

2. **Error Messages**:
   - Oracle: "ORA-00937: not a single-group group function"
   - SQL Server: "Column 'X' is invalid in select list..."

## 🔗 Related Concepts
```sql
-- HAVING for filtering groups
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 8000;
