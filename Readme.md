# Создание портлета Liferay 7.0 с использованием React JS Версия 2.0

### 1. Установка компонентов Liferay
Для создания правильного каркаса портлета требуется установить специальный компонент от Liferay.
Для этого переходим на сайт  [Liferay Portal IDE](https://sourceforge.net/projects/lportal/files/Liferay%20IDE/ "Liferay Portal IDE") (либо скачиваем из архива со всеми требуемыми программами из архива релиза [Dop.Soft.zip](https://github.com/Allorion/liferay-react-portlet/releases "GIT ZIP") может быть уже устаревшей версией), выбираем файл подходящий под вашу операционную систему и скачиваем его.
Перейдем к установке (Windows):
1. Выбираем установленную версию Java JDK;  
   ![](Manual/1readme.png "Версия Java JDK")
2. Устанавливаем желаемое расположения каталога с коммандером (запоминаем путь);  
   ![](Manual/2readme.png "Выбор каталога")
3. Ставим версию Portable Community;  
   ![](Manual/3readme.png "Выбор пакета")
4. Далее выбираем версию Liferay;  
   ![](Manual/4readme.png "Версия IDE")
5. Если есть прокси можем их установить.  
   ![](Manual/5readme.png "Прокси")

Сразу добавляем папку `liferay-workspace` в директорию Path. Если этого не сделать, то будет появляться ошибка gradlew.

### 2. Создание каркаса портлета
Переходим в директорию, куда установили компонент Liferay. Далее перемещаемся в папку `wars`. Именно здесь мы будем создавать новые портлеты. Запускаем `cmd` и вписываем команду:
```sh
blade create -t war-mvc-portlet -v 7.0 -p ru.allorion.portlet -c AllorionMvcPortlet allorion-mvc-portlet-project
```
где
- `blade create` - внутренняя команда Liferay для создания портлетов;
- `-t war-mvc-portlet` - выбор желаемого шаблона портлета;
- `-p ru.allorion.portlet` - путь до исполняемых файлов Java;
- `my-mvc-portlet-project` - название папки портлета, а т.ж название отображаемого портлета в списке портлетов Liferay.
- `AllorionMvcPortlet` - "Allorion" меняем на свое название

> Обращаю внимание, для корректной работы портлета на Liferay 7.0 требуется использовать именно .war архив с портлетом и именно mvc. Иначе портлет попросту не будет работать.

### 3. Настройка портлета для работы с React JS

##### 3.1. Импорт Gradle в проект
Проект создался с базовым функционалом и без всякого мусора. Теперь для полноценной работы требуется добавить в прпоект Gradle (Если он отсутствует на PC сначала устанавливаем его и прописываем в Path `ставим новую версию`). После установки Gradle переходим в корневую директорию проекта, удаляем файл `build.gradle` и вызываем консоль. Добавим Gradle в проект:

```sh
gradlew init
```

Далее выбираем следующие настройки `basic`, `Groovy`, `дефолтное название проекта`.

##### 3.2. Обновление зависимостей Liferay

Перейдем к обновлению зависимостей Liferay для функционирования портлета. Открываем в любом редакторе кода (IDE) файл `build.gradle` и вставляем следующий код:

```gradle
buildscript {
    repositories {
        maven {
            url "https://cdn.lfrs.sl/repository.liferay.com/nexus/content/groups/public"
        }
    }

    dependencies {
        classpath group: "com.liferay", name: "com.liferay.gradle.plugins.css.builder", version: "latest.release"
        classpath group: "com.liferay", name: "com.liferay.gradle.plugins.node", version: "latest.release"
    }
}

apply plugin: "com.liferay.css.builder"
apply plugin: "war"
apply plugin: "com.liferay.node"

dependencies {
    compileOnly group: "com.liferay.portal", name: "com.liferay.portal.kernel", version: "latest.release"
    compileOnly group: "javax.portlet", name: "portlet-api", version: "latest.release"
    compileOnly group: "javax.servlet", name: "javax.servlet-api", version: "latest.release"
    cssBuilder group: "com.liferay", name: "com.liferay.css.builder", version: "latest.release"
    compileOnly group: "org.osgi", name: "org.osgi.service.component.annotations", version: "latest.release"
    compileOnly group: "com.liferay.portal", name: "com.liferay.util.taglib", version: "latest.release"
    compileOnly group: "jstl", name: "jstl", version: "latest.release"
}

repositories {
    mavenLocal()
    maven {
        url "https://cdn.lfrs.sl/repository.liferay.com/nexus/content/groups/public"
    }
}

war {
    dependsOn buildCSS
    exclude "**/*.scss"

    filesMatching("**/.sass-cache/") {
        it.path = it.path.replace(".sass-cache/", "")
    }

    includeEmptyDirs = false
}

task deleteIndexFile(type: Delete) {
    delete "${rootDir}/src/main/webapp/js/index.html"
}

task cleanJsDir(type: Delete) {
    delete "${rootDir}/src/main/webapp/js/"
}

war {
    dependsOn deleteIndexFile
}

clean {
    dependsOn cleanJsDir
}
```

Для проверки зависимостей можем прописать в консоль:
```ssh 
gradlew build
```

Если проект собрался переходим к следующему шагу. Иначе проверяем правильную установку всего доп софта и Path, либо вытаскиевам данные из ошибки в консоле.

##### 3.3. Добавляем зависимости React Js, а т.ж. модули для его компиляции
Создадим в корневом каталоге файл `package.json`, добавляем следующий код:

```json
{
  "name": "react-front",
  "version": "1.0.0",
  "description": "MVC Portlet with React JS and Webpack",
  "devDependencies": {
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-polyfill": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "css-loader": "^0.28.4",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.30.1",
    "liferay-npm-bundler": "^2.13.3",
    "path": "^0.12.7",
    "style-loader": "^0.18.2",
    "url-loader": "^0.5.9",
    "webpack": "^3.5.0",
    "bootstrap": "^4.6.1",
    "react-bootstrap": "^2.1.1"
  },
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Allorion/liferay-react-portlet.git"
  },
  "author": "allorion.ru",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.25.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "rgbcolor": "^1.0.1",
    "bootstrap": "^4.6.1",
    "react-bootstrap": "^2.1.1"
  }
}
```

Устанавливаем модули с помощью `npm install`

##### 3.4. Создаем автоматическую компоновку проекта

Создадим в корневом каталоге проект новый файл `webpack.config.js` и вставляем следующий код:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SRC = path.resolve(__dirname, 'app');
const DEST = path.resolve(__dirname, 'src/main/webapp/js');

module.exports = exports;

const NAME_PORTLET = "index";

module.exports = {
    entry: {
        app: SRC + '/' + NAME_PORTLET + '.jsx'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
        path: DEST,
        filename: NAME_PORTLET + '.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: SRC,
                use: ['babel-loader'],
                exclude: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.(css|scss)$/,
                loader: "style-loader!css-loader"
            },
            {test: /\.(s[ca]ss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader', {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    "postcss-preset-env",
                                    {
                                        // Options
                                    },
                                ],
                            ],
                        },
                    },
                }]
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=application/font-woff']},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=application/octet-stream']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ['file']},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=image/svg+xml']}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};
```

> В NAME_PORTLET = "index" указывается не только название .jsx файла с кодом приложения, но и также название скомпилированного кода в обычный JS. Далее это будет более подромно рассмотрено.

Дабы не было ошибок при обработке синтаксиса реакта добавим файл `.babelrc` в корневую директорию. Добавим в него следующий код:

```
{
  presets: ['es2015', 'stage-0', 'react']
}
```

##### 3.5. Добавление простейшего кода React JS

В корне проекта создаем папку app. В нее помещаем один файл `index.html` и файл `index.jsx`.

`index.html`

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>React Home Page static Test</title>
    <style></style>
</head>
<body>
<div id="input"></div>
</body>
</html>
```

