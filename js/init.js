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
    [ "Czech Republic","CZ"],
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
const nameArr = ["AT","BE","BG","CY","CZ","DE","DK","EE","EL","ES","Euro","FI","FR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"]
