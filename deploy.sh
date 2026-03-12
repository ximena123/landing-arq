#!/bin/bash

# ============================================
# Script de despliegue - Landing Arq
# ============================================
# Uso:
#   ./deploy.sh                              → Despliega cambios actuales
#   ./deploy.sh sitio-export-2026-03-12.zip  → Importa ZIP del admin y despliega
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Despliegue - Landing Arq${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Si se proporcionó un archivo ZIP
if [ -n "$1" ]; then
    if [ ! -f "$1" ]; then
        echo -e "${RED}  ✗ Archivo no encontrado: $1${NC}"
        exit 1
    fi

    EXT="${1##*.}"
    if [ "$EXT" = "zip" ]; then
        echo -e "${YELLOW}→ Importando ZIP exportado del admin...${NC}"

        # Crear carpeta temporal
        TEMP_DIR=$(mktemp -d)
        unzip -q "$1" -d "$TEMP_DIR"

        # Copiar content.json
        if [ -f "$TEMP_DIR/content.json" ]; then
            cp "$TEMP_DIR/content.json" public/data/content.json
            echo -e "${GREEN}  ✓ content.json actualizado${NC}"
        fi

        # Copiar imágenes subidas
        if [ -d "$TEMP_DIR/img" ]; then
            cp -r "$TEMP_DIR/img/"* public/img/
            echo -e "${GREEN}  ✓ Imágenes copiadas a public/img/${NC}"
        fi

        rm -rf "$TEMP_DIR"

    elif [ "$EXT" = "json" ]; then
        echo -e "${YELLOW}→ Importando content.json...${NC}"
        cp "$1" public/data/content.json
        echo -e "${GREEN}  ✓ content.json actualizado${NC}"
    else
        echo -e "${RED}  ✗ Formato no soportado. Usa .zip o .json${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}→ Sin archivo, desplegando cambios actuales${NC}"
fi

# Verificar que hay cambios
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo ""
    echo -e "${YELLOW}  No hay cambios para desplegar.${NC}"
    exit 0
fi

# Mostrar resumen
echo ""
echo -e "${YELLOW}→ Cambios detectados:${NC}"
git status --short
echo ""

# Confirmar
read -p "¿Desplegar estos cambios? (s/n): " confirm
if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo -e "${RED}  Cancelado.${NC}"
    exit 0
fi

# Commit y push
echo ""
echo -e "${YELLOW}→ Creando commit...${NC}"
git add -A
git commit -m "Actualización de contenido - $(date '+%Y-%m-%d %H:%M')"

echo -e "${YELLOW}→ Subiendo a GitHub...${NC}"
git push origin main

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Desplegado correctamente${NC}"
echo -e "${GREEN}  El sitio se actualizará en 2-3 min${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
