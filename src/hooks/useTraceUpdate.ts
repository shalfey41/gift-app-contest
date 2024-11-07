import { useEffect, useRef } from 'react';

export function useTraceUpdate(page: string, props: any) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(`${page} - `, 'changed props:', changedProps);
    }
    prev.current = props;
  });
}
