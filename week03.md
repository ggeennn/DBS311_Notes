# [DBS311](http://dbs211.ca/courses/dbs311/)

# 3 - Multi-line (Aggregate) Functions

## Table of Contents

coming soon

## Aggregate Functions

When we think about the business world and what questions are being asked in the workplace, it is absolutely impossible to not include questions that include "How much ... ", "How many ... ", "What is the highest ... ", "What is the lowest ... ". With questions like "How much money did we make today?", "How many employees work for us?"," etc.... it is easy to see that some answers to questions will require the aggregation of data across multiple rows of data. To this point in your SQL learning, all `SELECT` statements have been executed on single rows of data, one at a time. Now we move into the world of multiple-row functions.

### The 7 Aggregate Functions

There are exactly 7 different aggregate functions in SQL, and these 7 will enable the programmer to answer almost any business question. The 7 aggregate functions are:

| Function | Description | Example |
| --- | --- | --- |
| **SUM()** | the summation (addition) of data | the total owing on a receipt adding up multiple purchased products |
| **COUNT()** | counting the number of instances (rows) | The number of employees that work at a specific location |
| **AVG()** | Average - the non-weighted average of a group of given numbers | The average price of products being sold on a website. |
| **MIN()** | Minimum - the smallest number, the first alphabetical string, and the earliest date chronologically. | The earliest date (first event) in a list of events |
| **MAX()** | Maximum - the largest number, last alphabetical string, or latest date | The largest number in a set of numbers |
| **STDDEV()** | Standard Deviation - A statistical measure of the horizontal distribution of data points. |  |
| **VARIANCE()** | Standard Deviation - A statistical measure of the vertical distribution of data points. |  |

7 Aggregate Functions

Some examples of the main functions might be:

```
    SELECT count(playerID) AS numPlayers FROM players;

```

will return the number of rows in the player table. This should product a unique list as _playerid_ would be the primary key, so in this case `DISTINCT` would not be required, but it might be in other cases.

```
    SELECT sum(balanceOwing) AS totalOwing FROM customers;

```

would return the total owing from ALL customers. This would be an important number for companies to know how much money they should have coming in within the next short time period: assuming customers all pay their bills that is :)

```
    SELECT min(eventDate) AS firstEventDate FROM events;

```

would return the date of the first event in a table of events, if multiple events had the same date, it would still only return the date once.

## Grouping (GROUP BY)

It is often required to have more complex answers that involve grouping data rows together. For example: How many players in a players table, does not requiring any grouping, but a slightly different question: How many players play on each team in a league would require you to group players together that play on the same team and then count them. This is achieved through the GROUP BY statement.

#### How many players play on each team?

```
    SELECT teamName, firstName, lastName
    FROM players JOIN teams USING (teamID)
    ORDER BY teamName;

```

gives us the players on each team, but we can only count them manually because we sorted it by teamName. It is still a manual count. Therefore, if we want the SQL to produce the actual numbers automatically, we need to group the players together by team and then use the `count()` aggregate function

```
    SELECT
        teamName,
        count(playerID) AS numPlayers
    FROM players JOIN teams USING (teamID)
    GROUP BY teamName
    ORDER BY teamName;

```

gives us the results that we need. However, what if there is a possibility that the teamName is not unique and we therefore need to ensure we are not mixing players from multiple teams.

```
    -- THIS CAUSES AN ERROR
    SELECT
        teamID,
        teamName,
        count(playerID) AS numPlayers
    FROM players JOIN teams USING (teamID)
    GROUP BY teamName
    ORDER BY teamName;

```

will give us an error as the teamID is not part of an aggregate function nor is it in the `GROUP BY` clause.

_Note: That if we had used `ON` rather than `USING` then we would also have an ambiguous field error._

Clint's Law: Any field in the `SELECT` clause that is not part of an aggregate function MUST be in the `GROUP BY` clause.

_yes I called it my law, I made it up, but it works. Realistically it is just a different way of saying what other books have said, but I feel it simplifies it and makes it an easy to follow rule._

So because of the above rule, the teamID in the above statement is a field that is not part of the aggregate function, and therefore must be in the `GROUP BY`. Let us correct this along with the ambiguous issue we had above if we had used ON.

```
    SELECT
        t.teamID, -- because an inner join is used, it does not matter if this is t.teamID or p.teamID
        teamName, -- outer joins are different and careful consideration is required.
        count(playerID) AS numPlayers
    FROM players p JOIN teams t ON p.teamID = t.teamID
    GROUP BY t.teamID, teamName
    ORDER BY teamName;

```

> Caution when grouping by a `PRIMARY KEY`, as grouping on a primary key can often result in nothing more than groups of one. In this case the `INNER JOIN` will result in repeated values for the teamID in the out put so it would be okay.

### Examples

Again using the sports teams tables as shown below lets do some example with the results we will receive.

| PLAYERS |  | TEAMS |
| --- | --- | --- |
| PlayerID | firstname | lastname | ShirtNumber | teamid | teamID | teamName | shirtColor | homeField |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | John | Smith | 10 | 10 |  | 10 | Hornets | Yellow | Toronto |
| 2 | Bob | Marley | 2 | 10 | 11 | Falcons | Brown | Barrie |
| 3 | Steven | King | 13 | 11 | 12 | Bloopers | Red | Kitchener |
| 4 | Jim | Parsons | 7 | NULL | 13 | Kings | Purple | Oshawa |

SPORTS TEAMS TABLES
