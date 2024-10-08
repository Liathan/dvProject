var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const nameMap = new Map(
    [["Austria","AT"],
    [ "Belgium","BE"],
    [ "Bulgaria","BG"],
    [ "Cyprus","CY"],
    [ "Czech_Republic","CZ"],
    [ "Germany","DE"],
    [ "Denmark","DK"],
    [ "Estonia","EE"],
    [ "Greece","EL"],
    [ "Spain","ES"],
    [ "Europe","EU27_2020"],
    [ "Finland","FI"],
    [ "France","FR"],
    [ "Croatia","HR"],
    [ "Hungary","HU"],
    [ "Ireland","IE"],
    [ "Italy","IT"],
    [ "Lithuania","LT"],
    [ "Luxembourg","LU"],
    [ "Latvia","LV"],
    [ "Malta","MT"],
    [ "Netherlands","NL"],
    [ "Poland","PL"],
    [ "Portugal","PT"],
    [ "Romania","RO"],
    [ "Sweden","SE"],
    [ "Slovenia","SI"],
    [ "Slovakia","SK"]])
const nameArr = ["AT","BE","BG","CY","CZ","DE","DK","EE","EL","ES","FI","FR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"]
const quarters = Array("2010-Q1" ,"2010-Q2" ,"2010-Q3" ,"2010-Q4" ,"2011-Q1" ,"2011-Q2" ,"2011-Q3" ,"2011-Q4" ,"2012-Q1" ,"2012-Q2" ,"2012-Q3" ,"2012-Q4" ,"2013-Q1" ,"2013-Q2" ,"2013-Q3" ,"2013-Q4" ,"2014-Q1" ,"2014-Q2" ,"2014-Q3" ,"2014-Q4" ,"2015-Q1" ,"2015-Q2" ,"2015-Q3" ,"2015-Q4" ,"2016-Q1" ,"2016-Q2" ,"2016-Q3" ,"2016-Q4" ,"2017-Q1" ,"2017-Q2" ,"2017-Q3" ,"2017-Q4" ,"2018-Q1" ,"2018-Q2" ,"2018-Q3" ,"2018-Q4" ,"2019-Q1" ,"2019-Q2" ,"2019-Q3" ,"2019-Q4" ,"2020-Q1" ,"2020-Q2" ,"2020-Q3" ,"2020-Q4" ,"2021-Q1" ,"2021-Q2" ,"2021-Q3" ,"2021-Q4" ,"2022-Q1" ,"2022-Q2" ,"2022-Q3" ,"2022-Q4" ,"2023-Q1" ,"2023-Q2" ,"2023-Q3" ,"2023-Q4" ,"2024-Q1" )
const years = Array("2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023")
const palette = new Map([['A', '#f1a3ff'], ['B','blue'], ['C', '#993e00'], ['D', '#4c005c'], ['E', '#181818'], ['F', '#005c30'],['G','green'],['H', 'honeydew'],
                ['I', '#808080'], ['J','#94feb4'], ['K', 'khaki'], ['L', 'lime'], ['M', '#c20088'], ['N', 'navy'], ['O', '#18a204'], ['P', 'pink'],
                ['Q', '#426600'], ['R', 'red'], ['S', '#5ef1fe'], ['T', 'turquoise'], ['U', '#e1ff66'], ['HH', '#FF5000']])
