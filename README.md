# SO Final CI/CD

[![CI Pipeline](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/ci-pipeline.yml)
[![Security Scan](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/security-scan.yml/badge.svg)](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/security-scan.yml)
[![Release](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/release.yml/badge.svg)](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/release.yml)
[![Deploy to Vercel](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/andresedu1996/so-final-ci-cd/actions/workflows/deploy-vercel.yml)

Proyecto final de la asignatura de Sistemas Operativos. Integra CI/CD, runners multi-plataforma, gestión de procesos, sistema de archivos, contenedores, deploy continuo y seguridad de dependencias. La aplicación se despliega automáticamente en Vercel mediante GitHub Actions.

## 1. Descripción
Aplicación **Node.js + Express** que:
- Expone rutas `/`, `/info` y `/env`
- Muestra información del sistema operativo y entorno de ejecución
- Genera logs y archivos en el sistema de archivos
- Incluye tests unitarios con Jest y Supertest
- Se ejecuta en matriz de 3 SO en CI/CD: Ubuntu, Windows y macOS

Incluye un pipeline completo con:
- CI multi-plataforma
- Security Scan
- Releases automáticos por tags
- Deploy automático a producción en Vercel
- Rollback usando `git_ref`

## 2. Instrucciones de ejecución local
1) Instalar dependencias  
```bash
npm install
```
2) Ejecutar la aplicación  
```bash
npm start
```
Abrir en: http://localhost:3000

3) Ejecutar tests  
```bash
npm test
```
Cobertura:  
```bash
npm run test:coverage
```

## 3. Estructura del proyecto
```
so-final-ci-cd/
├─ src/
│  ├─ app.js          # Lógica de la app
│  ├─ server.js       # Servidor Express
│  └─ logger.js       # Logs en sistema de archivos
├─ logs/
├─ __tests__/         # Pruebas unitarias
├─ .github/workflows/ # Pipelines CI/CD
│  ├─ ci-pipeline.yml
│  ├─ security-scan.yml
│  ├─ release.yml
│  └─ deploy-vercel.yml
├─ package.json
└─ README.md
```

## 4. Endpoints principales
| Ruta | Descripción |
| --- | --- |
| `/` | Muestra info del sistema (SO, CPU, Node, hostname) |
| `/info` | Devuelve info del sistema en JSON |
| `/env` | Devuelve variables de entorno como `NODE_ENV` y `VERSION` |

## 5. Workflows explicados
- **CI Pipeline (`ci-pipeline.yml`)**: matriz `ubuntu-latest`, `windows-latest`, `macos-latest`; instala dependencias específicas por OS; corre tests; genera cobertura y sube artifacts; garantiza compatibilidad en 3 SO.
- **Security Scan (`security-scan.yml`)**: `npm audit`; revisión de permisos (`ls -l` en Linux/macOS, `icacls` en Windows); genera artifact JSON.
- **Release automático (`release.yml`)**: se ejecuta con tags `vX.Y.Z`; corre tests, crea `dist`, genera un Release en GitHub y sube artefactos.
- **Deploy automático (`deploy-vercel.yml`)**: deploy a producción con `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`; rollback vía `git_ref` (sha o tag).

## 6. Conceptos de SO aplicados
Runners como VMs efímeras, procesos en segundo plano y Node, sistema de archivos (logs, temporales), variables de entorno, permisos (POSIX vs ACL), contenedores (fases previas).

## 7. Despliegue
Producción (Vercel): `<coloca aquí tu URL de producción>`

## 8. Contribución
Pull requests son bienvenidos para revisión.

## 9. Autor
Andrés López Alfaro — Proyecto final de Sistemas Operativos (Pipeline CI/CD multi-plataforma).
