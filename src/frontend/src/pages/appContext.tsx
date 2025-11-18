// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useState, useEffect, useMemo } from "react";
import { loadFromAzureFrontDoor } from "@azure/app-configuration-provider";
import { FeatureManager, ConfigurationMapFeatureFlagProvider } from "@microsoft/feature-management";
import { createTelemetryPublisher } from "@microsoft/feature-management-applicationinsights-browser";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { config } from "../config";

interface AppContextValue {
  appInsights: ApplicationInsights;
  featureManager?: FeatureManager;
  currentUser?: string;
  loginUser: (user: string) => void;
  logoutUser: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
  const [featureManager, setFeatureManager] = useState<FeatureManager | undefined>(undefined);

  const appInsights = useMemo(() => {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: config.appInsightsConnectionString,
      },
    });
    appInsights.loadAppInsights();
    return appInsights;
  }, []);

  useEffect(() => {
    const init = async () => {
        const appConfig = await loadFromAzureFrontDoor(
          config.azureFrontDoorEndpoint,
          {
            featureFlagOptions: { enabled: true },
          }
        );
        const fm = new FeatureManager(new ConfigurationMapFeatureFlagProvider(appConfig), {
          onFeatureEvaluated: createTelemetryPublisher(appInsights),
        });
        setFeatureManager(fm);
    };
    init();
  }, [appInsights]);

  const loginUser = (user: string) => setCurrentUser(user);
  const logoutUser = () => setCurrentUser(undefined);

  return (
    <AppContext.Provider value={{ appInsights, featureManager, currentUser, loginUser, logoutUser }}>
      {children}
    </AppContext.Provider>
  );
};