> В блоке `div` в `id=input` указываем такой id чтобы в дальнейшем указать его в приложении реакта. Именно в этот блок React будет передавать компоненты.

Теперь добавим файл `index.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom';


function Welcome(props) {
    return <h1>Привет, {props.name}</h1>;
}

const element = <Welcome name="Алиса" />;

ReactDOM.render(
    element,
    document.getElementById('input')
);
```

Для примера был выбран элементарный скрипт написанный на React JS. Не забудьте добавить файл `.babelrc` иначе портлет собираться не будет.

##### 3.6. Настройка вывода шаблонов React JS

После добавления первого компонента React, Liferay надо указать на расположение компонентов и прописать настройки, дабы он смог отобразить их на экране. Открываем следующий файл `\src\main\webapp\view.jsp`. Здесь мы указываем `div` с id `input` (сноска из пункта 3.5). В теге скрипт указываем `src="<%=request.getContextPath()%>/js/index.js"`, где index.js - это файл расширения `js` генерирующийся после компиляции jsx и tsx кода для работы на сервере (сноска в пункте 3.4)

Имя переменной (в примере `allorionMvcPortlet`) меняем на свое указанное при создании каркаса портлета (пункт 2 "AllorionMvcPortlet")

Пример полного кода файла

```jsp
<%@ include file="init.jsp" %>

<div id="input"></div>
<script src="<%=request.getContextPath()%>/js/index.js"></script>

<portlet:resourceURL var="downloadURL">
    <portlet:param name="file_id" value="id" />
    <portlet:param name="p_p_resource_id" value="downloadFile" />
</portlet:resourceURL>

<script>
    var allorionMvcPortlet = {
        portletNamespace : '<portlet:namespace />',
        downloadFullURL: '${downloadURL}'
    };
</script>
```

