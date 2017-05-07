var application, body_parser = require ('body-parser'), database = require ('nano') ('http://localhost:5984').db.use ('coe_49407_project'), express = require ('express'), file_path, file_system = require ('fs'), http_server = require ('http'), index, password, url_encoded_parser = body_parser.urlencoded ({extended: false}), username;
application = express ();
application.use (express.static (__dirname));
database.Update = function (object, key, callback_function)
{
    var database_updater = this;
    database_updater.get (key, function (error, existing_object)
    {
        if (!error)
        {
            object ['_rev'] = existing_object ['_rev'];
            database_updater.insert (object, key, callback_function);
        }
    });
}
application.get ('/', function (request, response)
{
    file_path = __dirname + '\\User Authentication Page.html';
    file_system.readFile (file_path, function (error_message, data)
    {
        response.writeHead (200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        response.write (data);
        response.end ();
    });
});
application.post ('/Login', url_encoded_parser, function (request, response)
{
    var mall_administrators, shop_owners, shoppers;
    username = request.body.Username;
    password = request.body.Password;
    database.view ('login', 'mall_administrator_login', function (error, body)
    {
        if (!error)
        {
            mall_administrators = body.rows [0].value;
            for (index = 0; index < mall_administrators.length; index = index + 1)
            {
                if (username == mall_administrators [index] ['Username'] && password == mall_administrators [index] ['Password'])
                {
                    response.end ('../Mall%20Administrator%20Page');
                }
            }
        }
    });
    database.view ('login', 'shop_owner_login', function (error, body)
    {
        if (!error)
        {
            shop_owners = body.rows [0].value;
            for (index = 0; index < shop_owners.length; index = index + 1)
            {
                if (username == shop_owners [index] ['Username'] && password == shop_owners [index] ['Password'])
                {
                    response.end ('../Shop%20Owner%20Page?Shop%20Owner=' + username.replace (/ /g, '%20'));
                }
            }
        }
    });
    database.view ('login', 'shopper_login', function (error, body, callback)
    {
        if (!error)
        {
            shoppers = body.rows [0].value;
            for (index = 0; index < shoppers.length; index = index + 1)
            {
                if (username == shoppers [index] ['Username'] && password == shoppers [index] ['Password'])
                {
                    response.end ('../Shopper%20Page?Username=' + username.replace (/ /g, '%20'));
                }
            }
        }
    });
});
application.post ('/Register', url_encoded_parser, function (request, response)
{
    var presence_of_a_duplicate = false, users;
    username = request.body.Username;
    password = request.body.Password;
    database.view ('registration', 'register_a_user', function (error, body)
    {
        if (!error)
        {
            users = body ['rows'] [0] ['value'] ['Shoppers'];
            for (index = 0; index < users.length; index = index + 1)
            {
                if (users [index] ['Username'] == username)
                {
                    presence_of_a_duplicate = true;
                }
            }
            if (!presence_of_a_duplicate)
            {
                users.push ({"Username": username, "Password": password});
                body ['rows'] [0] ['value'] ['Shoppers'] = users;
                database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id'], function (updating_error, updating_response)
                {
                    if (!updating_error)
                    {
                        response.end ('../Shopper%20Page?Username=' + username.replace (/ /g, '%20'));
                    }
                });
            }
        }
    });
});
application.get ('/Mall%20Administrator%20Page', function (request, response)
{
    file_path = __dirname + '\\Mall Administrator Page.html';
    file_system.readFile (file_path, function (error_message, data)
    {
        response.writeHead (200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        response.write (data);
        response.end ();
    });
});
application.post ('/Add%20a%20Shop', url_encoded_parser, function (request, response)
{
    var name = request.body.Name, owner = request.body.Owner, password = request.body.Password, presence_of_a_duplicate = false;
    database.view ('registration', 'add_a_shop', function (error, body)
    {
        if (!error)
        {
            var shops = body ['rows'] [0] ['value'] ['Shops'];
            for (index = 0; index < shops.length; index = index + 1)
            {
                if (shops [index] ['Name'] == name)
                {
                    presence_of_a_duplicate = true;
                }
            }
            if (!presence_of_a_duplicate)
            {
                shops.push ({"Name": name, "Owner": owner});
                body ['rows'] [0] ['value'] ['Shops'] = shops;
                database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
            }
        }
    });
    database.view ('registration', 'register_a_user', function (error, body)
    {
        if (!error)
        {
            var users = body ['rows'] [0] ['value'] ['Shop Owners'];
            for (index = 0; index < users.length; index = index + 1)
            {
                if (users [index] ['Username'] == username)
                {
                    presence_of_a_duplicate = true;
                }
            }
            if (!presence_of_a_duplicate)
            {
                users.push ({"Username": owner, "Password": password});
                body ['rows'] [0] ['value'] ['Shop Owners'] = users;
                database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
            }
        }
    });
});
application.get ('/Get%20Statistics', function (request, response)
{
    database.view ('ratings', 'get_ratings', function (error, body)
    {
        if (!error)
        {
            response.json (body ['rows'] [0] ['value']);
            response.end ();
        }
    });
});
application.get ('/Shopper%20Page', function (request, response)
{
    file_path = __dirname + '\\Shopper Page.html';
    file_system.readFile (file_path, function (error_message, data)
    {
        response.writeHead (200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        response.write (data);
        response.end ();
    });
});
application.get ('/Shop%20Owner%20Page', function (request, response)
{
    file_path = __dirname + '\\Shop Owner Page.html';
    file_system.readFile (file_path, function (error_message, data)
    {
        response.writeHead (200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        response.write (data);
        response.end ();
    });
});
application.get ('/Get%20Items', function (request, response)
{
    database.view ('items', 'get_items', function (error, body)
    {
        if (!error)
        {
            var relevant_items = new Array ();
            for (index = 0; index < body ['rows'] [0] ['value'] ['Items'].length; index = index + 1)
            {
                if (request.query ['Shop'] == body ['rows'] [0] ['value'] ['Items'] [index] ['Shop'])
                {
                    relevant_items.push (body ['rows'] [0] ['value'] ['Items'] [index]);
                }
            }
            response.json (relevant_items);
            response.end ();
        }
    });
});
application.get ('/Get%20Shops', function (request, response)
{
    database.view ('shops', 'get_shops', function (error, body)
    {
        if (!error)
        {
            response.json (body ['rows'] [0] ['value'] ['Shops']);
            response.end ();
        }
    });
});
application.post ('/Add%20an%20Item', url_encoded_parser, function (request, response)
{
    database.view ('registration', 'add_an_item', function (error, body)
    {
        if (!error)
        {
            var items = body ['rows'] [0] ['value'] ['Items'], presence_of_a_duplicate = false;
            for (index = 0; index < items.length; index = index + 1)
            {
                if (items [index] ['Name'] == request.body.Name)
                {
                    presence_of_a_duplicate = true;
                }
            }
            if (!presence_of_a_duplicate)
            {
                items.push ({"Name": request.body.Name, "Shop": request.body.Shop});
                body ['rows'] [0] ['value'] ['Items'] = items;
                database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
            }
        }
    });
});
application.get ('/Get%20Name%20of%20the%20Shop', function (request, response)
{
    database.view ('shops', 'get_shops', function (error, body)
    {
        if (!error)
        {
            for (index = 0; index < body ['rows'] [0] ['value'] ['Shops'].length; index = index + 1)
            {
                if (request.query ['Shop Owner'] == body ['rows'] [0] ['value'] ['Shops'] [index] ['Owner'])
                {
                    response.end (body ['rows'] [0] ['value'] ['Shops'] [index] ['Name']);
                }
            }
        }
    });
});
application.post ('/Update%20Rating', url_encoded_parser, function (request, response)
{
    database.view ('ratings', 'update_ratings', function (error, body)
    {
        if (!error)
        {
            var presence_of_a_duplicate = false, ratings = body ['rows'] [0] ['value'] ['Ratings'];
            request.body ['Rating'] = parseInt (request.body ['Rating']);
            for (index = 0; index < ratings.length; index = index + 1)
            {
                if (ratings [index] ['Item'])
                {
                    if (ratings [index] ['Username'] == request.body ['Username'] && ratings [index] ['Item'] == request.body ['Item/Shop'] && ratings [index] ['Rating'] == request.body ['Rating'])
                    {
                        presence_of_a_duplicate = true;
                    }
                    if (ratings [index] ['Username'] == request.body ['Username'] && ratings [index] ['Item'] == request.body ['Item/Shop'] && ratings [index] ['Rating'] != request.body ['Rating'])
                    {
                        body ['rows'] [0] ['value'] ['Ratings'] [index] ['Rating'] = request.body ['Rating'];
                        database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
                        presence_of_a_duplicate = true;
                        response.json (body ['rows'] [0] ['value'] ['Ratings']);
                        response.end ();
                    }
                }
                else
                {
                    if (ratings [index] ['Username'] == request.body ['Username'] && ratings [index] ['Shop'] == request.body ['Item/Shop'] && ratings [index] ['Rating'] == request.body ['Rating'])
                    {
                        presence_of_a_duplicate = true;
                    }
                    if (ratings [index] ['Username'] == request.body ['Username'] && ratings [index] ['Shop'] == request.body ['Item/Shop'] && ratings [index] ['Rating'] != request.body ['Rating'])
                    {
                        body ['rows'] [0] ['value'] ['Ratings'] [index] ['Rating'] = request.body ['Rating'];
                        database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
                        presence_of_a_duplicate = true;
                        response.json (body ['rows'] [0] ['value'] ['Ratings']);
                        response.end ();
                    }
                }
            }
            if (!presence_of_a_duplicate)
            {
                if (request.body.Type == 'Item')
                {
                    ratings.push ({"Username": request.body.Username, "Item": request.body ['Item/Shop'], "Rating": request.body.Rating});
                    body ['rows'] [0] ['value'] ['Ratings'] = ratings;
                    database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
                    response.json (body ['rows'] [0] ['value'] ['Ratings']);
                    response.end ();
                }
                else
                {
                    ratings.push ({"Username": request.body.Username, "Shop": request.body ['Item/Shop'], "Rating": request.body.Rating});
                    body ['rows'] [0] ['value'] ['Ratings'] = ratings;
                    database.Update (body ['rows'] [0] ['value'], body ['rows'] [0] ['value'] ['_id']);
                    response.json (body ['rows'] [0] ['value'] ['Ratings']);
                    response.end ();
                }
            }
        }
    });
});
http_server.createServer (application).listen (8080);