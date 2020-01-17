# Приложение не собиралось
Если нажать F5, падали 2 ошибки
1. В server.ts надо было заменить return value в conn.onInitialize

 Станет 

``` typescript 
conn.onInitialize((params: InitializeParams) => {
    return {
        capabilities: {
            textDocumentSync: {
                change: TextDocumentSyncKind.Full
            }
        }
    };
});
```

Тут помог VS Code, т.к. он пишет причину ошибки, то есть, что типы несовместимы. Посмотрела в definition _ServerCapabilities, там написано, что можно использовать TextDocumentSyncOptions или TextDocumentSyncKind. Но про второй вариант написано, что он только для обратной совместимости оставлен, так что лучше выбрать первый.

2. В том же файле внутри  const validateProperty надо поменять property.key.loc на property.loc.

 У property тип AstProperty. В описании этого типа информация, что location лежит в .loc, а не в key.loc

# Приложение запустилось
Решила посмотреть, что в проекте вообще есть. Обнаружился tslint, tsconfig с mode:strict, где подробно расписано, что нельзя, и package.json, внутри которого лежала команда на запуск тестов.

Раз конфигурация tslint есть, было бы отлично проверить код линтером. Я установила в VS Code плагин для tslint, и сразу пришло 3 ошибки - в файле extension.ts двух местах не хватало ";" и if без {} использовался.

Добавила prettier: в нескольких местах код криво отформатирован, используются разные варианты кавычек, нет единого стиля и всё такое. Конфигурации для prettier в проекте нет, так что я взяла готовую из репозитория tinkoff (https://github.com/TinkoffCreditSystems/linters). 

# Сломанное превью (всегда пишет {{content}})
Похоже, что так работать не должно. Решила поискать, где должен подменяться content на нормальное содержимое. С помощью дебаггера VS Code дошла до функции updateContent. Внутри неё была регулярка, которая искала то, что нужно подменить в index.html, и замещала это на распаршенные значения. Но регулярка была сломана, т.к. там ожидались обязательные пробелы внутри {{}}. Если заменить + (поиск 1 или более символов) на * (поиск 0 или более символов) около \s, то работает как надо.

Теперь html в panel webview правильная, но вместо {{content}} осталась просто пустота. Перепроверив, что html точно доходит до panel, посмотрела на style.css, там селектор неправильный. В html нет класса .div, так что скорее всего нужно просто div выбирать.

Но оказалось, что этого не достаточно. Попробовала локально вне VS запустить html + css - отображается. Погуглила, наткнулась на  документацию, вот этот раздел https://code.visualstudio.com/api/extension-guides/webview#loading-local-content, - там описано, что в vs нужен особый формат uri. Вот так работает:

``` typescript
const getMediaPath = (context: vscode.ExtensionContext, panel: vscode.WebviewPanel) => {
      return panel.webview.asWebviewUri(vscode.Uri.file(context.extensionPath)).toString() + '/';
};
```

# Превью показывается

Перечитала, как должно работать превью. Проверила, что всё работает:
* Доступно для любого Json.
* Всеми вариантами открывается,
* вкладка рядом, 
* лишний раз не открывается.
* При обновлении json превью тоже обновляется.

![blocks screenshot 1](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/Block1.png?token=AGC5FL5X2IR6GSUP3EPHSZK6EIS5A)
![blocks screenshot 2](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/Blocks.png?token=AGC5FLYFZ5WD4YX725ZL2S26EITBC)



Подменила style.css стилями из первого задания, добавила script.js в html. Стало отображаться красиво.
Можно вернуться к отображению прямоугольниками, если в index.html заменить стили на styles_init.css 

![new blocks screenshot 1](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks1.png?token=AGC5FL3E27BWH7IF3XG65T26EITFI)
![new blocks screenshot 2](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks2.png?token=AGC5FLY5CLKKASBXK46C55K6EITGE)
![new blocks screenshot 3](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks3.png?token=AGC5FL4VGDIWZ5Z7ABFMDIC6EITHC)
![new blocks screenshot 4](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks4.png?token=AGC5FL4ZXU6RYX4O7YEGQKC6EITIC)
![new blocks screenshot 5](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks5.png?token=AGC5FL5WN3BMUNDP3OUV5Q26EITJA)
![new blocks screenshot 6](https://raw.githubusercontent.com/hhharm/find-mistakes/bugfix/my-fixes/media/proofs/StyledBlocks6.png?token=AGC5FL62GYGG5NP7TFCOOB26EITJ2)