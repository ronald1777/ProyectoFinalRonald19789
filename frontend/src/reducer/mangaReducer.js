export const estadoInicial = {
  lista:           [],
  filtroCategoria: 'todas',
  filtroEstado:    'todos',
  busqueda:        '',
  historial:       [],
};

export function mangaReducer(state, action) {
  switch (action.type) {
    case 'HIDRATAR':
      return { ...state, lista: action.payload };
    case 'AGREGAR':
      return { ...state, lista: [...state.lista, action.payload] };
    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.map((m) =>
          m.id === action.payload
            ? { ...m, activo: false, fechaActividad: new Date().toISOString() }
            : m
        ),
      };
    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map((m) =>
          m.id === action.payload.id
            ? { ...m, estado: action.payload.estado, fechaActividad: new Date().toISOString() }
            : m
        ),
      };

    case 'FILTRAR':
      return { ...state, ...action.payload };

    case 'LIMPIAR_FILTROS':
      return { ...state, filtroCategoria: 'todas', filtroEstado: 'todos', busqueda: '' };

    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...state,
        historial: [
          ...state.historial,
          {
            fecha: new Date().toISOString(),
            tipo: action.payload.tipo,   // 'agregar' | 'editar' | 'archivar'
            mangaId: action.payload.id,
          },
        ],
      };

    default:
      return state;
  }
}
