const minify = require("html-minifier").minify
const fs = require("fs")
const path = require("path");
const ejs = require("ejs");
const inlineCss = require("inline-css")
var moment = require('moment')

moment.locale('pt-br')

const data = [
    {
        section: 'Destaques',
        articles: [
            {
                title: 'Hacktoberfest Android Dev BR',
                date: new Date(2020, 10, 01),
                text: 'Vamos celebrar o open source e fazer parte desse movimento global com um foco em projetos android.',
                image: 'https://hacktoberfest.digitalocean.com/assets/HF-full-logo-b05d5eb32b3f3ecc9b2240526104cf4da3187b8b61963dd9042fdc2536e4a76c.svg',
                url: 'https://organize.mlh.io/participants/events/4249-hacktoberfest-android-dev-br',
                featured: true
            },
            {
                title: 'Latin Android Summit',
                date: new Date(2020, 10, 22),
                text: 'Evento internacional voltado para pessoas que falam alguma língua latina. Terão palestras em Português, Espanhol e Inglês.',
                image: 'https://res.cloudinary.com/ideation/image/upload/w_470,q_auto,f_auto,dpr_auto/qxvpabgk4pxsf5mnq6wx',
                url: 'https://latinandroidsummit-welcome.virtualconference.com/',
                featured: true
            }
        ]
    },
    {
        section: 'Notícias',
        articles: [
            {
                title: 'Impacto econômico e social do Android no Brasil',
                date: new Date(2020, 09, 23),
                text: 'Este site apresenta os principais resultados de um estudo realizado pela Bain & Company sobre impactos econômicos e sociais do Android no Brasil.',
                image: 'https://baininsights.com.br/wp-content/uploads/2020/09/home-destaque-smartphone.jpg',
                url: 'https://baininsights.com.br/',
                featured: false
            },
            {
                title: 'Turning it up to 11: Android 11 for developers',
                date: new Date(2020, 09, 07),
                text: 'Android 11 is here! Today we’re pushing the source to the Android Open Source Project (AOSP) and officially releasing the newest version of Android. We built Android 11 with a focus on three themes: a People-centric approach to communication, Controls to let users quickly get to and control all of their smart devices, and Privacy to give users more ways to control how data on devices is shared. Read more in our Keyword post.',
                image: 'https://1.bp.blogspot.com/-nNMn8M5HB90/X1VDbnTopaI/AAAAAAAAPmU/pXIMwzpsCh4I_6FqWelywA4ErpsjJOQbwCLcBGAsYHQ/s1600/image17.png',
                url: 'https://android-developers.googleblog.com/2020/09/android11-final-release.html',
                featured: false
            },
            {
                title: 'Kotlin Multiplatform Mobile Goes Alpha',
                date: new Date(2020, 08, 31),
                text: 'Kotlin Multiplatform Mobile (KMM) is an SDK that allows you to use the same business logic code in both iOS and Android applications.',
                image: 'https://blog.jetbrains.com/wp-content/uploads/2020/08/KMM_release_banners_blogpost.png',
                url: 'https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/',
                featured: false
            }
        ]
    }
]

const articles = [
    {
        title: 'Como implementar InAppReview',
        date: new Date(2020, 09, 11),
        text: 'Em algum momento você já implementou ou vai precisar implementar uma forma de pedir para os seus usuários deixarem um review sobre o seu app na PlayStore.',
        image: 'https://miro.medium.com/max/3000/1*R6rNjXZKU1pXMiX8iiXfOw.png',
        url: 'https://medium.com/android-dev-br/como-implementar-inappreview-83ae04e1f5c8',
        author: {
            name: 'Iago Mendes Fucolo',
            image: 'https://miro.medium.com/fit/c/96/96/1*q4DrYIBsatHvx-9A9xi7Yg.jpeg'
        }
    },
    {
        title: 'Flow e ViewPager',
        date: new Date(2020, 07, 04),
        text: 'Pessoal, hoje vamos ver um pouco como o Flow pode nos ajudar a fazer de uma forma elegante e bem mais organizada um carrossel.',
        image: 'https://miro.medium.com/max/1400/1*SP-5OrAglsCyWLZbl4DXiA.png',
        url: 'https://medium.com/android-dev-br/flow-e-viewpager-863b6c30efc8',
        author: {
            name: 'João Victor',
            image: 'https://miro.medium.com/fit/c/96/96/0*GF_o2IKLvZo7AV9l.jpg'
        }
    },
]

