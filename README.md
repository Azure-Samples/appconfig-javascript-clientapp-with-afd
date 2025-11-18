# Azure App Configuration Azure Front Door JavaScript Example

This sample is a full-stack chatbot application that uses Azure AI Foundry to generate natural language responses, Azure App Configuration to manage feature flags, and Azure Front Door to securely expose the feature flag to client-side users. The Node.js/TypeScript backend connects to an Azure AI Foundry deployment to handle chat requests and orchestrate calls to different LLM models. The React + Vite frontend is the main focus: it is served through Azure Front Door, loads a variant feature flag from Azure App Configuration at runtime, and uses the JavaScript feature management library together with Application Insights to run an A/B test across multiple LLM model configurations.

### Prerequisite

- Azure AI Foundry with LLM model deployments
* Azure Front Door endpoint configured with Azure App Configuration as its origin.
* Application Insights resource
- Azure App Configuration with a variant feature flag named "OpenAI/newmodel" with the below configuration:

```json
{
	"id": "OpenAI/newmodel",
	"description": "",
	"enabled": true,
	"variants": [
		{
			"name": "Off",
			"configuration_value": "gpt-4o"
		},
		{
			"name": "On",
			"configuration_value": "gpt-5"
		}
	],
	"allocation": {
		"percentile": [
			{
				"variant": "Off",
				"from": 0,
				"to": 50
			},
			{
				"variant": "On",
				"from": 50,
				"to": 100
			}
		],
		"user": [
			{
				"variant": "On",
				"users": [
					"admin"
				]
			}
		],
		"default_when_enabled": "Off",
		"default_when_disabled": "Off"
	},
	"telemetry": {
		"enabled": true
	}
}
```

## Get Started

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

- Excute the following commands:

    ```bash
    cd src
    npm run build
    npm run start
    ```

- Visit http://localhost:3000 in your browser.
