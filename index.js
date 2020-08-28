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
                title: 'Android Dev BR 2020 — Colaboração, Relevância e Transparência',
                date: new Date(2020, 07, 18),
                text: 'Nós do Android Dev BR anunciamos diversas melhorias e mudanças para todas as pessoas que participam e contribuem com a comunidade.',
                image: 'https://miro.medium.com/max/1126/1*-OKoXHQhNuhsC3XCQsgOhA.png',
                url: 'https://medium.com/android-dev-br/android-dev-br-2020-colabora%C3%A7%C3%A3o-relev%C3%A2ncia-e-transpar%C3%AAncia-55f280443520',
                featured: true
            },
            {
                title: 'Mercado brasileiro de desenvolvimento Android',
                date: new Date(2020, 07, 11),
                text: 'Resultados da pesquisa salarial e de mercado de desenvolvimento web entre pessoas brasileiras morando no país ou no exterior.',
                image: 'https://androiddevbr-survey.netlify.app/static/logo-70d971a32693f18bfb9fd92d34e07cd8.png',
                url: 'http://panorama.androiddevbr.org/',
                featured: true
            }
        ]
    },
    {
        section: 'Notícias',
        articles: [
            {
                title: 'Lançamento do Kotlin 1.4 com foco na qualidade e no desempenho',
                date: new Date(2020, 07, 17),
                text: 'Hoje, estamos lançando o Kotlin 1.4.0! Nos últimos anos, temos trabalhado muito para tornar o Kotlin uma linguagem de programação divertida, agradável e produtiva. Para continuarmos nossa jornada em busca dessa meta com esta versão do Kotlin, colocamos muita energia e esforço para melhorar o desempenho e a qualidade do Kotlin e de suas ferramentas.',
                image: 'https://blog.jetbrains.com/wp-content/uploads/2020/08/image-1597417083773.png',
                url: 'https://blog.jetbrains.com/pt-br/kotlin/2020/08/lancamento-do-kotlin-1-4-com-foco-na-qualidade-e-no-desempenho/',
                featured: false
            },
            {
                title: 'Leverage the In-App Review API for your Google Play reviews',
                date: new Date(2020, 07, 05),
                text: 'For many developers, ratings and reviews are an important touchpoint with users. Millions of reviews are left on Google Play every day, offering developers valuable insight on what users love and what they want improved.',
                image: 'https://1.bp.blogspot.com/--nhQBfqIbWU/XymyMRgZYeI/AAAAAAAAPZ0/hfN_M3Y6aHY4nz1qFm-0KguS5r1A9homwCLcBGAsYHQ/s1600/twittter_In_App_Review.jpg',
                url: 'https://android-developers.googleblog.com/2020/08/in-app-review-api.html',
                featured: false
            },
            {
                title: 'Announcing Jetpack Compose Alpha!',
                date: new Date(2020, 07, 26),
                text: 'Today, we’re releasing the alpha of Jetpack Compose, our modern UI toolkit designed to help you quickly and easily build beautiful apps across all Android platforms, with native access to the platform APIs. Bring your app to life with dramatically less code, interactive tools, and intuitive Kotlin APIs.',
                image: 'https://3.bp.blogspot.com/-VVp3WvJvl84/X0Vu6EjYqDI/AAAAAAAAPjU/ZOMKiUlgfg8ok8DY8Hc-ocOvGdB0z86AgCLcBGAsYHQ/s1600/jetpack%2Bcompose%2Bicon_RGB.png',
                url: 'https://android-developers.googleblog.com/2020/08/announcing-jetpack-compose-alpha.html',
                featured: false
            }
        ]
    }
]

