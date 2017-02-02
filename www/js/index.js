/** Made 31-01-2017 **/

function prepareSeasons(event, ui)
{
    console.log("ready to load Seasons");

    $.get
    (
        "http://www.dr.dk/mu-online/api/1.3/list/view/seasons?id=skam&onlyincludefirstepisode=true&limit=15&offset=0",
        function(res, code)
        {
            console.debug(code + ": " + JSON.stringify(res));

            // check lige om indholdes er bare lidt i orden...
            if (res.Items && res.TotalSize > 0)
            {
                // fjern 'gamle' knapper
                $('#seasons a').remove();
                var newContent = '';
                // gennemløb alle sæsoner i Items
                for (var i in res.Items)
                {
                    // lav en ny "knap" for hver sæson
                    // <a href="#episodes" data-role="button" data-slug="">Sæson 1</a>
                    newContent += '<a href="#episodes" data-role="button" data-slug="'+res.Items[i].Slug+'">Sæson ' + res.Items[i].SeasonNumber + '</a>';
                }
                // tilføj knapperne til DOM'en
                $(newContent).appendTo('#seasons');
                // lad JQM forbedre htmlen
                $('#seasons').enhanceWithin();
                // tilføj event handler til hver knap
                $('#seasons a').one('click', prepareSeason);
            }

        }
    )
}

function prepareSeason(event, ui)
{
    console.log("Indlæser sæson " + this.dataset.slug );

    $.get
    (
        'http://www.dr.dk/mu-online/api/1.3/list/view/season?id='+ this.dataset.slug +'&limit=15&offset=0',
        function(res, code)
        {
            console.debug(code + ": " + JSON.stringify(res));

            // check lige om indholdes er bare lidt i orden...
            if (res.Items && res.TotalSize > 0)
            {
                $('#episodes div').remove();
                // fjern 'gamle' div'er
                //$('#season div').remove();
                var newContent = '';
                // gennemløb alle afsnit i Items
                for (var i in res.Items)
                {

                    newContent += '<div>'
                                + '<img src="' + res.Items[i].PrimaryImageUri + '" width="50%">'
                                + '<h2>' + res.Items[i].Title + '</h2>'
                                + '<p>' + res.Items[i].Description + '</p>'
                                + '<a href="#episodeDetails" data-role="butten">se mere</a>'
                                + '</div>';

                }
                $(newContent).appendTo('#episodes');
                // lad JQM forbedre htmlen
                $('#episodes').enhanceWithin();
                // tilføj event handler til hver knap
                $('#episodes a').one('click', prepareEpisodeDetails());
            }
        }
    )
}



 function prepareEpisodeDetails(event, ui)
{
    {
        console.log("Indlæser ... " + this.dataset.slug);

        $.get
        (
            'http://www.dr.dk/mu-online/api/1.3/list/view/season?id=' + this.dataset.slug + '&limit=15&offset=0',
            function (res, code) {
                console.debug(code + ': ' + res);
            }
        )
    }
}


$(document).ready
(
    // når siden er loaded
    function()
    {
        $('#episodes a').one('click', prepareEpisodeDetails);

        var pageContainer = $("div#container").pagecontainer
        (
            {
                beforeshow:
                function( event, ui)
                {
                //hvilken side er vi ved at vise
                console.log("beforeshow: " + ui.toPage[0].id);

                    switch(ui.toPage[0].id)
                    {
                        case "seasons":
                            prepareSeasons(event, ui);
                            break;

                        case "landingpage":
                            break;
                    }
                }
            }
        )
    }
);
