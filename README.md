# Azure App Configuration Azure Front Door JavaScript Example

This sample is a full-stack chatbot application that uses Azure App Configuration to manage feature flags and Azure Front Door to securely expose the feature flag to client-side users. The React + Vite frontend is the main focus: it is served through Azure Front Door, loads a variant feature flag from Azure App Configuration at runtime, and uses the JavaScript feature management library together with Application Insights to run an A/B test across multiple LLM model configurations.

The Node.js/TypeScript backend returns **mocked** chat replies that vary by model name, so you can run the whole sample without an Azure AI resource, credentials, or token spend. See `src/backend/chatService.ts` for how to swap in a real Azure AI Foundry deployment.

### Prerequisite

- Azure Front Door endpoint configured with Azure App Configuration as its origin
- Application Insights resource
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

## Using a real model

The chat backend is mocked on purpose. To connect a real Azure AI Foundry deployment:

1. Install the SDKs: `cd src/backend && npm install @azure/identity @azure/ai-projects`
2. Replace the mock in `src/backend/chatService.ts` with the Azure AI Foundry call shown in the comments there.
3. Add the connection settings to `src/backend/.env`:

    ```
    AI_FOUNDRY_ENDPOINT=<YOUR-AI_FOUNDRY_ENDPOINT>
    AI_FOUNDRY_API_VERSION=<YOUR-AI_FOUNDRY_API_VERSION>
    ```

Once a real model is wired up, `POST /api/chat` becomes a paid, credential-backed endpoint. Add authentication and rate limiting before exposing it beyond your local machine — the browser-only login in this sample is a UI demo for feature flag targeting, not a security control.
