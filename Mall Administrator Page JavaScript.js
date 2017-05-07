$(document).ready (function ()
{
    var index, length_of_the_password = Math.floor (13 * Math.random () + 8), password = '';

    $.get ('../Get%20Shops', function (data)
    {
        for (index = 0; index < data.length; index = index + 1)
        {
            $(document.getElementById ('Shops')).append ('<Option>' + data [index] ['Name'] + '</Option>');
        }
    });

    $(document.getElementById ('Shop Addition Button')).on ('click', function ()
    {
        if (document.getElementById ('Name').value != '' && document.getElementById ('Owner').value != '')
        {
            for (index = 0; index < length_of_the_password; index = index + 1)
            {
                password = password + String.fromCharCode (Math.floor (94 * Math.random () + 33));
            }
            $.post ('../Add%20a%20Shop', {Name: $('#Name').val (), Owner: $('#Owner').val (), Password: password});
            $(document.getElementById ('Shops')).append ('<Option>' + $('#Name').val () + '</Option>');
        }
    });

    $(document.getElementById ('Shops')).on ('change', function ()
    {
        $(document.getElementById ('Shop')).text (document.getElementById ('Shops').options [document.getElementById ('Shops').selectedIndex].text);
        $.get ('../Get%20Statistics', function (data)
        {
            var bar_chart_data = '[', index, number_of_voters_for_each_rating = [0, 0, 0, 0, 0], ratings = new Array ();
            for (index = 0; index < data.length; index = index + 1)
            {
                if (data [index] ['Shop'] == document.getElementById ('Shops').options [document.getElementById ('Shops').selectedIndex].text)
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
                if (data [index] ['Shop'] == document.getElementById ('Shops').options [document.getElementById ('Shops').selectedIndex].text)
                {
                    bar_chart_data = bar_chart_data + '{"name": "' + data [index] ['Shop'] + '", "y": ' + data [index] ['Rating'] + '}, ';
                }
            }
            if (data [index] ['Shop'] == document.getElementById ('Shops').options [document.getElementById ('Shops').selectedIndex].text)
            {
                bar_chart_data = bar_chart_data + '{"name": "' + data [index] ['Shop'] + '", "y": ' + data [index] ['Rating'] + '}]';
            }
            Highcharts.chart ('Bar Chart 1',
                {
                    chart:
                        {
                            type: 'column'
                        },
                    title:
                        {
                            text: 'Ratings of ' + document.getElementById ('Shop').innerHTML
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

    $.get ('../Get%20Statistics', function (data)
    {
        var bar_chart_data = '[', index, matters_of_voting = new Array (), number_of_voters, ratings = {};
        for (index = 0; index < data.length; index = index + 1)
        {
            if (data [index] ['Item'])
            {
                matters_of_voting.push (data [index] ['Item']);
            }
            else
            {
                matters_of_voting.push (data [index] ['Shop']);
            }
        }
        matters_of_voting.forEach (function (internal_index)
        {
            ratings [internal_index] = (ratings [internal_index] || 0) + 1;
        });
        for (var matter_of_voting in ratings)
        {
            bar_chart_data = bar_chart_data + '{"name": "' + matter_of_voting + '", "y": ' + ratings [matter_of_voting] + '}, ';
        }
        bar_chart_data = bar_chart_data.substring (0, bar_chart_data.length - 1);
        bar_chart_data = bar_chart_data.Replace_Character_At_Specific_Index (bar_chart_data.length - 1, ']');
        Highcharts.chart ('Bar Chart 2',
            {
                chart:
                    {
                        type: 'column'
                    },
                title:
                    {
                        text: 'Total Voting Statistics'
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
                    data: JSON.parse (bar_chart_data)
                }]
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

    String.prototype.Replace_Character_At_Specific_Index = function (index, new_character)
    {
        return this.substr (0, index) + new_character + this.substr (index + 1);
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
});