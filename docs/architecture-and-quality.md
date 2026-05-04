# Arquitectura y calidad

## Patrones de software

- MVC: las vistas viven en `src/components` y `src/app`; la logica de negocio del
  semaforo esta en `src/lib/strategies` y `src/lib/liquidity`; el acceso a datos
  queda separado en `src/lib/repositories`.
- Repositorio: `FinancialRepository` centraliza lectura de categorias, canales y
  movimientos. Hay implementacion demo y Supabase.
- Strategy: `LiquidityAlertStrategy` permite cambiar umbrales de liquidez y
  categorias de costos fijos sin tocar las vistas.

## Cobertura funcional del flujo

- Tesoreria carga datos reales o proyectados en `/treasury`.
- El sistema integra datos mediante el repositorio financiero.
- El dashboard compara proyectado vs real por categoria y canal.
- Las desviaciones mayores al 15% se resaltan en rojo.
- El semaforo calcula OK, Riesgo o Critico.
- El motor de notificaciones prepara alertas proactivas Amarillo/Rojo.
- El grafico de tendencia anticipa faltantes a 15 dias.

## Factores criticos de exito

- Visibilidad tecnica total: la tabla de desviaciones cubre canales Mayorista y
  Minorista, agrupados por categoria.
- Precision de alertas: Rojo se activa solo cuando el saldo real no cubre costos
  fijos prioritarios; Amarillo cuando la cobertura proyectada queda bajo 1.0.
- Rendimiento: el dashboard usa SSR para datos y carga diferida de graficos para
  sostener render inicial bajo 3 segundos en condiciones normales.
- Validacion de datos: UI, RLS, FK y `check (amount > 0)` impiden montos negativos
  y categorias/canales no autorizados.
- Alcance: el prototipo implementa US 01, US 02 y US 04 sin agregar modulos fuera
  del alcance definido.
