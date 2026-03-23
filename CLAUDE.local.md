# CLAUDE.local.md — Reglas de trabajo

> ⛔ REGLAS ABSOLUTAS. Sin excepciones. No omitir pasos.
> Solo preguntar cuando el impacto sea crítico e irreversible. Todo lo demás → actuar con criterio.

## Stack
- Angular + TypeScript estricto
- GitLab (control de versiones)
- Jira via MCP Atlassian (gestión de tareas)

## Comandos
Antes de ejecutar CUALQUIER comando: leer `package.json` y usar `npm run [script]`. Si no existe un script → informar, NO inventar.

---

## REGLAS PERMANENTES (aplicar SIEMPRE)

### ALCANCE: solo tocar lo que el ticket pide
Antes de modificar un archivo preguntarse:
1. ¿El ticket lo menciona? No → NO tocarlo
2. ¿Afecta otros flujos? Sí → evaluar impacto primero
3. ¿Se justifica con un criterio de aceptación? No → NO hacerlo

Bug detectado fuera del ticket → mencionarlo al final, NO corregirlo.
Impacto crítico fuera del ticket → avisar UNA vez. Impacto menor → proceder sin preguntar.

### PROHIBIDO reformatear
No reformatear código no relacionado con la tarea: imports, comillas, indentación, variables, líneas en blanco, renombramientos. Linter falla en archivo no relacionado → informar, NO corregir.

### ARCHIVOS INTOCABLES (salvo que el ticket lo pida explícitamente)
`angular.json`, `tsconfig*.json`, `package.json`, `package-lock.json`, `environment*.ts`, `app-routing.module.ts`, `app.module.ts`, `styles.scss`, archivos de CI/CD.

### BUENAS PRÁCTICAS ANGULAR (aplicar en TODO código nuevo/modificado)
- Cero `any` → siempre interfaces/tipos. Nunca `as any`
- Tipado explícito en parámetros y retornos
- `interface` para datos, `type` para uniones/alias
- `readonly` en propiedades inmutables
- Componente = solo presentación y eventos. Lógica → servicio
- Inputs/Outputs tipados, nunca `any`
- Desuscribir Observables: `takeUntilDestroyed` o `async pipe`
- No llamar HTTP desde componente → usar servicio
- Un servicio = un dominio. No crear duplicados
- `catchError` en TODAS las llamadas HTTP
- No importar módulos no usados. Verificar duplicados antes de añadir
- Estilos en `.scss` del componente. No tocar `styles.scss` global
- No usar `!important` salvo que sea inevitable y justificado

---

## FLUJO OBLIGATORIO — 4 FASES

> ⛔ INSTRUCCIÓN CRÍTICA: Siempre anunciar la fase actual antes de ejecutarla.
> Formato: "▶ FASE X — [nombre]"
> No saltar fases. No avanzar con pendientes.

---

### FASE 1 — Análisis

**Trigger:** el desarrollador pega un link de Jira, dice "tengo esta tarea", o da un ticket key.

**Ejecutar en este orden:**
1. Leer ticket COMPLETO via MCP Atlassian
2. Leer TODOS los adjuntos (JSONs, imágenes, documentos). Si no se puede leer uno → pedirlo antes de continuar
3. Identificar criterios de aceptación
4. Identificar archivos a tocar y archivos/flujos que NO se deben tocar
5. Dudas menores → resolver con criterio. Solo preguntar si es CRÍTICO y sin respuesta en ticket/adjuntos

**Output obligatorio de Fase 1:**
```
▶ FASE 1 — Análisis

📋 Tarea: [KEY] — [título]

📎 Adjuntos revisados:
  - [archivo]: [contenido]

🎯 Criterios de aceptación:
  1. [criterio]

✏️ Archivos a tocar:
  - [archivo] — motivo: [criterio X]

🚫 NO tocaré:
  - [módulo/flujo]
```

Después del output → arrancar FASE 2 inmediatamente. No esperar confirmación salvo duda crítica.

---

### FASE 2 — Desarrollo

**Inicia automáticamente después de Fase 1.**

Reglas durante desarrollo:
- Cada cambio debe corresponder a un criterio de aceptación
- Solo tocar archivos listados en Fase 1. Si se necesita otro por necesidad técnica → hacerlo y mencionarlo en Fase 3
- Verificar responsividad en componentes modificados: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Si algo sale mal → informar inmediatamente. NO intentar arreglarlo tocando otros archivos

---

### FASE 3 — Revisión final

**Trigger:** el desarrollador dice "ya terminé", "revisa", "listo", "terminé", "ya acabé".

**Ejecutar:**
1. Revisar cada criterio de aceptación vs implementación
2. Verificar adjuntos contemplados
3. Listar archivos modificados
4. Verificar flujos no afectados
5. Ejecutar build y lint (scripts del package.json)

**Output obligatorio de Fase 3:**
```
▶ FASE 3 — Revisión final

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 REVISIÓN FINAL — [KEY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITERIOS DE ACEPTACIÓN:
✅/❌ [criterio] → [archivo]

ADJUNTOS CONTEMPLADOS:
✅/❌ [adjunto] → [cómo se usó]

ARCHIVOS MODIFICADOS:
  - [archivo]

FLUJOS NO AFECTADOS:
✅/⚠️ [flujo]

RESPONSIVIDAD:
✅/❌ Mobile | ✅/❌ Tablet | ✅/❌ Desktop

BUILD Y LINT:
✅/❌ build | ✅/❌ lint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- ❌ pendiente → resolver antes de continuar
- ⚠️ crítico → mencionarlo. ⚠️ menor → continuar
- Todo ✅ → "Listo para push."

---

### FASE 4 — Post-push y cierre en Jira

**Trigger:** el desarrollador dice "ya hice push", "ya subí", "ya lo subí", "ya pusheé".

**Ejecutar en este orden:**
1. `git rev-parse --abbrev-ref HEAD` → rama
2. `git log -5 --pretty=format:"%h|%s"` → commits
3. `git diff --name-status main...HEAD` → archivos cambiados
4. Si no mencionó el tiempo → preguntar UNA vez: "¿Cuánto tardaste? (ej: 2h)"
5. Via MCP Atlassian, en este orden exacto:
   a. Obtener estados disponibles del ticket
   b. Registrar tiempo en worklog
   c. Publicar comentario (formato abajo)
   d. Mover ticket al estado de revisión

**Formato comentario Jira:**
```
✅ *Implementación completada*

[2-3 líneas explicando QUÉ se hizo en lenguaje claro. Sin nombres de archivos ni líneas de código. Si se usaron adjuntos, mencionarlo.]

---
🌿 *Rama:* `[rama]`
⏱ *Tiempo trabajado:* [Xh Ym]
📅 *Fecha:* [fecha]
```

**Output obligatorio de Fase 4:**
```
▶ FASE 4 — Cierre

✅ [KEY] cerrado:
   ⏱ Tiempo registrado: [Xh Ym]
   💬 Comentario publicado
   🔀 Estado: [anterior] → [nuevo]
   🌿 Rama: [rama]
```

---

## RECORDATORIO DE FASES (consultar si hay duda)

| Fase | Trigger | Qué hacer |
|------|---------|-----------|
| 1 | Link Jira / "tengo tarea" | Analizar ticket + adjuntos → output análisis → iniciar Fase 2 |
| 2 | Automático tras Fase 1 | Codear según criterios. Solo archivos listados |
| 3 | "ya terminé" / "revisa" / "listo" | Checklist completo + build + lint |
| 4 | "ya subí" / "ya hice push" | Git info + Jira: worklog, comentario, transición |
