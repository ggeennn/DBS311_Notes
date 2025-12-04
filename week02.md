# [DBS311](http://dbs211.ca/courses/dbs311/)

# 2 - Continued Review of SQL and Single-Line Functions

## Table of Contents

- Date Data Types and Date Formatting
- Case Sensitivity
- Single Line Functions
- Order of Execution

## Date Data types and Date Formatting

When using dates in SQL it is very important to consider a few very important facts about dates that impact their values, format, and calculations including dates.

- Dates are impacted by time zones and geographic location
- The standard format for dates differs greatly between nationalities
- Date values often overlap and it can be easily mistaken for an incorrect date.
- Dates are not actually stored as months, days, and years but as a decimal value.

Let us look at these topics thoroughly.

### Standard Date Formats

Dates are generally formatted using a standard, however, these standards differ between countries. For example, in Canada, dates are formatted as dd/mm/yyyy and in the USA, dates are formatted as mm/dd/yyyy. This ofter creates confusion with what dates actually are as computers in Canada are often setup up as either Canadian or America.

> For example: 03/06/19 could be March 6, 2019 in the USA, but is June 3, 2019 in Canada. In other areas of the world, this might be June 19, 2003. Therefore, it is critical that we ensure that any dates entered are specifically entered in a way that they can not be misinterpreted and work regardless of the country, and more specifically, the regional settings on the computer being used.

#### Dates that are already stored in the database

There is no need to change values that are already stored in the database or that are already specified as a date type. The computer knows how to calculate the correct date and no interference is required. The only time changes to the code would be required, is if the data is to be directly displayed to a human that needs to know what the data actually is: this is accomplished using the `to_char()` or `convert` functions.

We do not need to specify date details for already stored dates, because the computer can not misinterpret the value. This is because dates are not stored by months, days, and years; but as a single decimal value. The value is a representation of the number of days that have passed since January 1, 1900. The decimal portion is representative of the time of day as a fraction (example: 0.5 would be 12pm noon, half way through the day)

If and only if the output from an SQL statement is to be directly printed or viewed by a human, should we format the date such that it is clear of its' exact value using the `to_char()` (Oracle) or `convert` (MS SQL) function.

```
    SELECT
        first_name,
        last_name,
        TO_CHAR(hire_date,'Mon dd, yyyy') AS HireDate
    FROM employees
    ORDER BY HireDate;  -- should be hire_date

```

would be a good example of when we want to format the date such that is is clear what the date actually is.

> note that the data type has been changed to a string by the `to_char()` (Oracle) or `format` (MS SQL) function and therefore would need to be converted back to a date for further use within software applications. This conversion to a string also impacts the sorting order, changing it to alphabetical sorting rather than chronological sorting

```
    SELECT
        first_name,
        last_name,
        FORMAT(hire_date, 'MMMM dd, yyyy') AS HireDate
    FROM employees
    ORDER BY HireDate;  -- should be hire_date

```

is the MS SQL equivalent. The `FORMAT` function is used to convert the date to a string and use a format string to specific the desirable output format.

In both Oracle and MS SQL examples above, the ORDER BY clause will sort the dates alphabetically, rather than chronologically, so it would be correct to order by the original field instead of using the alias.

#### Dates that are manually entered through SQL statements

Dates that are entered through code (hard coded specifically) should be converted to a date data type (they are entered as strings) such that the exact value of the date is not subject to interpretation of the computer or the regional settings of the computer. This is accomplished using the `to_date()` or `convert` function

In the following examples, the hard coded (typed in) dates need to be clarified as to which term of the date refers to which part of the date.

```
    -- assuming the output is being sent to software
    SELECT
        first_name,
        last_name,
        hire_date
    FROM employees
    WHERE hire_date BETWEEN to_date('03/01/19', 'mm/dd/yy') AND to_date('02/29/20', 'mm/dd/yy')
    ORDER BY hire_date, last_name, first_name;

```

```
    -- assuming the output is being sent to software
    SELECT
        first_name,
        last_name,
        hire_date
    FROM employees
    WHERE hire_date BETWEEN Convert(date, '03/01/19', 1) AND Convert(date, '02/29/20', 1)
    ORDER BY hire_date, last_name, first_name;
    -- date type 1 is mm/dd/yy

```

## Case Sensitivity

Although SQL itself is not case sensitive, the values of strings used are case sensitive in some, but not all, database management systems. Because some, specifically Oracle, is case sensitive for strings, it is best practice to allow for case sensitivity in the SQL that is written.

### No Assumptions

In order to understand the concept of case sensitivity it is important to understand that the writer of SQL can not assume that any data entered by humans is entered consistently or in the way that it was intended to be entered. For instance, people often type in their name starting with a capital and all following letters lower case, but you can not guarantee that this is always to case. If results from searches are to return the intended records regardless of case, the SQL must be written in such a way that case is not longer a factor.

The same assumption can not be made in user entered parameters used in the SQL.

```
    Question: List all employees whose last name starts with an "A"
    SELECT
        first_name,
        last_name
    FROM employees
    WHERE last_name LIKE 'A%'   -- this is incorrect
    ORDER BY
        last_name,
        first_name;

```