### 4. Deploy portlet

Все настройки портлета выполнены. Для сборки открываем консоль в корне портлета и выполняем следующую команду:
```ssh
gradlew clean build
```

Gradle собирает проект в `war` архив, который уже сейчас можно выгрузить на сервер и увидеть результат. На экране отобразится надпись Привет, Алиса.
Данный способ позволяет создать портлет и добавить в него не сложное React приложение. Я не советую таким образом проводить разработку, т.к. запуск самого реак приложения из портлета произвести не возможно и придется отдельно разрабатывать приложение и потом его добавлять в портлет и заново собирать. Для облегчения технологии разработки и сборки портлета требуется выполнить действия описанные в пункте 5 и далее.

### 5. Создание React приложения и импорт его в портлет.

#### 5.1. Создание React приложения.
Если вы только начали разработку и у вас еще нет React приложения, то выполняем действия из этого пункта, если же вы уже создали приложение, то переходим к следующему пункту.

Для создания React приложения можно воспользоваться автоматическими сборщиками к примеру встроенный в WebStorm. Для примера воспользуемся командой

```sh
npx create-react-app my-app --template typescript
```
где `my-app` название приложения.

> В данной инструкции описан способ сборки портлета с приложением React написанном на TypeScript. Для сборки обычного проекта придется поменять некоторые настройки в пунктах далее.

#### 5.2. Настройка приложения.
После создания приложения либо если у вас уже есть готовое приложение, которое требуется сделать портлетом, выполним настройку.

Первым делом добавим в корень приложения созданный в пункте 4 портлет (архив с расширением .war).
Теперь создадим в корне приложения файл `webpack.config.js`. В нем будут находиться все настройки для сборки проекта.

```js
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(?:|gif|png|jpg|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return 'img/[name][ext]'
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'js'),
    },
};
```
> В пятой строке (entry: './src/index.tsx') указан путь до родительского файла приложения, то место, где указан (root.render). Хочу напомнить, дабы в портлете отображались компоненты реакта указываем в `document.getElementById` тот id что указывали в пункте 3.5. Также в строке `filename: 'index.js'` указываем название файла такоеже как в пункте 3.4.

В данном коде придусмотрена сборка не только файлов с кодом приложения, но и также файлов статики (картинки, стили и т.д.).

Далее переходим в файл `package.json`. В нем указаны все модули, которые использует React. Для того чтобы React мог собрать все компоненты в один файл и всю статику требуется добавить некоторые модули:

```json
"dependencies": {
"webpack": "^5.73.0",
"webpack-cli": "^4.10.0",
"ts-loader": "^9.3.1",
},
"devDependencies": {
"file-loader": "^6.2.0",
"url-loader": "^4.1.1"
}
```

> В примере приведены последние версии на момент написания инструкиции. Поэтому советую прописывать новые.

