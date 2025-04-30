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
const namePalette = new Map(
    [["AT","#83c623"],
    [ "BE","#71e656"],
    [ "BG","#40e8c9"],
    [ "CY","#a3393c"],
    [ "CZ","#f79bd7"],
    [ "DE","#b668a0"],
    [ "DK","#c5c048"],
    [ "EE","#221d48"],
    [ "EL","#daebd0"],
    [ "ES","#181321"],
    [ "EU27_2020","blue"],
    [ "FI","#a8bda0"],
    [ "FR","#728c51"],
    [ "HR","#d2d45c"],
    [ "HU","#8210ef"],
    [ "IE","#1fa661"],
    [ "IT","#dd749a"],
    [ "LT","#911fb8"],
    [ "LU","#1ae5f7"],
    [ "LV","#99a303"],
    [ "MT","#49a452"],
    [ "NL","#548500"],
    [ "PL","#ba3b3f"],
    [ "PT","#e49acb"],
    [ "RO","#b9a579"],
    [ "SE","#fd68c3"],
    [ "SI","#3896ae"],
    [ "SK","#7dfdcd"]])
const nameArr = ["AT","BE","BG","CY","CZ","DE","DK","EE","EL","ES","FI","FR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK"]
const quarters = Array("2010-Q1" ,"2010-Q2" ,"2010-Q3" ,"2010-Q4" ,"2011-Q1" ,"2011-Q2" ,"2011-Q3" ,"2011-Q4" ,"2012-Q1" ,"2012-Q2" ,"2012-Q3" ,"2012-Q4" ,"2013-Q1" ,"2013-Q2" ,"2013-Q3" ,"2013-Q4" ,"2014-Q1" ,"2014-Q2" ,"2014-Q3" ,"2014-Q4" ,"2015-Q1" ,"2015-Q2" ,"2015-Q3" ,"2015-Q4" ,"2016-Q1" ,"2016-Q2" ,"2016-Q3" ,"2016-Q4" ,"2017-Q1" ,"2017-Q2" ,"2017-Q3" ,"2017-Q4" ,"2018-Q1" ,"2018-Q2" ,"2018-Q3" ,"2018-Q4" ,"2019-Q1" ,"2019-Q2" ,"2019-Q3" ,"2019-Q4" ,"2020-Q1" ,"2020-Q2" ,"2020-Q3" ,"2020-Q4" ,"2021-Q1" ,"2021-Q2" ,"2021-Q3" ,"2021-Q4" ,"2022-Q1" ,"2022-Q2" ,"2022-Q3" ,"2022-Q4" ,"2023-Q1" ,"2023-Q2" ,"2023-Q3" ,"2023-Q4" ,"2024-Q1" )
const years = Array("2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023")
const stackedPalette = new Map([['A', '#f1a3ff'], ['B','blue'], ['C', '#993e00'], ['D', '#4c005c'], ['E', '#181818'], ['F', '#005c30'],['G','green'],['H', 'honeydew'],
                ['I', '#808080'], ['J','#94feb4'], ['K', 'khaki'], ['L', 'lime'], ['M', '#c20088'], ['N', 'navy'], ['O', '#18a204'], ['P', 'pink'],
                ['Q', '#426600'], ['R', 'red'], ['S', '#5ef1fe'], ['T', 'turquoise'], ['U', '#e1ff66'], ['HH', '#FF5000']])
const stackedType = new Map([['A', 'Agricolture'], ['B','Mining'], ['C', 'Manufacturing'], ['D', 'Electricity, gas, steam and air conditioning supply'], ['E', 'Water supply'],
                ['F', 'Construction'],['G','Trade and vehicle repair'],['H', 'Transposrtation and Storage'],['I', 'Accomodation and Food services'], ['J','Communication'], 
                ['K', 'Finance'], ['L', 'Real Estate'], ['M', 'Professional, Scientific activities'], ['N', 'Administration'], ['O', 'Public services and Defence'], ['P', 'Education'],
                ['Q', 'Healt and Social Work'], ['R', 'Arts and Recreation'], ['S', 'Other service'], ['T', 'Households related activities'], ['U', 'Extraterritorial organisations'],
                ['HH', 'House Holds ']])
const radarType = new Map([["C0000X0350-0370", "Solid Fossil Fuels"], ["C0350-0370", "Manufactered Gases"], ["E7000", "Electricity"], ["G3000", "Natural Gas"], ["H8000", "Heat"],["O4000XBIO","Oil and Petroleum"],["P1000", "Peat"],["RA000", "Renewable"], ["S2000", "Oil Sands"], ["TOTAL", "Total"], ["W6100_6220", "Non-renewable waste"]])
const radarPalette = new Map([["C0000X0350-0370", '#f1a3ff'], ["C0350-0370", 'blue'], ["E7000", "yellow"], ["G3000", '#993e00'], ["H8000", 'red'],["O4000XBIO","petroleum"],["P1000", '#4c005c'],["RA000", "green"], ["S2000", 'lime'], ["W6100_6220", "gray"]])
const fuelSiec = new Map([[ "Electricity","E7000"], [ "Natural Gas","G3000"], [ "Liquefied Petroleum Gases","O4630"], ["Motor Gasoline","O4652XR5210B"], ["Jet Fuel","O4661XR5230B"],
                          [ "Diesel Oil","O4671XR5220B"], ["Fuel oil","O4680"], [ "Blended Biogasoline","R5210B"], [ "Pure Biogasoline","R5210P"], [ "Blended Biodiesel","R5220B"],
                          [ "Pure Biodisel","R5220P"], [ "Other Liquid biofuels","R5290"], [ "Biogases","R5300"]])
const fuelPalette = new Map([["E7000", "yellow"], ["G3000", "#993e00"], ["O4630", "#f1a3ff"], ["O4652XR5210B","blue"], ["O4661XR5230B","red"], ["O4671XR5220B", "petroleum"], ["O4680","#4c005c"], ["R5210B", "lime"], ["R5210P", "green"], ["R5220B", "pink"],
                        ["R5220P", "navy"], ["R5290", "gray"], ["R5300", "honeydew"]])