const jobs = [
    [
        {
            title: '[são paulo] Android Developer - 5A Attiva',
            description: 'Buscamos um Desenvolvedor apaixonado por tecnologias e novos conceitos. Que goste de trabalhar em modelo Squad e método ágil.',
            url: 'https://github.com/androiddevbr/vagas/issues/1235'
        },
        {
            title: 'Analista Programador(a) Android Senior',
            description: 'Estamos em busca de uma pessoa com experiência em programação/ desenvolvimento mobile Android, com experiência em Kotlin, tecnologia RESTful, Back-end, web developer, e adaptação de layout entre diferentes dispositivos para atuar no desenvolvimento da plataforma Sofie.',
            url: 'https://github.com/androiddevbr/vagas/issues/1233'
        }
    ],
    [
        {
            title: '(PRESENCIAL ou REMOTO) Desenvolvedor Mobile (Porto Alegre)',
            description: 'Requisitos / Seu dia a dia: Estar disposto a atuar em um cenário de transformação digital; Ter noções de Governança; Possuir sólidos conhecimentos e vivência com práticas de agilidade (Scrum, Kanban, Lean...) Vivência com desenvolvimento, planejamento, arquitetura, realização e configuração de testes.',
            url: 'https://github.com/androiddevbr/vagas/issues/1228'
        },
        {
            title: 'Desenvolvedor Android para o Rio de Janeiro',
            description: 'Desejáveis: Conhecimento em Desenvolvimento com Android, Desenvolvimento de Aplicações para integração de dados com outros aplicativos Node. Escrever código limpo, de fácil manutenção, utilizando as melhores práticas de desenvolvimento de software;',
            url: 'https://github.com/androiddevbr/vagas/issues/1226'
        }
    ],
    [
        {
            title: 'DESENVOLVEDOR(A) ANDROID - ZUP INNOVATION',
            description: 'Sabe aquele app que você ama cada interação? Que tal participar da construção e melhorias das experiências para dispositivos Android - e contribuir para a transformação digital no país? Confere se você tem o que é preciso para fazer parte desse time de elite.',
            url: 'https://github.com/androiddevbr/vagas/issues/1225'
        },
        {
            title: '[MARINGÁ/REMOTO] Senior Android Developer na DB1',
            description: 'No DB1 Group, o (a) desenvolvedor(a) Android terá a oportunidade de trabalhar com práticas de desenvolvimento ágil, pair programming, integração contínua, desenvolvimento orientado a testes (TDD) e boas práticas de Clean Code.',
            url: 'https://github.com/androiddevbr/vagas/issues/1224'
        }
    ]
]

    ; (async () => {
        try {
            ejs.renderFile(
                path.resolve(
                    __dirname,
                    `newsletter.ejs`
                ),
                { moment, data, articles, jobs },
                {},
                (e, html) => {
                    if (e) console.error(e)

                    fs.mkdir(
                        path.resolve(__dirname, "output"),
                        { recursive: true },
                        async (e) => {
                            if (e) console.error(e)

                            fs.writeFileSync(
                                path.resolve(__dirname, `output/newsletter.html`),
                                minify(
                                    await inlineCss(html, {
                                        url: 'androiddevbr.org',
                                        removeLinkTags: false,
                                        applyTableAttributes: true,
                                        preserveMediaQueries: true,
                                    }),
                                    {
                                        minifyCSS: true,
                                        removeEmptyElements: true,
                                        removeEmptyAttributes: true,
                                        collapseWhitespace: true,
                                        removeComments: true,
                                    }
                                )
                            )
                        }
                    )
                }
            )
        } catch (e) {
            console.error(e)
        }
    })()