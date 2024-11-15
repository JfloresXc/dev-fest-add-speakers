# 🎤 Speaker Manager

**Speaker Manager** es un proyecto desarrollado con Node.js que permite gestionar **speakers** y sus imágenes. Este proyecto está compuesto por tres scripts principales que se ejecutan de forma independiente:

1. `postImages.js`: Sube imágenes al sistema.
2. `postSpeakers.js`: Agrega nuevos speakers.
3. `updateImagesInSpeakers.js`: Asigna imágenes a los speakers existentes.

---

## 🛠️ Requisitos Previos

Asegúrate de tener lo siguiente instalado antes de comenzar:

- **Node.js** (versión 14 o superior).
- Un entorno configurado con los archivos necesarios (imágenes y datos JSON).

---

## 🚀 Uso

Cada archivo JS es un script ejecutable que realiza una acción específica. Puedes ejecutarlos directamente desde la terminal usando **Node.js**.

### 1️⃣ **Subir Imágenes**: `postImages.js`

Este script carga imágenes en el sistema y genera un identificador único para cada una.

#### Ejecución:
```bash
node postImages.js
```

### 2️⃣ **Subir Speakers**: `postSpeakers.js`

Este script carga speakers en el sistema.

#### Ejecución:
```bash
node postSpeakers.js
```

### 3️⃣ **Asignar imagenes a speakers**: `updateImagesInSpeakers.js`

Este script asignar imagenes a speakers en el sistema.

#### Ejecución:
```bash
node updateImagesInSpeakers.js
```



