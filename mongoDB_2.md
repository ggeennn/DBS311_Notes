### 1. 查询陷阱：数组与空值 (Search: Arrays & Nulls)

这是课件中篇幅最长，也是最容易混淆的部分。

#### **A. 数组查询的三种姿势**
1.  **`$all` (子集匹配/无序)**
    * [cite_start]**规则：** 只要数组包含指定的**所有**元素即可，顺序无关紧要，数组还可以包含其他元素 [cite: 190, 567]。
    * [cite_start]**示例：** `find({fruit: {$all: ["apple", "banana"]}})` 可以匹配 `["apple", "banana", "peach"]` [cite: 567, 570]。
    * [cite_start]**对比：** 如果顺序反过来写 `["banana", "apple"]`，`$all` 依然能匹配，但精确匹配不行 [cite: 577, 578]。
2.  **精确匹配 `[]` (完全相等)**
    * [cite_start]**规则：** 这是一个极其严格的匹配。数组的**元素值**、**数量**、**顺序**必须完全一致 [cite: 573]。
    * [cite_start]**示例：** 如果文档是 `["apple", "banana", "peach"]`，你查 `["apple", "banana"]` 是查不到的（因为数量不对） [cite: 575, 576]。
    * [cite_start]**示例：** 如果顺序不对，如 `["banana", "apple"]`，也查不到 [cite: 576]。
3.  **`$elemMatch` (单元素内多条件)**
    * [cite_start]**场景：** 当数组里的元素是对象，且你需要**同一个对象**同时满足多个条件时 [cite: 653, 656]。
    * [cite_start]**示例：** `scores: { $elemMatch: { $gte: 80, $lt: 85 } }` [cite: 670]。
    * [cite_start]**对比：** 如果不用 `$elemMatch` 而直接写条件，可能会导致“跨元素匹配”（即 A 元素满足条件 1，B 元素满足条件 2），这通常不是你想要的 [cite: 678, 679]。
4.  **`$size` (长度查询)**
    * [cite_start]**规则：** 仅匹配数组长度等于指定值的文档 [cite: 819]。
    * [cite_start]**限制：** 不能与其他条件操作符（如 `$gt`）直接混合使用 [cite: 821]。

#### **B. Null 与 Existence (存在性查询)**
1.  **查询 `null` 的歧义**
    * **规则：** `find({phone: null})` 会返回两种文档：
        1.  [cite_start]`phone` 字段存在且值为 `null` [cite: 298, 305]。
        2.  [cite_start]`phone` 字段**根本不存在** [cite: 307, 324]。
2.  **精准查 Null (`$exists`)**
    * 如果要**排除**那些“字段不存在”的文档，只找“明确设置为 null”的文档，必须配合 `$exists`。
    * [cite_start]**写法：** `{ phone2: { $eq: null, $exists: true } }` 或者 `{ phone2: { $in: [null], $exists: true } }` [cite: 429, 494]。
3.  **`$exists` 操作符**
    * [cite_start]用于匹配包含或不包含指定字段的文档 [cite: 418, 426]。

---

### 2. 更新风控：修改 vs 替换 (Update vs Replace)

这是我们之前讨论中风险最高的区域，课件中明确了它们的区别。

#### **A. `replaceOne` (高风险)**
* [cite_start]**行为：** 找到匹配的第一个文档，并用新文档**完全替换**它 [cite: 888]。
* [cite_start]**后果：** 除了 `_id` 保持不变，旧文档中**所有**未在替换文档中列出的字段都会丢失 [cite: 893, 895]。
* [cite_start]**Upsert：** 默认是 `false`。如果设为 `true` (`{upsert: true}`)，当找不到文档时会执行插入操作 [cite: 915, 927]。

#### **B. `updateOne` / `$set` (推荐)**
* [cite_start]**行为：** 仅修改指定的字段，其他字段保留原样 [cite: 943]。
* **`$set` 的双重性：**
    1.  [cite_start]如果字段存在 -> 修改值 [cite: 1029]。
    2.  [cite_start]如果字段不存在 -> **添加新字段** [cite: 944, 1032]。
    * *（结合我们之前的对话：如果要防止添加新字段，必须在 filter 中加 `$exists: true`）。*

#### **C. 其他更新操作符**
* [cite_start]**`$inc`：** 用于增加（或减少，使用负数）数值字段的值 [cite: 939, 983, 990]。
* **`$unset`：** 用于完全删除一个字段。
    * [cite_start]**语法确认：** 必须使用对象形式 `{ $unset: { "field": 1 } }`，这验证了我们之前关于“为什么要花括号”的讨论 [cite: 1048]。

#### **D. 批量操作 (Bulk Write)**
* [cite_start]`bulkWrite` 允许在一个请求中同时执行插入、更新和删除操作 [cite: 161, 163]。

---

### 3. 语法细节与 ID (Syntax Details)

#### **A. `_id` 查询**
* [cite_start]**规则：** 在 MongoDB Shell 中查询默认生成的 ID 时，**必须**使用 `ObjectId("...")` 包裹字符串，直接查字符串通常查不到 [cite: 263, 290]。

#### **B. 逻辑操作符**
* [cite_start]**`$or` / `$and`：** 用于连接多个独立的条件。`$or` 接受一个包含可能条件的数组 [cite: 190, 193]。
* [cite_start]**`$mod`：** 取模运算查询。例如 `{"id_num": {$mod: [5, 1]}}` 表示 `id_num % 5 == 1` [cite: 200, 202]。

#### **C. 投影 (Projection)**
* [cite_start]**规则：** 在 `find` 的第二个参数中指定。`1` 表示显示，`0` 表示隐藏 [cite: 20, 800, 805]。
* [cite_start]**限制：** 通常不能混用包含和排除（除了 `_id`）[cite: 21]。

---

### 📝 核心复习摘要 (Summary for Exam)

1.  **查数组包含多值：** 用 `$all`（忽略顺序）。
2.  **查数组精确匹配：** 直接用 `[...]`（顺序、数量必须一致）。
3.  **查数组内对象的特定逻辑：** 必须用 `$elemMatch` 防止跨元素匹配。
4.  **查 Null：** 小心它会匹配“字段不存在”的情况，救兵是 `$exists: true`。
5.  **改数据：** 除非你想重写整个文档，否则永远用 `updateOne` + `$set`，不要用 `replaceOne`。
6.  **删字段：** `$unset` 后面要跟一个对象 `{field: 1}`。