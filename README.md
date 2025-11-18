# Azure App Configuration Azure Front Door JavaScript Example

## Get Started

### Prerequisite

- Configure `src/backend/.env` for AI Foundry connection

```
AI_FOUNDRY_ENDPOINT=<YOUR-AI_FOUNDRY_ENDPOINT>
AI_FOUNDRY_API_VERSION=<YOUR-AI_FOUNDRY_API_VERSION>
```

- Configure `src/frontend/src/config.ts` for Azure Front Door and Application Insights connection

``` ts
export const config = {
  appInsightsConnectionString: "YOUR-APP-INSIGHTS-CONNECTION-STRING",
  azureFrontDoorEndpoint: "YOUR-AZURE-FRONT-DOOR-ENDPOINT"
};
```

### Run the application

- Excute the following commands:

    ```bash
    cd src
    npm run build
    npm run start
    ```

- Visit http://localhost:3000 in your browser.
