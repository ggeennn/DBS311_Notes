### MongoDB 核心语法与Shell操作总结 (最终完整版) ###

---
#### 1. Shell 环境与基础操作
---

* **db 变量:** 在 MongoDB Shell (`mongosh`) 中，`db` 是一个自动初始化的全局变量，代表当前正在操作的数据库。
* **use [databaseName]:**
    * `use('test');`
    * 切换到指定的数据库。如果该数据库不存在，它会在你首次向其插入数据时被自动创建。
* **Shell 作为 JS 环境:**
    * Shell 是一个完整的 JavaScript 解释器。
    * 支持 JS 变量、数学运算 (`x=200; x/5;`)、字符串方法 (`"Hello".replace(...)`)。
    * 支持自定义 JS 函数 (`function factorial(n) {...}`)。
    * 支持 `for` 循环，可用于批量插入：
        * `for (var i=1; i <= 15; i++) { db.testData.insert({x:i}) };`
* **VS Code Playground:**
    * **执行全部:** 点击右上角的 ▷ (Play) 按钮，会执行文件中的所有代码（通常会弹出安全确认）。
    * **执行选中:** 选中代码 -> 按 `Ctrl+Shift+P` -> 选择 `MongoDB: Run Selected Lines From Playground`。

---
#### 2. 数据库 (Database)
---

* **动态创建:** 在 `insertOne` 时自动创建（如果不存在）。
* **保留名称 (Reserved Names):**
    * `admin`: 根数据库，用于身份验证和管理。
    * `local`: 存储特定于单个服务器的数据。
    * `config`: 存储分片集群 (Sharded Cluster) 的元数据。

---
#### 3. 集合 (Collections)
---

* **动态创建 (Dynamic Creation):** 当你对一个不存在的集合执行 `insertOne` 或 `insertMany` 时，MongoDB 会自动创建该集合。
* **显式创建 (Explicit Creation):**
    * `db.createCollection("collectionName");`
* **删除集合 (Dropping):**
    * `db.collection.drop();` (删除集合及其所有文档和索引)。
* **访问集合 (Accessing):**
    * **语法糖 (Sugar):** `db.MyCustomers` (推荐用于简单名称)
    * **标准方法 (Safe):** `db.getCollection('MyCustomers')`
* **带点号的集合名:**
    * 如果集合名本身包含点号（例如 `mailing.list`），你**必须**使用 `getCollection()` 方法访问：
    * `db.getCollection('mailing.list').find()` (推荐)

---
#### 4. CRUD - 创建 (Create / Insert)
---

* **`insertOne(document)`:**
    * 插入单个文档 (Document)。参数必须是一个**对象** `{}`。
    * `db.MyCustomers.insertOne({name: "Alice", age: 30});`
* **`insertMany([documents])`:**
    * 插入多个文档。参数必须是一个**数组** `[]`。
    * `db.MyCustomers.insertMany([{name: "Bob"}, {name: "Charlie"}]);`
* **插入返回值 (Return Value):**
    * 操作会返回一个确认对象，包含 `acknowledged: true`。
    * `insertOne` 返回 `insertedId` (例如 `103` 或 `{"$oid": "..."}`)。
    * `insertMany` 返回 `insertedIds` (一个索引映射对象，例如 `{"0": 112, "1": 124}`)。
* **_id 字段:**
    * 如果你在插入时**没有**提供 `_id` 字段，MongoDB 会自动生成一个唯一的 `ObjectId` 作为主键。
    * `_id` 字段是**不可变的 (Immutable)**，一旦设置，不能更改。
    * 建议：始终为文档包含一个唯一的 `_id` 字段。
* **使用变量插入:**
    * `let post = {"_id": 103, name: "Atelier"};`
    * `db.mycustomers.insertOne(post);`
* **插入验证 (Validation):**
    * MongoDB 会检查文档的基本结构，例如大小（必须小于 16MB）。
* **常见陷阱 (Gotcha):**
    * **错误:** `db.collection.insertOne([ {name: "Wrong"} ])`
    * **正确:** `db.collection.insertOne({name: "Correct"})`
    * `insertOne` 只接受单个对象。错误地使用数组会导致文档被错误地存储（例如，作为数组或键为 "0" 的对象），使其无法通过常规查询找到。
* **(旧) `insert()` 与错误处理:**
    * `insert()` 已弃用 (Deprecated)。
    * 默认情况下，遇到第一个错误（如 `_id` 重复）时，批量插入**立即停止**。
    * （旧）`continueOnError` 选项（或现代的 `ordered: false`）允许跳过错误，继续插入批次中剩余的文档。

---
#### 5. CRUD - 读取 (Read / Find)
---

* **`find({filter}, {projection})`:**
    * 返回一个游标 (Cursor)，包含所有匹配的文档。
* **`findOne({filter}, {projection})`:**
    * 只返回匹配的**第一个**文档（返回的是对象，不是游标）。
