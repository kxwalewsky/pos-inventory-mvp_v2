# Naprawa budowania .exe na GitHub Actions

Poprawka dodaje wymagany folder ikon Tauri:

```text
src-tauri/icons/icon.ico
src-tauri/icons/32x32.png
src-tauri/icons/128x128.png
src-tauri/icons/128x128@2x.png
```

Błąd `icons/icon.ico not found` oznaczał, że Tauri nie miało ikony Windows potrzebnej do utworzenia zasobów pliku `.exe`.

Dodatkowo workflow używa `npm install` zamiast `npm ci`, żeby budowanie działało także wtedy, gdy w repozytorium nie ma jeszcze `package-lock.json`.
