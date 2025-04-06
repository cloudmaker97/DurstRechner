# Der Durstrechner

Der Durstrechner ist eine einfache Webanwendung, die den Getränkeverkauf bei Veranstaltungen unterstützt. 
Die Anwendung ermöglicht das einfache Rechnen von Bestellsummen für eine diverse Getränkeauswahl. Die Anwendung
ist auch offline verfügbar und kann ohne Internetverbindung genutzt werden (Service-Worker). Für die erstmalige
Einrichtung wird eine Internetverbindung empfohlen (das einmalige Aufrufen der Seite im Browser mit einer Internetverbindung 
genügt).

![preview.png](.github/screenshots/preview.png)

> Weitere Screenshots sind im Ordner `.github/screenshots` zu finden.

## Anleitung und Hinweise

- Die Anwendung ist unter <https://cloudmaker97.github.io/DurstRechner> erreichbar.
- Die Anwendung kann auch lokal genutzt werden. Dazu einfach die Startseite einmal im Browser öffnen.
- Neue Produkte können im Bereich 'Einstellungen' hinzugefügt werden, Produktbilder sollten im Format 1:1 sein und idealerweise 150x150px.
- Die angelegten Produkte können auf andere Geräte übertragen werden in den Einstellungen. Einfach den Text aus dem Feld Export/Import entweder herauskopieren oder einfügen.

## Entwicklung und Installation

```bash
# Installieren der Abhängigkeiten
pnpm install

# Startet den Entwicklungsserver
npx http-server -o . 
```

