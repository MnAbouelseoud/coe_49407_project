$(document).ready (function ()
{
    var index;

    $.get ('../Get%20Name%20of%20the%20Shop?Shop%20Owner=' + window.location.search.replace ('?', '').split ('&') [0].substring ('Shop%20Owner='.length), function (name_of_the_shop)
    {
        document.getElementById ('Shop').innerHTML = name_of_the_shop;
        $.get ('../Get%20Items?Shop=' + name_of_the_shop.replace (/ /g, '%20'), function (data)
        {
            var temp = $(document.getElementById ('Shop')).text ().replace (/ /g, '%20');
            for (index = 0; index < data.length; index = index + 1)
            {
                $(document.getElementById ('Items')).append ('<Option>' + data [index] ['Name'] + '</Option>');
            }
        });
    });

    $(document.getElementById ('Item Addition Button')).on ('click', function ()
    {
        $.post ('../Add%20an%20Item', {Name: $('#Name').val (), Shop: $('#Shop').text ()});
        $(document.getElementById ('Items')).append ('<Option>' + $('#Name').val () + '</Option>');
    });

    $(document.getElementById ('Items')).on ('change', function ()
    {
        $(document.getElementById ('Item')).text (document.getElementById ('Items').options [document.getElementById ('Items').selectedIndex].text);
        $.get ('../Get%20Statistics', function (data)
        {
            var bar_chart_data = '[', index, number_of_voters_for_each_rating = [0, 0, 0, 0, 0], ratings = new Array ();
            for (index = 0; index < data.length; index = index + 1)
            {
                if (data [index] ['Item'] == document.getElementById ('Items').options [document.getElementById ('Items').selectedIndex].text)
                {
                    ratings.push (data [index] ['Rating'])
                }
            }
            document.getElementById ('Statistics').innerHTML = 'Average Rating: ' + Calculate_Average_Rating (ratings).toString () + '<Br>' + 'Median Rating: ' + Calculare_Median_Rating (ratings).toString () + '<Br>' + 'Standard Deviation: ' + Calculate_Standard_Deviation (ratings).toString () + '<Br>';
            for (index = 0; index < ratings.length; index = index + 1)
            {
                if (ratings [index] == 1)
                {
                    number_of_voters_for_each_rating [0] = number_of_voters_for_each_rating [0] + 1;
                }
                else if (ratings [index] == 2)
                {
                    number_of_voters_for_each_rating [1] = number_of_voters_for_each_rating [1] + 1;
                }
                else if (ratings [index] == 3)
                {
                    number_of_voters_for_each_rating [2] = number_of_voters_for_each_rating [2] + 1;
                }
                else if (ratings [index] == 4)
                {
                    number_of_voters_for_each_rating [3] = number_of_voters_for_each_rating [3] + 1;
                }
                else if (ratings [index] == 5)
                {
                    number_of_voters_for_each_rating [4] = number_of_voters_for_each_rating [4] + 1;
                }
            }
            for (index = 0; index < data.length - 1; index = index + 1)
            {
                if (data [index] ['Item'] == document.getElementById ('Items').options [document.getElementById ('Items').selectedIndex].text)
                {
                    bar_chart_data = bar_chart_data + '{"name": "' + data [index] ['Item'] + '", "y": ' + data [index] ['Rating'] + '}, ';
                }
            }
            if (data [index] ['Item'] == document.getElementById ('Items').options [document.getElementById ('Items').selectedIndex].text)
            {
                bar_chart_data = bar_chart_data + '{"name": "' + data [index] ['Item'] + '", "y": ' + data [index] ['Rating'] + '}]';
            }
            Highcharts.chart ('Bar Chart',
                {
                    chart:
                        {
                            type: 'column'
                        },
                    title:
                        {
                            text: 'Ratings of ' + document.getElementById ('Item').innerHTML
                        },
                    xAxis:
                        {
                            type: 'category'
                        },
                    yAxis: {
                        title: {
                            text: 'Number of voters'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Number of voters',
                        colorByPoint: true,
                        data: [{
                            name: '1',
                            y: number_of_voters_for_each_rating [0],
                        }, {
                            name: '2',
                            y: number_of_voters_for_each_rating [1],
                        }, {
                            name: '3',
                            y: number_of_voters_for_each_rating [2],
                        }, {
                            name: '4',
                            y: number_of_voters_for_each_rating [3],
                        }, {
                            name: '5',
                            y: number_of_voters_for_each_rating [4],
                        }]
                    }]
                });
        });
    });
});

Array.prototype.Check_Whether_The_Object_Is_Already_Present = function (object)
{
    var index;
    for (index = 0; index < this.length; index = index + 1)
    {
        if (object === this [index])
        {
            return true;
        }
    }
    return false;
}

function Calculate_Sum (sum, rating)
{
    return (sum + rating);
}

function Calculate_Average_Rating (ratings)
{
    return ratings.reduce (Calculate_Sum) / ratings.length;
}

function Calculare_Median_Rating (ratings)
{
    if (ratings.length == 0)
    {
        return 0;
    }
    else if (ratings.length % 2 == 0)
    {
        return (0.5 * (ratings.sort () [(ratings.length) / 2] + ratings.sort () [((ratings.length) / 2) - 1]));
    }
    else
    {
        return ratings.sort () [(ratings.length - 1) / 2]
    }
}

function Calculate_The_Difference_Between_A_Rating_And_An_Average_Rating (average_rating)
{
    return function (rating)
    {
        return Math.pow (rating - average_rating, 2);
    };
}

function Calculate_Standard_Deviation (ratings)
{
    ratings = ratings.map (Calculate_The_Difference_Between_A_Rating_And_An_Average_Rating (Calculate_Average_Rating (ratings)));
    return Math.sqrt (ratings.reduce (Calculate_Sum) / ratings.length);
}