# DBS311 MongoDB 核心知识点汇总 (Lecture 10)

## 1\. 复习与基础操作 (Review & Basics)

### 字段更新 (Field Updates)

  * **`$unset`**: 物理删除某个字段。
  * **`replaceOne`**: 替换除 `_id` 外的整个文档（不同于 `updateOne` + `$set`）。
  * **`$set`**: 修改现有值或添加新字段。

<!-- end list -->

```javascript
// 删除 "age" 字段
db.collection.updateOne({ _id: 1 }, { $unset: { age: 1 } });

// 完全替换文档 (ID不变)
db.collection.replaceOne({ _id: 10 }, { brand: "Toyota", model: "Camry" });
```

### 数组查询操作符 (Array Query Operators)

  * **`$all`**: 匹配包含所有指定元素的数组（无视顺序）。
  * **`$size`**: 匹配特定长度的数组。
  * **`$elemMatch`**: 精确匹配数组中的对象，或在单个元素上同时满足多个条件（避免跨元素匹配）。
  * **`$type`**: 检查字段类型（如区分 String 和 Array）。

<!-- end list -->

```javascript
// 查找同时包含 "Joe" 和 "Bob" 的数组
{ narrator: { $all: ["Joe", "Bob"] } }

// 查找长度为 3 的数组
{ narrator: { $size: 3 } }

// 排除仅为 String 的 narrator，只找数组类型
{ narrator: { $type: "array" } }

// 查找 narrator 包含 "Meg" 但排除她是唯一 narrator 的情况 (必须是数组且匹配)
{ narrator: { $elemMatch: { $eq: "Meg" } } }
```

-----

## 2\. 数组修饰符 (Array Modifiers)

*用于 `updateOne` / `updateMany` 中修改数组内容。*

### 添加元素

  * **`$push`**: 追加元素，**允许重复**。若字段不存在则创建数组。
  * **`$addToSet`**: 集合逻辑，仅当元素不存在时才添加，**防止重复**。
  * **限制**: 不能对非数组字段（如 String）使用这些操作符，会报错。

### 批量与控制 (`$each`, `$sort`, `$slice`)

必须配合 `$push` 使用。

  * **`$each`**: 一次添加多个独立元素（否则整个数组会变成嵌套子数组）。
  * **`$sort`**: 添加后排序（1 升序，-1 降序）。
  * **`$slice`**: 截断数组保留特定数量（正数保留前 N 个，负数保留后 N 个）。

**代码演练：添加、排序并限制大小**

```javascript
db.movies.updateOne(
  { genre: "horror" },
  {
    $push: {
      top10: {
        $each: [{ name: "Saw", rating: 4.3 }, { name: "Alien", rating: 8.5 }], // 1. 添加
        $sort: { rating: -1 }, // 2. 按评分降序排列 (注意：直接写字段名，不要用点语法)
        $slice: 10             // 3. 只保留前10个 (即评分最高的10个)
      }
    }
  }
)
```

-----

## 3\. 聚合框架 (Aggregation Framework)

### 核心概念

  * **管道 (Pipeline)**: 数据像流一样经过一系列阶段 (Stages) 处理。
  * **语法**: `db.coll.aggregate([ {Stage1}, {Stage2}, ... ])`。即使只有一个阶段，也必须包裹在数组 `[]` 中（尽管 Shell 有时允许省略，但严谨代码必须加）。

### 常用阶段

1.  **`$match`**: 过滤文档。**最佳实践**：尽可能放在管道最前面，以减少后续处理的数据量。
2.  **`$project`**:
      * 选择字段 (`name: 1`) 或 排除字段 (`_id: 0`)。
      * 重命名字段 (`newField: "$oldField"`).
      * 创建计算字段 (Virtual Fields).
3.  **`$addFields`**: 添加新字段，同时自动保留所有现有字段（比 `$project` 更省事，不用逐一列出要保留的字段）。

-----

## 4\. 表达式与计算 (Expressions)

