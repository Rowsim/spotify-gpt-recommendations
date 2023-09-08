package main

import (
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type RecommendationsResponse struct {
	Test    string `json:"test"`
	ReqBody any    `json:"reqBody"`
}

func Handler(request events.APIGatewayV2HTTPRequest) (string, error) {
	log.Println("Received body: ", request.Body)

	response, err := json.Marshal(&RecommendationsResponse{Test: "test", ReqBody: request.Body})
	if err != nil {
		log.Println(err)
	}
	return string(response), nil
}

func main() {
	lambda.Start(Handler)
}
