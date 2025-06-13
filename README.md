# Nutripae Frontend

Frontend para el proyecto Nutripae desarrollado con React, TypeScript y Bun.

## Consideraciones:

Este proyecto usa las mejores practicas descritas para react, basandonos en bulletproof-react:

https://github.com/alan2207/bulletproof-react

Ademas usamos varias liberias de tanstack:

[TanStack](https://tanstack.com/)

Los mock-ups de la UI se encuentran en el [este figma](https://www.figma.com/design/T6WP7qQgVaSKohQk1IvUAp/NUTRIPAE?node-id=0-1&t=OCK4xCBX2xGKYpG5-1)


## Requisitos Previos

- [Bun](https://bun.sh/) (versión 1.0.0 o superior)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd nutripae-frontend
```

2. Instala las dependencias usando Bun:
```bash
bun install
```

## Scripts Disponibles

- `bun run dev` - Inicia el servidor de desarrollo
- `bun run build` - Construye la aplicación para producción
- `bun run preview` - Previsualiza la versión de producción localmente
- `bun run lint` - Ejecuta el linter
- `bun test` - Ejecuta los tests
- `bun run release` - Genera una nueva versión siguiendo semantic versioning

## Convenciones de Commits

Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/) para los mensajes de commit. Los commits deben seguir el siguiente formato:

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]
```

Tipos de commit permitidos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios que no afectan el significado del código
- `refactor`: Cambios que no arreglan bugs ni añaden funcionalidades
- `perf`: Cambios que mejoran el rendimiento
- `test`: Añadir o corregir tests
- `chore`: Cambios en el proceso de build o herramientas auxiliares

## Estructura del Proyecto

```
nutripae-frontend/
├── src/              # Código fuente
│   ├── __tests__/   # Tests
│   └── ...
├── public/          # Archivos estáticos
├── .husky/         # Hooks de git
└── ...
```

## Configuración de Desarrollo

El proyecto utiliza:
- ESLint para linting
- Jest para testing
- Husky para git hooks
- Commitlint para validación de mensajes de commit

## Contribución

1. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Haz commit de tus cambios (`git commit -m 'feat: add some amazing feature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
