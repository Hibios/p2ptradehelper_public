import { createContext, useState, useEffect } from 'react';
import { HeaderProviderProps } from '../providers';

export interface HeaderState {
    [key: string]: string;
}

export const HeaderContext = createContext({
  headersState: {} as HeaderState,
  setHeadersState: (headers: HeaderState) => {},
});

export const HeaderProvider = ({ headers, children }: HeaderProviderProps) => {
  const [headersState, setHeadersState] = useState<HeaderState>({
    'iv-user': '',
    'user_roles': '',
  });

  useEffect(() => {
    setHeadersState(headers);
  }, [headers]);

  return (
    <HeaderContext.Provider value={{ headersState, setHeadersState }}>
      {children}
    </HeaderContext.Provider>
  );
};