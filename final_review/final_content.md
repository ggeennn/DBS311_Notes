根据提供的课堂记录（Transcript），以下是期末考试（Final Exam）的详细考点总结与代码示例。

### ✅ 必考内容 (Will Be On The Exam)

#### 1\. PL/SQL 函数 (Functions)

  * [cite_start]**结构口诀:** 必须掌握 "SCRAB RE" (Structure: Create, Return type, As, Begin, Return value, End) [cite: 51, 53]。
  * [cite_start]**使用规则:** 函数可以在 `SELECT` 和 `ORDER BY` 中使用，**但不能**在 `WHERE` 子句中直接使用列的别名（Alias）[cite: 91, 92]。
  * [cite_start]**区别:** 函数必须有返回值 (`RETURN`)，且可用在 SQL 语句中，而存储过程不能 [cite: 25, 26]。

**代码示例:**

```sql
-- 创建函数
CREATE OR REPLACE FUNCTION calculate_tax (
    p_salary IN NUMBER
) RETURN NUMBER AS             -- [R]eturn type + [A]s
    v_tax NUMBER;
BEGIN                          -- [B]egin
    v_tax := p_salary * 0.13;
    RETURN v_tax;              -- [R]eturn value
END;                           -- [E]nd
/

-- 使用函数 (注意 WHERE 中不能用别名)
SELECT last_name, calculate_tax(salary) AS tax_amt 
FROM employees 
WHERE calculate_tax(salary) > 500  -- 正确：重复调用函数
ORDER BY tax_amt;                  -- 正确：ORDER BY 可用别名
```

#### 2\. PL/SQL 存储过程与游标 (Procedures & Cursors)

  * [cite_start]**游标语法:** 必须掌握 `CURSOR cursor_name IS ...` 的定义方式 [cite: 160]。
  * [cite_start]**联结 (Joins):** 游标定义中会包含多表联结（JOIN）[cite: 164]。
  * [cite_start]**整行变量:** 使用 `%ROWTYPE` 来定义存储整行数据的变量 [cite: 153]。
  * [cite_start]**控制中断处理 (Control Break Processing):** 这是一个难点。逻辑是：遍历游标时，只有当某个ID（如 `customer_id`）发生变化时，才打印表头或特定信息，否则只打印详细行 [cite: 123, 216]。
      * [cite_start]*注：如果这部分写不出来会扣少量分，写出来得满分 [cite: 124]。*

**代码示例:**

```sql
CREATE OR REPLACE PROCEDURE report_customers AS
    -- 定义游标 (含 JOIN)
    CURSOR c_cust IS 
        SELECT c.name, p.phone 
        FROM customers c JOIN phones p ON c.id = p.cust_id
        ORDER BY c.id; -- 必须排序才能做 Control Break
    
    v_row c_cust%ROWTYPE; -- 使用 ROWTYPE
    v_prev_name customers.name%TYPE := ''; -- 保存上一次的名字
BEGIN
    OPEN c_cust;
    LOOP
        FETCH c_cust INTO v_row;
        EXIT WHEN c_cust%NOTFOUND;

        -- Control Break Logic
        IF v_row.name != v_prev_name THEN
            DBMS_OUTPUT.PUT_LINE('--- New Customer: ' || v_row.name);
            v_prev_name := v_row.name;
        END IF;
        
        DBMS_OUTPUT.PUT_LINE('Phone: ' || v_row.phone);
    END LOOP;
    CLOSE c_cust;
END;
/
```

#### 3\. PL/SQL 触发器 (Triggers)

  * [cite_start]**行级触发:** 必须写 `FOR EACH ROW`，否则触发器只对整个语句执行一次，而不是每行一次 [cite: 284, 291]。
  * [cite_start]**新旧值引用:** 掌握 `:OLD` (更新前) 和 `:NEW` (更新后) 的用法 [cite: 302]。
  * [cite_start]**事务类型判断:** 能够判断 `UPDATING`, `INSERTING`, `DELETING` [cite: 260]。

**代码示例:**

```sql
CREATE OR REPLACE TRIGGER audit_salary
AFTER UPDATE ON employees
FOR EACH ROW      -- 关键：行级触发
BEGIN
    IF UPDATING THEN
        -- 记录旧薪资 (:OLD) 和 新薪资 (:NEW)
        INSERT INTO audit_table (emp_id, old_sal, new_sal)
        VALUES (:OLD.id, :OLD.salary, :NEW.salary);
    END IF;
END;
/
```

#### 4\. MongoDB 基础操作

  * **查询与投影 (Query & Projection):**
      * Query Document: 过滤文档（WHERE条件）。
      * [cite_start]Projection Document: 控制显示哪些字段（0表示隐藏，1表示显示）[cite: 336, 343]。
  * **更新操作符:**
      * [cite_start]`$set` (修改/新增), `$unset` (删除字段), `$inc` (数值增减) [cite: 380, 392, 384]。
      * [cite_start]数组操作: `$push` (添加), `$addToSet` (添加且去重) [cite: 438, 443]。
  * [cite_start]**替换文档:** 使用 `replaceOne` 替换除 `_id` 外的整个文档 [cite: 484]。
  * [cite_start]**计数:** 使用 `countDocuments` [cite: 502]。

**代码示例:**

```javascript
// 查找 genre 为 Fiction 的书，只显示 title，不显示 _id
db.books.find(
    { genre: "Fiction" },    // Query
    { title: 1, _id: 0 }     // Projection
);

// 更新：给 ID 为 1 的书增加 sales 数组元素，并增加价格
db.books.updateOne(
    { _id: 1 },
    { 
        $addToSet: { sales: 2023 }, // 数组去重添加
        $inc: { price: 5 }          // 价格 +5
    }
);
```

#### 5\. MongoDB 聚合 (Aggregation) - ❗必考难点

[cite_start]老师明确提到会有一道**较难的聚合题**，只会考以下两种场景之一 [cite: 554, 558]：

  * **场景 A: 分组统计 (`$group`)**
      * [cite_start]计算某分类下的平均值 (`$avg`) 和总数 (`$sum: 1`) [cite: 559, 571]。
  * **场景 B: 字符串拼接 (`$project`)**
      * [cite_start]构造一个新的虚拟字段（如 Email），使用 `$concat` 拼接 `$substr` (子串) 和 `$toString` (转字符串) [cite: 579, 588, 594]。

**代码示例 (场景 A - Group):**

```javascript
db.books.aggregate([
    {
        $group: {
            _id: "$genre",           // 按 genre 分组
            avgDuration: { $avg: "$duration" }, // 计算平均时长
            totalBooks: { $sum: 1 }  // 计算总书本数
        }
    }
]);
```

**代码示例 (场景 B - Project/String):**

```javascript
db.books.aggregate([
    {
        $project: {
            email: {
                $concat: [
                    { $substr: ["$author", 0, 1] }, // 作者首字母
                    "@",
                    { $toString: "$_id" },          // ID 转字符串
                    ".com"
                ]
            }
        }
    }
]);
```

-----

### ❌ 不会考的内容 (Will NOT Be On The Exam)

  * [cite_start]**Aggregation `$match` 阶段:** 老师明确说聚合题**不包含** `$match` [cite: 557]。
  * [cite_start]**多阶段复杂聚合:** 考试只关注单阶段（Single Stage）的复杂应用 [cite: 531]。
  * [cite_start]**`count()`:** 已废弃，不要用，请用 `countDocuments` [cite: 501]。
  * [cite_start]**运行代码调试:** 考试时无法运行代码，必须能够静态写出正确的逻辑，且不能依赖之前的状态（每题独立）[cite: 314, 606]。