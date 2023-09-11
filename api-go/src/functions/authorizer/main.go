package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/imroc/req"
)

func Handler(request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2CustomAuthorizerSimpleResponse, error) {
	headerToken := request.Headers["authorization"]

	if headerToken == os.Getenv("DEV_DEBUG_AUTH_KEY") {
		return events.APIGatewayV2CustomAuthorizerSimpleResponse{
			IsAuthorized: true,
		}, nil
	}

	hasValidSpotifyToken := checkSpotifyUser(headerToken)
	if !hasValidSpotifyToken {
		return events.APIGatewayV2CustomAuthorizerSimpleResponse{
			IsAuthorized: false,
		}, nil
	}

	return events.APIGatewayV2CustomAuthorizerSimpleResponse{
		IsAuthorized: true,
	}, nil
}

func main() {
	lambda.Start(Handler)
}

func checkSpotifyUser(authorizationToken string) bool {
	requestClient := req.New()
	authHeader := req.Header{
		"Authorization": fmt.Sprintf("Bearer %s", authorizationToken),
	}

	_, err := requestClient.Get("https://api.spotify.com/v1/me", authHeader)

	if err != nil {
		fmt.Print(err.Error())
		return false
	}

	return true
}
