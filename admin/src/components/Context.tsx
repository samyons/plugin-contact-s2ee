import React from "react";

function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    // Utiliser directement React.createContext au lieu de ContextSelector
    const Context = React.createContext<ContextValueType | undefined>(defaultContext);
    
    const Provider = (props: ContextValueType & { children: React.ReactNode }) => {
      const { children, ...context } = props;
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
      
      // Utilisez explicitement les types React que vous importez
      return React.createElement(
        Context.Provider,
        { value }, 
        children
      );
    };
    
    function useContext<Selected>(
      consumerName: string,
      selector: (value: ContextValueType) => Selected
    ): Selected {
      // Utiliser useContext standard avec un sélecteur manuel
      const context = React.useContext(Context);
      if (context) return selector(context);
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    
    Provider.displayName = rootComponentName + 'Provider';
    return [Provider, useContext] as const;
  }

export { createContext }; 