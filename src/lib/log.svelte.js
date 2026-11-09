// One row per `beforeNavigate` call. Module state, so the log survives leaving the editor.
/** @type {Array<{ type: string, to: string, result: 'cancelled' | 'allowed' }>} */
export const log = $state([]);
