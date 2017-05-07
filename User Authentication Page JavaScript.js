var index, login_page_html_contents = document.getElementById ('User Authentication Form').innerHTML, registration_page_html_contents = 'Username: <Input Type = "Text" ID = "Username">' + '<Br>' + 'Password: <Input Type = "Password" ID = "Password">' + '<Br>' + 'Repeat Password: <Input Type = "Password" ID = "Password_Repetition">' + '<Br>' + '<Input Type = "Button" ID = "Register" Value = "Register">' + '<Br>' + '<A HRef = "#Login_Link" Class = "Login_Link">Already have an account? Log In!</A>';

$(document).ready (function ()
{
    $(document).on ('click', 'A.Registration_Link', function ()
    {
        document.title = 'Registration Page';
        document.getElementById ('User Authentication Form').innerHTML = registration_page_html_contents;
    });
    $(document).on ('click', 'A.Login_Link', function ()
    {
        document.title = 'Login Page';
        document.getElementById ('User Authentication Form').innerHTML = login_page_html_contents;
    });
    $(document).on ('click', '#Log_In', function ()
    {
        $.post ('../Login', {Username: $('#Username').val (), Password: $('#Password').val ()}, function (data)
        {
            window.location.href = data;
        });
    });
    $(document).on ('click', '#Register', function ()
    {
        if ($('#Password').val () == $('#Password_Repetition').val ())
        {
            $.post ('../Register', {Username: $('#Username').val (), Password: $('#Password').val ()}, function (data)
            {
                window.location.href = data;
            });
        }
    });
});