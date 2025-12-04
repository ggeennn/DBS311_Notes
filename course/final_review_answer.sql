--1
create or replace function INCREASEALLOWED
(
    c_limit customers.creditlimit%type
) return number as
gap customers.creditlimit%type;
begin
    select max(creditlimit) - c_limit into gap from customers;
    return gap;
end;
--2
create or replace procedure creditincrease
(
    v_country in char,
    v_credit in number
) as
cursor c is select customernumber,customername, contactname, creditlimit, phonenumber from MyCustomers
            join CustPhone using (CUSTOMERNUMBER) where country = v_country
            order by customername,phonenumber;
v_id MyCustomers.customernumber%type := -1;
begin
    dbms_output.PUT_LINE('customer in'||v_country||'increase'||v_credit);
    for item in c
    loop
        if v_id != item.customernumber then
            UPDATE MyCustomers SET creditlimit = creditlimit + v_credit WHERE customernumber = item.customernumber;
            dbms_output.PUT_LINE(item.customername||'phone'||item.contactname||'at'||item.phonenumber);
            v_id = item.customernumber;
        ELSE
            dbms_output.PUT_LINE('Alternate phone: ' || item.phonenumber);
        end if;
    end loop;
end;
--3
create or replace trigger audit
after update or delete on staff
for each ROW
declare 
    trans varchar2(10);
begin 
    trans := CASE
        when updating then 'update'
        when deleting then 'delete'
    end;
    insert into clerksaudit values (default,'staff',trans,user,TO_CHAR(sysdate,'yy-mm-dd'),
    :old.id, :old.job, :old.dept, :old.SALARY, :new.salary);
end;

--4
db.booksreview.find({"genre":"Fiction"},
{"title":1,"author":1,"date":1,"_id":0});
db.booksreview.updateOne({"_id":4},{$set:{"author":{"first":"Neil","middle":"deGrasse","last": "Tyson" }}});
db.booksreview.updateOne({"title": "Take Your Breath Away"},{$addToSet:{"narrator":{$each:["Hillary Huber", "Peter Simonelli"]}}});
db.booksreview.updateMany({},{$inc:{"duration":5}});

--5 db aggregate
db.articles.aggregate([
    -- Stage 1: 过滤 (只保留 2024 年的文章)
    {
        "$match": {
            -- 注意：这里假设 createDate 字段存储的是 Date 类型
            "createDate": { "$gt": new Date('2024-01-01') }
        }
    },
    -- Stage 2: 投影与计算 (重命名字段，计算新字段)
    {
        "$project": {
            "_id": 0, -- 排除旧的 _id 字段 [cite: 270]
            "authorId": "$author", -- 重命名 author 字段 [cite: 380]
            "title": 1, 
            -- 虚拟字段：计算受欢迎程度 = (评论数 * 0.5) + (评分 * 0.5) [cite: 266, 469]
            "popularity": {
                "$add": [
                    { "$multiply": ["$comments", 0.5] },
                    { "$multiply": ["$rating", 0.5] }
                ]
            }
            --必须保留给 Stage 3 ($group) 使用的字段 (Field Inclusion)
            "comments": 1, 
            "rating": 1,
            "createDate": 1
        }
    },

    -- Stage 3: 分组与累加 (按 authorId 分组，计算统计值)
    {
        "$group": {
            "_id": "$authorId", -- 按 authorId 分组 [cite: 786]
            "totalComments": { "$sum": "$comments" }, -- 累加该作者所有评论数 [cite: 804, 805]
            "numArticles": { "$sum": 1 }, -- 统计文章数量 [cite: 822]
            "maxRating": { "$max": "$rating" }, -- 找出最高评分 [cite: 799, 829]
            "minRating": { "$min": "$rating" }, -- 找出最低评分 [cite: 800, 829]
            "firstPostDate": { "$min": "$createDate" } -- 找出最早的发布日期 (利用 $min/max 特性)
        }
    },
    -- Stage 4: 排序 (按总评论数降序排列)
    {
        "$sort": { "totalComments": -1 } -- -1 表示降序 
    },
    -- Stage 5: 限制 (只返回前 5 名最受欢迎的作者)
    {
        "$limit": 5 -- 限制结果集大小 [cite: 240, 934, 935]
    }
]);