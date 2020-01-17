#Ошибки, которые не позволяли даже запуститься (нажимаешь F5 и они в Output отображаются)
1. В server.ts надо заменить return value в conn.onInitialize. Станет 

conn.onInitialize((params: InitializeParams) => {
    return {
        capabilities: {textDocumentSync: {
                change: TextDocumentSyncKind.Full
            }
        }
    };
});

Тут помог VS Code, т.к. он сам пишет, что несовместимы типы. Посмотрела в definition _ServerCapabilities, там написано, что можно использовать TextDocumentSyncOptions или TextDocumentSyncKind. Но про второй вариант написано, что он только для обратной совместимости оставлен, лучше выбрать первый.

2. В том же файле внутри  const validateProperty надо поменять property.key.loc на property.loc. У property тип AstProperty, а там написано, что location лежит в .loc, а не в key.loc

#Приложение запустилось
Я проверила, что окошко открывается, поставила брекпоинты в openPreview и initPreviewPanel в extension.ts. Вроде что-то разумное происходит, но пока не очень понятно, где искать ошибки.
Решила посмотреть, что в проекте вообще есть. Обнаружился tslint, tsconfig с mode:strict, где подробно расписано, что нельзя, и package.json, внутри которого лежала команда на запуск тестов.

Раз конфигурация tslint есть, было бы отлично проверить код линтером. Я установила в VS Code плагин для tslint, и сразу пришло 3 ошибки - в файле extension.ts двух местах не хватало ";" и if без {} использовался.

Дальше можно прогнать prettier: в нескольких местах код криво отформатирован, используются разные варианты кавычек, нет единого стиля, а из-за этого страдает читабельность. Конфигурации для prettier в проекте нет, так что я взяла готовую из репозитория tinkoff (https://github.com/TinkoffCreditSystems/linters). 

#Приложение запустилось, но в окошке просто {{content}}
Похоже, что так работать не должно. Надо поискать, где должен подменяться content на нормальное содержимое и покопаться во внутренностях, чтобы найти, что сломалось. С помощью дебаггера VS Code дошла до функции updateContent. Внутри неё была регулярка, которая искала то, что нужно подменить в index.html, и замещала это на распаршенные значения. Но регулярка была сломана, т.к. там ожидались обязательные пробелы внутри {{}}. Если заменить + (поиск 1 или более символов) на * (поиск 0 или более символов) около \s.

Теперь html в panel webview правильная, но вместо {{content}} осталась просто пустота. Перепроверив, что html точно доходит до panel, посмотрела на style.css, там селектор неправильный. В html нет класса .div, так что скорее всего нужно просто div выбирать.

Но оказалось, что этого не достаточно. Попробовала локально вне VS запустить html + css - отображается. Почитала документацию, вот этот раздел особенно https://code.visualstudio.com/api/extension-guides/webview#loading-local-content, - там описано, что в vs нужен особый формат uri. Вот так работает:

const getMediaPath = (context: vscode.ExtensionContext, panel: vscode.WebviewPanel) => {
      return panel.webview.asWebviewUri(vscode.Uri.file(context.extensionPath)).toString() + '/';
};