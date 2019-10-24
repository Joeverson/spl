let app = new Vue({
    el: "#app",
    data: {
        alerts: {
            search: {
                show: false,
                message: ''
            },
            error: {
                show: false,
                message: ''
            }
        },
        show: {
            searchMusic: true,
            slide: false
        },
        music: "galileu",
        art: "fernandinho",
        id: false,
        result: [],
        slide: {
            musics: [],
            context: {
                current: '', //text corrente
                indexMusic: 0, //Qual a musica que est sendo apresentada
                indexTrack: 0, // qual a parte da musica que esta sendo apresentada
                trackFinal: 0 // quando ultima parte da musica
            }


        }
    },
    methods: {
        search: () => {

            app.$data.alerts.search.show = true
            app.$data.alerts.search.message = "search for: " + app.$data.music

            jQuery.getJSON(
                "https://api.vagalume.com.br/search.php" +
                "?art=" + app.$data.art +
                "&mus=" + app.$data.music + "&apikey={2d3baef391e78ab633f7097742391cd9}",
                function(result) {

                    app.$data.alerts.search.show = false
                    console.log(result)

                    if (result.type != 'exact') {
                        app.$data.alerts.error.show = true
                        app.$data.alerts.error.message = "Nao consegui achar a musica. "

                        return;
                    }


                    app.$data.result.name = result.art.name + " - " + result.mus[0].name
                    app.$data.result.music = result.mus[0].text.split('\n')

                }
            );

        },
        saveMusic: () => {
            if (app.$data.result.music !== undefined) {
                let music = [],
                    musicAll = '';

                for (let trap of app.$data.result.music) {
                    if (trap == '') {
                        music.push(musicAll)
                        musicAll = ''
                    }

                    musicAll += trap + '\n'

                }

                app.$data.result.music = music

                app.$data.slide.musics.push(app.$data.result)
                app.$data.result = []
            }
        },
        initApresentation: () => {
            app.$data.show.searchMusic = false
            app.$data.show.slide = true

            //current
            app.$data.slide.context.current = app.$data.slide.musics[0].music[0]

            //config index track final
            app.$data.slide.context.trackFinal = app.$data.slide.musics[0].music.length
        },
        next: () => {
            let track = app.$data.slide.context.indexTrack++
            let music = app.$data.slide.context.indexMusic

            //verifica se a musica acabou
            if (track > app.$data.slide.context.trackFinal) {
                music++
                app.$data.slide.context.indexMusic++

                track = 0
                app.$data.slide.context.indexTrack = 0

                //config index track final
                app.$data.slide.context.trackFinal = app.$data.slide.musics[music].music.length
            }


            //next
            app.$data.slide.context.current = app.$data.slide.musics[music].music[track]

        },
        prev: () => {
            let track = app.$data.slide.context.indexTrack - 1
            let music = app.$data.slide.context.indexMusic

            //verifica se a musica acabou
            if (track < 0) {
                music--
                app.$data.slide.context.indexMusic--

                    track = app.$data.slide.context.trackFinal
                app.$data.slide.context.indexTrack = app.$data.slide.context.trackFinal

                //config index track final
                app.$data.slide.context.trackFinal = app.$data.slide.musics[music].music.length
            }


            //next
            app.$data.slide.context.next = app.$data.slide.musics[music].music[track]
        }
    }
})


/**
----------------------------------
----------------------------------
**/

$("body").on('keypress', function(e){
    if(app.show.slide){
        var code = e.keyCode || e.which;
        //32 'space' for next
        //118 'v' for prev
        if(code == 32)
            app.next()
        else if(code == 118)
            app.prev()
    }
})
