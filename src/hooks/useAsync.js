import { useCallback, useEffect, useState } from "react";

/**
 * Executa uma função assíncrona (normalmente uma chamada à API) e acompanha o resultado.
 *
 *   const { data, error, loading, reload } = useAsync(
 *     (signal) => listRepositories({ signal }),
 *     []                      // dependências: refaz a chamada quando mudarem
 *   );
 *
 * - A função recebe um AbortSignal: a chamada é cancelada ao sair da página ou trocar as dependências.
 * - Respostas antigas são descartadas (nunca sobrescrevem uma chamada mais nova).
 * - `reload()` repete a chamada mantendo os dados atuais na tela enquanto carrega.
 * - `enabled: false` adia a chamada (ex.: esperar um parâmetro).
 */
export function useAsync(asyncFn, deps = [], { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: enabled });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setState((current) => ({ ...current, loading: false }));
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    setState((current) => ({ ...current, error: null, loading: true }));

    asyncFn(controller.signal)
      .then((data) => {
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!active || error?.aborted) return;
        setState((current) => ({ ...current, error, loading: false }));
      });

    return () => {
      active = false;
      controller.abort();
    };
    // asyncFn é recriada a cada renderização; quem decide quando refazer são as dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt, enabled]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, reload };
}