import { Template, Theme, Session, Article, Status } from "@/types/api";

export const themeArray: Theme[] = [
    {
        "id": 3,
        "parent_id": null,
        "code": "Credit card",
        "name": "Кредитная карта",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 4,
        "parent_id": null,
        "code": "Car loan",
        "name": "Авто",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 5,
        "parent_id": null,
        "code": "PDS",
        "name": "ПДС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 6,
        "parent_id": null,
        "code": "Selfemployed",
        "name": "Самозанятые",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 8,
        "parent_id": null,
        "code": "Debit card",
        "name": "Дебетовая карта",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 10,
        "parent_id": null,
        "code": "Sber health",
        "name": "СберЗдоровье",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 11,
        "parent_id": null,
        "code": "Brokerage service",
        "name": "Брокерское обслуживание",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 12,
        "parent_id": null,
        "code": "Business registration",
        "name": "Регистрация бизнеса",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 13,
        "parent_id": null,
        "code": "Sber law",
        "name": "СберПраво",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 14,
        "parent_id": null,
        "code": "Career assistant",
        "name": "Карьерный ассистент",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 15,
        "parent_id": null,
        "code": "Non banking products",
        "name": "Небанковские продукты",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 16,
        "parent_id": null,
        "code": "objections_credit_card",
        "name": "Возражения по кредитным картам",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 17,
        "parent_id": null,
        "code": "Sber prime",
        "name": "СберПрайм",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 18,
        "parent_id": null,
        "code": "Business account",
        "name": "Счет для бизнеса",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 19,
        "parent_id": null,
        "code": "objections_sber_health",
        "name": "Возражения по СберЗдоровью",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 20,
        "parent_id": null,
        "code": "Smart devices",
        "name": "Умные устройства",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 21,
        "parent_id": null,
        "code": "Acquiring",
        "name": "Эквайринг",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 22,
        "parent_id": null,
        "code": "Pension transfer",
        "name": "Перевод пенсии",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 23,
        "parent_id": null,
        "code": "Electronic signature",
        "name": "Электронная подпись",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 43,
        "parent_id": null,
        "code": "Test",
        "name": "Тест",
        "template_info": {
            "id": 43,
            "name": "test nepoisk"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 151,
        "parent_id": 43,
        "code": "test1633",
        "name": "test1633",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 160,
        "parent_id": null,
        "code": "Metals account",
        "name": "Металлический счет",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 161,
        "parent_id": null,
        "code": "Cash transactions",
        "name": "Операции с наличными",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 162,
        "parent_id": null,
        "code": "Account replenishment",
        "name": "Пополнение счета",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 163,
        "parent_id": null,
        "code": "Ingots",
        "name": "Слитки",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 164,
        "parent_id": null,
        "code": "Services for minors",
        "name": "Обслуживание несовершеннолетних",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 165,
        "parent_id": null,
        "code": "Financial delivery",
        "name": "Финансовая доставка",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 166,
        "parent_id": null,
        "code": "Letter of credit",
        "name": "Аккредитив",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 167,
        "parent_id": null,
        "code": "Protection for every occasion",
        "name": "Защита на любой случай",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 168,
        "parent_id": null,
        "code": "Salary client",
        "name": "Зарплатный клиент",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 169,
        "parent_id": null,
        "code": "Consumer loan",
        "name": "Потребительский кредит",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 170,
        "parent_id": null,
        "code": "Sber thanks",
        "name": "Сберспасибо",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 171,
        "parent_id": null,
        "code": "Financial delivery mbc",
        "name": "Финансовая доставка MBC",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 172,
        "parent_id": null,
        "code": "Debit card mbc",
        "name": "Дебетовая карта МВС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 173,
        "parent_id": null,
        "code": "Realty mbc",
        "name": "Недвижимость МВС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 174,
        "parent_id": null,
        "code": "Credit card mbc",
        "name": "Кредитная карта МВС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 175,
        "parent_id": null,
        "code": "Car loan mbc",
        "name": "Авто МВС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 176,
        "parent_id": null,
        "code": "PDS mbc",
        "name": "ПДС МВС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 177,
        "parent_id": null,
        "code": "Educational loan",
        "name": "Образовательный кредит",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 178,
        "parent_id": null,
        "code": "Service for foreign citizens",
        "name": "Обслуживание иностранных граждан",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 179,
        "parent_id": null,
        "code": "Serving the incapacitated",
        "name": "Обслуживание недееспособных",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 180,
        "parent_id": null,
        "code": "Power of attorney",
        "name": "Оформление доверенностей",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 181,
        "parent_id": null,
        "code": "Identity documents",
        "name": "Документы удостоверяющие личность",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 182,
        "parent_id": null,
        "code": "Sber Mobile",
        "name": "СберМобайл",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 211,
        "parent_id": null,
        "code": "Digital ruble",
        "name": "Цифровой рубль",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 212,
        "parent_id": null,
        "code": "testtest",
        "name": "Возражения Тест",
        "template_info": {
            "id": 78,
            "name": "тест_вар"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 213,
        "parent_id": null,
        "code": "Premium service package",
        "name": "Пакет услуг премиальное обслуживание",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 214,
        "parent_id": null,
        "code": "objections_protection_for_every_occasion",
        "name": "Возражения по защите на любой случай",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 216,
        "parent_id": null,
        "code": "Ticket to the future",
        "name": "Билет в будущее",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 217,
        "parent_id": null,
        "code": "Biometrics of the UBS",
        "name": "Биометрия ЕБС",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 218,
        "parent_id": null,
        "code": "VLI for consumer credit",
        "name": "ДСЖ при потребительском кредите",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 219,
        "parent_id": null,
        "code": "Mortgage life insurance",
        "name": "Ипотечное страхование жизни",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    },
    {
        "id": 220,
        "parent_id": null,
        "code": "Collateral insurance",
        "name": "Страхование залога",
        "template_info": {
            "id": 3,
            "name": "Кредитная карта"
        },
        "useGigachatOnlyWithKnowledgebase": false,
        "nepoiskErrorText": "",
        "uncensoredAnswers": true
    }
]

export const templateArray: Template[] = [
    {
        "id": 3,
        "name": "Кредитная карта",
        "template": "Кредитная карта"
    },
    {
        "id": 43,
        "name": "test nepoisk",
        "template": "test nepoisk pattern"
    },
    {
        "id": 73,
        "name": "au test16",
        "template": "au test16"
    },
    {
        "id": 77,
        "name": "tesss",
        "template": "tesss"
    },
    {
        "id": 78,
        "name": "тест_вар",
        "template": "1"
    },
    {
        "id": 79,
        "name": "тест_вар2",
        "template": "1"
    },
    {
        "id": 80,
        "name": "qwerty1",
        "template": "qwerty1"
    }
]

export const sessionsArray: Session[] = [
    {
        "sessionId": "05f08eb2-555c-45ff-910b-2d30eaecb399",
        "createDt": "2025-04-07T16:28:33.156+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "06b983a3-0716-45b4-b574-23f2b3b39653",
        "createDt": "2025-04-07T17:39:25.731+03:00",
        "ucpId": "",
        "theme": 11,
        "code": "Brokerage service",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "0b0a5da9-3b04-49c8-8aa0-863f0a4f0d71",
        "createDt": "2025-04-07T17:41:02.738+03:00",
        "ucpId": "",
        "theme": 11,
        "code": "Brokerage service",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "154fec4c-7f98-4a2f-a5dd-868086654420",
        "createDt": "2025-04-07T13:05:13.050+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "29707adf-278e-4fe8-a9ea-ca9042703aa6",
        "createDt": "2025-04-07T15:06:06.114+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "32af49c9-5a83-4fa0-b912-6d0716205782",
        "createDt": "2025-04-07T15:12:04.787+03:00",
        "ucpId": "",
        "theme": 11,
        "code": "Brokerage service",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "3355eb20-38c8-45be-b59c-cad61bc7cf2f",
        "createDt": "2025-04-07T15:51:41.644+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "3f27d304-1ec4-44ba-8124-81b4365866ea",
        "createDt": "2025-04-07T11:31:44.076+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "41b90597-04c0-4291-bac6-8594ce6fddad",
        "createDt": "2025-04-07T15:02:47.465+03:00",
        "ucpId": "",
        "theme": 8,
        "code": "Debit card",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "4c13c397-8658-4723-933f-37f02d412d52",
        "createDt": "2025-04-07T14:02:55.553+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "4d66af81-525e-4c9d-a316-00bd725a5fd5",
        "createDt": "2025-04-07T14:56:46.272+03:00",
        "ucpId": "",
        "theme": 8,
        "code": "Debit card",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5060bd6e-1a92-4bf6-bc6c-47fe53319cd3",
        "createDt": "2025-04-07T11:27:30.886+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "535c33a6-8af4-44ba-847d-e2b8db2ed798",
        "createDt": "2025-04-07T15:51:26.626+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "56a5808e-4d4d-4dc3-bc1d-84ccd5943d35",
        "createDt": "2025-04-07T08:00:31.814+03:00",
        "ucpId": "1474514645574762938",
        "theme": 0,
        "code": "",
        "user": "t1estuserDSA",
        "userDivisionCode": "13859300073"
    },
    {
        "sessionId": "5774e7c4-b263-4cf6-bf63-423ee69d3cdd",
        "createDt": "2025-04-07T15:11:54.618+03:00",
        "ucpId": "",
        "theme": 11,
        "code": "Brokerage service",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "586d3f2c-260a-4a70-95ae-5f27161f3f8e",
        "createDt": "2025-04-07T16:19:47.678+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5a309c07-66fc-4fcd-946a-abaa88904f8d",
        "createDt": "2025-04-07T08:00:31.053+03:00",
        "ucpId": "1474514645574762938",
        "theme": 2,
        "code": "Realty",
        "user": "smbd",
        "userDivisionCode": "1156087604"
    },
    {
        "sessionId": "5af6048c-eff7-4cb2-a744-5634631b14bb",
        "createDt": "2025-04-07T14:55:37.261+03:00",
        "ucpId": "",
        "theme": 8,
        "code": "Debit card",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5b1d74f3-447a-4043-9fae-ef4d5c6d9ffb",
        "createDt": "2025-04-07T15:33:37.138+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5b7cf0f4-9409-4148-a7a9-034bd04e60aa",
        "createDt": "2025-04-07T16:08:05.720+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5c055eb1-cee0-4e16-a8b8-da83c14d8099",
        "createDt": "2025-04-07T16:19:40.745+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5c2aaec5-1cbd-4b52-9226-3cb5541c61d7",
        "createDt": "2025-04-07T16:39:51.578+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5db75617-ff31-4f23-af1e-fa7523f0875c",
        "createDt": "2025-04-07T10:47:33.252+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    },
    {
        "sessionId": "5f8e0740-1789-4007-8969-a5c93145ea16",
        "createDt": "2025-04-07T08:00:49.251+03:00",
        "ucpId": "1474514645574762938",
        "theme": 6,
        "code": "Selfemployed",
        "user": "testuser",
        "userDivisionCode": "testdivcod"
    },
    {
        "sessionId": "65b69772-3b39-4689-8e86-dd93e1ba1e00",
        "createDt": "2025-04-07T16:04:11.586+03:00",
        "ucpId": "",
        "theme": 0,
        "code": "",
        "user": "",
        "userDivisionCode": ""
    }
]

export const articlesArray: Article[] = [
    {
        "articleId": "063c28d2-02af-48c0-91d4-79700ba4a4d2",
        "content": "СберПрайм Что такое подписка СберПрайм (Сбер Прайм, Прайм, СБЕРПРАЙМ) и СберПрайм+ (СберПраймПлюс\\Плюс\\ПраймПлюс/прайм+\\праймплюс)? Подписка СберПрайм и СберПрайм+ (СберПраймПлюс) – это подписка на сервисы Сбера, которые делают жизнь проще и комфортнее.",
        "title": "AT 2025-04-07T08:00:22.481784",
        "topic": "PDS",
        "topicCode": "PDS",
        "chunkNumber": 1,
        "currentStatus": "verified",
        "publishedDate": "2025-04-07",
        "deactivatedDate": "2025-04-08",
        "statusHistory": [
            {
                "status": "new",
                "timestamp": "2025-04-07T05:49:36+00:00",
                "timestampEnd": "2025-04-07T05:49:36+00:00",
                "publishedDate": "2025-04-07",
                "deactivatedDate": "2025-04-09",
                "transitionUser": "test_ift_iam"
            },
            {
                "status": "verified",
                "timestamp": "2025-04-07T05:49:36+00:00",
                "timestampEnd": "2025-04-07T05:50:33+00:00",
                "publishedDate": "2025-04-07",
                "deactivatedDate": "2025-04-09",
                "transitionUser": "test_ift_iam"
            },
            {
                "status": "verified",
                "timestamp": "2025-04-07T05:50:33+00:00",
                "timestampEnd": "9999-12-31T23:59:59.999999",
                "publishedDate": "2025-04-07",
                "deactivatedDate": "2025-04-08",
                "transitionUser": "test_ift_iam"
            }
        ],
        "fileName": "AT 2025-04-07T08:00:22.481784",
        "chunks": [
            "2515bb9b-1763-4c34-9b16-cf7f7c5b4536"
        ],
        "author": "test_ift_iam"
    },
]

export const statuses: Status[] = [
    {
        id: "noselect",
        name: "Не выбрано"
    },
    {
        id: "new",
        name: "Новая"
    },
    {
        id: "verified",
        name: "Верифицирована"
    },
    {
        id: "published",
        name: "Опубликована"
    },
    {
        id: "deactivated",
        name: "Удалена"
    },
]


export interface KeyPairString {
    [key: string]: string;
}

export const statusDict: KeyPairString = {
    "noselect": "Не выбрано",
    "new": "Новая",
    "verified": "Верифицирована",
    "published": "Опубликована",
    "deactivated": "Удалена",
}

export const filterOptions: KeyPairString = {
    "Идентификатор": "id",
    "Тематика": "theme_id",
}