* **查询所有 (Find All):**
    * `db.MyCustomers.find({})`
    * **注意:** 必须使用空花括号 `{}` 作为查询条件，`find()` 是错误的（不符合 API 规范）。
* **投影 (Projection) - (第二个参数):**
    * 用于限制返回的字段。
    * **包含 (Include):** `{"name": 1, "creditlimit": 1}` (只返回 `_id`, `name`, `creditlimit`)
    * **排除 (Exclude):** `{"phone": 0}` (返回除 `phone` 外的所有字段)
    * **排除 `_id`:** `_id` 默认总是被包含，必须显式排除：
        * `db.MyCustomers.find({}, {"name": 1, "creditlimit": 1, "_id": 0})`
* **查询嵌入文档 (Embedded Documents):**
    * **精确匹配 (Exact Match):** `find({contact: {first: "Jean", last: "King"}})`
        * 要求子文档**完全一致**（包括字段顺序和数量），通常不推荐。
    * **点表示法 (Dot Notation) (推荐):**
        * `db.MyCustomers.find({"contact.first": "Jean"})` (只匹配子字段)
        * `db.MyCustomers.find({"contact.first": "Jean", "contact.last": "King"})` (隐式 AND)
    * **数组/嵌入陷阱：** 当嵌入文档位于**数组**中时，使用精确匹配（如 `find({"comments": {"author": "joe", ...}})`）是**不正确**的，因为它试图匹配整个文档。

---
#### 6. CRUD - 删除 (Delete)
---

* **`deleteOne({filter})`:**
    * 删除**第一个**匹配的文档。
    * `db.MyCustomers.deleteOne({"_id": 124});`
    * `db.MyCustomers.deleteOne({"name": "XXX"});`
* **`deleteMany({filter})`:**
    * 删除**所有**匹配的文档。
    * **删除所有:** `db.MyCustomers.deleteMany({});`
* **返回结果：**
    * `{ "acknowledged": true, "deletedCount": 1 }`
* **(旧) `remove()`:**
    * 已弃用 (Phased out)。
    * `db.blog.remove({})` (删除所有)
    * `db.mailing.list.remove({"opt-out": true})` (删除匹配项)

---
#### 7. 查询操作符 ($)
---

* **比较操作符 (Comparison):**
    * `$gt` (大于), `$gte` (大于等于), `$lt` (小于), `$lte` (小于等于), `$ne` (不等于)
    * `db.MyCustomers.find({"creditlimit": {"$gte": 71800}})`
    * `$ne` 可用于任何类型。
* **范围查询 (Range):**
    * 在同一个字段上使用多个比较操作符（隐式 AND）。
    * `db.MyCustomers.find({"creditlimit": {"$gte": 71800, "$lt": 227600}})`
* **集合/数组操作符 (Array/Set):**
    * **`$in`**: 匹配数组中的**任一**值 (类似 SQL `IN`)。
        * `db.MyCustomers.find({"_id": {"$in": [112, 141]}})`
        * 可以混合不同类型：`db.users.find({"user_id": {"$in": [12345, "joe"]}})`
        * `{key: val}` 等同于 `{key: {$in: [val]}}`。
    * **`$nin`**: 不匹配数组中的**任何**值 (类似 SQL `NOT IN`)。
        * `db.MyCustomers.find({"_id": {"$nin": [112, 141]}})`
* **逻辑操作符 (Logical):**
    * **`$or` (或):**
        * 用于检查数组中**任一**条件是否为真。
        * `db.MyCustomers.find({"$or": [{"contact.first": "Jean"}, {"city": "Nantes"}]})`
    * **`$and` (与):**
        * 用于检查数组中**所有**条件是否为真。
        * `db.users.find({"$and": [{"x": {"$gte": 1}}, {"x": {"$lt": 4}}]})`
    * **默认 AND:** 在顶层文档中用逗号分隔的字段默认就是 AND 关系，通常比显式 `$and` 更简洁。
        * `find({"contact.first": "Jean", "city": "Nantes"})` (隐式 AND)
    * **`$not` (逻辑非):**
        * 反转任何条件。
        * `db.inventory.find({price: {$not: {$gt: 1.99}}})`
        * **重要区别：** `$not` 会匹配**不存在**的字段，而 `$lte` (或 `$gt` 等) **不会**。

---
#### 8. 语法规则 (Shell Syntax - JS vs JSON)
---

* **键 (Key) 的引号:**
    * MongoDB Shell 是一个 JavaScript 环境。
    * **插入/定义对象时 (JS):** 如果键是有效的 JS 变量名 (如 `name`, `id`, `$lt`)，引号**可以省略**。
        * `insertOne({id: 1, name: "Bob"})`
    * **查询时 (JSON):** 键通常是**字符串**，建议**总是加上引号**，特别是当键包含点号 `.` 或其他特殊字符时。
        * `find({"contact.first": "Jean"})` (必须加引号)
        * `find({"creditlimit": {"$gte": 71800}})` (推荐加引号)