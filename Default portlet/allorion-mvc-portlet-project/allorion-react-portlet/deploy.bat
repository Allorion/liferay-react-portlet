@echo off
rem Сборка проекта
call npm run build
rem Сохранение собраного проекта в war архив (Не забываем добавить jdk в path иначе работать не будет)
jar uvf allorion-react-portlet.war js\
rem Сохраняем портлет на сервер
scp allorion-react-portlet.war favr@777.777.777.777:/favr/liferay-ce-portal-7.0-ga4/deploy
pause