const articles = [
    {
        title: 'Continuous Delivery com Fastlane e Android',
        date: new Date(2020, 04, 22),
        text: 'Uma introdução sobre como a Fastlane pode ser útil em projetos Android',
        image: 'https://miro.medium.com/max/4800/1*clK6pn73fpNukIoVSHUiWQ.jpeg',
        url: 'https://medium.com/android-dev-br/continuous-delivery-com-fastlane-e-android-6ccc8f12a336',
        author: {
            name: 'Wil Filho',
            image: 'https://miro.medium.com/fit/c/96/96/1*MMVOqBiLe6uTyOEoyxffkg.jpeg'
        }
    },
    {
        title: 'Hilt Series: Architecture Components com Dagger Hilt — ViewModel',
        date: new Date(2020, 07, 04),
        text: 'Aprenda como injetar o ViewModel utilizando o Dagger Hilt no seu projeto',
        image: 'https://miro.medium.com/max/2000/0*a1aID0GPNMqAqHfn',
        url: 'https://medium.com/android-dev-br/hilt-series-architecture-components-com-dagger-hilt-3f10b6345f42',
        author: {
            name: 'Ramon Ribeiro Rabello',
            image: 'https://miro.medium.com/fit/c/96/96/1*jxSMxyXOBgdQhn6pVFaXUw.jpeg'
        }
    },
    {
        title: 'Escreva código mais rápido com Live Templates',
        date: new Date(2020, 07, 17),
        text: 'Os Live Templates são construções de código personalizados que permitem ser reutilizados sem precisar reescrever todo código já feito, e também não precisar copiar e colar de um arquivo para outro, aumentando assim a velocidade de codificação.',
        image: 'https://miro.medium.com/max/1400/1*T8QH8hOTOA5UOpFqyDulYw.png',
        url: 'https://medium.com/android-dev-br/escreva-c%C3%B3digo-mais-r%C3%A1pido-com-live-templates-83e1765f796e',
        author: {
            name: 'João Gabriel',
            image: 'https://miro.medium.com/fit/c/96/96/2*HL4mv0PGY1FACAUMGnyCmA.jpeg'
        }
    },
    {
        title: 'Configurando CI/CD com Github Actions e Firebase App Distribution para projetos Android',
        date: new Date(2020, 07, 19),
        text: 'Aprendar a fazer uma automação bem prática para CI/CD utilizando o Github Actions e Firebase Distribution para agilizar o desenvolvimento.',
        image: 'https://miro.medium.com/max/1400/1*7F7oJukndcEW8zCPyB29Dg.png',
        url: 'https://medium.com/android-dev-br/configurando-ci-cd-com-github-actions-e-firebase-app-distribution-para-projetos-android-8df02096610b',
        author: {
            name: 'Denis Vieira',
            image: 'https://miro.medium.com/fit/c/96/96/1*H3_UMVPXbjkbgiuUXR0yfQ.jpeg'
        }
    }
]

const jobs = [
    [
        {
            title: 'Altran PT - Arquiteto Android',
            description: 'Descrição da vaga: Arquiteto Android para projetos variados. Local: Escritório do Porto ou Fundão, Portugal. Benefícios: Ajuda no processo de imigração, Carro alugado pago pela empresa, Plano de saude, inclui familiar, Vale refeição, Seguro de vida, Telefone com conta incluida ( validar pacote de dados e minutagem ), Premio anual por meta atingidas',
            url: 'https://github.com/androiddevbr/vagas/issues/1198'
        },
        {
            title: 'ThoughtWorks - Pessoa Desenvolvedora Mobile Android Embarcado (C++)',
            description: 'Estamos procurando uma Pessoa Desenvolvedora Mobile Android Embarcado (C++) para trabalhar em projetos desafiadores, entregando a melhor solução para os objetivos de clientes. Esta pessoa terá a oportunidade de trabalhar com práticas de desenvolvimento ágil, incluindo padrões de projeto, refatoração, integração contínua e TDD (Test Driven Development).',
            url: 'https://github.com/androiddevbr/vagas/issues/1197'
        }
    ],
    [
        {
            title: 'Órama Investimentos- Desenvolvedor Android (Júnior/Pleno)',
            description: 'Buscamos um Desenvolvedor Android, que seja apaixonado pela engenharia de software e ao mesmo tempo goste de pensar no usuário final e se preocupe com a sua experiência de uso em nossos aplicativos. Para um melhor clima de trabalho é imprescindível ter boa comunicação e gostar de desafios.',
            url: 'https://github.com/androiddevbr/vagas/issues/1196'
        },
        {
            title: '[Remoto] Desenvolvedor(a) Android (Kotlin) [PLENO|SENIOR] | Brick Abode',
            description: 'We are building a Android/Kotlin development team for a project called Nynja, for the development of a client\'s application of same name. Nynja is a all in one communications platform. You can find more information on their overview page.',
            url: 'https://github.com/androiddevbr/vagas/issues/1194'
        }
    ],
    [
        {
            title: '[São Carlos, SP] Desenvolvedor(a) Android [Pleno] | Ambar',
            description: 'Procuramos por um(a) Desenvolvedor(a) Android que irá nos ajudar no desenvolvimento do nosso app usando Kotlin, e que desempenhará as seguintes atividades dentro do time: Participação ativa na criação de novas features. Participação na criação/melhoria da UI/UX. Gestão de releases para produção. Garantia de qualidade para as releases. Criação das features que usam dados em tempo real. Interação com as áreas de backend, hardware e data science.',
            url: 'https://github.com/androiddevbr/vagas/issues/1193'
        },
        {
            title: '[Belo Horizonte ou Remoto] Android Developer @ Sympla',
            description: 'Como membro da equipe de Produto, você irá trabalhar ao lado de desenvolvedores, designers e outros profissionais na criação de soluções para os nossos usuários e será responsável pelo desenvolvimento de aplicações para a plataforma Android dos APPS Sympla.',
            url: 'https://github.com/androiddevbr/vagas/issues/1192'
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