### 数学运算

  * **语法规则**: 多参数操作符必须用 **数组 `[]`** 包裹参数。
  * **常见操作符**: `$add`, `$subtract`, `$multiply`, `$divide`, `$mod` (取余), `$trunc` (截断), `$round` (四舍五入).

**场景：将分钟转换为 "X小时 Y分钟"**

  * 直接 `$divide` 会得到浮点数，不准。
  * 策略：用 `$trunc` 取整得到小时，用 `$mod` 得到剩余分钟。

<!-- end list -->

```javascript
{
  $project: {
    title: 1,
    // hours = 截断(duration / 60)
    hours: { $trunc: [ { $divide: ["$duration", 60] }, 0 ] }, 
    // minutes = duration % 60
    minutes: { $mod: ["$duration", 60] }
  }
}
```

### 字符串操作

  * **`$concat`**: 拼接字符串。
  * **`$substr`**: 截取子串 `[string, start, length]`。
  * **`$toLower` / `$toUpper`**: 大小写转换。

**场景：构建 Email (首字母 + 点 + 姓氏)**

```javascript
{
  $project: {
    email: {
      $concat: [
        { $substr: ["$firstName", 0, 1] }, // 取首字母
        ".",
        "$lastName",
        "@email.com"
      ]
    }
  }
}
```

### 逻辑控制

  * **`$cond`**: 条件判断 (类似 if-else)。
      * 语法: `{ $cond: [ <boolean-expression>, <true-case>, <false-case> ] }`

-----

## 5\. 分组与统计 (`$group`)

### 基础语法

  * **`_id`**: **必须存在**。定义分组的依据（Group Key）。
      * 按单字段分组: `_id: "$genre"`
      * 按多字段分组 (复合): `_id: { prov: "$province", city: "$city" }`
  * **累加器 (Accumulators)**:
      * **`$sum: 1`**: 计数 (Count rows).
      * **`$sum: "$field"`**: 对某字段求和.
      * **`$avg`**: 平均值.
      * **`$min` / `$max`**: 最小值/最大值.

### 高级技巧：找出“最X”的文档信息

`$min` 和 `$max` 只返回数值，不返回对应的书名。
**解决方案**: 先 `$sort`，再 `$group` 并使用 `$first` 或 `$last`。

**代码演练：每个类别中最短的书名**

1.  **Sort**: 按时长升序 (Duration ASC).
2.  **Group**: 取第一个元素 (`$first`) 即为最短。

<!-- end list -->

```javascript
db.audiobooks.aggregate([
  { $sort: { duration: 1 } }, // 1. 先排序
  {
    $group: {
      _id: "$genre",
      shortestBookTitle: { $first: "$title" }, // 2. 取排序后的第一个文档的标题
      minDuration: { $first: "$duration" }     //    以及它的时长
    }
  }
])
```

-----

## 6\. 数据类型与常见坑 (Pitfalls & Types)

### 日期处理

  * **问题**: 数据库中日期可能是 `String` ("2018-01-01") 也可能是 `Date Object`。
  * **后果**: 直接使用 `$gt` (大于) 比较日期对象和字符串会失败或遗漏数据。`$year`, `$month` 对字符串字段也会报错。
  * **解决方案**: 在比较前强制类型转换。

<!-- end list -->

```javascript
// 纠正计数漏算问题
db.collection.aggregate([
  {
    $addFields: {
      realDate: { $toDate: "$dateStringField" } // 1. 强制转为 Date 对象
    }
  },
  {
    $match: {
      realDate: { $gt: new Date("2018-01-01") } // 2. 安全比较
    }
  },
  { $count: "total" }
])
```

### 计数方法的变迁

  * **`count()`**: 已弃用 (Deprecated)，可能不准确。
  * **`countDocuments(query)`**: 推荐使用，准确统计符合条件的文档数。

### 语法细节总结

1.  **引用字段值**: 必须加 `$` 并用引号 (如 `"$price"`).
2.  **引用数值类型字段名**: 即使字段名是数字开头 (如 "401k")，引用时也要写成 `"$401k"`。
3.  **方括号**: 聚合管道 `aggregate([])` 和多参数数学函数 `$add: [a, b]` 必须使用方括号。