The above statement assumes that all last names have been entered in the data base starting with a capital A. Any employees in the database whose last name was entered using a small "a" would not be found in the search results (Oracle). Therefore, we slightly change the SQL statement to ensure that all names starting with an "A" or an "a" are returned.

```
    Question: List all employees whose last name starts with an "A"
    SELECT
        first_name,
        last_name
    FROM employees
    WHERE upper(last_name) LIKE 'A%'
    ORDER BY
        last_name,
        first_name;

    -- OR

    SELECT
        first_name,
        last_name
    FROM employees
    WHERE lower(last_name) LIKE 'a%'
    ORDER BY
        last_name,
        first_name;

```

### User parameters and case sensitivity

In cases where the user is allowed to enter a value, through a parameter, for the comparison, then public users are involved in both sides of the comparison operator. Therefore, the SQL must allow for case sensitivity on both sides.

```
    Question: List all employees whose last name starts with an "A"
    SELECT
        first_name,
        last_name
    FROM employees
    WHERE upper(last_name) LIKE upper('&userEnteredLetter') || '%'
    ORDER BY
        last_name,
        first_name;

```

```
    Question: List all employees whose last name starts with an "A"
    DECLARE @letter varchar(25);
    SET @letter = 'A';

    SELECT
        firstname,
        lastname
    FROM employees
    WHERE upper(lastname) LIKE @letter + '%';

```

## Useful Single-Line Functions

There are many functions, like `to_char()`, `to_date()`, `convert()`, or `format()`, that can be used to manipulate data or conditions in order to obtain the desired results.

| Oracle | SQL Server | Description |
| --- | --- | --- |
| AND, OR | Boolean operators. Both sides of these boolean operators must contain boolean expressions |
| IN(), ANY() | used mostly in comparison expressions where multiple values could be valid avoiding the need for multiple OR operators |
| STRING FUNCTIONS |
| to\_char() | format() | format the given string in a specific format, can be used for dates, numbers and other non-string based data types. |
| upper(), lower(), initcap() | functions that can convert string to upper case, lower case, lower case but starting with an upper case letter. |
| concat(string1, string2) | concat(string1, .... stringN) | concatenating strings together into a single string. The input values do not need to strings, but the end result will always be a string. Note: Oracle only permits 2 input values at a time necessitating the need to nest multiple concat statements. |
| substr(i,n) | substring(i,n) | i - starting character index<br>n - number of characters to include<br>returns a substring of characters (part of) in a string starting at the ith character and continuing for n characters. |
| instr() | charindex() | returns the index number where a search string appears in a given string |
| length() |  |
| lpad() | left() |  |
| rpad() | right() |  |
| trim() |  |
| replace() |  |  |
| DATE FUNCTIONS |
| to\_date() | convert() |  |
| next\_day(), last\_day() |  |  |
| add\_months() | dateadd() |  |
| months\_between() | datediff() |  |
| round(), trunc() |  |  |
| sysdate | GetDate() |  |
| extract() | month(), year(), day() |  |
| MATH FUNCTIONS |
| round() |  |  |
| trunc() |  |  |
| floor(), ceiling() |  |  |
| mod() |  |  |
| MISCELLANEOUS FUNCTIONS |
| NVL() | isnull() | [Oracle docs on NVL](https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions105.htm) |
| NVL2() |  | [Oracle docs on NVL2](https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions106.htm) |

The following are examples of some of these functions used, but not all!

## Order of Execution

There are many little challenges that become apparent while writing SQL and the reason why these odd requirements exist can often be confusing. An example would be the fact that a field alias created in the `SELECT` clause can be used in the `ORDER BY` clause, but can not be used in the `WHERE` clause. The reason for this is the Order of Execution.

The various clauses in the SQL SELECT statement do not execute from top to bottom, but rather in a specific order. The order that the clauses execute are to ensure maximum efficiency in processing the data to retrieve the results as quickly as possible.

The order is

1. FROM (ON, USING, and JOIN)
2. DISTINCT
3. WHERE
4. _GROUP BY (not covered yet)_
5. HAVING (not covered yet)
6. _SELECT (iterating through each row)_
7. ORDER BY

### Order of Execution and Aliases

Using this Order of Execution, it is now obvious that **_field aliases_** that are defined in the `SELECT` clause do not yet exist at the time the `WHERE` clause is executed, but does exist when the `ORDER BY` clause is executed.

Consequently, **_table aliases_** defined in the `FROM` clause exists when all other clauses are executed and therefore, can be used in all other clauses.

### Order of Execution and Single-Line Functions

When considering the use of single line, or user-defined, functions it is important to consider the order of execution (ooe) with respect to efficiency. Looking at the above ooe order, it is apparent that the select clause is an iterative execution that runs one data row at a time. For each row remaining in the result set, after FROM, WHERE, GROUPING, and HAVING, the columns are chosen, calculation are performed and single-line functions are executed for each row. This clearly indicates that if there are _n_ rows in the result set, then the SELECT statements execute _n_ times. This must be considered in efficiency decisions, although there is never a clear answer to what is more efficient. This answer is always "it depends" on the specific database schema, the data, the size of the database, the number of rows, and the complexity of the calculations.
