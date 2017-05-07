$(document).ready (function ()
{
    document.getElementById ('Username').innerHTML = window.location.search.replace ('?', '').split ('&') [0].substring ('Username='.length).replace (/%20/g, ' ');
    if (annyang)
    {
        var commands = {

            'one star': function() {  message = new Paho.MQTT.Message('1');  message.destinationName = 'UserRating';  client.send(message);},
            'two stars': function() {  message = new Paho.MQTT.Message('2');  message.destinationName = 'UserRating';  client.send(message);},
            'three stars': function() {  message = new Paho.MQTT.Message('3');  message.destinationName = 'UserRating';  client.send(message);},
            'four stars': function() {  message = new Paho.MQTT.Message('4');  message.destinationName = 'UserRating';  client.send(message);},
            'five stars': function() {  message = new Paho.MQTT.Message('5');  message.destinationName = 'UserRating';  client.send(message);}
        };
        


        annyang.debug ();
        annyang.addCommands (commands);
        annyang.setLanguage ('en');
        //SpeechKITT.annyang ();
        //SpeechKITT.vroom ();
        annyang.start ();
    }
    $('#Rating').rateYo (
        {
            rating: 0,
            spacing: "5px",
            multiColor:
                {
                    "startColor": "#FF0000",
                    "endColor"  : "#00FF00"
                },
            fullStar: true,
            readOnly: true
        });
    Get_Statistics ();
});

function Calculate_Sum (sum, rating)
{
    return (sum + rating);
}

function Calculate_Average_Rating (ratings)
{
    return ratings.reduce(Calculate_Sum) / ratings.length;
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

function Give_One_Star ()
{
    Update_Rating (1);
}

function Give_Two_Stars ()
{
    Update_Rating (2);
}

function Give_Three_Stars ()
{
    Update_Rating (3);
}

function Give_Four_Stars ()
{
    Update_Rating (4);
}

function Give_Five_Stars ()
{
    Update_Rating (5);
}

function Update_Rating (rating)
{
    $.post ('../Update%20Rating', {Username: $(document.getElementById ('Username')).text (), 'Item/Shop': $(document.getElementById ('Item/Shop')).text (), Rating: rating, Type: 'Shop'}, function (data)
    {
        var bar_chart_data = '[', index, ratings = new Array ();
        for (index = 0; index < data.length; index = index + 1)
        {
            if ($(document.getElementById ('Username')).text () == data [index] ['Username'])
            {
                ratings.push (data [index] ['Rating']);
            }
        }
        document.getElementById ('Statistics').innerHTML = 'Average Rating: ' + Calculate_Average_Rating (ratings).toString () + '<Br>' + 'Median Rating: ' + Calculare_Median_Rating (ratings).toString () + '<Br>' + 'Standard Deviation: ' + Calculate_Standard_Deviation (ratings).toString () + '<Br>';
        ratings = new Array ();
        for (index = 0; index < data.length; index = index + 1)
        {
            if ($(document.getElementById ('Username')).text () == data [index] ['Username'])
            {
                ratings.push (data [index]);
            }
        }
        for (index = 0; index < ratings.length - 1; index = index + 1)
        {
            if (ratings [index] ['Item'])
            {
                bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Item'] + '", "y": ' + ratings [index] ['Rating'] + '}, ';
            }
            else
            {
                bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Shop'] + '", "y": ' + ratings [index] ['Rating'] + '}, ';
            }
        }
        if (ratings [index] ['Item'])
        {
            bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Item'] + '", "y": ' + ratings [index] ['Rating'] + '}]';
        }
        else
        {
            bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Shop'] + '", "y": ' + ratings [index] ['Rating'] + '}]';
        }
        Highcharts.chart ('Bar Chart',
            {
                chart:
                    {
                        type: 'column'
                    },
                title:
                    {
                        text: 'Ratings of ' + document.getElementById ('Username').innerHTML
                    },
                xAxis:
                    {
                        type: 'category'
                    },
                yAxis: {
                    title: {
                        text: 'Rating'
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
                    name: 'Rating',
                    colorByPoint: true,
                    data: JSON.parse (bar_chart_data)
                }]
            });
    });
    $('#Rating').rateYo ('rating', rating);
}

function Get_Statistics ()
{
    $.get ('../Get%20Statistics', function (data)
    {
        var bar_chart_data = '[', index, ratings = new Array ();
        for (index = 0; index < data.length; index = index + 1)
        {
            if ($(document.getElementById ('Username')).text () == data [index] ['Username'])
            {
                ratings.push (data [index] ['Rating']);
            }
        }
        document.getElementById ('Statistics').innerHTML = 'Average Rating: ' + Calculate_Average_Rating (ratings).toString () + '<Br>' + 'Median Rating: ' + Calculare_Median_Rating (ratings).toString () + '<Br>' + 'Standard Deviation: ' + Calculate_Standard_Deviation (ratings).toString () + '<Br>';
        ratings = new Array ();
        for (index = 0; index < data.length; index = index + 1)
        {
            if ($(document.getElementById ('Username')).text () == data [index] ['Username'])
            {
                ratings.push (data [index]);
            }
        }
        for (index = 0; index < ratings.length; index = index + 1)
        {
            if ($(document.getElementById ('Item/Shop')).text () == ratings [index] ['Item'])
            {
                $('#Rating').rateYo ('rating', ratings [index] ['Rating']);
            }
            if ($(document.getElementById ('Item/Shop')).text () == ratings [index] ['Shop'])
            {
                $('#Rating').rateYo ('rating', ratings [index] ['Rating']);
            }
        }
        for (index = 0; index < ratings.length - 1; index = index + 1)
        {
            if (ratings [index] ['Item'])
            {
                bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Item'] + '", "y": ' + ratings [index] ['Rating'] + '}, ';
            }
            else
            {
                bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Shop'] + '", "y": ' + ratings [index] ['Rating'] + '}, ';
            }
        }
        if (ratings [index] ['Item'])
        {
            bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Item'] + '", "y": ' + ratings [index] ['Rating'] + '}]';
        }
        else
        {
            bar_chart_data = bar_chart_data + '{"name": "' + ratings [index] ['Shop'] + '", "y": ' + ratings [index] ['Rating'] + '}]';
        }
        Highcharts.chart ('Bar Chart',
            {
                chart:
                    {
                        type: 'column'
                    },
                title:
                    {
                        text: 'Ratings of ' + document.getElementById ('Username').innerHTML
                    },
                xAxis:
                    {
                        type: 'category'
                    },
                yAxis: {
                    title: {
                        text: 'Rating'
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
                    name: 'Rating',
                    colorByPoint: true,
                    data: JSON.parse (bar_chart_data)
                }]
            });
    });
}