Далее в объекте `scripts` меняем поле `build`:

```json
"scripts": {
"start": "react-scripts start",
"build": "webpack",
"test": "react-scripts test",
"eject": "react-scripts eject"
},
```

### 6. Сборка приложения и выгрузка портлета.

#### 6.1. Сборка приложения.

Для сборки в ручном режиме воспользуемся следующей командой:

```sh
npm run build
```

> В пункте 7 рассмотрим автоматизацию.

#### 6.2. Выгрузка портлета.

После сборки приложения в корне появляется папка `js` ее требуется перенести со всем содержимым в архив `.war`, заменив в нем находящуюся.

После проделанных действий портлет готов и может быть загружен на сервер.

### 7. Автоматизация сборки и выгрузки портлета.

Автоматизация производится после выполнения всех выше изложенных пунктов.
Для нее необходимо создать в корне приложения React новый файл `deploy.bat`:

```bat
@echo off
rem Сборка проекта
call npm run build
rem Сохранение собраного проекта в war архив (Не забываем добавить jdk в path иначе работать не будет)
jar uvf allorion-react-portlet.war js\
rem Сохраняем портлет на сервер
scp allorion-react-portlet.war ip@777.777.777.777:/favr/liferay-ce-portal-7.0-ga4/deploy
pause
```

1. `allorion-react-portlet.war` портлет;
2. `ip@777.777.777.777:/favr/liferay-ce-portal-7.0-ga4/deploy` ip сервера и путь до папки с портлетами. (В данном случае используется автоматическая папка в которую помещаются портлеты, а она сама их распределяет)

Для сборки проекта требуется правильно установленный jdk он находится в первом пункте в архиве. Далее добавляем его в директорию Path (Пример `C:\Program Files\Java\jdk1.8.0_311\bin`). Также в переменные среды пользователя добавляем новую переменную `JAVA_HOME` и ее значение `C:\Program Files\Java\jdk1.8.0_311`.

Для автоматической отправки на сервер с Liferay требуется сгенерировать и добавить на сервер ssh ключи. Пользуясь Windows выполняем следующие действия:

Открываем терминал от имени администратора. Далее поочередно прописываем команды написанные снизу.

```sh
ssh-keygen
```

После применения данной команды консоль попросит ввести пароль для ключа. Пароль нам не требуется, поэтому просто нажимаем enter, также поступаем с другими вопросами.

Для работы ssh протокола на Win требуется включить ssh агент:

```sh
Get-Service ssh-agent | Set-Service -StartupType Manual
```
```sh
Start-Service ssh-agent
```

Добавим созданный ssh key в ssh-agent (путь указывается после создания)

```sh
ssh-add "C:\Users\user\.ssh\id_rsa"
```

Далее требуется добавить созданный ключ на сервер. Для этого открываем файл `id_rsa.pub` и копируем содержимое, заходим на сервер и переходим по пути хранения ключей ssh (пример `/home/favr/.ssh/`), добавляем скопированное содержимое в файл `authorized_keys`, если его нет, то создаем.

### 8. Немного о главном

- Не путайте названия родительских файлов. Что в портлете, что в приложении они должны быть одинаковые иначе работать не будет;
- Перед выгрузкой добавляем jdk в Path (jdk/bin) иначе работать НЕ будет;
- Запускаем deploy.bat либо через консоль, либо левой кнопкой мыши;
- В deploy.bat менять можно только названия файлов и папок. Папка с собраным проектом React JS сделана специально с таким названием, как папка в портлете (js), если измените то скрипт будет сохранять файл в другую папку в war архиве, и портлет работать не будет
- Если не работает ssh на Windows можете ознакомиться со статьей в блоке "ССылки".
---
###### Ссылки:

* [Git разработчика](https://github.com/Allorion)
* [Сайт разработчика](https://allorion.ru)
* [Liferay Portal IDE](https://sourceforge.net/projects/lportal/files/Liferay%20IDE/)
* [Liferay](https://www.liferay.com/)
* [React JS](https://reactjs.org/)
* [Настройка SSH-Agent Windows]( https://docs.microsoft.com/ru-ru/windows-server/administration/openssh/openssh_keymanagement)

@by Allori 2022
